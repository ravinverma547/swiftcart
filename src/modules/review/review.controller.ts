import type { Request, Response } from "express";
import prisma from "../../config/prisma";

export const listReviews = async (req: Request, res: Response) => {
  try {
    const productId = typeof req.query.productId === "string" ? req.query.productId : undefined;

    const reviews = await prisma.review.findMany({
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
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message ?? "Failed to fetch reviews" });
  }
};

export const createReview = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId as string;
    const { productId, rating, comment } = req.body as { productId: string; rating: number; comment: string };

    const r = typeof rating === "string" ? Number(rating) : rating;
    if (!productId) return res.status(400).json({ success: false, message: "productId required" });
    if (!Number.isFinite(r) || r < 1 || r > 5) return res.status(400).json({ success: false, message: "rating 1-5 required" });
    if (!comment || typeof comment !== "string" || comment.trim().length < 3) {
      return res.status(400).json({ success: false, message: "comment must be at least 3 chars" });
    }

    // Basic check: ensure product exists.
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating: Math.floor(r),
        comment: comment.trim(),
      },
    });

    // Recompute ratings for the product.
    const agg = await prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { id: true },
    });

    const avgRating = (agg as any)?._avg?.rating ?? 0;
    const count = (agg as any)?._count?.id ?? 0;

    await prisma.product.update({
      where: { id: productId },
      data: {
        ratings: avgRating,
        numReviews: count,
      },
    });

    return res.status(201).json({ success: true, message: "Review created", data: review });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message ?? "Failed to create review" });
  }
};

