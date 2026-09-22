import { NextResponse } from "next/server";
import crypto from "crypto";

const ADMIN_USERNAME = "admin";
// Pre-computed SHA-256 hash of "ali@123456"
const ADMIN_PASSWORD_HASH = "8b2ad0a024357fdfc582b4a438ae17f38a4dd729286c54fdb087e057a42ed60d";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, error: "Username and password required" }, { status: 400 });
    }

    // Hash the incoming password
    const incomingHash = crypto.createHash('sha256').update(password).digest('hex');

    // Check credentials
    if (username === ADMIN_USERNAME && incomingHash === ADMIN_PASSWORD_HASH) {
      // Create response
      const response = NextResponse.json({ success: true }, { status: 200 });
      
      // Set secure HTTP-only cookie
      response.cookies.set({
        name: "admin_session",
        value: "authenticated",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });

      return response;
    }

    return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
