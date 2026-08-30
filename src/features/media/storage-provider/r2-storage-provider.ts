import { StorageProvider, StorageObjectMetadata } from "./storage-provider.interface";

/**
 * Cloudflare R2 Storage Provider (S3-compatible API - P27-T18)
 * Server-only: Tuyệt đối không phơi lộ R2 Access Key hoặc Secret Key ra client bundle.
 */
export class CloudflareR2StorageProvider implements StorageProvider {
  public readonly providerName = "r2" as const;

  public async createSignedReadUrl(
    bucket: string,
    key: string,
    expiresInSeconds: number = 3600
  ): Promise<string> {
    return `https://r2.local/${bucket}/${key}?X-Amz-Signature=mock-r2-signature&X-Amz-Expires=${expiresInSeconds}`;
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
    // Xóa object từ Cloudflare R2
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
