import type { Request, Response } from "express";
import prisma from "../../config/prisma";

const allowedPaymentMethods = new Set(["COD", "STRIPE", "RAZORPAY"]);

export const checkoutOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId as string;
    const {
      shippingAddress,
      paymentMethod,
    } = req.body as {
      shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
      };
      paymentMethod: string;
    };

    if (!shippingAddress?.street || !shippingAddress?.city || !shippingAddress?.zipCode) {
      return res.status(400).json({ success: false, message: "Valid shippingAddress required" });
    }
    if (!paymentMethod || !allowedPaymentMethods.has(paymentMethod)) {
      return res.status(400).json({ success: false, message: "Valid paymentMethod required" });
    }

    const cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Validate stock and create order items snapshot.
    let totalPrice = 0;
    const orderItems = (cart.items as any[]).map((it) => {
      totalPrice += it.quantity * it.price;
      return {
        productId: it.productId,
        quantity: it.quantity,
        price: it.price,
        name: it.name,
        image: it.image,
      };
    });

    for (const it of cart.items as any[]) {
      const product = await prisma.product.findUnique({ where: { id: it.productId } });
      if (!product) {
        return res.status(400).json({ success: false, message: `Product missing: ${it.productId}` });
      }
      if (product.stock < it.quantity) {
        return res.status(400).json({ success: false, message: `Not enough stock for ${product.name}` });
      }
    }

    // Decrement stock.
    for (const it of cart.items as any[]) {
      await prisma.product.update({
        where: { id: it.productId },
        data: { stock: { decrement: it.quantity } },
      });
    }

    const paymentStatus = paymentMethod === "COD" ? "PAID" : "PENDING";

    const order = await prisma.order.create({
      data: {
        userId,
        orderItems: orderItems as any,
        shippingAddress: shippingAddress as any,
        paymentMethod,
        paymentStatus,
        totalPrice,
        status: "PROCESSING",
      },
    });

    await prisma.cart.update({
      where: { userId },
      data: { items: [] },
    });

    return res.status(201).json({ success: true, data: order });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message ?? "Checkout failed" });
  }
};

export const listMyOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId as string;
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return res.status(200).json({ success: true, data: orders });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message ?? "Failed to fetch orders" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId as string;
    const id = req.params.id as string;
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order || order.userId !== userId) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    return res.status(200).json({ success: true, data: order });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message ?? "Failed to fetch order" });
  }
};

export const adminListOrders = async (_req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return res.status(200).json({ success: true, data: orders });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message ?? "Failed to fetch orders" });
  }
};

export const adminUpdateOrderStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body as { status: "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" };
    const allowed = new Set(["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]);
    if (!status || !allowed.has(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const updateData: any = { status };
    if (status === "DELIVERED") {
      updateData.deliveredAt = new Date();
    }

    const order = await prisma.order.update({ where: { id }, data: updateData });
    return res.status(200).json({ success: true, data: order });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error?.message ?? "Failed to update order" });
  }
};

