import { NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

export async function POST(request: Request) {
  try {
    // 1. Get IP address (useful for proxies/Vercel)
    let ip = request.headers.get("x-forwarded-for") || 
             request.headers.get("x-real-ip") || 
             "Unknown IP";
             
    // Handle cases where multiple IPs are forwarded
    if (ip && ip.includes(",")) {
      ip = ip.split(",")[0].trim();
    }

    // 2. Get User Agent (Device Info)
    const userAgent = request.headers.get("user-agent") || "Unknown Device";
    
    // Parse User Agent
    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();

    // 3. Try to get location data (City, Country) based on IP
    let location = "Unknown Location";
    if (ip !== "Unknown IP" && ip !== "::1" && ip !== "127.0.0.1") {
        try {
            const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
            if (geoRes.ok) {
                const geoData = await geoRes.json();
                if (geoData.status === "success") {
                    location = `${geoData.city}, ${geoData.country}`;
                }
            }
        } catch (e) {
            console.error("GeoIP fetch failed", e);
        }
    }

    // 4. Time format - Pakistan Standard Time (PKT)
    const now = new Date();
    const pakistanTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Karachi',
        dateStyle: 'medium',
        timeStyle: 'medium',
    }).format(now);

    // 5. Prepare data payload
    const visitorData = {
      ip,
      userAgent,
      browser: `${browser.name || 'Unknown'} ${browser.version || ''}`.trim(),
      os: `${os.name || 'Unknown'} ${os.version || ''}`.trim(),
      device: device.type ? `${device.vendor || ''} ${device.model || ''} (${device.type})`.trim() : 'Desktop/Laptop',
      location,
      timestamp: now.toISOString(),
      visitedAt: pakistanTime, // Saving directly as formatted string for PKT
    };

    // 6. Send to Firebase Realtime Database
    const firebaseUrl = process.env.FIREBASE_DATABASE_URL || "https://portfolio-visitores-tracker-default-rtdb.firebaseio.com/";
    
    if (firebaseUrl) {
      // Ensure the URL ends correctly and points to the 'visitors.json' node
      const endpoint = firebaseUrl.endsWith('/') 
        ? `${firebaseUrl}visitors.json` 
        : `${firebaseUrl}/visitors.json`;
        
      await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(visitorData),
      });
    } else {
      console.warn("Visitor tracking missing Firebase URL. Data captured:", visitorData);
      console.warn("Please add FIREBASE_DATABASE_URL to your .env.local file.");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking visitor:", error);
    return NextResponse.json(
      { success: false, error: "Failed to track visitor" }, 
      { status: 500 }
    );
  }
}
