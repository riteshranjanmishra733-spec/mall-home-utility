import {
  createBooking as createBookingRecord,
  getCustomerBooking,
  getCustomerBookings,
  getProviderBookings,
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

export async function listProviderBookings(req, res) {
  try {
    const result = await getProviderBookings(req.user.id);
    return res.status(result.status).json(result.data);
  } catch (err) {
    console.error("List provider bookings error:", err);
    return res.status(500).json({ error: "Failed to fetch provider bookings" });
  }
}
