import type { Request, Response } from "express";
import prisma from "../../config/prisma";

type CartItemInput = {
  productId: string;
  quantity: number;
};

const ensureQuantity = (raw: unknown) => {
  const q = typeof raw === "string" ? Number(raw) : typeof raw === "number" ? raw : NaN;
  if (!Number.isFinite(q) || q <= 0) return undefined;
  return Math.floor(q);
};

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId as string;

    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId, items: [] } });
    }

    return res.status(200).json({ success: true, data: cart });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message ?? "Failed to fetch cart" });
  }
};

export const addCartItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId as string;
    const { productId, quantity } = req.body as CartItemInput;

    const qty = ensureQuantity(quantity);
    if (!productId || !qty) {
      return res.status(400).json({ success: false, message: "productId and quantity are required" });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    if (product.stock < qty) {
      return res.status(400).json({ success: false, message: "Not enough stock" });
    }

    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) cart = await prisma.cart.create({ data: { userId, items: [] } });

    const existing = cart.items?.find((it: any) => it.productId === productId);
    const newQuantity = existing ? existing.quantity + qty : qty;
    if (product.stock < newQuantity) {
      return res.status(400).json({ success: false, message: "Not enough stock" });
    }

    const nextItems = Array.isArray(cart.items) ? [...cart.items] : [];
    if (existing) {
      const idx = nextItems.findIndex((it: any) => it.productId === productId);
      nextItems[idx] = {
        ...existing,
        quantity: newQuantity,
        price: product.price,
        name: product.name,
        image: (product as any).images?.[0] ?? "",
      };
    } else {
      nextItems.push({
        productId: product.id,
        quantity: qty,
        price: product.price,
        name: product.name,
        image: (product as any).images?.[0] ?? "",
      } as any);
    }

    cart = await prisma.cart.update({
      where: { userId },
      data: { items: nextItems },
    });

    return res.status(200).json({ success: true, data: cart });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message ?? "Failed to add to cart" });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId as string;
    const productId = req.params.productId as string;
    const quantity = req.body?.quantity;

    const qty = ensureQuantity(quantity);
    if (!productId || !qty) {
      return res.status(400).json({ success: false, message: "Valid productId and quantity required" });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    if (product.stock < qty) {
      return res.status(400).json({ success: false, message: "Not enough stock" });
    }

    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) cart = await prisma.cart.create({ data: { userId, items: [] } });

    const nextItems = (Array.isArray(cart.items) ? cart.items : []).map((it: any) => {
      if (it.productId !== productId) return it;
      return {
        ...it,
        quantity: qty,
        price: product.price,
        name: product.name,
        image: product.images?.[0] ?? "",
      };
    });

    cart = await prisma.cart.update({
      where: { userId },
      data: { items: nextItems },
    });

    return res.status(200).json({ success: true, data: cart });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message ?? "Failed to update cart item" });
  }
};

export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId as string;
    const productId = req.params.productId;

    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) cart = await prisma.cart.create({ data: { userId, items: [] } });

    const nextItems = (Array.isArray(cart.items) ? cart.items : []).filter((it: any) => it.productId !== productId);

    cart = await prisma.cart.update({
      where: { userId },
      data: { items: nextItems },
    });

    return res.status(200).json({ success: true, data: cart });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message ?? "Failed to remove cart item" });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  const userId = (req as any).user.userId as string;
  try {
    const cart = await prisma.cart.update({
      where: { userId },
      data: { items: [] },
    });
    return res.status(200).json({ success: true, data: cart });
  } catch (error: any) {
    // If cart doesn't exist yet.
    try {
      const cart = await prisma.cart.create({ data: { userId, items: [] } });
      return res.status(200).json({ success: true, data: cart });
    } catch {
      return res.status(500).json({ success: false, message: error?.message ?? "Failed to clear cart" });
    }
  }
};

