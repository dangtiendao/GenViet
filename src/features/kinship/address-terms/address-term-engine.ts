import { KinshipPathStep } from "../relationship-path/relationship-path-engine";

export interface AddressTermSuggestion {
  suggestedTerm: string;
  reverseTerm: string;
  confidence: "exact" | "probable" | "ambiguous";
  explanation: string;
}

/**
 * Gợi ý danh xưng xưng hô phả hệ tiếng Việt (Prototype Engine - P27-T14)
 */
export function suggestVietnameseAddressTerm(
  steps: KinshipPathStep[],
  options: {
    userGender?: "male" | "female" | "other";
    targetGender?: "male" | "female" | "other";
    isPaternalBranch?: boolean; // Bên Nội (true) hay Bên Ngoại (false)
    targetIsOlder?: boolean;
  } = {}
): AddressTermSuggestion {
  if (steps.length === 0) {
    return {
      suggestedTerm: "Tôi",
      reverseTerm: "Bạn",
      confidence: "exact",
      explanation: "Hai đối tượng là cùng một người",
    };
  }

  // Quan hệ 1 bước: Cha / Mẹ / Con / Vợ / Chồng
  if (steps.length === 1) {
    const step = steps[0];
    if (step.relationType === "parent") {
      const term = options.targetGender === "female" ? "Mẹ" : "Cha/Bố";
      return {
        suggestedTerm: term,
        reverseTerm: "Con",
        confidence: "exact",
        explanation: `${term} ruột`,
      };
    }
    if (step.relationType === "child") {
      return {
        suggestedTerm: "Con",
        reverseTerm: options.userGender === "female" ? "Mẹ" : "Cha",
        confidence: "exact",
        explanation: "Con ruột",
      };
    }
    if (step.relationType === "spouse") {
      const term = options.targetGender === "female" ? "Vợ" : "Chồng";
      return {
        suggestedTerm: term,
        reverseTerm: options.userGender === "female" ? "Vợ" : "Chồng",
        confidence: "exact",
        explanation: "Bạn đời / Hôn phối",
      };
    }
  }

  // Quan hệ 2 bước: Anh / Chị / Em hoặc Ông / Bà
  if (steps.length === 2) {
    if (steps[0].relationType === "parent" && steps[1].relationType === "child") {
      // Anh chị em ruột
      const term = options.targetIsOlder
        ? options.targetGender === "female"
          ? "Chị"
          : "Anh"
        : "Em";
      return {
        suggestedTerm: term,
        reverseTerm: options.targetIsOlder ? "Em" : options.userGender === "female" ? "Chị" : "Anh",
        confidence: "probable",
        explanation: "Anh / Chị / Em cùng cha mẹ",
      };
    }
    if (steps[0].relationType === "parent" && steps[1].relationType === "parent") {
      // Ông / Bà
      const branch = options.isPaternalBranch !== false ? "Nội" : "Ngoại";
      const term = options.targetGender === "female" ? `Bà ${branch}` : `Ông ${branch}`;
      return {
        suggestedTerm: term,
        reverseTerm: "Cháu",
        confidence: "probable",
        explanation: `Bậc Ông/Bà bên ${branch}`,
      };
    }
  }

  // Fallback trung tính cho quan hệ phức tạp
  return {
    suggestedTerm: "Họ hàng",
    reverseTerm: "Họ hàng",
    confidence: "ambiguous",
    explanation: "Quan hệ phả hệ đa tầng, cần thêm thông tin vai vế thứ tự trong dòng họ",
  };
}
