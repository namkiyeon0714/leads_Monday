import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leadMemos } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const memos = await db
    .select()
    .from(leadMemos)
    .where(eq(leadMemos.leadId, Number(id)))
    .orderBy(desc(leadMemos.createdAt));
  return NextResponse.json(memos);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { content } = await req.json();

  if (!content?.trim()) {
    return NextResponse.json({ error: "내용을 입력해주세요." }, { status: 400 });
  }

  const created = await db
    .insert(leadMemos)
    .values({ leadId: Number(id), content: content.trim() })
    .returning();

  return NextResponse.json(created[0], { status: 201 });
}
