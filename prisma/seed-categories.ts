import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const defaultCategories = [
  { name: "corporate", sortOrder: 0 },
  { name: "government", sortOrder: 1 },
  { name: "launches", sortOrder: 2 },
  { name: "festivals", sortOrder: 3 },
  { name: "production", sortOrder: 4 },
  { name: "exhibits", sortOrder: 5 },
];

async function main() {
  console.log("Seeding categories...");

  for (const cat of defaultCategories) {
    const existing = await prisma.category.findUnique({ where: { name: cat.name } });
    if (!existing) {
      await prisma.category.create({ data: cat });
      console.log(`  Created: ${cat.name}`);
    } else {
      console.log(`  Skipped (exists): ${cat.name}`);
    }
  }

  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
