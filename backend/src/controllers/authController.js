import { register, login, getMe } from "../services/authService.js";

export async function registerHandler(req, res) {
  try {
    const result = await register(req.body);
    return res.status(result.status).json(result.data);
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Registration failed" });
  }
}

export async function loginHandler(req, res) {
  try {
    const result = await login(req.body);
    return res.status(result.status).json(result.data);
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Login failed" });
  }
}

export async function meHandler(req, res) {
  try {
    const result = await getMe(req.user.id);
    return res.status(result.status).json(result.data);
  } catch (err) {
    console.error("Me error:", err);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
}
