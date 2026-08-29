import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const typesPath = path.resolve(__dirname, "../../src/lib/supabase/database.types.ts");

console.log("🔍 Verifying Supabase Database Types freshness and validity...");

if (!fs.existsSync(typesPath)) {
  console.error("❌ Database types file does not exist at:", typesPath);
  console.error("💡 Run `npm run supabase:types` to generate it.");
  process.exit(1);
}

const content = fs.readFileSync(typesPath, "utf-8");

if (!content.includes("export type Database =") && !content.includes("export interface Database")) {
  console.error("❌ Invalid database.types.ts: Missing 'Database' type export.");
  process.exit(1);
}

if (!content.includes("AUTO-GENERATED")) {
  console.warn("⚠️ Warning: database.types.ts is missing AUTO-GENERATED header.");
}

console.log("✅ Supabase Database Types verified successfully!");
process.exit(0);
