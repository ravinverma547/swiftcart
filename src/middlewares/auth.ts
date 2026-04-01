import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import { verifyToken } from '../utils/jwt';

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Login first to access this resource',
      });
    }

    const decoded = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, name: true },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid user session',
      });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = (req as any).user?.role;

    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Role (${userRole}) is not allowed to access this resource`,
      });
    }

    next();
  };
};
