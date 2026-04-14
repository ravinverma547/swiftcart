import prisma from "./config/prisma";
import bcrypt from "bcryptjs";

export async function seedDatabase() {
  if (!process.env.DATABASE_URL) {
    console.warn("⚠️ DATABASE_URL not found. Skipping seeding.");
    return;
  }

  await prisma.$connect();

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@swiftcart.demo";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin1234@";

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  
  if (existingAdmin) {
    console.log("Admin already exists");
  } else {
    await prisma.user.create({
      data: {
        name: "SwiftCart Admin",
        email: adminEmail,
        password: await bcrypt.hash(adminPassword, 10),
        role: "ADMIN",
      },
    });
    console.log("Admin created successfully");
  }

  const productCount = await prisma.product.count();
  if (productCount === 0) {
    const products = [
      {
        name: "SwiftTech Wireless Headphones",
        description: "Comfort fit, deep bass, and 30-hour battery life.",
        price: 129.99,
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"],
        category: "Electronics",
        brand: "SwiftTech",
        stock: 60,
        isFeatured: true,
      },
      {
        name: "AirFlow Smart Watch",
        description: "Track fitness, sleep, and notifications in style.",
        price: 89.5,
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80"],
        category: "Wearables",
        brand: "AirFlow",
        stock: 90,
      },
      {
        name: "PureBrew Coffee Maker",
        description: "Brew rich coffee with quick heating technology.",
        price: 59.99,
        images: ["https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80"],
        category: "Home Appliances",
        brand: "PureBrew",
        stock: 40,
      },
      {
        name: "CloudSoft T-Shirt (Pack of 2)",
        description: "Breathable fabric with a modern fit for everyday wear.",
        price: 24.99,
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80"],
        category: "Fashion",
        brand: "CloudSoft",
        stock: 140,
      },
      {
        name: "TrailPro Running Shoes",
        description: "Lightweight cushioning and grippy outsole for all runs.",
        price: 74.0,
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80"],
        category: "Sports",
        brand: "TrailPro",
        stock: 55,
      },
    ];

    for (const p of products) {
      await prisma.product.create({
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

  console.log("✅ Seed check complete");
}
