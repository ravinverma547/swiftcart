import { Request, Response } from "express";
import * as authService from "./auth.service";

export const signup = async (req: Request, res: Response) => {
  try {
    const user = await authService.createUser(req.body);
    
    // Password hide kar dena response mein
    const { password, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      message: "User registered successfully! 🛒",
      data: userWithoutPassword,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};