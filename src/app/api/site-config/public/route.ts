import { NextResponse } from "next/server";
import { getSiteConfig, PUBLIC_SITE_CONFIG_KEYS, SITE_CONFIG_DEFAULTS } from "@/lib/site-config";

/** GET /api/site-config/public – returns only whitelisted config keys, with defaults applied */
export async function GET() {
  try {
    const config = await getSiteConfig(PUBLIC_SITE_CONFIG_KEYS);
    return NextResponse.json({ data: config });
  } catch (error) {
    console.error("Failed to fetch public site config:", error);
    // Never let a config read failure change public behaviour: fall back to defaults.
    const fallback: Record<string, string> = {};
    for (const key of PUBLIC_SITE_CONFIG_KEYS) {
      fallback[key] = SITE_CONFIG_DEFAULTS[key];
    }
    return NextResponse.json({ data: fallback });
  }
}
