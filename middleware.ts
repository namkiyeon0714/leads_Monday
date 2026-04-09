import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "admin_session";
const TTL_SECONDS = 28800; // 8시간

async function verifyToken(token: string, secret: string): Promise<boolean> {
  const dotIndex = token.indexOf(".");
  if (dotIndex === -1) return false;

  const timestamp = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);
  if (!timestamp || !signature) return false;

  // TTL 체크
  const issued = parseInt(timestamp, 10);
  if (isNaN(issued) || Date.now() / 1000 - issued > TTL_SECONDS) return false;

  // HMAC 재계산 (Web Crypto API — Edge Runtime 호환)
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(timestamp));
  const expected = Array.from(new Uint8Array(sigBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return expected === signature;
}

export async function middleware(request: NextRequest) {
  // /admin/login은 인증 없이 통과
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const secret = process.env.ADMIN_SECRET ?? "";

  if (token && (await verifyToken(token, secret))) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
