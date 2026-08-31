import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublicPersonProfile } from "@/features/public-trees/services/get-public-person";
import { getPublicTreeSummary } from "@/features/public-trees/services/get-public-tree";
import { ArrowLeft, User, ShieldCheck, Calendar, GitFork, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PublicPersonPageProps {
  params: Promise<{ slug: string; publicPersonId: string }>;
}

export async function generateMetadata(props: PublicPersonPageProps): Promise<Metadata> {
  const { slug, publicPersonId } = await props.params;

  try {
    const person = await getPublicPersonProfile(slug, publicPersonId);
    return {
      title: `${person.displayName} | ${person.treeName}`,
      description: `Xem thông tin nhân vật ${person.displayName} trong cây gia phả ${person.treeName}.`,
      robots: {
        index: false,
        follow: false,
      },
    };
  } catch {
    return {
      title: "Nhân vật công khai | GenViet",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function PublicPersonPage(props: PublicPersonPageProps) {
  const { slug, publicPersonId } = await props.params;

  try {
    const person = await getPublicPersonProfile(slug, publicPersonId);
    const isLiving = person.livingState === "LIVING" || person.livingState === "UNKNOWN";

    return (
      <main className="min-h-screen bg-neutral-50 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <Link href={`/public/trees/${slug}`}>
            <Button variant="ghost" size="sm" className="text-xs text-neutral-600">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Quay lại cây gia phả
            </Button>
          </Link>

          {/* Profile Card */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 shadow-inner">
                <User className="h-8 w-8" />
              </div>

              <div>
                <h1 className="text-xl font-bold text-neutral-900">{person.displayName}</h1>
                <p className="mt-0.5 text-xs text-neutral-500 capitalize">
                  {person.gender === "male" ? "Nam" : person.gender === "female" ? "Nữ" : "Chưa rõ"}{" "}
                  • {isLiving ? "Còn sống" : "Đã mất"}
                </p>
              </div>
            </div>

            {isLiving && (
              <div className="mt-4 flex items-start space-x-2 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs text-emerald-900">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                <span>
                  Thông tin chi tiết (ngày sinh đầy đủ, nơi sinh, liên hệ) đã được ẩn để bảo vệ
                  quyền riêng tư cá nhân.
                </span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            {/* Dates */}
            <div>
              <h2 className="flex items-center text-xs font-bold tracking-wider text-neutral-500 uppercase">
                <Calendar className="mr-1.5 h-4 w-4" /> Năm sinh & Năm mất
              </h2>
              <div className="mt-2 space-y-1 rounded-lg bg-neutral-50 p-3 text-xs text-neutral-800">
                <p>
                  <span className="font-semibold text-neutral-600">Năm sinh:</span>{" "}
                  {person.birthYear ? `Năm ${person.birthYear}` : isLiving ? "Đã ẩn" : "Chưa rõ"}
                </p>
                {!isLiving && (
                  <p>
                    <span className="font-semibold text-neutral-600">Năm mất:</span>{" "}
                    {person.deathYear ? `Năm ${person.deathYear}` : "Chưa rõ"}
                  </p>
                )}
              </div>
            </div>

            {/* Parents */}
            <div>
              <h2 className="flex items-center text-xs font-bold tracking-wider text-neutral-500 uppercase">
                <GitFork className="mr-1.5 h-4 w-4" /> Cha Mẹ
              </h2>
              <div className="mt-2 space-y-2">
                {person.father && (
                  <Link href={`/public/trees/${slug}/person/${person.father.id}`}>
                    <div className="rounded-lg border border-neutral-200 p-3 text-xs font-medium text-neutral-900 hover:border-emerald-500">
                      Cha: {person.father.displayName}
                    </div>
                  </Link>
                )}
                {person.mother && (
                  <Link href={`/public/trees/${slug}/person/${person.mother.id}`}>
                    <div className="rounded-lg border border-neutral-200 p-3 text-xs font-medium text-neutral-900 hover:border-emerald-500">
                      Mẹ: {person.mother.displayName}
                    </div>
                  </Link>
                )}
              </div>
            </div>

            {/* Spouses */}
            {person.spouses && person.spouses.length > 0 && (
              <div>
                <h2 className="flex items-center text-xs font-bold tracking-wider text-neutral-500 uppercase">
                  <Heart className="mr-1.5 h-4 w-4 text-rose-500" /> Hôn phối
                </h2>
                <div className="mt-2 space-y-2">
                  {person.spouses.map((sp) => (
                    <Link key={sp.id} href={`/public/trees/${slug}/person/${sp.id}`}>
                      <div className="rounded-lg border border-neutral-200 p-3 text-xs font-medium text-neutral-900 hover:border-emerald-500">
                        {sp.displayName}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Children */}
            {person.children && person.children.length > 0 && (
              <div>
                <h2 className="flex items-center text-xs font-bold tracking-wider text-neutral-500 uppercase">
                  <User className="mr-1.5 h-4 w-4" /> Con cái ({person.children.length})
                </h2>
                <div className="mt-2 space-y-2">
                  {person.children.map((ch) => (
                    <Link key={ch.id} href={`/public/trees/${slug}/person/${ch.id}`}>
                      <div className="rounded-lg border border-neutral-200 p-3 text-xs font-medium text-neutral-900 hover:border-emerald-500">
                        {ch.displayName}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  } catch {
    notFound();
  }
}
