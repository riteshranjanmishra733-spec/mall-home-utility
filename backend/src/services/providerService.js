import prisma from "../lib/prisma.js";

function formatProvider(profile) {
  return {
    id: profile.id,
    name: profile.user.name,
    bio: profile.bio,
    city: profile.city,
    area: profile.area,
    pincode: profile.pincode,
    isAvailable: profile.isAvailable,
    phone: profile.phone,
    services: profile.providerServices.map((ps) => ({
      id: ps.service.id,
      name: ps.service.name,
      categoryName: ps.service.category.name,
      price: ps.price,
      isAvailable: ps.isAvailable,
    })),
  };
}

export async function getProvidersByService(serviceId, { city, area, pincode, available } = {}) {
  const where = { serviceId, provider: { verificationStatus: "APPROVED" } };

  if (available === "true") {
    where.isAvailable = true;
    where.provider = { ...where.provider, isAvailable: true };
  }

  if (city) {
    where.provider = { ...where.provider, city: { equals: city, mode: "insensitive" } };
  }
  if (area) {
    where.provider = { ...where.provider, area: { contains: area, mode: "insensitive" } };
  }
  if (pincode) {
    where.provider = { ...where.provider, pincode: { equals: pincode } };
  }

  const records = await prisma.providerService.findMany({
    where,
    include: {
      provider: {
        include: {
          user: { select: { name: true } },
          providerServices: {
            include: {
              service: { include: { category: { select: { name: true } } } },
            },
          },
        },
      },
    },
  });

  const providers = records.map((r) => formatProvider(r.provider));

  return { status: 200, data: { providers } };
}

export async function getProviderById(id) {
  const profile = await prisma.providerProfile.findFirst({
    where: { id, verificationStatus: "APPROVED" },
    include: {
      user: { select: { name: true } },
      providerServices: {
        include: {
          service: { include: { category: { select: { name: true } } } },
        },
      },
    },
  });

  if (!profile) {
    return { status: 404, data: { error: "Provider not found" } };
  }

  return { status: 200, data: { provider: formatProvider(profile) } };
}

export async function searchProviders({ city, area, pincode, available } = {}) {
  const where = { verificationStatus: "APPROVED" };

  if (available === "true") {
    where.isAvailable = true;
  }
  if (city) {
    where.city = { equals: city, mode: "insensitive" };
  }
  if (area) {
    where.area = { contains: area, mode: "insensitive" };
  }
  if (pincode) {
    where.pincode = { equals: pincode };
  }

  const profiles = await prisma.providerProfile.findMany({
    where,
    include: {
      user: { select: { name: true } },
      providerServices: {
        include: {
          service: { include: { category: { select: { name: true } } } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const providers = profiles.map(formatProvider);

  return { status: 200, data: { providers } };
}
export async function updateOwnServicePrice(userId, serviceId, price) {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    return {
      status: 400,
      data: { error: "Price must be a valid non-negative number" },
    };
  }

  const profile = await prisma.providerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) {
    return {
      status: 404,
      data: { error: "Provider profile not found" },
    };
  }

  const providerService = await prisma.providerService.findUnique({
    where: {
      providerId_serviceId: {
        providerId: profile.id,
        serviceId,
      },
    },
  });

  if (!providerService) {
    return {
      status: 404,
      data: { error: "This service is not assigned to you" },
    };
  }

  const updated = await prisma.providerService.update({
    where: {
      providerId_serviceId: {
        providerId: profile.id,
        serviceId,
      },
    },
    data: {
      price: numericPrice,
    },
    select: {
      providerId: true,
      serviceId: true,
      price: true,
      isAvailable: true,
    },
  });

  return {
    status: 200,
    data: {
      providerService: updated,
    },
  };
}
export async function getOwnProviderServices(userId) {
  const profile = await prisma.providerProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      providerServices: {
        include: {
          service: {
            select: {
              id: true,
              name: true,
              category: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!profile) {
    return {
      status: 404,
      data: { error: "Provider profile not found" },
    };
  }

  return {
    status: 200,
    data: {
      services: profile.providerServices.map((ps) => ({
        id: ps.service.id,
        name: ps.service.name,
        categoryName: ps.service.category.name,
        price: ps.price,
        isAvailable: ps.isAvailable,
      })),
    },
  };
}