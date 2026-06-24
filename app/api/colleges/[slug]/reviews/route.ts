import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";
import { z } from "zod";

const schema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(5).max(100),
  body: z.string().min(20).max(1000),
  batch: z.number().optional(),
});

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Sign in to leave a review" }, { status: 401 });
  }

  const college = await prisma.college.findUnique({ where: { slug: params.slug } });
  if (!college) return NextResponse.json({ error: "College not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      ...parsed.data,
      userId: session.userId,
      collegeId: college.id,
    },
    include: { user: { select: { name: true } } },
  });

  // Update college aggregate rating
  const agg = await prisma.review.aggregate({
    where: { collegeId: college.id },
    _avg: { rating: true },
    _count: true,
  });
  await prisma.college.update({
    where: { id: college.id },
    data: {
      rating: Math.round((agg._avg.rating ?? 0) * 10) / 10,
      reviewCount: agg._count,
    },
  });

  return NextResponse.json(review, { status: 201 });
}
