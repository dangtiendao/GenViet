import React from "react";
import Link from "next/link";
import { User, GitFork, CheckCircle2, AlertCircle, HelpCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchHighlight } from "./search-highlight";
import { ParentContext } from "./parent-context";
import { AvatarThumbnail } from "@/features/media/components/avatar-thumbnail";
import type { PersonSearchResultItem } from "../types/person-search.types";

export interface PersonSearchResultItemProps {
  person: PersonSearchResultItem;
  searchQuery?: string;
}

export function PersonSearchResultItemComponent({
  person,
  searchQuery,
}: PersonSearchResultItemProps) {
  const isDeceased = person.livingStatus === "deceased";
  const birthText = person.birthYear ? String(person.birthYear) : "?";
  const deathText = isDeceased ? (person.deathYear ? String(person.deathYear) : "Mất") : "";
  const lifespanText = isDeceased ? `${birthText} - ${deathText}` : `Sinh: ${birthText}`;

  const isMale = person.gender === "male";
  const isFemale = person.gender === "female";

  const isVerified = person.verificationStatus === "verified";
  const isDisputed = person.verificationStatus === "disputed";

  return (
    <div className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-2xs transition-all hover:border-emerald-300 hover:shadow-xs">
      <div className="space-y-3">
        {/* Header: Avatar + Name + Badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <AvatarThumbnail
              treeId={person.treeId}
              personId={person.id}
              fullName={person.fullName}
              avatarPath={person.avatarPath}
              gender={person.gender}
              isDeceased={isDeceased}
              size="md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-neutral-900">
                  <SearchHighlight text={person.fullName} query={searchQuery} />
                </span>

                {/* Verification badge */}
                {isVerified ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-label="Đã xác minh" />
                ) : isDisputed ? (
                  <AlertCircle
                    className="h-4 w-4 text-rose-600"
                    aria-label="Tranh chấp thông tin"
                  />
                ) : (
                  <HelpCircle className="h-4 w-4 text-amber-500" aria-label="Chưa xác minh" />
                )}
              </div>

              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                <span
                  className={`py-0.2 rounded px-1.5 font-medium ${
                    isMale
                      ? "bg-blue-50 text-blue-700"
                      : isFemale
                        ? "bg-rose-50 text-rose-700"
                        : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {isMale ? "Nam" : isFemale ? "Nữ" : "Khác"}
                </span>

                <span className="font-mono font-medium text-neutral-600">{lifespanText}</span>

                <span
                  className={`py-0.2 rounded px-1.5 text-[10px] font-medium ${
                    isDeceased
                      ? "bg-neutral-100 text-neutral-600"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {isDeceased ? "Đã mất" : "Còn sống"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quê quán */}
        {person.hometownText && (
          <div className="flex items-center text-xs text-neutral-600">
            <MapPin className="mr-1 h-3.5 w-3.5 shrink-0 text-neutral-400" aria-hidden="true" />
            <span className="truncate">{person.hometownText}</span>
          </div>
        )}

        {/* Parent Context để phân biệt người trùng tên */}
        <div className="rounded-lg bg-neutral-50 p-2.5">
          <ParentContext parents={person.parents} />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex items-center justify-end gap-2 border-t border-neutral-100 pt-3">
        <Button asChild variant="outline" size="sm" className="h-8 text-xs">
          <Link
            href={`/trees/${person.treeId}/people/${person.id}`}
            aria-label={`Xem hồ sơ của ${person.fullName}`}
          >
            <User className="mr-1.5 h-3.5 w-3.5 text-neutral-500" />
            Xem hồ sơ
          </Link>
        </Button>

        <Button
          asChild
          size="sm"
          className="h-8 bg-emerald-700 text-xs text-white hover:bg-emerald-800"
        >
          <Link
            href={`/trees/${person.treeId}/tree?centerPersonId=${person.id}`}
            aria-label={`Xem ${person.fullName} trên sơ đồ cây`}
          >
            <GitFork className="mr-1.5 h-3.5 w-3.5 text-white" />
            Xem trên cây
          </Link>
        </Button>
      </div>
    </div>
  );
}
