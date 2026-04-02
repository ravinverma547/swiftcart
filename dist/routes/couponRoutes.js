"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const couponController_1 = require("../controllers/couponController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post('/validate', auth_1.isAuthenticated, couponController_1.validateCoupon);
router.get('/my', auth_1.isAuthenticated, couponController_1.getMyCoupons);
exports.default = router;
//# sourceMappingURL=couponRoutes.js.map