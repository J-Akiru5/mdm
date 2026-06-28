import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { logAudit } from "@/lib/audit";

function getRequestMeta(req: NextRequest) {
  return {
    ipAddress:
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      undefined,
    userAgent: req.headers.get("user-agent") ?? undefined,
  };
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const { ipAddress, userAgent } = getRequestMeta(req);

  try {
    const body = await req.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const existing = await prisma.category.findUnique({
      where: { name: name.trim().toLowerCase() },
    });
    if (existing) {
      return NextResponse.json({ error: "Category already exists" }, { status: 409 });
    }

    const maxOrder = await prisma.category.aggregate({ _max: { sortOrder: true } });

    const category = await prisma.category.create({
      data: {
        name: name.trim().toLowerCase(),
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
        updatedByUserId: auth.user.id,
        updatedByEmail: auth.user.email,
      },
    });

    // Fire-and-forget audit
    logAudit({
      action: "CREATE",
      entity: "Category",
      entityId: category.id,
      actorId: auth.user.id,
      actorEmail: auth.user.email,
      ipAddress,
      userAgent,
      after: { name: category.name },
      metadata: { title: category.name },
    });

    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const { ipAddress, userAgent } = getRequestMeta(req);

  try {
    const body = await req.json();
    const { id, name } = body;

    if (!id || !name || !name.trim()) {
      return NextResponse.json({ error: "ID and name are required" }, { status: 400 });
    }

    const existing = await prisma.category.findFirst({
      where: { name: name.trim().toLowerCase(), NOT: { id } },
    });
    if (existing) {
      return NextResponse.json({ error: "Category name already exists" }, { status: 409 });
    }

    // Capture before snapshot
    const before = await prisma.category.findUnique({ where: { id } });

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: name.trim().toLowerCase(),
        updatedByUserId: auth.user.id,
        updatedByEmail: auth.user.email,
      },
    });

    // Fire-and-forget audit
    if (before) {
      logAudit({
        action: "UPDATE",
        entity: "Category",
        entityId: id,
        actorId: auth.user.id,
        actorEmail: auth.user.email,
        ipAddress,
        userAgent,
        before: { name: before.name },
        after: { name: category.name },
        metadata: { title: category.name },
      });
    }

    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const { ipAddress, userAgent } = getRequestMeta(req);

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    // Capture before snapshot
    const before = await prisma.category.findUnique({ where: { id } });

    await prisma.category.delete({ where: { id } });

    // Fire-and-forget audit
    if (before) {
      logAudit({
        action: "DELETE",
        entity: "Category",
        entityId: id,
        actorId: auth.user.id,
        actorEmail: auth.user.email,
        ipAddress,
        userAgent,
        before: { name: before.name },
        metadata: { title: before.name },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
