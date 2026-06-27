import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [portfolioCount, inquiryCount, feedbackCount] = await Promise.all([
      prisma.portfolio.count(),
      prisma.contactSubmission.count(),
      prisma.feedback.count(),
    ]);
    return NextResponse.json({ portfolioCount, inquiryCount, feedbackCount });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
