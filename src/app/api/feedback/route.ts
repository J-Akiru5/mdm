import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendFeedbackNotification } from "@/lib/email";
import { requireAuth } from "@/lib/api-auth";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20", 10));
    const search = searchParams.get("search")?.trim() ?? "";
    const ratingParam = searchParams.get("rating") ?? "";

    const where: Prisma.FeedbackWhereInput = {};

    if (ratingParam) {
      const rating = parseInt(ratingParam, 10);
      if (!isNaN(rating)) where.rating = rating;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { comment: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, feedbacks] = await Promise.all([
      prisma.feedback.count({ where }),
      prisma.feedback.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const data = feedbacks.map((f) => ({
      id: f.id,
      name: f.name,
      email: f.email,
      rating: f.rating,
      comment: f.comment,
      created_at: f.createdAt.toISOString(),
    }));

    return NextResponse.json({
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      pageSize: limit,
    });
  } catch (error) {
    console.error("Failed to fetch feedbacks:", error);
    return NextResponse.json({ error: "Failed to fetch feedbacks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, rating, comment } = body;

    if (!name || !email || rating === undefined || !comment) {
      return NextResponse.json(
        { error: "Name, email, rating, and comment are required" },
        { status: 400 },
      );
    }

    const ratingVal = parseInt(rating, 10);
    if (isNaN(ratingVal) || ratingVal < 1 || ratingVal > 5) {
      return NextResponse.json(
        { error: "Rating must be an integer between 1 and 5" },
        { status: 400 },
      );
    }

    const feedback = await prisma.feedback.create({
      data: {
        name,
        email,
        rating: ratingVal,
        comment,
      },
    });

    sendFeedbackNotification({
      name: feedback.name,
      email: feedback.email,
      rating: feedback.rating,
      comment: feedback.comment,
    }).catch(console.error);

    return NextResponse.json({ success: true, data: feedback }, { status: 201 });
  } catch (error) {
    console.error("Failed to submit feedback:", error);
    return NextResponse.json({ error: "Invalid request or database error" }, { status: 400 });
  }
}
