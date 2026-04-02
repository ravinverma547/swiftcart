"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyCoupons = exports.validateCoupon = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const validateCoupon = async (req, res, next) => {
    try {
        const { code } = req.body;
        const userId = req.user.id;
        if (!code) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a coupon code'
            });
        }
        const coupon = await prisma_1.default.coupon.findUnique({
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
    }
    catch (error) {
        next(error);
    }
};
exports.validateCoupon = validateCoupon;
const getMyCoupons = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const now = new Date();
        const coupons = await prisma_1.default.coupon.findMany({
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
    }
    catch (error) {
        next(error);
    }
};
exports.getMyCoupons = getMyCoupons;
//# sourceMappingURL=couponController.js.map