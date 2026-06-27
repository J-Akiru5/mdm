import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const item = await prisma.portfolio.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    });

    if (!item) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({
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
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
  }
}
