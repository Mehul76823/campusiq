import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const saved = await prisma.savedCollege.findMany({
    where: { userId: session.userId },
    include: {
      college: {
        select: {
          id: true, name: true, slug: true, location: true, city: true, state: true,
          type: true, rating: true, reviewCount: true, totalFees: true,
          ranking: true, nirf: true, accreditation: true,
          avgPackage: true, placementRate: true, examsAccepted: true, logo: true,
        },
      },
    },
    orderBy: { savedAt: "desc" },
  });

  return NextResponse.json(saved.map((s) => s.college));
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { collegeId } = await req.json().catch(() => ({}));
  if (!collegeId) return NextResponse.json({ error: "collegeId required" }, { status: 400 });

  await prisma.savedCollege.upsert({
    where: { userId_collegeId: { userId: session.userId, collegeId } },
    create: { userId: session.userId, collegeId },
    update: {},
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { collegeId } = await req.json().catch(() => ({}));
  if (!collegeId) return NextResponse.json({ error: "collegeId required" }, { status: 400 });

  await prisma.savedCollege.deleteMany({
    where: { userId: session.userId, collegeId },
  });

  return NextResponse.json({ ok: true });
}
