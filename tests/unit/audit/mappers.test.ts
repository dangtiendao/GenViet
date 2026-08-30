import { describe, it, expect } from "vitest";
import { sanitizeAuditData, computeChangedFields } from "@/features/audit/mappers/audit-redaction";
import { mapRawRowToAuditLogDto, type RawAuditRow } from "@/features/audit/mappers/audit.mapper";

describe("Audit Redaction & Mapper Utilities", () => {
  it("khử nhiễm loại bỏ các trường nhạy cảm thuộc Denylist (password, token, signed_url)", () => {
    const rawData = {
      full_name: "Nguyễn Văn A",
      password: "secret_password_123",
      access_token: "jwt.token.abc",
      signed_url: "https://storage.supabase.co/signed?token=xyz",
      living_status: "living",
    };

    const sanitized = sanitizeAuditData("person", rawData);
    expect(sanitized).not.toBeNull();
    expect(sanitized?.full_name).toBe("Nguyễn Văn A");
    expect(sanitized?.living_status).toBe("living");
    expect(sanitized?.password).toBeUndefined();
    expect(sanitized?.access_token).toBeUndefined();
    expect(sanitized?.signed_url).toBeUndefined();
  });

  it("chỉ giữ lại các trường thuộc Allowlist của từng Entity Type", () => {
    const rawData = {
      full_name: "Nguyễn Văn B",
      unrelated_internal_field: "some_data",
      version: 1,
    };

    const sanitized = sanitizeAuditData("person", rawData);
    expect(sanitized?.full_name).toBe("Nguyễn Văn B");
    expect(sanitized?.version).toBe(1);
    expect(sanitized?.unrelated_internal_field).toBeUndefined();
  });

  it("tính toán chính xác danh sách changed_fields giữa before và after", () => {
    const before = { full_name: "Nguyễn Văn C", living_status: "living" };
    const after = { full_name: "Nguyễn Văn D", living_status: "living" };

    const changed = computeChangedFields(before, after);
    expect(changed).toEqual(["full_name"]);
  });

  it("ánh xạ thành công raw row sang AuditLogDto với nhãn tiếng Việt chuẩn", () => {
    const rawRow: RawAuditRow = {
      id: "11111111-1111-4111-a111-111111111111",
      tree_id: "22222222-2222-4222-a222-222222222222",
      actor_user_id: "33333333-3333-4333-a333-333333333333",
      actor_name_cached: "Trần Văn A",
      entity_type: "person",
      entity_id: "44444444-4444-4444-a444-444444444444",
      action_type: "create",
      before_data: null,
      after_data: { full_name: "Nguyễn Văn Mới" },
      changed_fields: ["full_name"],
      reason: "Tạo nhân vật",
      source: "direct_rpc",
      created_at: "2026-08-30T10:00:00.000Z",
    };

    const dto = mapRawRowToAuditLogDto(rawRow);
    expect(dto.id).toBe(rawRow.id);
    expect(dto.entityTypeLabel).toBe("Nhân vật");
    expect(dto.actionTypeLabel).toBe("Tạo mới");
    expect(dto.actorName).toBe("Trần Văn A");
  });
});
