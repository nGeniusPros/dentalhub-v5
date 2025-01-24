export interface AuthenticatedUser {
    id: string;
    email: string;
    role: 'admin' | 'dentist' | 'hygienist' | 'staff';
    practice_id: string;
    phone?: string;
}
export interface SupabaseUserMetadata {
    role?: string;
    practice_id?: string;
    phone?: string;
}
export declare const validateUserMetadata: (metadata: unknown) => metadata is SupabaseUserMetadata;
