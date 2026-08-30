export interface PersonComparisonCandidate {
  id: string;
  fullName: string;
  gender?: string;
  birthDate?: string;
  fatherName?: string;
  motherName?: string;
  spouseName?: string;
}

export interface DuplicateScoreResult {
  score: number; // 0 - 100
  reasons: string[];
  classification: "likely" | "possible" | "unlikely";
}

/**
 * Tính điểm trùng lặp giải thích được (P27-T15)
 */
export function calculateDuplicateScore(
  personA: PersonComparisonCandidate,
  personB: PersonComparisonCandidate
): DuplicateScoreResult {
  if (personA.id === personB.id) {
    return { score: 100, reasons: ["Cùng một ID"], classification: "likely" };
  }

  let score = 0;
  const reasons: string[] = [];

  // 1. Tên trùng nhau (40 điểm)
  if (personA.fullName.trim().toLowerCase() === personB.fullName.trim().toLowerCase()) {
    score += 40;
    reasons.push("Họ tên trùng khớp hoàn toàn");
  }

  // 2. Giới tính trùng nhau (10 điểm)
  if (personA.gender && personB.gender && personA.gender === personB.gender) {
    score += 10;
    reasons.push("Giới tính trùng khớp");
  }

  // 3. Ngày sinh trùng nhau (25 điểm)
  if (personA.birthDate && personB.birthDate && personA.birthDate === personB.birthDate) {
    score += 25;
    reasons.push("Ngày/năm sinh trùng khớp");
  }

  // 4. Cha/Mẹ trùng nhau (25 điểm)
  if (
    personA.fatherName &&
    personB.fatherName &&
    personA.fatherName.trim().toLowerCase() === personB.fatherName.trim().toLowerCase()
  ) {
    score += 25;
    reasons.push("Tên cha trùng khớp");
  }

  let classification: "likely" | "possible" | "unlikely" = "unlikely";
  if (score >= 75) classification = "likely";
  else if (score >= 40) classification = "possible";

  return { score, reasons, classification };
}
