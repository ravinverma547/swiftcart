import type { Request, Response } from "express";
export declare const getProducts: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getProductById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const adminCreateProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const adminUpdateProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const adminDeleteProduct: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=product.controller.d.ts.map