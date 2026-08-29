import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backupDir = path.resolve(__dirname, "../../.backups");

console.log("🛡️ GenViet Pre-Migration Backup Guard...");

const targetEnv = process.env.TARGET_ENV || "development";

if (targetEnv === "production" && !process.env.CONFIRM_PRODUCTION_BACKUP) {
  console.error(
    "🛑 DANGER: Production backup requires explicit CONFIRM_PRODUCTION_BACKUP=true environment variable."
  );
  console.error(
    "💡 Usage: CONFIRM_PRODUCTION_BACKUP=true TARGET_ENV=production node scripts/supabase/backup-before-migrate.mjs"
  );
  process.exit(1);
}

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupMetaFile = path.join(backupDir, `backup_meta_${targetEnv}_${timestamp}.json`);

const metadata = {
  targetEnvironment: targetEnv,
  timestamp: new Date().toISOString(),
  status: "initialized",
  note: "Pre-migration backup record. In production, run `supabase db dump` to generate full SQL dump.",
};

fs.writeFileSync(backupMetaFile, JSON.stringify(metadata, null, 2), "utf-8");
console.log(`✅ Pre-migration backup metadata recorded: ${backupMetaFile}`);
console.log("💡 Remember to never commit the `.backups/` directory to Git!");
process.exit(0);
