"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = exports.listReviews = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const listReviews = async (req, res) => {
    var _a;
    try {
        const productId = typeof req.query.productId === "string" ? req.query.productId : undefined;
        const reviews = await prisma_1.default.review.findMany({
            where: productId ? { productId } : {},
            orderBy: { createdAt: "desc" },
            take: 50,
            include: {
                user: {
                    select: { id: true, name: true },
                },
            },
        });
        return res.status(200).json({ success: true, data: reviews });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Failed to fetch reviews" });
    }
};
exports.listReviews = listReviews;
const createReview = async (req, res) => {
    var _a, _b, _c, _d, _e;
    try {
        const userId = req.user.userId;
        const { productId, rating, comment } = req.body;
        const r = typeof rating === "string" ? Number(rating) : rating;
        if (!productId)
            return res.status(400).json({ success: false, message: "productId required" });
        if (!Number.isFinite(r) || r < 1 || r > 5)
            return res.status(400).json({ success: false, message: "rating 1-5 required" });
        if (!comment || typeof comment !== "string" || comment.trim().length < 3) {
            return res.status(400).json({ success: false, message: "comment must be at least 3 chars" });
        }
        // Basic check: ensure product exists.
        const product = await prisma_1.default.product.findUnique({ where: { id: productId } });
        if (!product)
            return res.status(404).json({ success: false, message: "Product not found" });
        const review = await prisma_1.default.review.create({
            data: {
                userId,
                productId,
                rating: Math.floor(r),
                comment: comment.trim(),
            },
        });
        // Recompute ratings for the product.
        const agg = await prisma_1.default.review.aggregate({
            where: { productId },
            _avg: { rating: true },
            _count: { id: true },
        });
        const avgRating = (_b = (_a = agg === null || agg === void 0 ? void 0 : agg._avg) === null || _a === void 0 ? void 0 : _a.rating) !== null && _b !== void 0 ? _b : 0;
        const count = (_d = (_c = agg === null || agg === void 0 ? void 0 : agg._count) === null || _c === void 0 ? void 0 : _c.id) !== null && _d !== void 0 ? _d : 0;
        await prisma_1.default.product.update({
            where: { id: productId },
            data: {
                ratings: avgRating,
                numReviews: count,
            },
        });
        return res.status(201).json({ success: true, message: "Review created", data: review });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: (_e = error === null || error === void 0 ? void 0 : error.message) !== null && _e !== void 0 ? _e : "Failed to create review" });
    }
};
exports.createReview = createReview;
//# sourceMappingURL=review.controller.js.map