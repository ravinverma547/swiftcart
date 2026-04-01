"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUpdateOrderStatus = exports.adminListOrders = exports.getOrderById = exports.listMyOrders = exports.checkoutOrder = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const allowedPaymentMethods = new Set(["COD", "STRIPE", "RAZORPAY"]);
const checkoutOrder = async (req, res) => {
    var _a;
    try {
        const userId = req.user.userId;
        const { shippingAddress, paymentMethod, } = req.body;
        if (!(shippingAddress === null || shippingAddress === void 0 ? void 0 : shippingAddress.street) || !(shippingAddress === null || shippingAddress === void 0 ? void 0 : shippingAddress.city) || !(shippingAddress === null || shippingAddress === void 0 ? void 0 : shippingAddress.zipCode)) {
            return res.status(400).json({ success: false, message: "Valid shippingAddress required" });
        }
        if (!paymentMethod || !allowedPaymentMethods.has(paymentMethod)) {
            return res.status(400).json({ success: false, message: "Valid paymentMethod required" });
        }
        const cart = await prisma_1.default.cart.findUnique({ where: { userId } });
        if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }
        // Validate stock and create order items snapshot.
        let totalPrice = 0;
        const orderItems = cart.items.map((it) => {
            totalPrice += it.quantity * it.price;
            return {
                productId: it.productId,
                quantity: it.quantity,
                price: it.price,
                name: it.name,
                image: it.image,
            };
        });
        for (const it of cart.items) {
            const product = await prisma_1.default.product.findUnique({ where: { id: it.productId } });
            if (!product) {
                return res.status(400).json({ success: false, message: `Product missing: ${it.productId}` });
            }
            if (product.stock < it.quantity) {
                return res.status(400).json({ success: false, message: `Not enough stock for ${product.name}` });
            }
        }
        // Decrement stock.
        for (const it of cart.items) {
            await prisma_1.default.product.update({
                where: { id: it.productId },
                data: { stock: { decrement: it.quantity } },
            });
        }
        const paymentStatus = paymentMethod === "COD" ? "PAID" : "PENDING";
        const order = await prisma_1.default.order.create({
            data: {
                userId,
                orderItems: orderItems,
                shippingAddress: shippingAddress,
                paymentMethod,
                paymentStatus,
                totalPrice,
                status: "PROCESSING",
            },
        });
        await prisma_1.default.cart.update({
            where: { userId },
            data: { items: [] },
        });
        return res.status(201).json({ success: true, data: order });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Checkout failed" });
    }
};
exports.checkoutOrder = checkoutOrder;
const listMyOrders = async (req, res) => {
    var _a;
    try {
        const userId = req.user.userId;
        const orders = await prisma_1.default.order.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 50,
        });
        return res.status(200).json({ success: true, data: orders });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Failed to fetch orders" });
    }
};
exports.listMyOrders = listMyOrders;
const getOrderById = async (req, res) => {
    var _a;
    try {
        const userId = req.user.userId;
        const id = req.params.id;
        const order = await prisma_1.default.order.findUnique({ where: { id } });
        if (!order || order.userId !== userId) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        return res.status(200).json({ success: true, data: order });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Failed to fetch order" });
    }
};
exports.getOrderById = getOrderById;
const adminListOrders = async (_req, res) => {
    var _a;
    try {
        const orders = await prisma_1.default.order.findMany({
            orderBy: { createdAt: "desc" },
            take: 100,
        });
        return res.status(200).json({ success: true, data: orders });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Failed to fetch orders" });
    }
};
exports.adminListOrders = adminListOrders;
const adminUpdateOrderStatus = async (req, res) => {
    var _a;
    try {
        const id = req.params.id;
        const { status } = req.body;
        const allowed = new Set(["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]);
        if (!status || !allowed.has(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }
        const updateData = { status };
        if (status === "DELIVERED") {
            updateData.deliveredAt = new Date();
        }
        const order = await prisma_1.default.order.update({ where: { id }, data: updateData });
        return res.status(200).json({ success: true, data: order });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Failed to update order" });
    }
};
exports.adminUpdateOrderStatus = adminUpdateOrderStatus;
//# sourceMappingURL=order.controller.js.map