import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// Lazy singleton — never throws at module load time (build-safe)
let _prisma: PrismaClient | undefined;

function createClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL environment variable is not set.");

  // Strip channel_binding — not supported by @neondatabase/serverless
  let connectionString = url;
  try {
    const parsed = new URL(url);
    parsed.searchParams.delete("channel_binding");
    connectionString = parsed.toString();
  } catch { /* keep original */ }

  const adapter = new PrismaNeon({ connectionString });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new PrismaClient({ adapter } as any);
}

// Proxy: creation is deferred until first actual DB call (not at import time)
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_, prop: string | symbol) {
    if (!_prisma) _prisma = createClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const val = (_prisma as any)[prop];
    return typeof val === "function" ? val.bind(_prisma) : val;
  },
});
