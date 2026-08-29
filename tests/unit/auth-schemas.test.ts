import { describe, it, expect } from "vitest";
import {
  loginSchema,
  signUpSchema,
  forgotPasswordSchema,
  updatePasswordSchema,
  changePasswordSchema,
  updateDisplayNameSchema,
} from "@/features/auth/schemas";

describe("Auth Validation Schemas (P09-WP01 / Unit Tests)", () => {
  describe("loginSchema", () => {
    it("should accept valid email and password", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "secretpassword",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const result = loginSchema.safeParse({
        email: "not-an-email",
        password: "secretpassword",
      });
      expect(result.success).toBe(false);
    });

    it("should reject empty password", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("signUpSchema", () => {
    it("should accept valid sign up data with matching password", () => {
      const result = signUpSchema.safeParse({
        displayName: "Nguyen Van A",
        email: "test@example.com",
        password: "securepassword123",
        confirmPassword: "securepassword123",
      });
      expect(result.success).toBe(true);
    });

    it("should reject mismatched confirmPassword", () => {
      const result = signUpSchema.safeParse({
        displayName: "Nguyen Van A",
        email: "test@example.com",
        password: "securepassword123",
        confirmPassword: "differentpassword",
      });
      expect(result.success).toBe(false);
    });

    it("should reject password shorter than 6 characters", () => {
      const result = signUpSchema.safeParse({
        displayName: "Nguyen Van A",
        email: "test@example.com",
        password: "12345",
        confirmPassword: "12345",
      });
      expect(result.success).toBe(false);
    });

    it("should reject empty displayName", () => {
      const result = signUpSchema.safeParse({
        displayName: "   ",
        email: "test@example.com",
        password: "securepassword123",
        confirmPassword: "securepassword123",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("forgotPasswordSchema", () => {
    it("should accept valid email", () => {
      const result = forgotPasswordSchema.safeParse({
        email: "recovery@example.com",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const result = forgotPasswordSchema.safeParse({
        email: "invalid-email",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("updatePasswordSchema", () => {
    it("should accept matching passwords", () => {
      const result = updatePasswordSchema.safeParse({
        password: "newsecurepassword",
        confirmPassword: "newsecurepassword",
      });
      expect(result.success).toBe(true);
    });

    it("should reject mismatch", () => {
      const result = updatePasswordSchema.safeParse({
        password: "newsecurepassword",
        confirmPassword: "mismatchpassword",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("updateDisplayNameSchema", () => {
    it("should accept valid trimmed name", () => {
      const result = updateDisplayNameSchema.safeParse({
        displayName: "  Tran Van B  ",
      });
      expect(result.success).toBe(true);
    });

    it("should reject whitespace only name", () => {
      const result = updateDisplayNameSchema.safeParse({
        displayName: "   ",
      });
      expect(result.success).toBe(false);
    });
  });
});
