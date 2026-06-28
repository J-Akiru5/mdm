import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const url = process.env.DIRECT_URL || process.env.DATABASE_URL!;
const pool = new Pool({
  connectionString: url,
  ssl: url.includes("supabase") ? { rejectUnauthorized: false } : undefined,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting seed...\n");

  // ── Notification Recipients ───────────────────────────────
  const defaultRecipients = [
    {
      email: "admin@mdmevents.org",
      name: "Admin",
      active: true,
      types: ["inquiry", "feedback"],
    },
  ];

  console.log("Seeding notification recipients...");
  for (const recipient of defaultRecipients) {
    const existing = await prisma.notificationRecipient.findUnique({
      where: { email: recipient.email },
    });

    if (existing) {
      console.log(`  ↳ ${recipient.email} already exists, skipping.`);
    } else {
      await prisma.notificationRecipient.create({ data: recipient });
      console.log(`  ✓ Created ${recipient.email}`);
    }
  }

  // ── Portfolio Items ───────────────────────────────────────
  try {
    const { portfolioItems } = await import("../src/data/portfolio");
    console.log("\nSeeding portfolio items...");
    for (const item of portfolioItems) {
      await prisma.portfolio.upsert({
        where: { id: item.id },
        update: {},
        create: {
          id: item.id,
          title: item.title,
          category: item.category,
          imageUrl: item.image,
          clientName: item.clientName || null,
          challenge: item.challenge || null,
          solution: item.solution || null,
          result: item.result || null,
        },
      });
    }
    console.log("  ✓ Portfolio items seeded.");
  } catch {
    console.log("  ↳ Portfolio data not found, skipping.");
  }

  console.log("\nSeed complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
