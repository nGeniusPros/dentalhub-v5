import { PrismaClient } from '@prisma/client';
// Initialize Prisma Client
const db = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
export { db };
