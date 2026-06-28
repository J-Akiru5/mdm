import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

function getRequestMeta(request: Request) {
  return {
    ipAddress:
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      request.headers.get("x-real-ip") ??
      undefined,
    userAgent: request.headers.get("user-agent") ?? undefined,
  };
}

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const recipients = await prisma.notificationRecipient.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    data: recipients.map((r) => ({
      id: r.id,
      email: r.email,
      name: r.name,
      active: r.active,
      types: r.types,
      createdAt: r.createdAt.toISOString(),
    })),
  });
}

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json();
  const { email, name, types } = body;

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const validTypes = ["inquiry", "feedback"];
  const recipientTypes = Array.isArray(types)
    ? types.filter((t: string) => validTypes.includes(t))
    : ["inquiry", "feedback"];

  if (recipientTypes.length === 0) {
    return NextResponse.json(
      { error: "At least one notification type is required." },
      { status: 400 },
    );
  }

  try {
    const recipient = await prisma.notificationRecipient.create({
      data: {
        email: email.toLowerCase().trim(),
        name: name?.trim() || null,
        types: recipientTypes,
      },
    });

    logAudit({
      action: "CREATE",
      entity: "NotificationRecipient",
      entityId: recipient.id,
      actorId: auth.user.id,
      actorEmail: auth.user.email,
      ...getRequestMeta(request),
      after: { email: recipient.email, name: recipient.name, types: recipient.types },
      metadata: { title: recipient.email },
    });

    return NextResponse.json(
      {
        id: recipient.id,
        email: recipient.email,
        name: recipient.name,
        active: recipient.active,
        types: recipient.types,
        createdAt: recipient.createdAt.toISOString(),
      },
      { status: 201 },
    );
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002") {
      return NextResponse.json({ error: "This email is already registered." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create recipient." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const body = await request.json();
  const { id, email, name, active, types } = body;

  if (!id) {
    return NextResponse.json({ error: "Recipient ID is required." }, { status: 400 });
  }

  const existing = await prisma.notificationRecipient.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Recipient not found." }, { status: 404 });
  }

  const validTypes = ["inquiry", "feedback"];
  const updateData: {
    email?: string;
    name?: string | null;
    active?: boolean;
    types?: string[];
  } = {};

  if (email !== undefined) updateData.email = email.toLowerCase().trim();
  if (name !== undefined) updateData.name = name?.trim() || null;
  if (active !== undefined) updateData.active = active;
  if (types !== undefined) {
    const filtered = Array.isArray(types)
      ? types.filter((t: string) => validTypes.includes(t))
      : [];
    if (filtered.length === 0) {
      return NextResponse.json(
        { error: "At least one notification type is required." },
        { status: 400 },
      );
    }
    updateData.types = filtered;
  }

  try {
    const updated = await prisma.notificationRecipient.update({
      where: { id },
      data: updateData,
    });

    logAudit({
      action: "UPDATE",
      entity: "NotificationRecipient",
      entityId: updated.id,
      actorId: auth.user.id,
      actorEmail: auth.user.email,
      ...getRequestMeta(request),
      before: {
        email: existing.email,
        name: existing.name,
        active: existing.active,
        types: existing.types,
      },
      after: {
        email: updated.email,
        name: updated.name,
        active: updated.active,
        types: updated.types,
      },
      metadata: { title: updated.email },
    });

    return NextResponse.json({
      id: updated.id,
      email: updated.email,
      name: updated.name,
      active: updated.active,
      types: updated.types,
      createdAt: updated.createdAt.toISOString(),
    });
  } catch (e: unknown) {
    if (e && typeof e === "object" && "code" in e && e.code === "P2002") {
      return NextResponse.json({ error: "This email is already registered." }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to update recipient." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Recipient ID is required." }, { status: 400 });
  }

  const existing = await prisma.notificationRecipient.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Recipient not found." }, { status: 404 });
  }

  await prisma.notificationRecipient.delete({ where: { id } });

  logAudit({
    action: "DELETE",
    entity: "NotificationRecipient",
    entityId: id,
    actorId: auth.user.id,
    actorEmail: auth.user.email,
    ...getRequestMeta(request),
    before: { email: existing.email, name: existing.name, types: existing.types },
    metadata: { title: existing.email },
  });

  return NextResponse.json({ success: true });
}
