"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addReviewToProduct = exports.removeProductById = exports.updateProductById = exports.createNewProduct = exports.findProductById = exports.findAllProducts = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
/**
 * Product Service handles all database interactions for Products.
 * Separation of concerns: Controller handles HTTP, Service handles logic/DB.
 */
const findAllProducts = async (filters) => {
    const { keyword, category, minPrice, maxPrice, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;
    const where = {};
    if (keyword) {
        where.OR = [
            { name: { contains: keyword, mode: 'insensitive' } },
            { description: { contains: keyword, mode: 'insensitive' } },
        ];
    }
    if (category) {
        where.category = category;
    }
    if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice)
            where.price.gte = minPrice;
        if (maxPrice)
            where.price.lte = maxPrice;
    }
    const [products, total] = await Promise.all([
        prisma_1.default.product.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                reviews: {
                    select: {
                        rating: true,
                    }
                }
            }
        }),
        prisma_1.default.product.count({ where }),
    ]);
    return { products, total };
};
exports.findAllProducts = findAllProducts;
const findProductById = async (id) => {
    return await prisma_1.default.product.findUnique({
        where: { id },
        include: {
            reviews: true,
        },
    });
};
exports.findProductById = findProductById;
const createNewProduct = async (productData) => {
    return await prisma_1.default.product.create({
        data: {
            ...productData,
            price: Number(productData.price),
            stock: Number(productData.stock),
            variants: productData.variants || [],
            isFeatured: Boolean(productData.isFeatured),
        },
    });
};
exports.createNewProduct = createNewProduct;
const updateProductById = async (id, updateData) => {
    return await prisma_1.default.product.update({
        where: { id },
        data: updateData,
    });
};
exports.updateProductById = updateProductById;
const removeProductById = async (id) => {
    return await prisma_1.default.product.delete({
        where: { id },
    });
};
exports.removeProductById = removeProductById;
const addReviewToProduct = async (reviewData) => {
    return await prisma_1.default.review.create({
        data: reviewData,
    });
};
exports.addReviewToProduct = addReviewToProduct;
//# sourceMappingURL=productService.js.map