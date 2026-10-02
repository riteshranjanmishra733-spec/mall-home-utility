import { getAllServices, getServiceById } from "../services/serviceService.js";

export async function listServices(req, res) {
  try {
    const result = await getAllServices(req.query.categoryId);
    return res.status(result.status).json(result.data);
  } catch (err) {
    console.error("List services error:", err);
    return res.status(500).json({ error: "Failed to fetch services" });
  }
}

export async function getService(req, res) {
  try {
    const result = await getServiceById(req.params.id);
    return res.status(result.status).json(result.data);
  } catch (err) {
    console.error("Get service error:", err);
    return res.status(500).json({ error: "Failed to fetch service" });
  }
}
