import { Request, Response, NextFunction } from 'express';
/**
 * Controller manages HTTP requests and responses.
 * Logic is delegated to the Service.
 */
export declare const getProducts: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getProductDetails: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createProduct: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateProduct: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteProduct: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createReview: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=productController.d.ts.map