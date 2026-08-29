import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, "../../supabase/migrations");

console.log("🔍 Running GenViet Supabase Migration Quality & Security Checks...");

if (!fs.existsSync(migrationsDir)) {
  console.error("❌ Migrations directory does not exist:", migrationsDir);
  process.exit(1);
}

const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql"));

if (files.length === 0) {
  console.warn("⚠️ No migration files found in supabase/migrations/.");
  process.exit(0);
}

const timestampRegex = /^(\d{14})_([a-z0-9_]+)\.sql$/;
const timestamps = new Set();
let hasErrors = false;

for (const file of files) {
  const match = file.match(timestampRegex);
  if (!match) {
    console.error(
      `❌ Invalid migration filename format: "${file}". Expected format: YYYYMMDDHHMMSS_description_in_snake_case.sql`
    );
    hasErrors = true;
    continue;
  }

  const timestamp = match[1];
  if (timestamps.has(timestamp)) {
    console.error(`❌ Duplicate migration timestamp detected: ${timestamp} in file "${file}"`);
    hasErrors = true;
  }
  timestamps.add(timestamp);

  const filePath = path.join(migrationsDir, file);
  const content = fs.readFileSync(filePath, "utf-8");

  if (content.trim().length === 0) {
    console.error(`❌ Empty migration file detected: "${file}"`);
    hasErrors = true;
  }

  // Security & Secret check
  if (
    content.includes("eyJhYmM") ||
    content.includes("sbp_") ||
    content.includes("SUPABASE_SERVICE_ROLE_KEY")
  ) {
    console.error(`❌ Potential secret/credential leak detected in migration: "${file}"`);
    hasErrors = true;
  }
}

if (hasErrors) {
  console.error("❌ Migration quality checks failed. Please resolve the issues above.");
  process.exit(1);
}

console.log(
  `✅ All ${files.length} migration file(s) passed naming, structure, and security verification!`
);
process.exit(0);
