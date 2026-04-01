import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';

export const validateCoupon = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.body;
    const userId = (req as any).user.id;

    if (!code) {
        return res.status(400).json({
            success: false,
            message: 'Please enter a coupon code'
        });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code },
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid coupon code',
      });
    }

    if (coupon.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'This coupon does not belong to you',
      });
    }

    if (coupon.isUsed) {
      return res.status(400).json({
        success: false,
        message: 'This coupon has already been used',
      });
    }

    if (new Date() > new Date(coupon.expiresAt)) {
      return res.status(400).json({
        success: false,
        message: 'This coupon has expired (2-day limit reached)',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Coupon applied successfully!',
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyCoupons = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const now = new Date();

        const coupons = await prisma.coupon.findMany({
            where: {
                userId,
                isUsed: false,
                expiresAt: { gt: now }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            success: true,
            coupons
        });
    } catch (error) {
        next(error);
    }
};
