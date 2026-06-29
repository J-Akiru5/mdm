import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendFeedbackNotification } from "@/lib/email";

export async function GET() {
  try {
    const feedbacks = await prisma.feedback.findMany({
      where: { isVisible: true },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        name: true,
        company: true,
        rating: true,
        comment: true,
        createdAt: true,
      },
    });

    const data = feedbacks.map((f) => ({
      id: f.id,
      name: f.name,
      company: f.company ?? "",
      rating: f.rating,
      comment: f.comment,
      created_at: f.createdAt.toISOString(),
    }));

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, rating, comment } = body;

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
        company: company || null,
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
