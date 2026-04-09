import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";

export async function POST(req: NextRequest) {
  const { name, phone, email } = await req.json();

  if (!name || !phone || !email) {
    return NextResponse.json({ error: "필수 항목이 누락되었습니다." }, { status: 400 });
  }

  await db.insert(leads).values({ name, phone, email });

  return NextResponse.json({ success: true }, { status: 201 });
}
