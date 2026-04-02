"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductDetails = exports.getProducts = void 0;
const productService = __importStar(require("../services/productService"));
/**
 * Controller manages HTTP requests and responses.
 * Logic is delegated to the Service.
 */
// Get all products - with search, filter, pagination
const getProducts = async (req, res, next) => {
    try {
        const { keyword, category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
        const { products, total } = await productService.findAllProducts({
            keyword: keyword ? String(keyword) : undefined,
            category: category ? String(category) : undefined,
            minPrice: minPrice ? Number(minPrice) : undefined,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            page: Number(page),
            limit: Number(limit),
        });
        res.status(200).json({
            success: true,
            count: products.length,
            total,
            products,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProducts = getProducts;
// Get single product details
const getProductDetails = async (req, res, next) => {
    try {
        const product = await productService.findProductById(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found',
            });
        }
        res.status(200).json({
            success: true,
            product,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProductDetails = getProductDetails;
// Admin: Create new product
const createProduct = async (req, res, next) => {
    try {
        const product = await productService.createNewProduct(req.body);
        res.status(201).json({
            success: true,
            product,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createProduct = createProduct;
// Admin: Update product
const updateProduct = async (req, res, next) => {
    try {
        const updatedProduct = await productService.updateProductById(req.params.id, req.body);
        res.status(200).json({
            success: true,
            product: updatedProduct,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProduct = updateProduct;
// Admin: Delete product
const deleteProduct = async (req, res, next) => {
    try {
        await productService.removeProductById(req.params.id);
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProduct = deleteProduct;
// Create Product Review
const createReview = async (req, res, next) => {
    try {
        const { rating, comment } = req.body;
        const { productId } = req.params;
        const user = req.user;
        const review = await productService.addReviewToProduct({
            rating: Number(rating),
            comment,
            userName: user.name,
            userId: user.id,
            productId: productId,
        });
        res.status(201).json({
            success: true,
            review,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.createReview = createReview;
//# sourceMappingURL=productController.js.map