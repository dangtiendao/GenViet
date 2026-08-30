import { StorageProvider } from "./storage-provider.interface";
import { SupabaseStorageProvider } from "./supabase-storage-provider";
import { CloudflareR2StorageProvider } from "./r2-storage-provider";
import { getFeatureFlags } from "@/config/feature-flags";

let currentProvider: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (currentProvider) return currentProvider;

  const flags = getFeatureFlags();
  if (flags.storageProvider === "r2") {
    currentProvider = new CloudflareR2StorageProvider();
  } else {
    currentProvider = new SupabaseStorageProvider();
  }

  return currentProvider;
}
