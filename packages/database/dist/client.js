import { PrismaClient } from '@prisma/client';
// Main database client instance
export const db = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
// Factory function for creating new clients
export const createClient = () => new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
