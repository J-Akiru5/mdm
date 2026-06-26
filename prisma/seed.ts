import { PrismaClient } from '@prisma/client';
import { portfolioItems } from '../src/data/portfolio';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding portfolio items...');
  for (const item of portfolioItems) {
    await prisma.portfolioItem.upsert({
      where: { id: item.id },
      update: {},
      create: {
        id: item.id,
        title: item.title,
        category: item.category,
        image: item.image,
      },
    });
  }
  console.log('Portfolio items seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
