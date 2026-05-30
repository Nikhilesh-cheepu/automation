import "dotenv/config";
import { seedDatabase } from "../src/lib/seed-data";
import { prisma } from "../src/lib/prisma";

seedDatabase()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
