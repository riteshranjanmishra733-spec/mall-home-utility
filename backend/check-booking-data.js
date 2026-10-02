import prisma from "./src/lib/prisma.js";

const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    role: true,
  },
});

const providers = await prisma.providerProfile.findMany({
  select: {
    id: true,
    user: {
      select: {
        name: true,
        email: true,
      },
    },
  },
});

const services = await prisma.service.findMany({
  where: {
    isActive: true,
  },
  select: {
    id: true,
    name: true,
  },
  orderBy: {
    name: "asc",
  },
});

console.log("\nUSERS:");
console.table(users);

console.log("\nPROVIDERS:");
console.table(providers);

console.log("\nSERVICES:");
console.table(services);

await prisma.$disconnect();