import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { Role } from "@prisma/client";

export type AuthUser = {
  userId: string;
  role: Role;
  email: string;
};

export type AuthedRequest = Request & { user: AuthUser };

const JWT_SECRET = process.env.JWT_SECRET;

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!JWT_SECRET) {
      return res.status(500).json({ success: false, message: "JWT_SECRET missing in env" });
    }

    const secret: string = JWT_SECRET;

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Missing or invalid Authorization header" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Missing token in Authorization header" });
    }
    const decoded = jwt.verify(token, secret) as unknown as { userId?: string; role?: Role; email?: string };

    if (!decoded?.userId || !decoded?.role || !decoded?.email) {
      return res.status(401).json({ success: false, message: "Unauthorized: invalid token payload" });
    }

    (req as AuthedRequest).user = {
      userId: decoded.userId,
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Unauthorized: invalid token" });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  requireAuth(req, res, () => {
    const user = (req as AuthedRequest).user;
    if (!user || user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }
    next();
  });
};

