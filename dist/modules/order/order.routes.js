"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const order_controller_1 = require("./order.controller");
const router = (0, express_1.Router)();
router.post("/checkout", auth_middleware_1.requireAuth, order_controller_1.checkoutOrder);
router.get("/", auth_middleware_1.requireAuth, order_controller_1.listMyOrders);
router.get("/:id", auth_middleware_1.requireAuth, order_controller_1.getOrderById);
// Admin
router.get("/admin", auth_middleware_1.requireAuth, auth_middleware_1.requireAdmin, order_controller_1.adminListOrders);
router.patch("/admin/:id/status", auth_middleware_1.requireAuth, auth_middleware_1.requireAdmin, order_controller_1.adminUpdateOrderStatus);
exports.default = router;
//# sourceMappingURL=order.routes.js.map