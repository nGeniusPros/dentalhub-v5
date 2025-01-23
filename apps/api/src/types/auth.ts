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

export const validateUserMetadata = (metadata: unknown): metadata is SupabaseUserMetadata => {
  return typeof metadata === 'object' && metadata !== null &&
    (!('role' in metadata) || typeof metadata.role === 'string') &&
    (!('practice_id' in metadata) || typeof metadata.practice_id === 'string') &&
    (!('phone' in metadata) || typeof metadata.phone === 'string');
};