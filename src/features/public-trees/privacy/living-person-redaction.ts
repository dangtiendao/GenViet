import type { LivingPersonPolicy } from "../contracts/tree-visibility";
import type { PublicPersonDto } from "../contracts/public-person.dto";

export interface RawPersonEntity {
  id: string;
  fullName: string;
  gender: "male" | "female" | "other" | "unknown";
  livingStatus: "living" | "deceased" | "unknown";
  birthDate?: string | null;
  birthYear?: number | null;
  deathDate?: string | null;
  deathYear?: number | null;
  birthIsEstimated?: boolean;
  deathIsEstimated?: boolean;
  publicVisibility?: "INHERIT_TREE" | "PRIVATE" | "PUBLIC_REDACTED" | "PUBLIC";
  isCenter?: boolean;
}

/**
 * Server-side living-person redaction utility (P30-T03, P30-T20).
 * Enforces conservative allowlisting:
 * - Living persons have full dates, contact info, biographies, places redacted.
 * - Unknown living status is treated conservatively as LIVING.
 * - Strict policy hides full names and birth years for living persons.
 */
export function redactLivingPerson(
  raw: RawPersonEntity,
  policy: LivingPersonPolicy = "REDACTED"
): PublicPersonDto {
  const isLivingOrUnknown = raw.livingStatus === "living" || raw.livingStatus === "unknown";
  const isStrict = policy === "STRICT";

  let displayName = raw.fullName;
  if (isLivingOrUnknown) {
    if (isStrict) {
      displayName = "Thành viên gia đình";
    } else {
      displayName = raw.fullName || "Hậu duệ";
    }
  }

  let birthYear: number | null = raw.birthYear ?? null;
  if (isLivingOrUnknown && isStrict) {
    birthYear = null;
  }

  const deathYear: number | null = raw.livingStatus === "deceased" ? (raw.deathYear ?? null) : null;
  const isEstimated =
    raw.livingStatus === "deceased" ? Boolean(raw.birthIsEstimated || raw.deathIsEstimated) : false;

  const visibility =
    isLivingOrUnknown || raw.publicVisibility === "PUBLIC_REDACTED" ? "PUBLIC_REDACTED" : "PUBLIC";

  return {
    id: raw.id,
    displayName,
    gender: raw.gender,
    livingState: raw.livingStatus.toUpperCase() as "LIVING" | "DECEASED" | "UNKNOWN",
    birthYear,
    deathYear,
    isEstimated,
    isCenter: Boolean(raw.isCenter),
    publicThumbnail: null, // Conservative: avatars for living persons are not public by default
    visibility,
  };
}
