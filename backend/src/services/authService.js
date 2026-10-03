import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

const PUBLIC_REGISTRATION_ROLES = ["CUSTOMER", "PROVIDER"];

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function safeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function register({ name, email, password, role }) {
  if (!name || !email || !password) {
    return { status: 400, data: { error: "Name, email, and password are required" } };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: 400, data: { error: "Invalid email format" } };
  }

  if (password.length < 6) {
    return { status: 400, data: { error: "Password must be at least 6 characters" } };
  }

  const assignedRole = role === undefined ? "CUSTOMER" : role;
  if (typeof assignedRole !== "string" || !PUBLIC_REGISTRATION_ROLES.includes(assignedRole)) {
    return { status: 400, data: { error: "Invalid role" } };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { status: 409, data: { error: "Email already registered" } };
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role: assignedRole },
  });

  const token = signToken(user);
  return { status: 201, data: { token, user: safeUser(user) } };
}

export async function login({ email, password }) {
  if (!email || !password) {
    return { status: 400, data: { error: "Email and password are required" } };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { status: 401, data: { error: "Invalid email or password" } };
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return { status: 401, data: { error: "Invalid email or password" } };
  }

  const token = signToken(user);
  return { status: 200, data: { token, user: safeUser(user) } };
}

export async function getMe(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { status: 404, data: { error: "User not found" } };
  }
  return { status: 200, data: { user: safeUser(user) } };
}
