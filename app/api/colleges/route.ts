import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const q = searchParams.get("q") ?? "";
  const type = searchParams.get("type") ?? "";
  const state = searchParams.get("state") ?? "";
  const exam = searchParams.get("exam") ?? "";
  const minFees = parseInt(searchParams.get("minFees") ?? "0");
  const maxFees = parseInt(searchParams.get("maxFees") ?? "9999999");
  const minRating = parseFloat(searchParams.get("minRating") ?? "0");
  const sort = searchParams.get("sort") ?? "ranking";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const limit = Math.min(20, parseInt(searchParams.get("limit") ?? "12"));
  const skip = (page - 1) * limit;

  const where: Prisma.CollegeWhereInput = {
    AND: [
      q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { city: { contains: q, mode: "insensitive" } },
              { state: { contains: q, mode: "insensitive" } },
              { affiliation: { contains: q, mode: "insensitive" } },
            ],
          }
        : {},
      type ? { type: type as Prisma.EnumCollegeTypeFilter } : {},
      state ? { state: { contains: state, mode: "insensitive" } } : {},
      exam ? { examsAccepted: { has: exam } } : {},
      { totalFees: { gte: minFees, lte: maxFees } },
      { rating: { gte: minRating } },
    ],
  };

  const orderBy: Prisma.CollegeOrderByWithRelationInput =
    sort === "fees_asc"
      ? { totalFees: "asc" }
      : sort === "fees_desc"
      ? { totalFees: "desc" }
      : sort === "rating"
      ? { rating: "desc" }
      : sort === "package"
      ? { avgPackage: "desc" }
      : sort === "name"
      ? { name: "asc" }
      : { nirf: { sort: "asc", nulls: "last" } };

  const [colleges, total] = await Promise.all([
    prisma.college.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        location: true,
        city: true,
        state: true,
        type: true,
        rating: true,
        reviewCount: true,
        totalFees: true,
        ranking: true,
        nirf: true,
        accreditation: true,
        avgPackage: true,
        placementRate: true,
        examsAccepted: true,
        logo: true,
      },
    }),
    prisma.college.count({ where }),
  ]);

  return NextResponse.json({
    colleges,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    hasNext: page * limit < total,
  });
}
