import type { Role } from "@prisma/client";
type CreateUserInput = {
    name: string;
    email: string;
    password: string;
};
type LoginInput = {
    email: string;
    password: string;
};
export declare const createUser: ({ name, email, password }: CreateUserInput) => Promise<{
    id: string;
    name: string;
    email: string;
    password: string;
    role: import(".prisma/client").$Enums.Role;
    createdAt: Date;
    updatedAt: Date;
    addresses: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
        default: boolean;
    }[];
}>;
export declare const login: ({ email, password }: LoginInput) => Promise<{
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
        addresses: {
            street: string;
            city: string;
            state: string;
            zip: string;
            country: string;
            default: boolean;
        }[];
    };
    role: Role;
}>;
export {};
//# sourceMappingURL=auth.service.d.ts.map