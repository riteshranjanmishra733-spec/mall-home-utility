import prisma from "./src/lib/prisma.js";

const result = await prisma.$queryRawUnsafe(`
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
    AND table_name = 'bookings';
`);

console.table(result);

await prisma.$disconnect();
