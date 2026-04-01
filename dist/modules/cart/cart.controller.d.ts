import type { Request, Response } from "express";
export declare const getCart: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const addCartItem: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateCartItem: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const removeCartItem: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const clearCart: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=cart.controller.d.ts.map