"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const cart_controller_1 = require("./cart.controller");
const router = (0, express_1.Router)();
router.get("/", auth_middleware_1.requireAuth, cart_controller_1.getCart);
router.post("/items", auth_middleware_1.requireAuth, cart_controller_1.addCartItem);
router.patch("/items/:productId", auth_middleware_1.requireAuth, cart_controller_1.updateCartItem);
router.delete("/items/:productId", auth_middleware_1.requireAuth, cart_controller_1.removeCartItem);
router.post("/clear", auth_middleware_1.requireAuth, cart_controller_1.clearCart);
exports.default = router;
//# sourceMappingURL=cart.routes.js.map