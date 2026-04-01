import { Response } from 'express';
export declare const generateToken: (userId: string) => string;
export declare const sendToken: (res: Response, statusCode: number, userId: string, user: any) => void;
export declare const verifyToken: (token: string) => {
    id: string;
};
//# sourceMappingURL=jwt.d.ts.map