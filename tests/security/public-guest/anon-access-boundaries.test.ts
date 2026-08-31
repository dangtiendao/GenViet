import { describe, it, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

describe("P30-T28, P30-T29: Anon Database Boundaries & Migration Verification", () => {
  it("xác minh file migration P30 không cấp SELECT trực tiếp trên domain tables cho anon", () => {
    const migrationPath = path.resolve(
      process.cwd(),
      "supabase/migrations/20260831200000_p30_public_guest_view.sql"
    );
    expect(fs.existsSync(migrationPath)).toBe(true);

    const sqlContent = fs.readFileSync(migrationPath, "utf8");

    // Reaffirm anon table revokes
    expect(sqlContent).toContain("REVOKE ALL ON TABLE public.family_trees FROM anon;");
    expect(sqlContent).toContain("REVOKE ALL ON TABLE public.persons FROM anon;");
    expect(sqlContent).toContain(
      "REVOKE ALL ON TABLE public.parent_child_relationships FROM anon;"
    );
    expect(sqlContent).toContain("REVOKE ALL ON TABLE public.unions FROM anon;");
    expect(sqlContent).toContain("REVOKE ALL ON TABLE public.tree_memberships FROM anon;");

    // Verify publish & unpublish are revoked from anon
    expect(sqlContent).toContain("REVOKE EXECUTE ON FUNCTION public.publish_family_tree");
    expect(sqlContent).toContain("REVOKE EXECUTE ON FUNCTION public.unpublish_family_tree");

    // Verify only public read functions are granted to anon
    expect(sqlContent).toContain("GRANT EXECUTE ON FUNCTION public.get_public_tree_summary");
    expect(sqlContent).toContain("GRANT EXECUTE ON FUNCTION public.get_public_tree_graph_slice");
    expect(sqlContent).toContain("GRANT EXECUTE ON FUNCTION public.get_public_person_profile");
  });
});
