import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRawUnsafe(`
    SELECT COUNT(*)::int AS count
    FROM users;
  `);

  console.log(result);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());