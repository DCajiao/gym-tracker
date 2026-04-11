import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { readFileSync } from "fs";
import { join } from "path";

// Load .env for CLI commands (prisma db pull, generate, etc.)
try {
  const raw = readFileSync(join(process.cwd(), ".env"), "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = val;
  }
} catch { /* .env optional in production */ }

export default defineConfig({
  schema: "./prisma/schema.prisma",
  adapter: () => {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    return new PrismaPg(pool);
  },
});
