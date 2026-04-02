"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const products = [
    // MOBILES-COMPUTERS
    {
        name: "iPhone 15 Pro Max",
        description: "The ultimate iPhone with Titanium design, A17 Pro chip, and the most advanced camera system. Experience the future of mobile technology with 6.7-inch Super Retina XDR display.",
        price: 159900,
        category: "mobiles-computers",
        stock: 25,
        images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop"],
        isFeatured: true,
    },
    {
        name: "Samsung Galaxy S24 Ultra",
        description: "Galaxy AI is here. Epic camera with 200MP, Snapdragon 8 Gen 3 for Galaxy, and built-in S Pen. Pure premium titanium finish.",
        price: 129999,
        category: "mobiles-computers",
        stock: 15,
        images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=1000&auto=format&fit=crop"],
        isFeatured: true,
    },
    {
        name: "MacBook Pro M3 Max",
        description: "The most powerful laptop ever. M3 Max chip with 14-core CPU and 30-core GPU. Liquid Retina XDR display and 22 hours of battery life.",
        price: 349900,
        category: "mobiles-computers",
        stock: 10,
        images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000&auto=format&fit=crop"],
        isFeatured: true,
    },
    {
        name: "ASUS ROG Zephyrus G14",
        description: "Compact yet powerful gaming laptop. AMD Ryzen 9, RTX 4080, and Nebula HDR Display for stunning visuals.",
        price: 184990,
        category: "mobiles-computers",
        stock: 8,
        images: ["https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000&auto=format&fit=crop"],
    },
    // TV-APPLIANCES
    {
        name: "Sony Bravia XR OLED 65\"",
        description: "Cognitive Processor XR brings lifelike contrast and colors. Pure black OLED and Acoustic Surface Audio+.",
        price: 249900,
        category: "tv-appliances",
        stock: 5,
        images: ["https://images.unsplash.com/photo-1593359674241-55cd06ddc3b2?q=80&w=1000&auto=format&fit=crop"],
        isFeatured: true,
    },
    {
        name: "Dyson V15 Detect",
        description: "The most powerful, intelligent cordless vacuum. Lasers reveal microscopic dust you can't see.",
        price: 65900,
        category: "tv-appliances",
        stock: 20,
        images: ["https://images.unsplash.com/photo-1558317374-067fb5f30001?q=80&w=1000&auto=format&fit=crop"],
    },
    {
        name: "LG 8kg Front Load AI Washing Machine",
        description: "Intello DD detects fabric weight and softness for optimal washing patterns. Direct Drive Motor for durability.",
        price: 42990,
        category: "tv-appliances",
        stock: 12,
        images: ["https://images.unsplash.com/photo-1626806819282-2c1dc61a0e0c?q=80&w=1000&auto=format&fit=crop"],
    },
    // FASHION
    {
        name: "Nike Air Max 270",
        description: "Nike's first lifestyle Air Max delivers style, comfort and big attitude. Features a large Air unit in the heel.",
        price: 13995,
        category: "mens-fashion",
        stock: 45,
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"],
        isFeatured: true,
    },
    {
        name: "Levi's 501 Original Jeans",
        description: "The original blue jean since 1873. A cultural icon and the ultimate straight-fit silhouette.",
        price: 4599,
        category: "mens-fashion",
        stock: 100,
        images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1000&auto=format&fit=crop"],
    },
    {
        name: "Zara Oversized Trench Coat",
        description: "Classic double-breasted trench coat with belt and lapel collar. Perfect for autumn and spring layering.",
        price: 9990,
        category: "womens-fashion",
        stock: 30,
        images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop"],
        isFeatured: true,
    },
    {
        name: "Gucci GG Marmont Shoulder Bag",
        description: "A signature Gucci silhouette in soft matelassé leather with the iconic double G hardware.",
        price: 215000,
        category: "womens-fashion",
        stock: 3,
        images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1000&auto=format&fit=crop"],
    },
    // HOME-KITCHEN
    {
        name: "Nespresso Vertuo Pop",
        description: "The latest addition to the Nespresso coffee machine range. Versatile and compact for the perfect espresso.",
        price: 14995,
        category: "home-kitchen",
        stock: 25,
        images: ["https://images.unsplash.com/photo-1520970014086-2208080ec187?q=80&w=1000&auto=format&fit=crop"],
    },
    {
        name: "Philips Essential Air Fryer XL",
        description: "Healthy frying with Rapid Air technology. Fry, bake, grill, roast and even reheat with 90% less fat.",
        price: 10490,
        category: "home-kitchen",
        stock: 50,
        images: ["https://images.unsplash.com/photo-1626074353765-517a681e40be?q=80&w=1000&auto=format&fit=crop"],
        isFeatured: true,
    },
    // BOOKS
    {
        name: "Atomic Habits",
        description: "The #1 New York Times bestseller by James Clear. An easy and proven way to build good habits and break bad ones.",
        price: 599,
        category: "books",
        stock: 200,
        images: ["https://images.unsplash.com/photo-1589998059171-988d887df643?q=80&w=1000&auto=format&fit=crop"],
        isFeatured: true,
    },
    {
        name: "The Psychology of Money",
        description: "Timeless lessons on wealth, greed, and happiness by Morgan Housel. Understanding how people think about money.",
        price: 399,
        category: "books",
        stock: 150,
        images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop"],
    },
    {
        name: "Harry Potter & the Philosopher's Stone",
        description: "The classic first book in the Harry Potter series by J.K. Rowling. Journey to Hogwarts and discover your magic.",
        price: 499,
        category: "books",
        stock: 80,
        images: ["https://images.unsplash.com/photo-1626618012641-bfbca5a31239?q=80&w=1000&auto=format&fit=crop"],
    }
];
async function main() {
    console.log('--- Starting Seeding ---');
    for (const product of products) {
        const upsertedProduct = await prisma.product.upsert({
            where: {
                // Since name isn't unique in schema, but for seeding 
                // we use it as a proxy or we'll just use create Many 
                // if we want simple population.
                // Actually since schema doesn't have unique 'name', 
                // we'll just create them.
                id: "000000000000000000000000" // Dummy ID to trigger create
            },
            update: {},
            create: product
        });
        console.log(`✅ Seeded: ${product.name}`);
    }
    console.log('--- Seeding Completed Successfully ---');
}
main()
    .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map