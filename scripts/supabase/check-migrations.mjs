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

// ==============================================================================
// Check full_schema.sql Freshness & Synchronization
// ==============================================================================
const fullSchemaPath = path.resolve(__dirname, "../../supabase/full_schema.sql");

if (!fs.existsSync(fullSchemaPath)) {
  console.error("❌ Missing unified deployment file: supabase/full_schema.sql");
  console.error("👉 Please run: npm run supabase:schema:bundle to generate it.");
  process.exit(1);
}

const existingFullSchema = fs.readFileSync(fullSchemaPath, "utf-8").replace(/\r\n/g, "\n").trim();

// Generate expected bundle content
let expectedContent = "";
expectedContent +=
  "-- ==============================================================================\n";
expectedContent += "-- PROJECT: GenViet - Responsive Web App Quản Lý Cây Gia Phả\n";
expectedContent += "-- FILE: supabase/full_schema.sql\n";
expectedContent +=
  "-- MỤC ĐÍCH: Hợp nhất toàn bộ các file migration SQL để triển khai 1 lần duy nhất.\n";
expectedContent +=
  "-- GHI CHÚ: File này được tổng hợp tuần tự từ tất cả migration trong supabase/migrations/.\n";
expectedContent +=
  "--          Các file migration gốc vẫn được giữ nguyên đầy đủ để quản lý theo version.\n";
expectedContent += `-- TỔNG SỐ MIGRATION: ${files.length}\n`;
expectedContent +=
  "-- ==============================================================================\n\n";

expectedContent +=
  "-- ==============================================================================\n";
expectedContent += "-- DANH SÁCH CÁC MIGRATION ĐƯỢC HỢP NHẤT (THEO THỨ TỰ THỜI GIAN):\n";
files.forEach((file, idx) => {
  expectedContent += `--   ${String(idx + 1).padStart(2, "0")}. ${file}\n`;
});
expectedContent +=
  "-- ==============================================================================\n\n";

files.forEach((file, idx) => {
  const filePath = path.join(migrationsDir, file);
  const fileContent = fs.readFileSync(filePath, "utf-8").replace(/\r\n/g, "\n");

  expectedContent +=
    "/*******************************************************************************\n";
  expectedContent += ` * [${String(idx + 1).padStart(2, "0")}/${String(files.length).padStart(2, "0")}] MIGRATION: ${file}\n`;
  expectedContent +=
    " *******************************************************************************/\n\n";

  expectedContent += fileContent.trim() + "\n\n";
});

expectedContent +=
  "-- ==============================================================================\n";
expectedContent += "-- HOÀN TẤT TRIỂN KHAI TOÀN BỘ SCHEMA GENVIET\n";
expectedContent +=
  "-- ==============================================================================";

if (existingFullSchema !== expectedContent.trim()) {
  console.error(
    "❌ STALE_FULL_SCHEMA: supabase/full_schema.sql is out of sync with migration files!"
  );
  console.error(
    "👉 Changes in supabase/migrations/ were detected that are not reflected in full_schema.sql."
  );
  console.error(
    "👉 Run 'npm run supabase:schema:bundle' to re-bundle and synchronize full_schema.sql."
  );
  process.exit(1);
}

console.log(
  `✅ All ${files.length} migration file(s) and supabase/full_schema.sql passed naming, structure, sync, and security verification!`
);
process.exit(0);
