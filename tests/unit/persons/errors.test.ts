import { describe, it, expect } from "vitest";
import {
  PersonError,
  PERSON_ERROR_CODES,
  PERSON_ERROR_MESSAGES,
} from "@/features/persons/errors/person.errors";

describe("Person Error Taxonomy (P12)", () => {
  it("should have user-friendly message for all known error codes", () => {
    Object.values(PERSON_ERROR_CODES).forEach((code) => {
      const msg = PERSON_ERROR_MESSAGES[code];
      expect(msg).toBeDefined();
      expect(msg.length).toBeGreaterThan(5);
    });
  });

  it("should instantiate PersonError with standard message", () => {
    const err = new PersonError(PERSON_ERROR_CODES.NOT_FOUND);
    expect(err.code).toBe(PERSON_ERROR_CODES.NOT_FOUND);
    expect(err.message).toBe(PERSON_ERROR_MESSAGES[PERSON_ERROR_CODES.NOT_FOUND]);
    expect(err.isUserFacing).toBe(true);
  });

  it("should allow custom message in PersonError", () => {
    const custom = "Họ và tên chứa ký tự không hợp lệ";
    const err = new PersonError(PERSON_ERROR_CODES.NAME_INVALID, custom);
    expect(err.code).toBe(PERSON_ERROR_CODES.NAME_INVALID);
    expect(err.message).toBe(custom);
  });
});
