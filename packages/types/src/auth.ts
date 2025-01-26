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

// Type guard for user metadata
export function isUserMetadata(metadata: unknown): metadata is UserMetadata {
  if (!metadata || typeof metadata !== "object") {
    return false;
  }

  const { role, practice_id, phone } = metadata as UserMetadata;

  // Check role
  if (role !== undefined && typeof role !== "string") {
    return false;
  }

  // Check practice_id
  if (practice_id !== undefined && typeof practice_id !== "string") {
    return false;
  }

  // Check phone
  if (phone !== undefined && typeof phone !== "string") {
    return false;
  }

  return true;
}
