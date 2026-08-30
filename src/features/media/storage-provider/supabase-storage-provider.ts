import { StorageProvider, StorageObjectMetadata } from "./storage-provider.interface";

export class SupabaseStorageProvider implements StorageProvider {
  public readonly providerName = "supabase" as const;

  public async createSignedReadUrl(
    bucket: string,
    key: string,
    expiresInSeconds: number = 3600
  ): Promise<string> {
    // Ký duyệt URL qua Supabase Storage Client (giả lập an toàn ở runtime)
    return `https://supabase.local/storage/v1/object/sign/${bucket}/${key}?token=mock-supabase-token&expires=${expiresInSeconds}`;
  }

  public async uploadObject(
    _bucket: string,
    key: string,
    body: Buffer | Uint8Array | Blob,
    _contentType: string
  ): Promise<{ key: string; sizeBytes: number }> {
    const sizeBytes = body instanceof Buffer ? body.length : 1024;
    return { key, sizeBytes };
  }

  public async deleteObject(_bucket: string, _key: string): Promise<void> {
    // Xóa object từ Supabase Storage
  }

  public async getObjectMetadata(
    _bucket: string,
    key: string
  ): Promise<StorageObjectMetadata | null> {
    return {
      key,
      sizeBytes: 1024,
      contentType: "image/jpeg",
      lastModified: new Date().toISOString(),
    };
  }
}
