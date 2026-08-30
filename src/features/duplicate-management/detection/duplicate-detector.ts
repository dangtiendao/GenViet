import {
  PersonComparisonCandidate,
  calculateDuplicateScore,
  DuplicateScoreResult,
} from "./scoring-model";

export interface DuplicatePairCandidate {
  personA: PersonComparisonCandidate;
  personB: PersonComparisonCandidate;
  scoreResult: DuplicateScoreResult;
}

/**
 * Quét tìm các cặp hồ sơ có khả năng trùng trong cây gia phả (P27-T15)
 * Chỉ tạo ứng viên đề xuất, tuyệt đối không tự động gộp
 */
export function findDuplicateCandidates(
  persons: PersonComparisonCandidate[],
  minScoreThreshold: number = 40
): DuplicatePairCandidate[] {
  const candidates: DuplicatePairCandidate[] = [];

  for (let i = 0; i < persons.length; i++) {
    for (let j = i + 1; j < persons.length; j++) {
      const scoreResult = calculateDuplicateScore(persons[i], persons[j]);
      if (scoreResult.score >= minScoreThreshold) {
        candidates.push({
          personA: persons[i],
          personB: persons[j],
          scoreResult,
        });
      }
    }
  }

  // Sắp xếp theo điểm trùng lặp giảm dần
  return candidates.sort((a, b) => b.scoreResult.score - a.scoreResult.score);
}
