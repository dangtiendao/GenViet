import { describe, it, expect } from "vitest";
import {
  buildActiveAvatarPath,
  buildTemporaryAvatarPath,
  parseAvatarPath,
} from "@/features/media/utils/object-path";

describe("Media Object Path Utility", () => {
  const treeId = "11111111-1111-4111-a111-111111111111";
  const personId = "22222222-2222-4222-a222-222222222222";
  const mediaId = "33333333-3333-4333-a333-333333333333";
  const uploadId = "upload-test-123";

  it("xây dựng active avatar path chuẩn xác", () => {
    const path = buildActiveAvatarPath(treeId, personId, mediaId, "avatar");
    expect(path).toBe(`trees/${treeId}/persons/${personId}/avatars/${mediaId}/avatar.webp`);
  });

  it("xây dựng active thumbnail path chuẩn xác", () => {
    const path = buildActiveAvatarPath(treeId, personId, mediaId, "thumb");
    expect(path).toBe(`trees/${treeId}/persons/${personId}/avatars/${mediaId}/thumb.webp`);
  });

  it("xây dựng temporary avatar path chuẩn xác", () => {
    const path = buildTemporaryAvatarPath(treeId, personId, uploadId, "avatar");
    expect(path).toBe(`temporary/trees/${treeId}/persons/${personId}/${uploadId}/avatar.webp`);
  });

  it("ném lỗi khi truyền UUID không hợp lệ khi tạo path", () => {
    expect(() => buildActiveAvatarPath("invalid-uuid", personId, mediaId)).toThrow();
  });

  it("phân tích thành công active avatar path", () => {
    const path = `trees/${treeId}/persons/${personId}/avatars/${mediaId}/avatar.webp`;
    const parsed = parseAvatarPath(path);
    expect(parsed).not.toBeNull();
    expect(parsed?.treeId).toBe(treeId);
    expect(parsed?.personId).toBe(personId);
    expect(parsed?.mediaId).toBe(mediaId);
    expect(parsed?.variant).toBe("avatar");
    expect(parsed?.extension).toBe("webp");
    expect(parsed?.isTemporary).toBe(false);
  });

  it("phân tích thành công temporary avatar path", () => {
    const path = `temporary/trees/${treeId}/persons/${personId}/${uploadId}/thumb.webp`;
    const parsed = parseAvatarPath(path);
    expect(parsed).not.toBeNull();
    expect(parsed?.treeId).toBe(treeId);
    expect(parsed?.personId).toBe(personId);
    expect(parsed?.variant).toBe("thumb");
    expect(parsed?.isTemporary).toBe(true);
  });

  it("từ chối path traversal (..) và trả về null", () => {
    expect(parseAvatarPath("../../../etc/passwd")).toBeNull();
    expect(parseAvatarPath(`trees/${treeId}/persons/../avatars/${mediaId}/avatar.webp`)).toBeNull();
    expect(parseAvatarPath("trees/..\\..\\avatar.webp")).toBeNull();
  });

  it("từ chối định dạng mở rộng không hợp lệ", () => {
    expect(
      parseAvatarPath(`trees/${treeId}/persons/${personId}/avatars/${mediaId}/avatar.exe`)
    ).toBeNull();
    expect(
      parseAvatarPath(`trees/${treeId}/persons/${personId}/avatars/${mediaId}/avatar.svg`)
    ).toBeNull();
  });
});
