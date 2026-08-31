import "server-only";
import { createClient } from "@/lib/supabase/server";
import { PublicTreeError, PUBLIC_TREE_ERROR_CODES } from "../errors/public-tree.errors";
import { redactLivingPerson } from "../privacy/living-person-redaction";
import type { PublicGraphDto } from "../contracts/public-graph.dto";
import type { LivingPersonPolicy } from "../contracts/tree-visibility";

/**
 * Public Preview for Tree Owners (P30-T14)
 * Allows tree owners to preview exactly what unauthenticated guests will see,
 * using the real privacy projection without making the tree public.
 */
export async function getOwnerPublicPreview(
  treeId: string,
  policy: LivingPersonPolicy = "REDACTED"
): Promise<PublicGraphDto> {
  const supabase = await createClient();

  // 1. Verify owner access
  const { data: tree } = await supabase
    .from("family_trees")
    .select(
      "id, name, public_slug, publication_version, privacy_projection_version, generation_anchor_person_id"
    )
    .eq("id", treeId)
    .is("deleted_at", null)
    .maybeSingle();

  if (!tree) {
    throw new PublicTreeError(PUBLIC_TREE_ERROR_CODES.NOT_FOUND);
  }

  // 2. Fetch persons, relationships, and unions within the tree
  const [personsRes, relsRes, unionsRes, membersRes] = await Promise.all([
    supabase
      .from("persons")
      .select(
        "id, full_name, gender, living_status, birth_year, death_year, birth_is_estimated, death_is_estimated, public_visibility"
      )
      .eq("tree_id", treeId)
      .is("deleted_at", null)
      .neq("public_visibility", "PRIVATE"),
    supabase
      .from("parent_child_relationships")
      .select("id, parent_id, child_id, parent_role, relationship_kind, verification_status")
      .eq("tree_id", treeId)
      .is("deleted_at", null),
    supabase
      .from("unions")
      .select("id, status, verification_status")
      .eq("tree_id", treeId)
      .is("deleted_at", null),
    supabase
      .from("union_members")
      .select("union_id, person_id, member_role")
      .eq("tree_id", treeId)
      .is("deleted_at", null),
  ]);

  const rawPersons = personsRes.data || [];
  const validPersonIds = new Set(rawPersons.map((p) => p.id));

  // Apply living-person redaction to all persons
  const publicPersons = rawPersons.map((p) =>
    redactLivingPerson(
      {
        id: p.id,
        fullName: p.full_name,
        gender: p.gender as "male" | "female" | "other" | "unknown",
        livingStatus: p.living_status as "living" | "deceased" | "unknown",
        birthYear: p.birth_year,
        deathYear: p.death_year,
        birthIsEstimated: p.birth_is_estimated ?? false,
        deathIsEstimated: p.death_is_estimated ?? false,
        publicVisibility: p.public_visibility as
          "INHERIT_TREE" | "PRIVATE" | "PUBLIC_REDACTED" | "PUBLIC",
        isCenter: p.id === tree.generation_anchor_person_id,
      },
      policy
    )
  );

  // Filter relationships that connect valid public persons
  const publicRelationships = (relsRes.data || [])
    .filter((r) => validPersonIds.has(r.parent_id) && validPersonIds.has(r.child_id))
    .map((r) => ({
      id: r.id,
      parentId: r.parent_id,
      childId: r.child_id,
      parentRole: r.parent_role as "father" | "mother" | "unspecified",
      relationshipKind: r.relationship_kind as "biological" | "adoptive" | "step" | "foster",
      verificationStatus: r.verification_status as "unverified" | "verified" | "disputed",
    }));

  const publicUnions = (unionsRes.data || []).map((u) => ({
    id: u.id,
    status: u.status as "active" | "separated" | "divorced" | "widowed" | "former",
    verificationStatus: u.verification_status as "unverified" | "verified" | "disputed",
  }));

  const publicMembers = (membersRes.data || [])
    .filter((m) => validPersonIds.has(m.person_id))
    .map((m) => ({
      unionId: m.union_id,
      personId: m.person_id,
      memberRole: m.member_role as "spouse" | "partner" | "unspecified",
    }));

  return {
    schemaVersion: 1,
    tree: {
      id: tree.id,
      slug: tree.public_slug || "preview",
      name: tree.name,
      publicationVersion: tree.publication_version,
      privacyProjectionVersion: tree.privacy_projection_version,
    },
    centerPersonId: tree.generation_anchor_person_id || rawPersons[0]?.id || null,
    persons: publicPersons,
    parentChildRelationships: publicRelationships,
    unions: publicUnions,
    unionMembers: publicMembers,
    expansion: {},
    limits: {
      maxAncestorDepth: 5,
      maxDescendantDepth: 5,
      returnedPersonCount: publicPersons.length,
      traversalMode: "PATERNAL_LINE",
      truncated: false,
    },
  };
}
