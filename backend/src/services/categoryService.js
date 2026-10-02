import prisma from "../lib/prisma.js";

export async function getAllCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { services: true } } },
  });
  return { status: 200, data: { categories } };
}

export async function getCategoryById(id) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      services: { where: { isActive: true }, orderBy: { name: "asc" } },
    },
  });

  if (!category) {
    return { status: 404, data: { error: "Category not found" } };
  }

  return { status: 200, data: { category } };
}
