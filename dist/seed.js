"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./config/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function main() {
    var _a, _b;
    await prisma_1.default.$connect();
    const adminEmail = (_a = process.env.ADMIN_EMAIL) !== null && _a !== void 0 ? _a : "admin@swiftcart.demo";
    const adminPassword = (_b = process.env.ADMIN_PASSWORD) !== null && _b !== void 0 ? _b : "admin1234@";
    const existingAdmin = await prisma_1.default.user.findUnique({ where: { email: adminEmail } });
    let adminUser;
    if (existingAdmin) {
        adminUser = existingAdmin;
        console.log("Admin already exists");
    }
    else {
        adminUser = await prisma_1.default.user.create({
            data: {
                name: "SwiftCart Admin",
                email: adminEmail,
                password: await bcryptjs_1.default.hash(adminPassword, 10),
                role: "ADMIN",
            },
        });
        console.log("Admin created successfully");
    }
    const productCount = await prisma_1.default.product.count();
    if (productCount === 0) {
        const products = [
            {
                name: "SwiftTech Wireless Headphones",
                description: "Comfort fit, deep bass, and 30-hour battery life.",
                price: 129.99,
                images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"],
                category: "Electronics",
                stock: 60,
                isFeatured: true,
            },
            {
                name: "AirFlow Smart Watch",
                description: "Track fitness, sleep, and notifications in style.",
                price: 89.5,
                images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80"],
                category: "Wearables",
                stock: 90,
            },
            {
                name: "PureBrew Coffee Maker",
                description: "Brew rich coffee with quick heating technology.",
                price: 59.99,
                images: ["https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80"],
                category: "Home Appliances",
                stock: 40,
            },
            {
                name: "CloudSoft T-Shirt (Pack of 2)",
                description: "Breathable fabric with a modern fit for everyday wear.",
                price: 24.99,
                images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80"],
                category: "Fashion",
                stock: 140,
            },
            {
                name: "TrailPro Running Shoes",
                description: "Lightweight cushioning and grippy outsole for all runs.",
                price: 74.0,
                images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80"],
                category: "Sports",
                stock: 55,
            },
        ];
        for (const p of products) {
            await prisma_1.default.product.create({
                data: {
                    ...p,
                    variants: [
                        { type: "Color", value: "Default", price: 0, stock: p.stock }
                    ]
                },
            });
        }
        console.log(`✅ Seeded ${products.length} products`);
    }
    console.log("✅ Seed complete");
}
main()
    .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma_1.default.$disconnect();
});
//# sourceMappingURL=seed.js.map