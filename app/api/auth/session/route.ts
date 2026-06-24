import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (session.userId) {
    return NextResponse.json({ userId: session.userId, name: session.name, email: session.email });
  }
  return NextResponse.json({ userId: null });
}

export async function DELETE() {
  const session = await getSession();
  session.destroy();
  return NextResponse.json({ ok: true });
}
