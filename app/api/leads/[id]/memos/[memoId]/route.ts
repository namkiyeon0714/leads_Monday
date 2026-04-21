import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { leadMemos } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; memoId: string }> }
) {
  const { memoId } = await params;

  const deleted = await db
    .delete(leadMemos)
    .where(eq(leadMemos.id, Number(memoId)))
    .returning();

  if (deleted.length === 0) {
    return NextResponse.json({ error: "메모를 찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
