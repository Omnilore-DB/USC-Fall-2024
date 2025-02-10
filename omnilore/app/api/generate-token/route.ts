import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "default-secret"; // Use secure backend env variable

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  // Generate JWT securely on the server
  const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "15m" });
  const authLink = `http://localhost:3000/testlinkaccept?token=${token}`;

  return NextResponse.json({ authLink });
}
