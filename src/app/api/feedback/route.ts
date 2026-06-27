import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
    });
    const mapped = feedbacks.map((f) => ({
      id: f.id,
      name: f.name,
      email: f.email,
      rating: f.rating,
      comment: f.comment,
      created_at: f.createdAt.toISOString(),
    }));
    return NextResponse.json(mapped);
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

    return NextResponse.json({ success: true, data: feedback }, { status: 201 });
  } catch (error) {
    console.error("Failed to submit feedback:", error);
    return NextResponse.json({ error: "Invalid request or database error" }, { status: 400 });
  }
}
