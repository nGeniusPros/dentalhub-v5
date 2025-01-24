import { PrismaClient } from '@prisma/client';
// Determine environment
const isDevelopment = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';
// Main database client instance
export const db = new PrismaClient({
    log: isDevelopment ? ['query', 'error', 'warn'] : ['error'],
});
// Factory function for creating new clients
export const createClient = () => new PrismaClient({
    log: isDevelopment ? ['query', 'error', 'warn'] : ['error'],
});
