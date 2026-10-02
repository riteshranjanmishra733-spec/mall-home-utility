import prisma from "./src/lib/prisma.js";

const result = await prisma.$queryRawUnsafe(`
  SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type
  FROM information_schema.table_constraints tc
  WHERE tc.table_schema = 'public'
    AND tc.table_name = 'bookings'
  ORDER BY tc.constraint_type, tc.constraint_name;
`);

console.table(result);

const columns = await prisma.$queryRawUnsafe(`
  SELECT
    column_name,
    data_type,
    udt_name
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'bookings'
  ORDER BY ordinal_position;
`);

console.table(columns);

await prisma.$disconnect();