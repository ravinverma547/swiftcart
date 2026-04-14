import app from "./app";
import prisma from "./config/prisma";
import { seedDatabase } from "./seed";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully!");

    // Run auto-seeding
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 SwiftCart Server running on: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

startServer();

