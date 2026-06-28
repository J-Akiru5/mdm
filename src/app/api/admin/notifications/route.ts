import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "20", 10));
  const typeFilter = searchParams.get("type") ?? "";
  const search = searchParams.get("search")?.trim() ?? "";
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";
  const fullPage = searchParams.get("full") === "true";

  // If full page mode, no default 24h window; otherwise default to 24h
  const since = fullPage
    ? from
      ? new Date(from)
      : undefined
    : new Date(Date.now() - 24 * 60 * 60 * 1000);

  const to_date = to ? new Date(to) : undefined;
  if (to_date) to_date.setHours(23, 59, 59, 999);

  const wantInquiry = !typeFilter || typeFilter === "inquiry";
  const wantFeedback = !typeFilter || typeFilter === "feedback";
  const wantAudit = !typeFilter || typeFilter === "audit";

  const dateFilter = since ? { gte: since } : {};
  const dateFilterLte = to_date ? { lte: to_date } : {};
  const createdAtRange = { ...dateFilter, ...dateFilterLte };

  // For full page mode, we need to fetch all items then paginate
  // For panel mode, we keep the original behavior
  if (fullPage) {
    const pageSize = limit;
    const offset = (page - 1) * pageSize;

    const [inquiries, feedback, auditEvents] = await Promise.all([
      prisma.contactSubmission.findMany({
        where: {
          ...(Object.keys(createdAtRange).length > 0 ? { createdAt: createdAtRange } : {}),
          ...(search
            ? {
                OR: [
                  { fullName: { contains: search, mode: "insensitive" as const } },
                  { email: { contains: search, mode: "insensitive" as const } },
                ],
              }
            : {}),
        },
        orderBy: { createdAt: "desc" },
        select: { id: true, fullName: true, email: true, eventType: true, createdAt: true },
      }),
      prisma.feedback.findMany({
        where: {
          ...(Object.keys(createdAtRange).length > 0 ? { createdAt: createdAtRange } : {}),
          ...(search
            ? {
                OR: [
                  { name: { contains: search, mode: "insensitive" as const } },
                  { email: { contains: search, mode: "insensitive" as const } },
                ],
              }
            : {}),
        },
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, rating: true, createdAt: true },
      }),
      prisma.auditLog.findMany({
        where: {
          ...(Object.keys(createdAtRange).length > 0 ? { createdAt: createdAtRange } : {}),
          ...(search
            ? {
                OR: [
                  { actorEmail: { contains: search, mode: "insensitive" as const } },
                  { entity: { contains: search, mode: "insensitive" as const } },
                ],
              }
            : {}),
        },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          action: true,
          entity: true,
          actorEmail: true,
          createdAt: true,
          metadata: true,
        },
      }),
    ]);

    const items = [
      ...(wantInquiry
        ? inquiries.map((i) => ({
            id: i.id,
            type: "inquiry" as const,
            title: i.fullName,
            subtitle: `${i.eventType ?? "General"} inquiry`,
            time: i.createdAt.toISOString(),
            read: false,
            href: "/admin/inquiries",
          }))
        : []),
      ...(wantFeedback
        ? feedback.map((f) => ({
            id: f.id,
            type: "feedback" as const,
            title: f.name,
            subtitle: `${"★".repeat(f.rating)}${"☆".repeat(5 - f.rating)} rating`,
            time: f.createdAt.toISOString(),
            read: false,
            href: "/admin/feedback",
          }))
        : []),
      ...(wantAudit
        ? auditEvents.map((e) => ({
            id: e.id,
            type: "audit" as const,
            title: `${e.action} — ${e.entity}`,
            subtitle: e.actorEmail ?? "System",
            time: e.createdAt.toISOString(),
            read: false,
            href: "/admin/audit-log",
          }))
        : []),
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    const total = items.length;
    const paged = items.slice(offset, offset + pageSize);

    return NextResponse.json({
      items: paged,
      total,
      page,
      totalPages: Math.ceil(total / pageSize),
      pageSize,
    });
  }

  // Panel mode — original behavior
  const sinceDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [inquiries, feedback, auditEvents] = await Promise.all([
    prisma.contactSubmission.findMany({
      where: { createdAt: { gte: sinceDate } },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, fullName: true, eventType: true, createdAt: true },
    }),
    prisma.feedback.findMany({
      where: { createdAt: { gte: sinceDate } },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, name: true, rating: true, createdAt: true },
    }),
    prisma.auditLog.findMany({
      where: { createdAt: { gte: sinceDate } },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        action: true,
        entity: true,
        actorEmail: true,
        createdAt: true,
        metadata: true,
      },
    }),
  ]);

  const items = [
    ...inquiries.map((i) => ({
      id: i.id,
      type: "inquiry" as const,
      title: i.fullName,
      subtitle: `${i.eventType ?? "General"} inquiry`,
      time: i.createdAt.toISOString(),
      read: false,
      href: "/admin/inquiries",
    })),
    ...feedback.map((f) => ({
      id: f.id,
      type: "feedback" as const,
      title: f.name,
      subtitle: `${"★".repeat(f.rating)}${"☆".repeat(5 - f.rating)} rating`,
      time: f.createdAt.toISOString(),
      read: false,
      href: "/admin/feedback",
    })),
    ...auditEvents.map((e) => ({
      id: e.id,
      type: "audit" as const,
      title: `${e.action} — ${e.entity}`,
      subtitle: e.actorEmail ?? "System",
      time: e.createdAt.toISOString(),
      read: false,
      href: "/admin/audit-log",
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  return NextResponse.json({ items: items.slice(0, 20) });
}
