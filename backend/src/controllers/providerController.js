import { getProvidersByService, getProviderById, searchProviders } from "../services/providerService.js";

export async function listProvidersForService(req, res) {
  try {
    const { serviceId } = req.params;
    const { city, area, pincode, available } = req.query;

    if (!serviceId) {
      return res.status(400).json({ error: "Service ID is required" });
    }

    const result = await getProvidersByService(serviceId, { city, area, pincode, available });
    return res.status(result.status).json(result.data);
  } catch (err) {
    console.error("List providers for service error:", err);
    return res.status(500).json({ error: "Failed to fetch providers" });
  }
}

export async function getProvider(req, res) {
  try {
    const result = await getProviderById(req.params.id);
    return res.status(result.status).json(result.data);
  } catch (err) {
    console.error("Get provider error:", err);
    return res.status(500).json({ error: "Failed to fetch provider" });
  }
}

export async function searchAllProviders(req, res) {
  try {
    const { city, area, pincode, available } = req.query;
    const result = await searchProviders({ city, area, pincode, available });
    return res.status(result.status).json(result.data);
  } catch (err) {
    console.error("Search providers error:", err);
    return res.status(500).json({ error: "Failed to search providers" });
  }
}
