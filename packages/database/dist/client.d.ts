import { PrismaClient } from '@prisma/client';
export declare const db: PrismaClient<{
    log: ("query" | "warn" | "error")[];
}, never, import("@prisma/client/runtime/library").DefaultArgs>;
export declare const createClient: () => PrismaClient<{
    log: ("query" | "warn" | "error")[];
}, never, import("@prisma/client/runtime/library").DefaultArgs>;
export type { Patient } from '@prisma/client';
export { Prisma } from '@prisma/client';
