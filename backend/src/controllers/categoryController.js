import { getAllCategories, getCategoryById } from "../services/categoryService.js";

export async function listCategories(req, res) {
  try {
    const result = await getAllCategories();
    return res.status(result.status).json(result.data);
  } catch (err) {
    console.error("List categories error:", err);
    return res.status(500).json({ error: "Failed to fetch categories" });
  }
}

export async function getCategory(req, res) {
  try {
    const result = await getCategoryById(req.params.id);
    return res.status(result.status).json(result.data);
  } catch (err) {
    console.error("Get category error:", err);
    return res.status(500).json({ error: "Failed to fetch category" });
  }
}
