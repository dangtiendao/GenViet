import React from "react";
import Link from "next/link";
import { GitFork, ArrowRight, Users, Shield, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PublicTreeListItem } from "../services/list-public-trees";

interface PublicTreesShowcaseProps {
  trees: PublicTreeListItem[];
}

export function PublicTreesShowcase({ trees }: PublicTreesShowcaseProps) {
  if (!trees || trees.length === 0) {
    return null;
  }

  return (
    <section
      id="gia-pha-cong-khai"
      className="border-t border-neutral-200/80 bg-gradient-to-b from-white via-emerald-50/30 to-white py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 shadow-2xs">
            <Users className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />
            <span>Khám phá không cần đăng nhập</span>
          </div>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl">
            Cây Gia Phả Tiêu Biểu Được Chia Sẻ Công Khai
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-neutral-600 sm:text-base">
            Tìm hiểu và tham quan phả hệ các dòng họ Việt Nam đang được lưu truyền trực quan trên
            GenViet.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trees.map((tree) => (
            <div
              key={tree.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-neutral-200/90 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 transition-colors group-hover:bg-emerald-700 group-hover:text-white">
                    <GitFork className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    <Shield className="h-3 w-3" aria-hidden="true" />
                    Công khai
                  </span>
                </div>

                <h3 className="mt-4 line-clamp-1 text-lg font-bold text-neutral-900 group-hover:text-emerald-800">
                  {tree.name}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-neutral-600 sm:text-sm">
                  {tree.description || "Cây gia phả được chia sẻ ở chế độ xem an toàn cho khách."}
                </p>
              </div>

              <div className="mt-6 border-t border-neutral-100 pt-4">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span className="flex items-center gap-1 font-medium text-neutral-700">
                    <Users className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                    {tree.personCount} thành viên
                  </span>
                  {tree.publishedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-neutral-400" aria-hidden="true" />
                      {new Date(tree.publishedAt).toLocaleDateString("vi-VN")}
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <Button
                    asChild
                    size="sm"
                    className="w-full bg-emerald-700 font-semibold text-white shadow-xs hover:bg-emerald-800"
                  >
                    <Link href={`/public/trees/${tree.slug}`}>
                      Xem cây gia phả
                      <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
