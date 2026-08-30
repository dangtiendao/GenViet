import React from "react";
import { describe, it, expect, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AvatarPreview } from "@/features/media/components/avatar-preview";
import { AvatarThumbnail } from "@/features/media/components/avatar-thumbnail";
import { AvatarUploader } from "@/features/media/components/avatar-uploader";

// Mock server actions
vi.mock("@/features/media/actions/avatar.actions", () => ({
  getAvatarSignedUrlAction: vi.fn().mockResolvedValue({
    success: true,
    data: {
      url: "https://storage.local/person-avatars/test.webp",
      variant: "avatar",
      expiresAt: Date.now() + 900000,
    },
  }),
  prepareAvatarUploadAction: vi.fn(),
  finalizeAvatarUploadAction: vi.fn(),
  removeAvatarAction: vi.fn(),
}));

describe("Media UI Components", () => {
  const treeId = "11111111-1111-4111-a111-111111111111";
  const personId = "22222222-2222-4222-a222-222222222222";

  it("AvatarPreview hiển thị initials fallback khi chưa có ảnh", () => {
    const html = renderToStaticMarkup(
      <AvatarPreview treeId={treeId} personId={personId} fullName="Nguyễn Văn An" />
    );
    expect(html).toContain("VA");
  });

  it("AvatarThumbnail hiển thị chữ cái đầu với màu sắc giới tính nam", () => {
    const html = renderToStaticMarkup(
      <AvatarThumbnail treeId={treeId} personId={personId} fullName="Trần Bá Đạt" gender="male" />
    );
    expect(html).toContain("BĐ");
    expect(html).toContain("bg-blue-100");
  });

  it("AvatarUploader hiển thị nút Tải ảnh lên khi chưa có avatar", () => {
    const html = renderToStaticMarkup(
      <AvatarUploader treeId={treeId} personId={personId} fullName="Lê Thị Mai" />
    );
    expect(html).toContain("Tải ảnh lên");
  });

  it("AvatarUploader hiển thị nút Thay ảnh đại diện và Xóa ảnh khi đã có avatarPath", () => {
    const html = renderToStaticMarkup(
      <AvatarUploader
        treeId={treeId}
        personId={personId}
        fullName="Lê Thị Mai"
        avatarPath="trees/123/persons/456/avatars/789/avatar.webp"
      />
    );
    expect(html).toContain("Thay ảnh đại diện");
    expect(html).toContain("Xóa ảnh");
  });
});
