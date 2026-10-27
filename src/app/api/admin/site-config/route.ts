import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { logAudit } from "@/lib/audit";
import { getSiteConfig, isSiteConfigKey, setSiteConfig } from "@/lib/site-config";
import { prisma } from "@/lib/prisma";

/** GET /api/admin/site-config – returns all site config keys, with defaults applied */
export async function GET(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const config = await getSiteConfig();
    return NextResponse.json({ data: config });
  } catch (error) {
    console.error("Failed to fetch site config:", error);
    return NextResponse.json({ error: "Failed to fetch site config" }, { status: 500 });
  }
}

/** PATCH /api/admin/site-config – upserts a known config key */
export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(req);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const { key, value } = body ?? {};

    if (typeof key !== "string" || typeof value !== "string" || !isSiteConfigKey(key)) {
      return NextResponse.json(
        { error: "A valid config key and a string value are required" },
        { status: 400 },
      );
    }

    const before = await prisma.siteConfig.findUnique({ where: { key } });

    await setSiteConfig(key, value);

    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      undefined;

    logAudit({
      action: "UPDATE",
      entity: "SiteConfig",
      entityId: key,
      actorId: auth.user.id,
      actorEmail: auth.user.email,
      ipAddress,
      userAgent: req.headers.get("user-agent") ?? undefined,
      before: { value: before?.value },
      after: { value },
      metadata: { key },
    });

    return NextResponse.json({ success: true, data: { [key]: value } });
  } catch (error) {
    console.error("Failed to update site config:", error);
    return NextResponse.json({ error: "Failed to update site config" }, { status: 500 });
  }
}
