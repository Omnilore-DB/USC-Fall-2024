import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "default-secret"; // Use secure backend env variable

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

    if (!decoded.userId) {
      throw new Error("Invalid token payload.");
    }

    return NextResponse.json({ userId: decoded.userId }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
