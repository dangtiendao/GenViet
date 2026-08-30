import { describe, it, expect } from "vitest";
import { updatePersonSchema } from "@/features/persons/schemas/person.schema";
import { PERSON_ERROR_CODES } from "@/features/persons/errors/person.errors";

describe("P22-T07: Kiểm soát xung đột phiên bản (Version Conflict & Optimistic Concurrency)", () => {
  it("chấp nhận update payload có version hợp lệ", () => {
    const res = updatePersonSchema.safeParse({
      personId: "11111111-1111-4111-a111-111111111111",
      treeId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      fullName: "Nguyễn Văn A Cập Nhật",
      expectedVersion: 2,
    });

    expect(res.success).toBe(true);
  });

  it("từ chối version là số âm hoặc số thập phân", () => {
    const resNegative = updatePersonSchema.safeParse({
      personId: "11111111-1111-4111-a111-111111111111",
      treeId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      fullName: "Nguyễn Văn A",
      expectedVersion: -1,
    });
    expect(resNegative.success).toBe(false);

    const resFloat = updatePersonSchema.safeParse({
      personId: "11111111-1111-4111-a111-111111111111",
      treeId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      fullName: "Nguyễn Văn A",
      expectedVersion: 1.5,
    });
    expect(resFloat.success).toBe(false);
  });

  it("định nghĩa mã lỗi VERSION_CONFLICT chuẩn xác", () => {
    expect(PERSON_ERROR_CODES.VERSION_CONFLICT).toBe("PERSON_VERSION_CONFLICT");
  });
});
