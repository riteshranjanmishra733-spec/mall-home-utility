import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

try {
  const result = await prisma.$queryRawUnsafe(`
    SELECT
      table_name,
      column_name,
      data_type,
      udt_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND (
        (table_name = 'categories' AND column_name = 'id')
        OR (table_name = 'services' AND column_name = 'category_id')
        OR (table_name = 'provider_profiles' AND column_name = 'user_id')
        OR (table_name = 'provider_services' AND column_name = 'provider_id')
        OR (table_name = 'provider_services' AND column_name = 'service_id')
      )
    ORDER BY table_name, column_name;
  `);

  console.table(result);
} catch (error) {
  console.error(error);
} finally {
  await prisma.$disconnect();
}