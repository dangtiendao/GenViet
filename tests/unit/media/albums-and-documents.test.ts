import { describe, it, expect } from "vitest";
import { buildPhotoAlbum } from "@/features/media/albums/album-service";
import {
  validateDocumentFile,
  buildScannedDocument,
} from "@/features/media/documents/document-service";

describe("P27-T08 & P27-T09: Albums and Scanned Documents Tests", () => {
  it("khởi tạo album ảnh thuộc cây gia phả an toàn", () => {
    const album = buildPhotoAlbum({
      treeId: "tree-1",
      title: "Album Họ Nguyễn Mùa Xuân 2026",
    });

    expect(album.treeId).toBe("tree-1");
    expect(album.title).toBe("Album Họ Nguyễn Mùa Xuân 2026");
    expect(album.mediaCount).toBe(0);
  });

  it("xác thực định dạng tài liệu scan hợp lệ (PDF, JPEG, PNG, WEBP)", () => {
    expect(validateDocumentFile("application/pdf", 5 * 1024 * 1024).isValid).toBe(true);
    expect(validateDocumentFile("image/jpeg", 2 * 1024 * 1024).isValid).toBe(true);
    expect(validateDocumentFile("text/html", 1024).isValid).toBe(false); // Chặn active content
    expect(validateDocumentFile("application/pdf", 25 * 1024 * 1024).isValid).toBe(false); // Chặn >20MB
  });

  it("tạo cấu trúc tài liệu scan đầy đủ siêu dữ liệu", () => {
    const doc = buildScannedDocument({
      treeId: "tree-1",
      documentType: "birth_certificate",
      title: "Giấy khai sinh cụ tổ",
      storagePath: "tree-1/documents/birth-cert.pdf",
      mimeType: "application/pdf",
      fileSizeBytes: 1048576,
    });

    expect(doc.documentType).toBe("birth_certificate");
    expect(doc.storagePath).toBe("tree-1/documents/birth-cert.pdf");
  });
});
