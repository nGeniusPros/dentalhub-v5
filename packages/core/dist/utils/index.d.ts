export declare const formatError: (error: unknown) => string;
export declare const createPaginationResponse: <T>(data: T[], total: number, page: number, limit: number) => {
    success: boolean;
    data: T[];
    total: number;
    page: number;
    limit: number;
};
export declare const isValidEmail: (email: string) => boolean;
