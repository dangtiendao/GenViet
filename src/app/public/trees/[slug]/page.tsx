import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicTreeSummary } from "@/features/public-trees/services/get-public-tree";
import { getPublicTreeGraph } from "@/features/public-trees/services/get-public-graph";
import { PublicTreeView } from "@/features/public-trees/components/public-tree-view";
import { getOptionalUser } from "@/lib/auth/optional-user";
import { createClient } from "@/lib/supabase/server";

interface PublicTreePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(props: PublicTreePageProps): Promise<Metadata> {
  const { slug } = await props.params;

  try {
    const tree = await getPublicTreeSummary(slug);
    const isIndexable = tree.searchEngineVisibility === "INDEX";

    return {
      title: `${tree.name} | GenViet Gia Phả`,
      description:
        tree.description || `Xem cây gia phả dòng họ ${tree.name} trên nền tảng GenViet.`,
      robots: {
        index: isIndexable,
        follow: isIndexable,
      },
      alternates: {
        canonical: `/public/trees/${slug}`,
      },
    };
  } catch {
    return {
      title: "Cây gia phả công khai | GenViet",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function PublicTreePage(props: PublicTreePageProps) {
  const { slug } = await props.params;

  try {
    // 1. Fetch public tree summary & initial graph slice
    const tree = await getPublicTreeSummary(slug);
    const { data: graph } = await getPublicTreeGraph({
      slug,
      ancestorDepth: 15,
      descendantDepth: 15,
      descendantTraversalMode: "PATERNAL_LINE",
    });

    // 2. Check if the current visitor has an authenticated session & membership
    const { user } = await getOptionalUser();
    let isMember = false;

    if (user) {
      const supabase = await createClient();
      const { data: memberData } = await supabase
        .from("tree_memberships")
        .select("id")
        .eq("tree_id", tree.id)
        .eq("user_id", user.id)
        .eq("status", "active")
        .is("deleted_at", null)
        .maybeSingle();

      isMember = Boolean(memberData);
    }

    return (
      <main className="h-screen w-screen overflow-hidden">
        <PublicTreeView
          initialGraph={graph}
          slug={slug}
          isLoggedIn={Boolean(user)}
          isMember={isMember}
        />
      </main>
    );
  } catch (error) {
    console.error("[PublicTreePage] Failed to render public tree page for slug:", slug, error);
    notFound();
  }
}
