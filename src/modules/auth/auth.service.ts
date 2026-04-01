import prisma from "../../config/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Role } from "@prisma/client";

type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

const JWT_SECRET = process.env.JWT_SECRET || "";

const signToken = (payload: { userId: string; role: Role; email: string }) => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET missing in env");
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const createUser = async ({ name, email, password }: CreateUserInput) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Role is default CUSTOMER in schema.
  return prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
};

export const login = async ({ email, password }: LoginInput) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    throw new Error("Invalid email or password");
  }

  const token = signToken({ userId: user.id, role: user.role as Role, email: user.email });

  const { password: _password, ...userWithoutPassword } = user;
  return { token, user: userWithoutPassword, role: user.role as Role };
};

