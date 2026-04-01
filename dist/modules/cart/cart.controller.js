"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeCartItem = exports.updateCartItem = exports.addCartItem = exports.getCart = void 0;
const prisma_1 = __importDefault(require("../../config/prisma"));
const ensureQuantity = (raw) => {
    const q = typeof raw === "string" ? Number(raw) : typeof raw === "number" ? raw : NaN;
    if (!Number.isFinite(q) || q <= 0)
        return undefined;
    return Math.floor(q);
};
const getCart = async (req, res) => {
    var _a;
    try {
        const userId = req.user.userId;
        let cart = await prisma_1.default.cart.findUnique({ where: { userId } });
        if (!cart) {
            cart = await prisma_1.default.cart.create({ data: { userId, items: [] } });
        }
        return res.status(200).json({ success: true, data: cart });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Failed to fetch cart" });
    }
};
exports.getCart = getCart;
const addCartItem = async (req, res) => {
    var _a, _b, _c, _d, _e, _f;
    try {
        const userId = req.user.userId;
        const { productId, quantity } = req.body;
        const qty = ensureQuantity(quantity);
        if (!productId || !qty) {
            return res.status(400).json({ success: false, message: "productId and quantity are required" });
        }
        const product = await prisma_1.default.product.findUnique({ where: { id: productId } });
        if (!product)
            return res.status(404).json({ success: false, message: "Product not found" });
        if (product.stock < qty) {
            return res.status(400).json({ success: false, message: "Not enough stock" });
        }
        let cart = await prisma_1.default.cart.findUnique({ where: { userId } });
        if (!cart)
            cart = await prisma_1.default.cart.create({ data: { userId, items: [] } });
        const existing = (_a = cart.items) === null || _a === void 0 ? void 0 : _a.find((it) => it.productId === productId);
        const newQuantity = existing ? existing.quantity + qty : qty;
        if (product.stock < newQuantity) {
            return res.status(400).json({ success: false, message: "Not enough stock" });
        }
        const nextItems = Array.isArray(cart.items) ? [...cart.items] : [];
        if (existing) {
            const idx = nextItems.findIndex((it) => it.productId === productId);
            nextItems[idx] = {
                ...existing,
                quantity: newQuantity,
                price: product.price,
                name: product.name,
                image: (_c = (_b = product.images) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : "",
            };
        }
        else {
            nextItems.push({
                productId: product.id,
                quantity: qty,
                price: product.price,
                name: product.name,
                image: (_e = (_d = product.images) === null || _d === void 0 ? void 0 : _d[0]) !== null && _e !== void 0 ? _e : "",
            });
        }
        cart = await prisma_1.default.cart.update({
            where: { userId },
            data: { items: nextItems },
        });
        return res.status(200).json({ success: true, data: cart });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: (_f = error === null || error === void 0 ? void 0 : error.message) !== null && _f !== void 0 ? _f : "Failed to add to cart" });
    }
};
exports.addCartItem = addCartItem;
const updateCartItem = async (req, res) => {
    var _a, _b;
    try {
        const userId = req.user.userId;
        const productId = req.params.productId;
        const quantity = (_a = req.body) === null || _a === void 0 ? void 0 : _a.quantity;
        const qty = ensureQuantity(quantity);
        if (!productId || !qty) {
            return res.status(400).json({ success: false, message: "Valid productId and quantity required" });
        }
        const product = await prisma_1.default.product.findUnique({ where: { id: productId } });
        if (!product)
            return res.status(404).json({ success: false, message: "Product not found" });
        if (product.stock < qty) {
            return res.status(400).json({ success: false, message: "Not enough stock" });
        }
        let cart = await prisma_1.default.cart.findUnique({ where: { userId } });
        if (!cart)
            cart = await prisma_1.default.cart.create({ data: { userId, items: [] } });
        const nextItems = (Array.isArray(cart.items) ? cart.items : []).map((it) => {
            var _a, _b;
            if (it.productId !== productId)
                return it;
            return {
                ...it,
                quantity: qty,
                price: product.price,
                name: product.name,
                image: (_b = (_a = product.images) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : "",
            };
        });
        cart = await prisma_1.default.cart.update({
            where: { userId },
            data: { items: nextItems },
        });
        return res.status(200).json({ success: true, data: cart });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: (_b = error === null || error === void 0 ? void 0 : error.message) !== null && _b !== void 0 ? _b : "Failed to update cart item" });
    }
};
exports.updateCartItem = updateCartItem;
const removeCartItem = async (req, res) => {
    var _a;
    try {
        const userId = req.user.userId;
        const productId = req.params.productId;
        let cart = await prisma_1.default.cart.findUnique({ where: { userId } });
        if (!cart)
            cart = await prisma_1.default.cart.create({ data: { userId, items: [] } });
        const nextItems = (Array.isArray(cart.items) ? cart.items : []).filter((it) => it.productId !== productId);
        cart = await prisma_1.default.cart.update({
            where: { userId },
            data: { items: nextItems },
        });
        return res.status(200).json({ success: true, data: cart });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Failed to remove cart item" });
    }
};
exports.removeCartItem = removeCartItem;
const clearCart = async (req, res) => {
    var _a;
    const userId = req.user.userId;
    try {
        const cart = await prisma_1.default.cart.update({
            where: { userId },
            data: { items: [] },
        });
        return res.status(200).json({ success: true, data: cart });
    }
    catch (error) {
        // If cart doesn't exist yet.
        try {
            const cart = await prisma_1.default.cart.create({ data: { userId, items: [] } });
            return res.status(200).json({ success: true, data: cart });
        }
        catch {
            return res.status(500).json({ success: false, message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : "Failed to clear cart" });
        }
    }
};
exports.clearCart = clearCart;
//# sourceMappingURL=cart.controller.js.map