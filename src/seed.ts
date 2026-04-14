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

  // ULTIMATE RESET: Always clear and re-seed to ensure a clean Amazon-like catalog
  console.log("🚀 Cleaning and Seeding fresh Amazon-like catalog...");
  await prisma.review.deleteMany(); // Clear reviews first due to relations
  await prisma.product.deleteMany(); 
  
  const products = [
      {
        name: "iPhone 15 Pro",
        description: "Titanium design, A17 Pro chip, and the most powerful iPhone camera system.",
        price: 999.00,
        images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80"],
        category: "Electronics",
        brand: "Apple",
        stock: 25,
        isFeatured: true,
      },
      {
        name: "MacBook Pro 14 M3",
        description: "The most advanced chips ever built for a personal computer.",
        price: 1599.00,
        images: ["https://images.unsplash.com/photo-1517336714460-4c504974f231?auto=format&fit=crop&w=1200&q=80"],
        category: "Electronics",
        brand: "Apple",
        stock: 15,
        isFeatured: true,
      },
      {
        name: "Sony WH-1000XM5",
        description: "Industry leading noise canceling with two processors controlling 8 microphones.",
        price: 348.00,
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"],
        category: "Electronics",
        brand: "Sony",
        stock: 45,
      },
      {
        name: "Mechanical Gaming Keyboard",
        description: "RGB Backlit, tactile switches, and durable aluminum frame.",
        price: 89.99,
        images: ["https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=1200&q=80"],
        category: "Electronics",
        brand: "Razer",
        stock: 60,
      },
      {
        name: "Men's Luxury Watch",
        description: "Elegant stainless steel design with Japanese quartz movement.",
        price: 199.50,
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80"],
        category: "Fashion",
        brand: "Fossil",
        stock: 30,
      },
      {
        name: "Nike Air Zoom Pegasus",
        description: "Responsive cushioning for everyday runs.",
        price: 130.00,
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80"],
        category: "Fashion",
        brand: "Nike",
        stock: 100,
      },
      {
        name: "Modern Leather Sofa",
        description: "Premium Italian leather with high-density foam cushions.",
        price: 1200.00,
        images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80"],
        category: "Home",
        brand: "Ikea",
        stock: 5,
      },
      {
        name: "Minimalist Desk Lamp",
        description: "Touch sensitive with adjustable brightness settings.",
        price: 45.00,
        images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80"],
        category: "Home",
        brand: "H&M Home",
        stock: 80,
      },
      {
        name: "Premium Coffee Maker",
        description: "Barista-quality coffee at the touch of a button.",
        price: 599.00,
        images: ["https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80"],
        category: "Kitchen",
        brand: "Breville",
        stock: 12,
      },
      {
        name: "Stanley Quencher Tumbler",
        description: "Double-wall vacuum insulation keeps drinks cold for hours.",
        price: 45.00,
        images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80"],
        category: "Kitchen",
        brand: "Stanley",
        stock: 200,
        isFeatured: true,
      },
      {
        name: "Organic Face Serum",
        description: "Hydrating serum with Vitamin C and Hyaluronic Acid.",
        price: 29.99,
        images: ["https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80"],
        category: "Beauty",
        brand: "The Ordinary",
        stock: 150,
      },
      {
        name: "Noise Cancelling Earbuds",
        description: "True wireless earbuds with deep bass and clear calls.",
        price: 199.00,
        images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1200&q=80"],
        category: "Electronics",
        brand: "JBL",
        stock: 75,
      },
      {
        name: "Retro Polarized Sunglasses",
        description: "Classic style with UV400 protection.",
        price: 120.00,
        images: ["https://images.unsplash.com/photo-1511499767390-91f197f66028?auto=format&fit=crop&w=1200&q=80"],
        category: "Fashion",
        brand: "Ray-Ban",
        stock: 50,
      },
      {
        name: "Yoga Mat Pro",
        description: "Extra thick non-slip mat for maximum comfort.",
        price: 65.00,
        images: ["https://images.unsplash.com/photo-1592431690279-3708f237bfbc?auto=format&fit=crop&w=1200&q=80"],
        category: "Fitness",
        brand: "Lululemon",
        stock: 40,
      },
      {
        name: "Handcrafted Ceramic Vase",
        description: "Unique design, perfect for any living room decor.",
        price: 35.00,
        images: ["https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=1200&q=80"],
        category: "Home",
        brand: "Artisan",
        stock: 20,
      }
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
