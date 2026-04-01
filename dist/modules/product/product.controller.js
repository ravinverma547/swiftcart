"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminDeleteProduct = exports.adminUpdateProduct = exports.adminCreateProduct = exports.getProductById = exports.getProducts = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const toNumber = (value) => {
    const n = typeof value === "string" ? Number(value) : typeof value === "number" ? value : NaN;
    return Number.isFinite(n) ? n : undefined;
};
const getProducts = async (req, res) => {
    var _a, _b, _c;
    try {
        const q = typeof req.query.q === "string" ? req.query.q.trim() : undefined;
        const category = typeof req.query.category === "string" ? req.query.category.trim() : undefined;
        const brand = typeof req.query.brand === "string" ? req.query.brand.trim() : undefined;
        const minPrice = toNumber(req.query.minPrice);
        const maxPrice = toNumber(req.query.maxPrice);
        const sort = typeof req.query.sort === "string" ? req.query.sort : "createdAt_desc";
        const where = {};
        if (category)
            where.category = category;
        if (brand)
            where.brand = brand;
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined)
                where.price.gte = minPrice;
            if (maxPrice !== undefined)
                where.price.lte = maxPrice;
        }
        if (q) {
            where.OR = [
                { name: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
                { brand: { contains: q, mode: "insensitive" } },
            ];
        }
        const page = (_a = toNumber(req.query.page)) !== null && _a !== void 0 ? _a : 1;
        const limit = (_b = toNumber(req.query.limit)) !== null && _b !== void 0 ? _b : 12;
        const skip = (page - 1) * limit;
        let orderBy = { createdAt: "desc" };
        if (sort === "price_asc")
            orderBy = { price: "asc" };
        if (sort === "price_desc")
            orderBy = { price: "desc" };
        if (sort === "rating_desc")
            orderBy = { ratings: "desc" };
        const products = await prisma_1.default.product.findMany({
            where,
            orderBy,
            skip,
            take: limit,
        });
        return res.status(200).json({ success: true, data: products });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: (_c = error === null || error === void 0 ? void 0 : error.message) !== null && _c !== void 0 ? _c : "Failed to fetch products" });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    var _a;
    try {
        const id = req.params.id;
        const product = await prisma_1.default.product.findUnique({ where: { id } });
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        const reviews = await prisma_1.default.review.findMany({
            where: { productId: id },
            orderBy: { createdAt: "desc" },
            take: 50,
        });
        return res.status(200).json({ success: true, data: { product, reviews } });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Failed to fetch product" });
    }
};
exports.getProductById = getProductById;
const adminCreateProduct = async (req, res) => {
    var _a, _b, _c, _d, _e;
    try {
        const body = req.body;
        if (!(body === null || body === void 0 ? void 0 : body.name) || !(body === null || body === void 0 ? void 0 : body.price) || !(body === null || body === void 0 ? void 0 : body.brand)) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }
        const product = await prisma_1.default.product.create({
            data: {
                name: body.name,
                description: (_a = body.description) !== null && _a !== void 0 ? _a : "",
                price: body.price,
                images: Array.isArray(body.images) ? body.images : [],
                category: (_b = body.category) !== null && _b !== void 0 ? _b : "General",
                brand: body.brand,
                stock: (_c = body.stock) !== null && _c !== void 0 ? _c : 0,
                variants: (_d = body.variants) !== null && _d !== void 0 ? _d : null,
            },
        });
        return res.status(201).json({ success: true, data: product });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: (_e = error === null || error === void 0 ? void 0 : error.message) !== null && _e !== void 0 ? _e : "Failed to create product" });
    }
};
exports.adminCreateProduct = adminCreateProduct;
const adminUpdateProduct = async (req, res) => {
    var _a;
    try {
        const id = req.params.id;
        const body = req.body;
        const data = {};
        if (body.name !== undefined)
            data.name = body.name;
        if (body.description !== undefined)
            data.description = body.description;
        if (body.price !== undefined)
            data.price = body.price;
        if (body.images !== undefined)
            data.images = body.images;
        if (body.category !== undefined)
            data.category = body.category;
        if (body.brand !== undefined)
            data.brand = body.brand;
        if (body.stock !== undefined)
            data.stock = body.stock;
        if (body.variants !== undefined)
            data.variants = body.variants;
        const updated = await prisma_1.default.product.update({
            where: { id },
            data,
        });
        return res.status(200).json({ success: true, data: updated });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Failed to update product" });
    }
};
exports.adminUpdateProduct = adminUpdateProduct;
const adminDeleteProduct = async (req, res) => {
    var _a;
    try {
        const id = req.params.id;
        await prisma_1.default.product.delete({ where: { id } });
        return res.status(200).json({ success: true, message: "Product deleted" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Failed to delete product" });
    }
};
exports.adminDeleteProduct = adminDeleteProduct;
//# sourceMappingURL=product.controller.js.map