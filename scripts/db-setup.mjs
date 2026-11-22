import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is missing. Add it to .env.local, then run npm run db:setup again.");
  process.exit(1);
}

const sql = neon(databaseUrl);

async function runSqlFile(path) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  const statements = source.split(";").map((statement) => statement.trim()).filter(Boolean);

  for (const statement of statements) {
    await sql.query(statement);
  }
}

await runSqlFile("../db/schema.sql");
await runSqlFile("../db/seed.sql");

const restaurants = await sql`SELECT id, name, cuisine, area FROM restaurants ORDER BY id`;
const reviews = await sql`SELECT id, restaurant_id, rating, comment, created_at FROM reviews ORDER BY id`;

console.log("Restaurants:", restaurants);
console.log("Reviews:", reviews);

