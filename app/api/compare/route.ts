import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const slugs = req.nextUrl.searchParams.getAll("slug");

  if (slugs.length < 1 || slugs.length > 3) {
    return NextResponse.json({ error: "Provide 1–3 college slugs" }, { status: 400 });
  }

  const colleges = await prisma.college.findMany({
    where: { slug: { in: slugs } },
    include: { courses: true },
  });

  // Preserve requested order
  const ordered = slugs.map((s) => colleges.find((c) => c.slug === s)).filter(Boolean);

  return NextResponse.json(ordered);
}
