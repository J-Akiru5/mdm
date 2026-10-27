import { prisma } from "@/lib/prisma";

/**
 * Editable site-wide settings stored as a key/value table.
 * Anything not explicitly written to the database falls back to the value
 * declared here, so a missing row can never make a section unexpectedly
 * appear or disappear.
 */
export const SITE_CONFIG_DEFAULTS = {
  show_testimonials: "false",
} as const;

export type SiteConfigKey = keyof typeof SITE_CONFIG_DEFAULTS;

export const SITE_CONFIG_KEYS = Object.keys(SITE_CONFIG_DEFAULTS) as SiteConfigKey[];

/** Keys that may be exposed through the unauthenticated public endpoint. */
export const PUBLIC_SITE_CONFIG_KEYS: SiteConfigKey[] = ["show_testimonials"];

export function isSiteConfigKey(value: string): value is SiteConfigKey {
  return Object.prototype.hasOwnProperty.call(SITE_CONFIG_DEFAULTS, value);
}

/**
 * Reads the requested keys, filling in defaults for anything that has not
 * been saved yet. Only the requested keys are returned.
 */
export async function getSiteConfig(
  keys: readonly SiteConfigKey[] = SITE_CONFIG_KEYS,
): Promise<Record<string, string>> {
  const config: Record<string, string> = {};
  for (const key of keys) {
    config[key] = SITE_CONFIG_DEFAULTS[key];
  }

  const rows = await prisma.siteConfig.findMany({ where: { key: { in: [...keys] } } });
  for (const row of rows) {
    if (isSiteConfigKey(row.key) && keys.includes(row.key)) {
      config[row.key] = row.value;
    }
  }

  return config;
}

/** Upserts a single config key. Callers are responsible for authorization. */
export async function setSiteConfig(key: SiteConfigKey, value: string): Promise<void> {
  await prisma.siteConfig.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}
