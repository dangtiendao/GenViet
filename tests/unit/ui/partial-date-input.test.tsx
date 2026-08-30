import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PartialDateInput, type PartialDateValue } from "@/components/forms/partial-date-input";

describe("Partial Date Input Tests (P10-T08 / AC-P10-057..071)", () => {
  it("should render unknown precision without rendering day/month/year inputs", () => {
    const value: PartialDateValue = {
      precision: "unknown",
      year: null,
      month: null,
      day: null,
      isEstimated: false,
    };

    const html = renderToStaticMarkup(
      <PartialDateInput label="Ngày sinh" value={value} onChange={() => {}} />
    );

    expect(html).toContain("Độ chính xác dữ liệu");
    expect(html).not.toContain("Năm (Dương lịch)");
    expect(html).not.toContain("Ngày (1 - 31)");
  });

  it("should render only year input when precision is year", () => {
    const value: PartialDateValue = {
      precision: "year",
      year: 1945,
      month: null,
      day: null,
      isEstimated: false,
    };

    const html = renderToStaticMarkup(
      <PartialDateInput label="Năm sinh" value={value} onChange={() => {}} />
    );

    expect(html).toContain("Năm (Dương lịch)");
    expect(html).toContain('value="1945"');
    expect(html).not.toContain("Ngày (1 - 31)");
    expect(html).not.toContain("-- Chọn tháng --");
  });

  it("should render all day, month, year inputs when precision is exact", () => {
    const value: PartialDateValue = {
      precision: "exact",
      year: 1990,
      month: 8,
      day: 25,
      isEstimated: false,
    };

    const html = renderToStaticMarkup(
      <PartialDateInput label="Ngày sinh đầy đủ" value={value} onChange={() => {}} />
    );

    expect(html).toContain("Ngày (1 - 31)");
    expect(html).toContain("Tháng");
    expect(html).toContain("Năm (Dương lịch)");
    expect(html).toContain('value="25"');
    expect(html).toContain('value="1990"');
  });

  it("should display estimated checkbox when precision is not unknown", () => {
    const value: PartialDateValue = {
      precision: "year",
      year: 1920,
      month: null,
      day: null,
      isEstimated: true,
    };

    const html = renderToStaticMarkup(
      <PartialDateInput label="Năm sinh ước tính" value={value} onChange={() => {}} />
    );

    expect(html).toContain("Ngày/năm ước tính");
    expect(html).toContain('checked=""');
  });
});
