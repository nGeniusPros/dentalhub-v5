import { UserRole } from '../types/auth.types';

export const isValidUserRole = (role: string): role is UserRole => {
  return ['admin', 'dentist', 'hygienist', 'staff', 'patient'].includes(role);
};