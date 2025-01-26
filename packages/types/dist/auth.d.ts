import { UUID, UserRole } from "./common.js";
export interface UserMetadata {
    role?: UserRole;
    practice_id?: UUID;
    phone?: string;
}
export interface AuthenticatedUser {
    id: UUID;
    email: string;
    metadata?: UserMetadata;
    created_at: string;
    updated_at: string;
}
export interface UserProfile {
    id: UUID;
    role: UserRole;
    practice_id: UUID;
    created_at: string;
    updated_at: string;
}
export declare function isUserMetadata(metadata: unknown): metadata is UserMetadata;
//# sourceMappingURL=auth.d.ts.map