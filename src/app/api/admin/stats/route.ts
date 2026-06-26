import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [portfolioCount, inquiryCount] = await Promise.all([
      prisma.portfolio.count(),
      prisma.contactSubmission.count(),
    ]);
    return NextResponse.json({ portfolioCount, inquiryCount });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
