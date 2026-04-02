"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Public Routes
router.get('/', productController_1.getProducts);
router.get('/:id', productController_1.getProductDetails);
// Protected Routes
router.post('/:productId/review', auth_1.isAuthenticated, productController_1.createReview);
// Admin Routes
router.post('/admin/new', auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('ADMIN'), productController_1.createProduct);
router.put('/admin/:id', auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('ADMIN'), productController_1.updateProduct);
router.delete('/admin/:id', auth_1.isAuthenticated, (0, auth_1.authorizeRoles)('ADMIN'), productController_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=productRoutes.js.map