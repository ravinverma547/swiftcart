import prisma from "../../config/prisma";
import bcrypt from "bcryptjs";

export const createUser = async (userData: any) => {
  const { name, email, password } = userData;

  // 1. Check karo user pehle se toh nahi hai
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists with this email!");
  }

  // 2. Password Hash karo
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Database mein save karo
  return await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
};