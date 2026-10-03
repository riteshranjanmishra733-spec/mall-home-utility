import * as adminService from "../services/adminService.js";

function createHandler(serviceMethod, errorMessage) {
  return async (req, res) => {
    try {
      const data = await serviceMethod();
      return res.status(200).json(data);
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