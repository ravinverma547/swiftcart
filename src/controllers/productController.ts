import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/productService';

/**
 * Controller manages HTTP requests and responses.
 * Logic is delegated to the Service.
 */

// Get all products - with search, filter, pagination
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { keyword, category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    const { products, total } = await productService.findAllProducts({
      keyword: keyword ? String(keyword) : undefined,
      category: category ? String(category) : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      page: Number(page),
      limit: Number(limit),
    });

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// Get single product details
export const getProductDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.findProductById(req.params.id as string);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Create new product
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.createNewProduct(req.body);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update product
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedProduct = await productService.updateProductById(req.params.id as string, req.body);

    res.status(200).json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete product
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await productService.removeProductById(req.params.id as string);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Create Product Review
export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;
    const user = (req as any).user;

    const review = await productService.addReviewToProduct({
        rating: Number(rating),
        comment,
        userName: user.name,
        userId: user.id,
        productId: productId as string,
    });

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    next(error);
  }
};
