import { NextResponse } from "next/server";

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

    // 3. Prepare data payload
    const visitorData = {
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
      visitedAt: new Date().toLocaleString(),
    };

    // 4. Send to Firebase Realtime Database
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
