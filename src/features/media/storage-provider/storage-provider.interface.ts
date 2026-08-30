export interface StorageObjectMetadata {
  key: string;
  sizeBytes: number;
  contentType: string;
  checksumSha256?: string;
  lastModified: string;
}

export interface StorageProvider {
  readonly providerName: "supabase" | "r2";

  createSignedReadUrl(bucket: string, key: string, expiresInSeconds?: number): Promise<string>;

  uploadObject(
    bucket: string,
    key: string,
    body: Buffer | Uint8Array | Blob,
    contentType: string
  ): Promise<{ key: string; sizeBytes: number }>;

  deleteObject(bucket: string, key: string): Promise<void>;

  getObjectMetadata(bucket: string, key: string): Promise<StorageObjectMetadata | null>;
}
