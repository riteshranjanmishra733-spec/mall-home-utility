import prisma from "../lib/prisma.js";

const bookingDetails = {
  service: { select: { id: true, name: true } },
  provider: { select: { id: true, user: { select: { name: true } } } },
};
const providerStatusTransitions = {
  PENDING: ["ACCEPTED", "REJECTED", "CANCELLED"],
  ACCEPTED: ["COMPLETED"],
};
const allowedProviderStatuses = new Set(["ACCEPTED", "REJECTED", "COMPLETED", "CANCELLED"]);

function isUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function createBooking(customerId, input = {}) {
  const { providerId, serviceId, bookingDate, bookingTime, address, notes } = input;

  if (!isUuid(providerId) || !isUuid(serviceId)) {
    return { status: 400, data: { error: "A valid provider and service are required" } };
  }

  if (typeof bookingDate !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(bookingDate)) {
    return { status: 400, data: { error: "A valid booking date is required" } };
  }
  const parsedDate = new Date(`${bookingDate}T00:00:00.000Z`);
  if (Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== bookingDate) {
    return { status: 400, data: { error: "A valid booking date is required" } };
  }
  // Booking dates are normalized to UTC midnight, so compare calendar dates in UTC.
  const todayUtc = new Date().toISOString().slice(0, 10);
  if (bookingDate < todayUtc) {
    return { status: 400, data: { error: "Booking date cannot be in the past" } };
  }

  let normalizedBookingTime = null;
  if (bookingTime !== undefined && bookingTime !== null) {
    if (typeof bookingTime !== "string") {
      return { status: 400, data: { error: "Booking time must use HH:mm format" } };
    }
    const trimmedBookingTime = bookingTime.trim();
    if (trimmedBookingTime && !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(trimmedBookingTime)) {
      return { status: 400, data: { error: "Booking time must use HH:mm format" } };
    }
    normalizedBookingTime = trimmedBookingTime || null;
  }

  if (typeof address !== "string" || !address.trim()) {
    return { status: 400, data: { error: "Address is required" } };
  }

  const [provider, service, providerService] = await Promise.all([
    prisma.providerProfile.findUnique({ where: { id: providerId } }),
    prisma.service.findUnique({ where: { id: serviceId } }),
    prisma.providerService.findUnique({
      where: { providerId_serviceId: { providerId, serviceId } },
    }),
  ]);

  if (!provider) return { status: 404, data: { error: "Provider not found" } };
  if (!service || !service.isActive) return { status: 404, data: { error: "Service not found" } };
  if (!providerService || !providerService.isAvailable) {
    return { status: 400, data: { error: "This provider does not offer this service" } };
  }
  if (!provider.isAvailable) {
    return { status: 409, data: { error: "This provider is currently unavailable" } };
  }

  const booking = await prisma.booking.create({
    data: {
      customerId,
      providerId,
      serviceId,
      bookingDate: parsedDate,
      bookingTime: normalizedBookingTime,
      address: address.trim(),
      notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
    },
    include: bookingDetails,
  });

  return { status: 201, data: { booking } };
}

export async function getCustomerBookings(customerId) {
  const bookings = await prisma.booking.findMany({
    where: { customerId },
    include: bookingDetails,
    orderBy: { createdAt: "desc" },
  });
  return { status: 200, data: { bookings } };
}

export async function getCustomerBooking(customerId, bookingId) {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, customerId },
    include: bookingDetails,
  });
  if (!booking) return { status: 404, data: { error: "Booking not found" } };
  return { status: 200, data: { booking } };
}

export async function cancelCustomerBooking(customerId, bookingId) {
  if (!isUuid(bookingId)) {
    return { status: 400, data: { error: "A valid booking ID is required" } };
  }

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, customerId },
    select: { id: true, status: true },
  });
  if (!booking) return { status: 404, data: { error: "Booking not found" } };
  if (booking.status !== "PENDING") {
    return { status: 409, data: { error: `Cannot cancel a booking with status ${booking.status}` } };
  }

  const update = await prisma.booking.updateMany({
    where: { id: booking.id, customerId, status: "PENDING" },
    data: { status: "CANCELLED" },
  });
  if (update.count === 0) {
    return { status: 409, data: { error: "Booking status changed; refresh and try again" } };
  }

  const updatedBooking = await prisma.booking.findFirst({
    where: { id: booking.id, customerId },
    include: bookingDetails,
  });
  return { status: 200, data: { booking: updatedBooking } };
}

export async function getProviderBookings(userId) {
  const profile = await prisma.providerProfile.findUnique({ where: { userId } });
  if (!profile) return { status: 404, data: { error: "Provider profile not found" } };

  const bookings = await prisma.booking.findMany({
    where: { providerId: profile.id },
    include: {
      ...bookingDetails,
      customer: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return { status: 200, data: { bookings } };
}

export async function updateProviderBookingStatus(userId, bookingId, nextStatus) {
  if (!isUuid(bookingId)) {
    return { status: 400, data: { error: "A valid booking ID is required" } };
  }
  if (!allowedProviderStatuses.has(nextStatus)) {
    return {
      status: 400,
      data: { error: "Status must be ACCEPTED, REJECTED, COMPLETED, or CANCELLED" },
    };
  }

  const profile = await prisma.providerProfile.findUnique({ where: { userId } });
  if (!profile) return { status: 404, data: { error: "Provider profile not found" } };

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, providerId: profile.id },
    select: { id: true, status: true },
  });
  if (!booking) return { status: 404, data: { error: "Booking not found" } };

  if (!providerStatusTransitions[booking.status]?.includes(nextStatus)) {
    return {
      status: 409,
      data: { error: `Cannot change booking status from ${booking.status} to ${nextStatus}` },
    };
  }

  const update = await prisma.booking.updateMany({
    where: { id: booking.id, providerId: profile.id, status: booking.status },
    data: { status: nextStatus },
  });
  if (update.count === 0) {
    return { status: 409, data: { error: "Booking status changed; refresh and try again" } };
  }

  const updatedBooking = await prisma.booking.findUnique({
    where: { id: booking.id },
    include: {
      ...bookingDetails,
      customer: { select: { id: true, name: true, email: true } },
    },
  });
  return { status: 200, data: { booking: updatedBooking } };
}