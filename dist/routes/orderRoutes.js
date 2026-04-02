"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Protected Routes
router.post('/new', auth_1.isAuthenticated, orderController_1.createOrder);
router.get('/me', auth_1.isAuthenticated, orderController_1.getMyOrders);
router.get('/:id', auth_1.isAuthenticated, orderController_1.getOrderDetails);
router.put('/return/:id', auth_1.isAuthenticated, orderController_1.returnOrder);
router.put('/cancel/:id', auth_1.isAuthenticated, orderController_1.cancelOrder);
// Admin Routes
router.get('/admin/all', auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('ADMIN'), orderController_1.getAllOrders);
router.put('/admin/:id', auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('ADMIN'), orderController_1.updateOrder);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map