import type { Request, Response } from "express";
import * as authService from "./auth.service";
import type { AuthedRequest } from "../../middlewares/auth.middleware";

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "name, email, password required" });
    }

    const user = await authService.createUser({ name, email, password });
    const { password: _password, ...userWithoutPassword } = user;

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: userWithoutPassword,
    });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error?.message ?? "Signup failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "email and password required" });
    }

    const result = await authService.login({ email, password });
    return res.status(200).json({ success: true, message: "Login success", data: result });
  } catch (error: any) {
    return res.status(401).json({ success: false, message: error?.message ?? "Login failed" });
  }
};

export const me = async (req: Request, res: Response) => {
  const authedReq = req as AuthedRequest;
  return res.status(200).json({
    success: true,
    data: authedReq.user,
  });
};

