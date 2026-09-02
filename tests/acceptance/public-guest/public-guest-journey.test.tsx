import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PublicModeBanner } from "@/features/public-trees/components/public-mode-banner";
import { PublicPersonCard } from "@/features/public-trees/components/public-person-card";
import { PrivateBranchIndicator } from "@/features/public-trees/components/private-branch-indicator";
import type { PublicPersonDto } from "@/features/public-trees/contracts/public-person.dto";

describe("P30-T50, AC-P30-089..109: Public Guest View Component & Journey Tests", () => {
  it("render PublicModeBanner hiển thị thông điệp bảo vệ quyền riêng tư và nút đăng nhập", () => {
    const html = renderToStaticMarkup(
      <PublicModeBanner slug="ho-nguyen" isLoggedIn={false} isMember={false} />
    );

    expect(html).toContain("Chế độ xem công khai");
    expect(html).toContain("Dữ liệu nhân vật còn sống đã được tự động bảo vệ quyền riêng tư");
    expect(html).toContain("Trang chủ");
    expect(html).toContain('href="/"');
    expect(html).toContain("Đăng nhập");
    expect(html).toContain("returnTo=%2Fpublic%2Ftrees%2Fho-nguyen");
  });

  it("render PublicModeBanner cho thành viên đã đăng nhập hiển thị nút mở trang quản trị", () => {
    const html = renderToStaticMarkup(
      <PublicModeBanner slug="ho-nguyen" treeId="tree-123" isLoggedIn={true} isMember={true} />
    );

    expect(html).toContain("Mở trang quản trị");
    expect(html).toContain('href="/trees/tree-123"');
  });

  it("render PublicPersonCard hiển thị đúng thông tin nhân vật còn sống bị ẩn", () => {
    const samplePerson: PublicPersonDto = {
      id: "p-1",
      displayName: "Nguyễn Văn A",
      gender: "male",
      livingState: "LIVING",
      birthYear: 1992,
      deathYear: null,
      isEstimated: false,
      visibility: "PUBLIC_REDACTED",
    };

    const html = renderToStaticMarkup(<PublicPersonCard person={samplePerson} />);

    expect(html).toContain("Nguyễn Văn A");
    expect(html).toContain("Sinh 1992");
    expect(html).not.toContain("Chết");
  });

  it("render PrivateBranchIndicator hiển thị nhãn Nhánh riêng tư", () => {
    const html = renderToStaticMarkup(<PrivateBranchIndicator reason="PRIVACY" />);
    expect(html).toContain("Nhánh riêng tư");
  });

  it("render PrivateBranchIndicator hiển thị nhãn Ngoại tộc khi bị dừng bởi PATERNAL_LINE", () => {
    const html = renderToStaticMarkup(<PrivateBranchIndicator reason="PATERNAL_LINE" />);
    expect(html).toContain("Ngoại tộc");
  });
});
