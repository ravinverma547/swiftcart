"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrder = exports.returnOrder = exports.updateOrder = exports.getAllOrders = exports.getMyOrders = exports.getOrderDetails = exports.createOrder = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
// Create new order
const createOrder = async (req, res, next) => {
    try {
        const { items, shippingAddress, totalAmount, paymentStatus, couponCode } = req.body;
        const userId = req.user.id;
        if (!items || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No order items found',
            });
        }
        // Mark coupon as used if provided
        if (couponCode) {
            await prisma_1.default.coupon.update({
                where: { code: couponCode },
                data: { isUsed: true }
            });
        }
        // Create order with initial timeline
        const order = await prisma_1.default.order.create({
            data: {
                userId,
                items,
                shippingAddress,
                totalAmount: Number(totalAmount),
                paymentStatus,
                orderStatus: 'PLACED',
                timeline: [
                    { status: 'PLACED', note: 'Order has been placed successfully' }
                ]
            },
        });
        // Update stock for each product
        for (const item of items) {
            await prisma_1.default.product.update({
                where: { id: item.productId },
                data: {
                    stock: { decrement: item.quantity },
                },
            });
        }
        // Calculate total spend today to award Gift Card
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const prevOrdersToday = await prisma_1.default.order.findMany({
            where: {
                userId,
                createdAt: { gte: todayStart },
                id: { not: order.id }
            }
        });
        const currentTotalToday = prevOrdersToday.reduce((sum, o) => sum + Number(o.totalAmount), 0);
        const orderAmount = Number(totalAmount);
        const newTotalToday = currentTotalToday + orderAmount;
        console.log(`[OrderReward] User: ${userId} | Today Prev: ${currentTotalToday} | This Order: ${orderAmount}`);
        let earnedCoupon = null;
        // AWARD if this order is > 50k OR total pushes them over 50k today
        if (orderAmount >= 50000 || (newTotalToday >= 50000 && currentTotalToday < 50000)) {
            try {
                const code = `SWIFT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
                const expiresAt = new Date();
                expiresAt.setHours(expiresAt.getHours() + 48); // 2 days limit
                earnedCoupon = await prisma_1.default.coupon.create({
                    data: {
                        code,
                        userId,
                        expiresAt,
                        discountPercentage: 15
                    }
                });
                console.log(`[OrderReward] Coupon Earned: ${code}`);
            }
            catch (couponError) {
                console.error('[OrderReward] Failed to create coupon but order will proceed:', couponError);
            }
        }
        res.status(201).json({
            success: true,
            order,
            earnedCoupon: earnedCoupon ? earnedCoupon.code : null,
            message: earnedCoupon ? `Congratulations! You've earned a 15% Discount Coupon: ${earnedCoupon.code} (Valid for 2 days)` : undefined
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createOrder = createOrder;
// Get single order details
const getOrderDetails = async (req, res, next) => {
    try {
        const order = await prisma_1.default.order.findUnique({
            where: { id: req.params.id },
            include: {
                user: { select: { name: true, email: true } },
            },
        });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }
        // Check if user is authorized to see this order
        const user = req.user;
        if (user.role !== 'ADMIN' && order.userId !== user.id) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to view this order',
            });
        }
        res.status(200).json({
            success: true,
            order,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getOrderDetails = getOrderDetails;
// Get logged-in user's orders
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await prisma_1.default.order.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getMyOrders = getMyOrders;
// Admin: Get all orders
const getAllOrders = async (req, res, next) => {
    try {
        const orders = await prisma_1.default.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { name: true } },
            },
        });
        res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllOrders = getAllOrders;
// Admin: Update order status and timeline
const updateOrder = async (req, res, next) => {
    try {
        const { orderStatus, note } = req.body;
        console.log(`Updating order ${req.params.id} to status ${orderStatus}`);
        const order = await prisma_1.default.order.findUnique({ where: { id: req.params.id } });
        if (!order) {
            console.error(`Order not found: ${req.params.id}`);
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }
        const updatedOrder = await prisma_1.default.order.update({
            where: { id: req.params.id },
            data: {
                orderStatus,
                timeline: {
                    push: {
                        status: orderStatus,
                        note: note || `Order status updated to ${orderStatus}`,
                        timestamp: new Date()
                    }
                }
            },
        });
        console.log(`Successfully updated order ${req.params.id}`);
        res.status(200).json({
            success: true,
            order: updatedOrder,
        });
    }
    catch (error) {
        console.error('Update Order Error:', error);
        next(error);
    }
};
exports.updateOrder = updateOrder;
// Customer: Return order (only if delivered)
const returnOrder = async (req, res, next) => {
    try {
        const { reason } = req.body;
        const orderId = req.params.id;
        const userId = req.user.id;
        console.log(`User ${userId} requested return for order ${orderId} with reason: ${reason}`);
        const order = await prisma_1.default.order.findUnique({ where: { id: orderId } });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }
        if (order.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to return this order',
            });
        }
        if (order.orderStatus !== 'DELIVERED') {
            return res.status(400).json({
                success: false,
                message: 'Only delivered orders can be returned',
            });
        }
        const updatedOrder = await prisma_1.default.order.update({
            where: { id: orderId },
            data: {
                orderStatus: 'RETURNED',
                timeline: {
                    push: {
                        status: 'RETURNED',
                        note: reason ? `Return requested: ${reason}` : 'Return requested by customer',
                        timestamp: new Date()
                    }
                }
            },
        });
        res.status(200).json({
            success: true,
            message: 'Return processed successfully',
            order: updatedOrder,
        });
    }
    catch (error) {
        console.error('Return Order Error:', error);
        next(error);
    }
};
exports.returnOrder = returnOrder;
// Customer: Cancel order (only before delivery)
const cancelOrder = async (req, res, next) => {
    try {
        const { reason } = req.body;
        const orderId = req.params.id;
        const userId = req.user.id;
        console.log(`User ${userId} requested cancellation for order ${orderId} with reason: ${reason}`);
        const order = await prisma_1.default.order.findUnique({ where: { id: orderId } });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found',
            });
        }
        if (order.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to cancel this order',
            });
        }
        const unCancellableStatuses = ['DELIVERED', 'CANCELLED', 'RETURNED'];
        if (unCancellableStatuses.includes(order.orderStatus)) {
            return res.status(400).json({
                success: false,
                message: `Order cannot be cancelled because it is already ${order.orderStatus.toLowerCase()}`,
            });
        }
        // Execute cancellation and stock restoration in a transaction
        const [updatedOrder] = await prisma_1.default.$transaction([
            prisma_1.default.order.update({
                where: { id: orderId },
                data: {
                    orderStatus: 'CANCELLED',
                    timeline: {
                        push: {
                            status: 'CANCELLED',
                            note: reason ? `Cancelled by customer: ${reason}` : 'Cancelled by customer',
                            timestamp: new Date()
                        }
                    }
                },
            }),
            // Restore stock for each product in the order
            ...order.items.map(item => prisma_1.default.product.update({
                where: { id: item.productId },
                data: {
                    stock: { increment: item.quantity }
                }
            }))
        ]);
        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully',
            order: updatedOrder,
        });
    }
    catch (error) {
        console.error('Cancel Order Error:', error);
        next(error);
    }
};
exports.cancelOrder = cancelOrder;
//# sourceMappingURL=orderController.js.map