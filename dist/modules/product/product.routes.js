"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("./product.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Public
router.get("/", product_controller_1.getProducts);
router.get("/:id", product_controller_1.getProductById);
// Admin
router.post("/", auth_middleware_1.requireAuth, auth_middleware_1.requireAdmin, product_controller_1.adminCreateProduct);
router.patch("/:id", auth_middleware_1.requireAuth, auth_middleware_1.requireAdmin, product_controller_1.adminUpdateProduct);
router.delete("/:id", auth_middleware_1.requireAuth, auth_middleware_1.requireAdmin, product_controller_1.adminDeleteProduct);
exports.default = router;
//# sourceMappingURL=product.routes.js.map