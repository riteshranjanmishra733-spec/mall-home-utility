import prisma from "../lib/prisma.js";

export async function getOverview() {
  const [totalUsers, totalCustomers, totalProviderAccounts, totalProviderProfiles, totalServices, totalBookings] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.user.count({ where: { role: "PROVIDER" } }),
    prisma.providerProfile.count(),
    prisma.service.count(),
    prisma.booking.count(),
  ]);

  return {
    overview: {
      totalUsers,
      totalCustomers,
      totalProviderAccounts,
      totalProviderProfiles,
      totalServices,
      totalBookings,
    },
  };
}

export async function listUsers() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return { users };
}

export async function listProviders() {
  const profiles = await prisma.providerProfile.findMany({
    select: {
      id: true,
      userId: true,
      bio: true,
      city: true,
      area: true,
      pincode: true,
      phone: true,
      isAvailable: true,
      user: { select: { name: true, email: true } },
      providerServices: {
        select: {
          isAvailable: true,
          service: {
            select: {
              id: true,
              name: true,
              isActive: true,
              category: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    providers: profiles.map((profile) => ({
      id: profile.id,
      userId: profile.userId,
      name: profile.user.name,
      email: profile.user.email,
      bio: profile.bio,
      city: profile.city,
      area: profile.area,
      pincode: profile.pincode,
      phone: profile.phone,
      isAvailable: profile.isAvailable,
      offeredServices: profile.providerServices.map((providerService) => ({
        ...providerService.service,
        isAvailable: providerService.isAvailable,
      })),
    })),
  };
}

export async function listServices() {
  const services = await prisma.service.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      isActive: true,
      category: { select: { id: true, name: true } },
    },
    orderBy: { name: "asc" },
  });
  return { services };
}

export async function listCategories() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true, description: true, icon: true, createdAt: true, updatedAt: true },
    orderBy: { name: "asc" },
  });
  return { categories };
}

export async function listBookings() {
  const bookings = await prisma.booking.findMany({
    select: {
      id: true,
      bookingDate: true,
      bookingTime: true,
      address: true,
      notes: true,
      status: true,
      createdAt: true,
      customer: { select: { name: true, email: true } },
      provider: { select: { user: { select: { name: true, email: true } } } },
      service: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return {
    bookings: bookings.map(({ provider, ...booking }) => ({
      ...booking,
      provider: provider.user,
    })),
  };
}