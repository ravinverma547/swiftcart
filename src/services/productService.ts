import prisma from '../config/prisma';

/**
 * Product Service handles all database interactions for Products.
 * Separation of concerns: Controller handles HTTP, Service handles logic/DB.
 */

export const findAllProducts = async (filters: {
  keyword?: string | undefined;
  category?: string | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  page?: number;
  limit?: number;
}) => {
  try {
    const { keyword, category, minPrice, maxPrice, page = 1, limit = 12 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
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
      prisma.product.count({ where }),
    ]);

    console.log(`✅ Fetched ${products.length} products successfully`);
    return { products, total };
  } catch (error: any) {
    console.error("❌ CRITICAL ERROR in findAllProducts service:", error.message);
    throw new Error(`Database Error: ${error.message}`);
  }
};

export const findProductById = async (id: string) => {
  return await prisma.product.findUnique({
    where: { id },
    include: {
      reviews: true,
    },
  });
};

export const createNewProduct = async (productData: any) => {
  return await prisma.product.create({
    data: {
      ...productData,
      brand: productData.brand || "SwiftCart",
      price: Number(productData.price),
      stock: Number(productData.stock),
      variants: productData.variants || [],
      isFeatured: Boolean(productData.isFeatured),
    },
  });
};

export const updateProductById = async (id: string, updateData: any) => {
  return await prisma.product.update({
    where: { id },
    data: updateData,
  });
};

export const removeProductById = async (id: string) => {
  return await prisma.product.delete({
    where: { id },
  });
};

export const addReviewToProduct = async (reviewData: {
  rating: number;
  comment: string;
  userName: string;
  userId: string;
  productId: string;
}) => {
  return await prisma.review.create({
    data: reviewData,
  });
};
