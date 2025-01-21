import { PrismaClient } from '@prisma/client';
declare const db: PrismaClient<{
    log: ("query" | "warn" | "error")[];
}, never, import("@prisma/client/runtime/library").DefaultArgs>;
export { db };
