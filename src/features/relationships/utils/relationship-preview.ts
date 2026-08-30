import type {
  RelationActionType,
  RelationshipKind,
  ParentRole,
  VerificationStatus,
  RelationshipPreviewData,
} from "../types/relationship.types";

export function getRelationshipKindLabel(kind: RelationshipKind): string {
  switch (kind) {
    case "biological":
      return "ruột";
    case "adoptive":
      return "nuôi";
    case "step":
      return "kế";
    case "foster":
      return "đỡ đầu";
    default:
      return "";
  }
}

export function getParentRoleLabel(role: ParentRole): string {
  switch (role) {
    case "father":
      return "cha";
    case "mother":
      return "mẹ";
    default:
      return "cha/mẹ";
  }
}

export function getVerificationStatusBadge(status: VerificationStatus): {
  label: string;
  variant: "default" | "secondary" | "outline" | "destructive";
} {
  switch (status) {
    case "verified":
      return { label: "Đã xác minh", variant: "default" };
    case "disputed":
      return { label: "Có tranh chấp", variant: "destructive" };
    case "unverified":
    default:
      return { label: "Chưa xác minh", variant: "outline" };
  }
}

export function buildRelationshipPreview(params: {
  subjectPersonName: string;
  relatedPersonName: string;
  actionType: RelationActionType;
  relationshipKind?: RelationshipKind;
  parentRole?: ParentRole;
  verificationStatus?: VerificationStatus;
}): RelationshipPreviewData {
  const kind = params.relationshipKind || "biological";
  const role = params.parentRole || "unspecified";
  const verification = params.verificationStatus || "unverified";
  const kindLabel = getRelationshipKindLabel(kind);

  let summaryText = "";

  switch (params.actionType) {
    case "add_father":
    case "link_father":
      summaryText = `«${params.relatedPersonName}» sẽ được liên kết là Cha ${kindLabel} của «${params.subjectPersonName}».`;
      break;
    case "add_mother":
    case "link_mother":
      summaryText = `«${params.relatedPersonName}» sẽ được liên kết là Mẹ ${kindLabel} của «${params.subjectPersonName}».`;
      break;
    case "add_adoptive_parent":
    case "link_adoptive_parent":
      summaryText = `«${params.relatedPersonName}» sẽ được liên kết là Cha/Mẹ nuôi của «${params.subjectPersonName}».`;
      break;
    case "add_spouse":
    case "link_spouse":
      summaryText = `«${params.relatedPersonName}» sẽ được kết đôi (Hôn nhân) với «${params.subjectPersonName}».`;
      break;
    case "add_child":
    case "link_child":
      summaryText = `«${params.relatedPersonName}» sẽ được liên kết là Con của «${params.subjectPersonName}».`;
      break;
    case "add_sibling":
    case "link_sibling":
      summaryText = `«${params.relatedPersonName}» sẽ được liên kết là Anh/Chị/Em với «${params.subjectPersonName}».`;
      break;
    default:
      summaryText = `Thiết lập quan hệ giữa «${params.subjectPersonName}» và «${params.relatedPersonName}».`;
  }

  return {
    subjectPersonName: params.subjectPersonName,
    relatedPersonName: params.relatedPersonName,
    actionType: params.actionType,
    relationshipKind: kind,
    parentRole: role,
    verificationStatus: verification,
    summaryText,
    isBlocking: false,
  };
}
