import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.portfolio.findMany({
      orderBy: { createdAt: "desc" },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });
    const mapped = items.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      image_url: item.imageUrl,
      client_logo: item.clientLogo,
      images: item.images.map((img) => ({
        id: img.id,
        url: img.url,
        sort_order: img.sortOrder,
      })),
      created_at: item.createdAt.toISOString(),
    }));
    return NextResponse.json(mapped);
  } catch {
    return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 });
  }
}

export async function POST(req: Request) {
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
        images: { create: imagesData },
      },
      include: { images: true },
    });
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, images, ...data } = body;

    // Update main fields
    await prisma.portfolio.update({
      where: { id },
      data: {
        title: data.title,
        category: data.category,
        imageUrl: data.image_url,
        clientLogo: data.client_logo || null,
      },
    });

    // Sync images if provided
    if (Array.isArray(images)) {
      // Delete existing images
      await prisma.portfolioImage.deleteMany({ where: { portfolioId: id } });
      // Create new images
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
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    // Images cascade delete via schema
    await prisma.portfolio.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
