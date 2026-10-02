import prisma from "../lib/prisma.js";

export async function getAllServices(categoryId) {
  const where = { isActive: true };
  if (categoryId) where.categoryId = categoryId;

  const services = await prisma.service.findMany({
    where,
    orderBy: { name: "asc" },
    include: {
      category: { select: { id: true, name: true, icon: true } },
      _count: {
        select: {
          providerServices: { where: { isAvailable: true } },
        },
      },
    },
  });

  return {
    status: 200,
    data: {
      services: services.map((s) => ({
        ...s,
        providerCount: s._count.providerServices,
        _count: undefined,
      })),
    },
  };
}

export async function getServiceById(id) {
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true, icon: true } },
    },
  });

  if (!service) {
    return { status: 404, data: { error: "Service not found" } };
  }

  return { status: 200, data: { service } };
}
