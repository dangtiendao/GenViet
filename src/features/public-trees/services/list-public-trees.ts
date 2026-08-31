import { createClient } from "@/lib/supabase/server";

export interface PublicTreeListItem {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  publishedAt: string | null;
  livingPersonPolicy: string;
  searchEngineVisibility: string;
  personCount: number;
}

/**
 * Lấy danh sách cây gia phả công khai cho trang chủ hoặc thư mục khám phá
 */
export async function listPublicTrees(limit = 12, offset = 0): Promise<PublicTreeListItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase.rpc as any)("list_public_trees", {
      p_limit: limit,
      p_offset: offset,
    });

    if (error || !data) {
      if (error) {
        console.error("[listPublicTrees] Supabase RPC Error:", error);
      }
      return [];
    }

    return data as unknown as PublicTreeListItem[];
  } catch (error) {
    console.error("[listPublicTrees] Exception loading public trees:", error);
    return [];
  }
}
