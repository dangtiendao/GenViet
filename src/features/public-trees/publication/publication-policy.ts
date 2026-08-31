import { isValidSlug, normalizeSlug } from "../contracts/tree-visibility";
import { PublicTreeError, PUBLIC_TREE_ERROR_CODES } from "../errors/public-tree.errors";

export interface PublishTreePolicyInput {
  treeId: string;
  slug: string;
  livingPersonPolicy?: "REDACTED" | "STRICT";
  searchEngineVisibility?: "NOINDEX" | "INDEX";
  expectedVersion?: number;
}

export function validatePublicationInput(input: PublishTreePolicyInput): {
  cleanSlug: string;
  livingPersonPolicy: "REDACTED" | "STRICT";
  searchEngineVisibility: "NOINDEX" | "INDEX";
} {
  if (!input.treeId) {
    throw new PublicTreeError(PUBLIC_TREE_ERROR_CODES.NOT_FOUND);
  }

  const cleanSlug = normalizeSlug(input.slug);
  if (!isValidSlug(cleanSlug)) {
    throw new PublicTreeError(PUBLIC_TREE_ERROR_CODES.SLUG_INVALID);
  }

  const livingPersonPolicy = input.livingPersonPolicy || "REDACTED";
  if (!["REDACTED", "STRICT"].includes(livingPersonPolicy)) {
    throw new PublicTreeError(PUBLIC_TREE_ERROR_CODES.VISIBILITY_INVALID);
  }

  const searchEngineVisibility = input.searchEngineVisibility || "NOINDEX";
  if (!["NOINDEX", "INDEX"].includes(searchEngineVisibility)) {
    throw new PublicTreeError(PUBLIC_TREE_ERROR_CODES.VISIBILITY_INVALID);
  }

  return { cleanSlug, livingPersonPolicy, searchEngineVisibility };
}
