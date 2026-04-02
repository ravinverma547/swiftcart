/**
 * Product Service handles all database interactions for Products.
 * Separation of concerns: Controller handles HTTP, Service handles logic/DB.
 */
export declare const findAllProducts: (filters: {
    keyword?: string | undefined;
    category?: string | undefined;
    minPrice?: number | undefined;
    maxPrice?: number | undefined;
    page?: number;
    limit?: number;
}) => Promise<{
    products: ({
        reviews: {
            rating: number;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        price: number;
        images: string[];
        category: string;
        stock: number;
        isFeatured: boolean;
        variants: {
            type: string;
            value: string;
            price: number;
            stock: number;
        }[];
    })[];
    total: number;
}>;
export declare const findProductById: (id: string) => Promise<({
    reviews: {
        id: string;
        createdAt: Date;
        userId: string;
        productId: string;
        rating: number;
        comment: string;
        userName: string;
    }[];
} & {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string;
    price: number;
    images: string[];
    category: string;
    stock: number;
    isFeatured: boolean;
    variants: {
        type: string;
        value: string;
        price: number;
        stock: number;
    }[];
}) | null>;
export declare const createNewProduct: (productData: any) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string;
    price: number;
    images: string[];
    category: string;
    stock: number;
    isFeatured: boolean;
    variants: {
        type: string;
        value: string;
        price: number;
        stock: number;
    }[];
}>;
export declare const updateProductById: (id: string, updateData: any) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string;
    price: number;
    images: string[];
    category: string;
    stock: number;
    isFeatured: boolean;
    variants: {
        type: string;
        value: string;
        price: number;
        stock: number;
    }[];
}>;
export declare const removeProductById: (id: string) => Promise<{
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    description: string;
    price: number;
    images: string[];
    category: string;
    stock: number;
    isFeatured: boolean;
    variants: {
        type: string;
        value: string;
        price: number;
        stock: number;
    }[];
}>;
export declare const addReviewToProduct: (reviewData: {
    rating: number;
    comment: string;
    userName: string;
    userId: string;
    productId: string;
}) => Promise<{
    id: string;
    createdAt: Date;
    userId: string;
    productId: string;
    rating: number;
    comment: string;
    userName: string;
}>;
//# sourceMappingURL=productService.d.ts.map