"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const review_controller_1 = require("./review.controller");
const router = (0, express_1.Router)();
router.get("/", review_controller_1.listReviews); // optional ?productId=
router.post("/", auth_middleware_1.requireAuth, review_controller_1.createReview);
exports.default = router;
//# sourceMappingURL=review.routes.js.map