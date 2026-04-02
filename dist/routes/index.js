"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const productRoutes_1 = __importDefault(require("./productRoutes"));
const orderRoutes_1 = __importDefault(require("./orderRoutes"));
const reportRoutes_1 = __importDefault(require("./reportRoutes"));
const couponRoutes_1 = __importDefault(require("./couponRoutes"));
const router = express_1.default.Router();
router.use('/auth', authRoutes_1.default);
router.use('/products', productRoutes_1.default);
router.use('/orders', orderRoutes_1.default);
router.use('/reports', reportRoutes_1.default);
router.use('/coupons', couponRoutes_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map