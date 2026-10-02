import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.category.count();
  const services = await prisma.service.count();
  const providers = await prisma.providerProfile.count();
  const providerServices = await prisma.providerService.count();

  console.table({
    categories,
    services,
    providers,
    providerServices,
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());