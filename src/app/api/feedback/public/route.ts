import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const feedbacks = await prisma.feedback.findMany({
      where: { isVisible: true },
      orderBy: { createdAt: "desc" },
      take: 50,
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
