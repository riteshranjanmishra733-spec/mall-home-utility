import {
  createBooking as createBookingRecord,
  cancelCustomerBooking as cancelCustomerBookingRecord,
  getCustomerBooking,
  getCustomerBookings,
  getProviderBookings,
  updateProviderBookingStatus as updateProviderBookingStatusRecord,
} from "../services/bookingService.js";

export async function createBooking(req, res) {
  try {
    const result = await createBookingRecord(req.user.id, req.body);
    return res.status(result.status).json(result.data);
  } catch (err) {
    console.error("Create booking error:", err);
    return res.status(500).json({ error: "Failed to create booking" });
  }
}

export async function listCustomerBookings(req, res) {
  try {
    const result = await getCustomerBookings(req.user.id);
    return res.status(result.status).json(result.data);
  } catch (err) {
    console.error("List customer bookings error:", err);
    return res.status(500).json({ error: "Failed to fetch bookings" });
  }
}

export async function getCustomerBookingById(req, res) {
  try {
    const result = await getCustomerBooking(req.user.id, req.params.id);
    return res.status(result.status).json(result.data);
  } catch (err) {
    console.error("Get customer booking error:", err);
    return res.status(500).json({ error: "Failed to fetch booking" });
  }
}

export async function cancelCustomerBooking(req, res) {
  try {
    const result = await cancelCustomerBookingRecord(req.user.id, req.params.id);
    return res.status(result.status).json(result.data);
  } catch (err) {
    console.error("Cancel customer booking error:", err);
    return res.status(500).json({ error: "Failed to cancel booking" });
  }
}

export async function listProviderBookings(req, res) {
  try {
    const result = await getProviderBookings(req.user.id);
    return res.status(result.status).json(result.data);
  } catch (err) {
    console.error("List provider bookings error:", err);
    return res.status(500).json({ error: "Failed to fetch provider bookings" });
  }
}

export async function updateProviderBookingStatus(req, res) {
  try {
    const result = await updateProviderBookingStatusRecord(req.user.id, req.params.id, req.body?.status);
    return res.status(result.status).json(result.data);
  } catch (err) {
    console.error("Update provider booking status error:", err);
    return res.status(500).json({ error: "Failed to update booking status" });
  }
}
