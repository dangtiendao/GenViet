import { describe, it, expect } from "vitest";
import {
  generateInvitationToken,
  hashInvitationToken,
  isInvitationExpired,
} from "@/features/collaboration/invitations/invitation-token";

describe("P27-T02: Invitation Security & Token Hashing Tests", () => {
  it("sinh token ngẫu nhiên và mã băm SHA-256 chính xác", () => {
    const { rawToken, tokenHash, expiresAt } = generateInvitationToken(7);

    expect(rawToken).toBeDefined();
    expect(rawToken.length).toBe(64); // 32 bytes hex
    expect(tokenHash).toBe(hashInvitationToken(rawToken));
    expect(expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it("kiểm tra chính xác token hết hạn", () => {
    const pastDate = new Date(Date.now() - 10000);
    const futureDate = new Date(Date.now() + 10000);

    expect(isInvitationExpired(pastDate)).toBe(true);
    expect(isInvitationExpired(futureDate)).toBe(false);
  });
});
