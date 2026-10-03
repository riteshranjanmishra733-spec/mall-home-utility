import * as adminService from "../services/adminService.js";

function createHandler(serviceMethod, errorMessage, getArgs = () => []) {
  return async (req, res) => {
    try {
      const result = await serviceMethod(...getArgs(req));
      return res.status(result.status ?? 200).json(result.data ?? result);
    } catch (err) {
      console.error(errorMessage, err);
      return res.status(500).json({ error: errorMessage });
    }
  };
}

export const getOverview = createHandler(adminService.getOverview, "Failed to fetch admin overview");
export const listUsers = createHandler(adminService.listUsers, "Failed to fetch users");
export const listProviders = createHandler(adminService.listProviders, "Failed to fetch providers");
export const listServices = createHandler(adminService.listServices, "Failed to fetch services");
export const listCategories = createHandler(adminService.listCategories, "Failed to fetch categories");
export const listBookings = createHandler(adminService.listBookings, "Failed to fetch bookings");
export const setProviderAvailability = createHandler(
  adminService.setProviderAvailability,
  "Failed to update provider availability",
  (req) => [req.params.id, req.body?.isAvailable]
);
export const setProviderServiceAvailability = createHandler(
  adminService.setProviderServiceAvailability,
  "Failed to update provider service availability",
  (req) => [req.params.providerId, req.params.serviceId, req.body?.isAvailable]
);
export const setServiceStatus = createHandler(
  adminService.setServiceStatus,
  "Failed to update service status",
  (req) => [req.params.id, req.body?.isActive]
);
export const setBookingStatus = createHandler(
  adminService.setBookingStatus,
  "Failed to update booking status",
  (req) => [req.params.id, req.body?.status]
);