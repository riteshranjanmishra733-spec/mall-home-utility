import prisma from "./src/lib/prisma.js";

const result = await prisma.$queryRawUnsafe(`
  SELECT routine_name
  FROM information_schema.routines
  WHERE routine_schema = 'public'
    AND routine_name = 'update_updated_at';
`);

console.table(result);

await prisma.$disconnect();