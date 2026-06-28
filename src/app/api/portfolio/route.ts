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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const highlightOnly = searchParams.get("highlight") === "true";

    const where = highlightOnly ? { highlight: true } : {};

    const items = await prisma.portfolio.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });
    const mapped = items.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      image_url: item.imageUrl,
      client_logo: item.clientLogo,
      client_name: item.clientName,
      challenge: item.challenge,
      solution: item.solution,
      result: item.result,
      highlight: item.highlight,
      images: item.images.map((img) => ({
        id: img.id,
        url: img.url,
        sort_order: img.sortOrder,
      })),
      created_at: item.createdAt.toISOString(),
      updated_at: item.updatedAt?.toISOString() ?? item.createdAt.toISOString(),
      updated_by_email: item.updatedByEmail ?? null,
    }));
    return NextResponse.json(mapped);
  } catch {
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const { ipAddress, userAgent } = getRequestMeta(req);

  try {
    const body = await req.json();
    const imagesData = Array.isArray(body.images)
      ? body.images.map((img: { url: string; sort_order?: number }, i: number) => ({
          url: img.url,
          sortOrder: img.sort_order ?? i,
        }))
      : [];

    const item = await prisma.portfolio.create({
      data: {
        title: body.title,
        category: body.category,
        imageUrl: body.image_url,
        clientLogo: body.client_logo || null,
        clientName: body.client_name || null,
        challenge: body.challenge || null,
        solution: body.solution || null,
        result: body.result || null,
        highlight: body.highlight || false,
        updatedByUserId: auth.user.id,
        updatedByEmail: auth.user.email,
        images: { create: imagesData },
      },
      include: { images: true },
    });

    // Fire-and-forget audit
    logAudit({
      action: "CREATE",
      entity: "Portfolio",
      entityId: item.id,
      actorId: auth.user.id,
      actorEmail: auth.user.email,
      ipAddress,
      userAgent,
      after: {
        title: item.title,
        category: item.category,
        highlight: item.highlight,
      },
      metadata: { title: item.title },
    });

    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const { ipAddress, userAgent } = getRequestMeta(req);

  try {
    const body = await req.json();
    const { id, images, ...data } = body;

    // Capture before snapshot
    const before = await prisma.portfolio.findUnique({ where: { id } });

    await prisma.portfolio.update({
      where: { id },
      data: {
        title: data.title,
        category: data.category,
        imageUrl: data.image_url,
        clientLogo: data.client_logo || null,
        clientName: data.client_name || null,
        challenge: data.challenge || null,
        solution: data.solution || null,
        result: data.result || null,
        highlight: data.highlight || false,
        updatedByUserId: auth.user.id,
        updatedByEmail: auth.user.email,
      },
    });

    if (Array.isArray(images)) {
      await prisma.portfolioImage.deleteMany({ where: { portfolioId: id } });
      if (images.length > 0) {
        await prisma.portfolioImage.createMany({
          data: images.map((img: { url: string; sort_order?: number }, i: number) => ({
            portfolioId: id,
            url: img.url,
            sortOrder: img.sort_order ?? i,
          })),
        });
      }
    }

    const item = await prisma.portfolio.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });

    // Fire-and-forget audit
    if (before) {
      logAudit({
        action: "UPDATE",
        entity: "Portfolio",
        entityId: id,
        actorId: auth.user.id,
        actorEmail: auth.user.email,
        ipAddress,
        userAgent,
        before: {
          title: before.title,
          category: before.category,
          highlight: before.highlight,
        },
        after: {
          title: data.title,
          category: data.category,
          highlight: data.highlight,
        },
        metadata: { title: data.title },
      });
    }

    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  const { ipAddress, userAgent } = getRequestMeta(req);

  try {
    const body = await req.json();
    const { id, highlight } = body;

    if (!id || typeof highlight !== "boolean") {
      return NextResponse.json({ error: "Missing id or highlight" }, { status: 400 });
    }

    // Capture before
    const before = await prisma.portfolio.findUnique({
      where: { id },
      select: { highlight: true, title: true },
    });

    const item = await prisma.portfolio.update({
      where: { id },
      data: {
        highlight,
        updatedByUserId: auth.user.id,
        updatedByEmail: auth.user.email,
      },
    });

    // Fire-and-forget audit
    logAudit({
      action: "UPDATE",
      entity: "Portfolio",
      entityId: id,
      actorId: auth.user.id,
      actorEmail: auth.user.email,
      ipAddress,
      userAgent,
      before: { highlight: before?.highlight },
      after: { highlight },
      metadata: { title: before?.title, field: "highlight" },
    });

    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed to update highlight" }, { status: 500 });
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
    const before = await prisma.portfolio.findUnique({ where: { id } });

    await prisma.portfolio.delete({ where: { id } });

    // Fire-and-forget audit
    if (before) {
      logAudit({
        action: "DELETE",
        entity: "Portfolio",
        entityId: id,
        actorId: auth.user.id,
        actorEmail: auth.user.email,
        ipAddress,
        userAgent,
        before: {
          title: before.title,
          category: before.category,
          highlight: before.highlight,
        },
        metadata: { title: before.title },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
