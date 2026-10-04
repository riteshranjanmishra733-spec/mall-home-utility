import prisma from "../lib/prisma.js";
import { updateAdminBookingStatus as updateBookingStatus } from "./bookingService.js";

const providerProfileSelect = {
  id: true,
  userId: true,
  bio: true,
  city: true,
  area: true,
  pincode: true,
  phone: true,
  isAvailable: true,
  verificationStatus: true,
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
};

function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function formatProvider(profile) {
  return {
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
    verificationStatus: profile.verificationStatus,
    offeredServices: profile.providerServices.map((providerService) => ({
      ...providerService.service,
      isAvailable: providerService.isAvailable,
    })),
  };
}

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
    select: providerProfileSelect,
    orderBy: { createdAt: "desc" },
  });

  return { providers: profiles.map(formatProvider) };
}

export async function setProviderAvailability(providerId, isAvailable) {
  if (!isUuid(providerId)) {
    return { status: 400, data: { error: "A valid provider ID is required" } };
  }
  if (typeof isAvailable !== "boolean") {
    return { status: 400, data: { error: "isAvailable must be a boolean" } };
  }

  const update = await prisma.providerProfile.updateMany({
    where: { id: providerId },
    data: { isAvailable },
  });
  if (update.count === 0) {
    return { status: 404, data: { error: "Provider profile not found" } };
  }

  const profile = await prisma.providerProfile.findUnique({
    where: { id: providerId },
    select: providerProfileSelect,
  });
  return { status: 200, data: { provider: formatProvider(profile) } };
}

export async function setProviderVerificationStatus(providerId, status) {
  if (!isUuid(providerId)) {
    return { status: 400, data: { error: "A valid provider ID is required" } };
  }
  if (status !== "APPROVED" && status !== "REJECTED") {
    return { status: 400, data: { error: "Status must be APPROVED or REJECTED" } };
  }

  const update = await prisma.providerProfile.updateMany({
    where: { id: providerId },
    data: { verificationStatus: status },
  });
  if (update.count === 0) {
    return { status: 404, data: { error: "Provider profile not found" } };
  }

  const profile = await prisma.providerProfile.findUnique({
    where: { id: providerId },
    select: providerProfileSelect,
  });
  return { status: 200, data: { provider: formatProvider(profile) } };
}

export async function setProviderServiceAvailability(providerId, serviceId, isAvailable) {
  if (!isUuid(providerId) || !isUuid(serviceId)) {
    return { status: 400, data: { error: "Valid provider and service IDs are required" } };
  }
  if (typeof isAvailable !== "boolean") {
    return { status: 400, data: { error: "isAvailable must be a boolean" } };
  }

  const provider = await prisma.providerProfile.findUnique({
    where: { id: providerId },
    select: { id: true },
  });
  if (!provider) {
    return { status: 404, data: { error: "Provider profile not found" } };
  }

  const update = await prisma.providerService.updateMany({
    where: { providerId, serviceId },
    data: { isAvailable },
  });
  if (update.count === 0) {
    return { status: 404, data: { error: "Provider service association not found" } };
  }

  const providerService = await prisma.providerService.findUnique({
    where: { providerId_serviceId: { providerId, serviceId } },
    select: {
      providerId: true,
      serviceId: true,
      isAvailable: true,
    },
  });
  return { status: 200, data: { providerService } };
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

export async function setServiceStatus(serviceId, isActive) {
  if (!isUuid(serviceId)) {
    return { status: 400, data: { error: "A valid service ID is required" } };
  }
  if (typeof isActive !== "boolean") {
    return { status: 400, data: { error: "isActive must be a boolean" } };
  }

  const update = await prisma.service.updateMany({
    where: { id: serviceId },
    data: { isActive },
  });
  if (update.count === 0) {
    return { status: 404, data: { error: "Service not found" } };
  }

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    select: {
      id: true,
      name: true,
      description: true,
      isActive: true,
      category: { select: { id: true, name: true } },
    },
  });
  return { status: 200, data: { service } };
}

export async function setBookingStatus(bookingId, status) {
  return updateBookingStatus(bookingId, status);
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
export async function setProviderServicePrice(providerId, serviceId, price) {
  if (!isUuid(providerId) || !isUuid(serviceId)) {
    return { status: 400, data: { error: "Valid provider and service IDs are required" } };
  }

  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    return { status: 400, data: { error: "Price must be a valid non-negative number" } };
  }

  const providerService = await prisma.providerService.findUnique({
    where: {
      providerId_serviceId: { providerId, serviceId },
    },
  });

  if (!providerService) {
    return {
      status: 404,
      data: { error: "Provider service association not found" },
    };
  }

  const updated = await prisma.providerService.update({
    where: {
      providerId_serviceId: { providerId, serviceId },
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
    data: { providerService: updated },
  };
}