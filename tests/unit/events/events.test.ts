import { describe, it, expect } from "vitest";
import { CreateFamilyEventSchema } from "@/features/events/event-types/event.types";
import { calculateNextAnniversary } from "@/features/events/death-anniversaries/anniversary-calculator";

describe("P27-T05 & P27-T06: Family Events and Death Anniversaries Tests", () => {
  it("xác thực schema sự kiện gia phả hợp lệ", () => {
    const validEvent = {
      treeId: "123e4567-e89b-12d3-a456-426614174000",
      eventType: "birth",
      title: "Ngày sinh cụ tổ",
      calendarSystem: "solar",
      privacy: "private",
    };

    const parsed = CreateFamilyEventSchema.safeParse(validEvent);
    expect(parsed.success).toBe(true);
  });

  it("tính toán chính xác ngày giỗ tiếp theo theo Dương lịch", () => {
    const observance = {
      id: "obs-1",
      treeId: "tree-1",
      personId: "person-1",
      calendarSystem: "solar" as const,
      month: 10,
      day: 15,
      leapMonthRule: "normal_month" as const,
      isEnabled: true,
    };

    const next = calculateNextAnniversary(observance, new Date(2026, 7, 30)); // 30/08/2026
    expect(next.solarDate).toBe("2026-10-15");
    expect(next.daysRemaining).toBeGreaterThan(0);
  });
});
