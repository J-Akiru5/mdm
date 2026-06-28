import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  try {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [
      portfolioCount,
      inquiryCount,
      feedbackCount,
      avgRatingResult,
      inquiriesThisWeek,
      feedbackThisWeek,
      inquiriesByEventType,
      recentInquiries,
      recentFeedback,
      portfolioByCategory,
    ] = await Promise.all([
      prisma.portfolio.count(),
      prisma.contactSubmission.count(),
      prisma.feedback.count(),
      prisma.feedback.aggregate({ _avg: { rating: true } }),
      prisma.contactSubmission.count({
        where: { createdAt: { gte: oneWeekAgo } },
      }),
      prisma.feedback.count({
        where: { createdAt: { gte: oneWeekAgo } },
      }),
      prisma.contactSubmission.groupBy({
        by: ["eventType"],
        _count: true,
        orderBy: { _count: { eventType: "desc" } },
      }),
      prisma.contactSubmission.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          fullName: true,
          email: true,
          eventType: true,
          createdAt: true,
        },
      }),
      prisma.feedback.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          rating: true,
          comment: true,
          createdAt: true,
        },
      }),
      prisma.portfolio.groupBy({
        by: ["category"],
        _count: true,
        orderBy: { _count: { category: "desc" } },
      }),
    ]);

    // Monthly inquiries for last 6 months
    const monthlyInquiries: { month: string; count: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);
      const count = await prisma.contactSubmission.count({
        where: { createdAt: { gte: start, lte: end } },
      });
      monthlyInquiries.push({
        month: start.toLocaleString("default", { month: "short", year: "2-digit" }),
        count,
      });
    }

    // Audit events — isolated so a missing table never breaks the dashboard
    let recentAuditEvents: unknown[] = [];
    try {
      recentAuditEvents = await prisma.auditLog.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          action: true,
          entity: true,
          entityId: true,
          actorEmail: true,
          metadata: true,
          createdAt: true,
        },
      });
    } catch {
      // Table may not exist in older Prisma client instances — degrade gracefully
    }

    return NextResponse.json({
      portfolioCount,
      inquiryCount,
      feedbackCount,
      avgRating: avgRatingResult._avg.rating ?? 0,
      inquiriesThisWeek,
      feedbackThisWeek,
      inquiriesByEventType: inquiriesByEventType.map((item) => ({
        eventType: item.eventType || "Other",
        count: item._count,
      })),
      recentInquiries,
      recentFeedback,
      portfolioByCategory: portfolioByCategory.map((item) => ({
        category: item.category,
        count: item._count,
      })),
      monthlyInquiries,
      recentAuditEvents,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
