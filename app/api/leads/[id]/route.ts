import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { name, phone, email } = body;

  const fields: Partial<{ name: string; phone: string; email: string }> = {};
  if (name !== undefined) fields.name = name;
  if (phone !== undefined) fields.phone = phone;
  if (email !== undefined) fields.email = email;

  if (Object.keys(fields).length === 0) {
    return NextResponse.json({ error: "수정할 항목이 없습니다." }, { status: 400 });
  }

  const updated = await db
    .update(leads)
    .set(fields)
    .where(eq(leads.id, Number(id)))
    .returning();

  if (updated.length === 0) {
    return NextResponse.json({ error: "리드를 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json(updated[0]);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const deleted = await db
    .delete(leads)
    .where(eq(leads.id, Number(id)))
    .returning();

  if (deleted.length === 0) {
    return NextResponse.json({ error: "리드를 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
