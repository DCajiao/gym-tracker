/**
 * Migration runner.
 * Reads all *.sql files from database_migrations/ sorted by filename prefix,
 * runs each one that hasn't been applied yet, and records it in _migrations.
 *
 * Usage: node scripts/migrate.js
 * Requires: DATABASE_URL env var
 */
import pg from "pg";
import { readdir, readFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "./env.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, "../database_migrations");

async function migrate() {
  const client = new pg.Client({ connectionString: config.DATABASE_URL });
  await client.connect();

  try {
    // Tracking table — created outside the numbered migrations so the runner
    // always has a place to record state, even on a fresh database.
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id         SERIAL PRIMARY KEY,
        filename   TEXT NOT NULL UNIQUE,
        applied_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    const { rows: applied } = await client.query(
      "SELECT filename FROM _migrations ORDER BY filename"
    );
    const appliedSet = new Set(applied.map((r) => r.filename));

    const files = (await readdir(MIGRATIONS_DIR))
      .filter((f) => f.endsWith(".sql"))
      .sort(); // lexicographic sort — 00_ < 01_ < 02_ ...

    let ran = 0;
    for (const file of files) {
      if (appliedSet.has(file)) {
        console.log(`  skip  ${file}`);
        continue;
      }

      const sql = await readFile(join(MIGRATIONS_DIR, file), "utf8");
      console.log(`  run   ${file}`);
      await client.query(sql);
      await client.query("INSERT INTO _migrations (filename) VALUES ($1)", [file]);
      ran++;
    }

    console.log(ran === 0 ? "No new migrations." : `Applied ${ran} migration(s).`);
  } finally {
    await client.end();
  }
}

migrate().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
