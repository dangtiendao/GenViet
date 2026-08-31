import * as React from "react";
import { User, Shield, Lock } from "lucide-react";
import type { PublicPersonDto } from "../contracts/public-person.dto";

interface PublicPersonCardProps {
  person: PublicPersonDto;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function PublicPersonCard({
  person,
  isSelected = false,
  onClick,
  className = "",
}: PublicPersonCardProps) {
  const isLiving = person.livingState === "LIVING" || person.livingState === "UNKNOWN";
  const isRedacted = person.visibility === "PUBLIC_REDACTED";

  const genderBg =
    person.gender === "male"
      ? "bg-blue-50/80 border-blue-200 text-blue-900"
      : person.gender === "female"
        ? "bg-rose-50/80 border-rose-200 text-rose-900"
        : "bg-neutral-50/80 border-neutral-200 text-neutral-900";

  const selectedRing = isSelected ? "ring-2 ring-emerald-600 ring-offset-1" : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex w-48 flex-col rounded-xl border p-3 text-left shadow-xs transition-all hover:shadow-md focus:outline-none ${genderBg} ${selectedRing} ${className}`}
    >
      <div className="flex items-center space-x-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/90 shadow-2xs">
          {isRedacted ? (
            <Shield className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          ) : (
            <User className="h-4 w-4 text-neutral-500" aria-hidden="true" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold text-neutral-900">{person.displayName}</p>

          <div className="mt-0.5 flex items-center text-[10px] text-neutral-500">
            {isLiving ? (
              <span className="flex items-center text-emerald-700">
                <Lock className="mr-0.5 h-2.5 w-2.5" aria-hidden="true" />
                {person.birthYear ? `Sinh ${person.birthYear}` : "Còn sống"}
              </span>
            ) : (
              <span>
                {person.birthYear || "?"} - {person.deathYear || "?"}
              </span>
            )}
          </div>
        </div>
      </div>

      {person.isCenter && (
        <span className="absolute -top-2 right-2 rounded-full bg-emerald-700 px-1.5 py-0.5 text-[9px] font-semibold text-white shadow-2xs">
          Mốc xem
        </span>
      )}
    </button>
  );
}
