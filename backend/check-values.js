import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRawUnsafe(`
    SELECT
      'services.category_id' AS column_name,
      category_id AS value
    FROM services

    UNION ALL

    SELECT
      'provider_profiles.user_id',
      user_id
    FROM provider_profiles

    UNION ALL

    SELECT
      'provider_services.provider_id',
      provider_id
    FROM provider_services

    UNION ALL

    SELECT
      'provider_services.service_id',
      service_id
    FROM provider_services
    LIMIT 100;
  `);

  console.table(result);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());