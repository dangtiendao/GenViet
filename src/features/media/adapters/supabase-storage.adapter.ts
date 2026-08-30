import "server-only";
import { createClient } from "@/lib/supabase/server";
import { MediaDomainError, MEDIA_ERROR_CODES } from "../errors/media.errors";

export const BUCKET_NAME = "person-avatars";

export class SupabaseStorageAdapter {
  /**
   * Sinh Signed Upload URL để client upload trực tiếp vào Storage
   */
  static async createSignedUploadUrl(path: string): Promise<{
    signedUrl: string;
    token: string;
    path: string;
  }> {
    const supabase = await createClient();
    const { data, error } = await supabase.storage.from(BUCKET_NAME).createSignedUploadUrl(path);

    if (error || !data) {
      throw new MediaDomainError(
        MEDIA_ERROR_CODES.UPLOAD_AUTHORIZATION_FAILED,
        `Không thể cấp quyền tải ảnh lên: ${error?.message || "Lỗi không xác định"}`
      );
    }

    return {
      signedUrl: data.signedUrl,
      token: data.token,
      path: data.path,
    };
  }

  /**
   * Sinh Signed Read URL có thời hạn ngắn (TTL) để đọc ảnh riêng tư
   */
  static async createSignedReadUrl(path: string, ttlSeconds: number = 900): Promise<string> {
    const supabase = await createClient();
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(path, ttlSeconds);

    if (error || !data?.signedUrl) {
      throw new MediaDomainError(
        MEDIA_ERROR_CODES.SIGNED_URL_FAILED,
        `Không thể tạo đường dẫn truy cập ảnh: ${error?.message || "Lỗi không xác định"}`
      );
    }

    return data.signedUrl;
  }

  /**
   * Upload đối tượng nhị phân trực tiếp từ server
   */
  static async uploadObject(
    path: string,
    fileData: ArrayBuffer | Buffer | Blob,
    mimeType: string = "image/webp"
  ): Promise<string> {
    const supabase = await createClient();
    const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(path, fileData, {
      contentType: mimeType,
      upsert: true,
    });

    if (error || !data) {
      throw new MediaDomainError(
        MEDIA_ERROR_CODES.UPLOAD_FAILED,
        `Tải ảnh lên thất bại: ${error?.message || "Lỗi không xác định"}`
      );
    }

    return data.path;
  }

  /**
   * Sao chép/Di chuyển đối tượng từ path tạm sang path active
   */
  static async copyObject(fromPath: string, toPath: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.storage.from(BUCKET_NAME).copy(fromPath, toPath);

    if (error) {
      throw new MediaDomainError(
        MEDIA_ERROR_CODES.FINALIZE_FAILED,
        `Không thể sao chép ảnh từ vùng tạm: ${error.message}`
      );
    }
  }

  /**
   * Xóa một hoặc nhiều đối tượng khỏi Storage
   */
  static async deleteObjects(paths: string[]): Promise<void> {
    if (!paths || paths.length === 0) return;

    const supabase = await createClient();
    const { error } = await supabase.storage.from(BUCKET_NAME).remove(paths);

    if (error) {
      // Log lỗi xóa file để đưa vào cleanup queue
      console.error("Lỗi xóa file trong Storage:", error);
    }
  }

  /**
   * Liệt kê các đối tượng theo tiền tố thư mục
   */
  static async listObjects(prefix: string): Promise<
    Array<{
      name: string;
      id: string | null;
      updated_at: string | null;
      created_at: string | null;
      last_accessed_at: string | null;
      metadata: Record<string, unknown> | null;
    }>
  > {
    const supabase = await createClient();
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list(prefix);

    if (error || !data) {
      return [];
    }

    return data;
  }
}
