export interface User {
    id: string;
    email: string;
    role: 'admin' | 'staff' | 'patient';
    name: string;
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
export interface PaginationParams {
    page: number;
    limit: number;
}
export interface PaginatedResponse<T> extends ApiResponse<T> {
    total: number;
    page: number;
    limit: number;
}
