import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [inquiries, feedback, auditEvents] = await Promise.all([
    prisma.contactSubmission.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, fullName: true, eventType: true, createdAt: true },
    }),
    prisma.feedback.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, name: true, rating: true, createdAt: true },
    }),
    prisma.auditLog.findMany({
      where: { createdAt: { gte: since } },
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
