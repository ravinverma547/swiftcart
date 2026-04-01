import type { Request, Response } from "express";
import prisma from "../../config/prisma";

import type { Role } from "@prisma/client";

const toNumber = (value: unknown) => {
  const n = typeof value === "string" ? Number(value) : typeof value === "number" ? value : NaN;
  return Number.isFinite(n) ? n : undefined;
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : undefined;
    const category = typeof req.query.category === "string" ? req.query.category.trim() : undefined;
    const brand = typeof req.query.brand === "string" ? req.query.brand.trim() : undefined;

    const minPrice = toNumber(req.query.minPrice);
    const maxPrice = toNumber(req.query.maxPrice);

    const sort = typeof req.query.sort === "string" ? req.query.sort : "createdAt_desc";

    const where: any = {};
    if (category) where.category = category;
    if (brand) where.brand = brand;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { brand: { contains: q, mode: "insensitive" } },
      ];
    }

    const page = toNumber(req.query.page) ?? 1;
    const limit = toNumber(req.query.limit) ?? 12;
    const skip = (page - 1) * limit;

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { price: "asc" };
    if (sort === "price_desc") orderBy = { price: "desc" };
    if (sort === "rating_desc") orderBy = { ratings: "desc" };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    return res.status(200).json({ success: true, data: products });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message ?? "Failed to fetch products" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const reviews = await prisma.review.findMany({
      where: { productId: id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return res.status(200).json({ success: true, data: { product, reviews } });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message ?? "Failed to fetch product" });
  }
};

export const adminCreateProduct = async (req: Request, res: Response) => {
  try {
    const body = req.body as {
      name: string;
      description: string;
      price: number;
      images: string[];
      category: string;
      brand: string;
      stock: number;
      variants?: any;
    };

    if (!body?.name || !body?.price || !body?.brand) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        description: body.description ?? "",
        price: body.price,
        images: Array.isArray(body.images) ? body.images : [],
        category: body.category ?? "General",
        brand: body.brand,
        stock: body.stock ?? 0,
        variants: body.variants ?? null,
      },
    });

    return res.status(201).json({ success: true, data: product });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message ?? "Failed to create product" });
  }
};

export const adminUpdateProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const body = req.body as Partial<{
      name: string;
      description: string;
      price: number;
      images: string[];
      category: string;
      brand: string;
      stock: number;
      variants: any;
    }>;

    const data: any = {};
    if (body.name !== undefined) data.name = body.name;
    if (body.description !== undefined) data.description = body.description;
    if (body.price !== undefined) data.price = body.price;
    if (body.images !== undefined) data.images = body.images;
    if (body.category !== undefined) data.category = body.category;
    if (body.brand !== undefined) data.brand = body.brand;
    if (body.stock !== undefined) data.stock = body.stock;
    if (body.variants !== undefined) data.variants = body.variants;

    const updated = await prisma.product.update({
      where: { id },
      data,
    });

    return res.status(200).json({ success: true, data: updated });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message ?? "Failed to update product" });
  }
};

export const adminDeleteProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.product.delete({ where: { id } });
    return res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message ?? "Failed to delete product" });
  }
};

