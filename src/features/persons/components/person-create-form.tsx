"use client";

import * as React from "react";
import Link from "next/link";
import { useActionState } from "react";
import { createFullPersonAction, checkSimilarPersonsAction } from "../actions/person.actions";
import { PersonFormFields, type PersonFormData } from "./person-form-fields";
import { SimilarPersonWarningDialog } from "./similar-person-warning";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronDown, ChevronUp, UserPlus } from "lucide-react";
import type { SimilarPersonCandidate } from "../types/person.types";

export function PersonCreateForm({ treeId }: { treeId: string }) {
  const [state, formAction, isPending] = useActionState(createFullPersonAction, null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const [formData, setFormData] = React.useState<PersonFormData>({
    fullName: "",
    gender: "unknown",
    livingStatus: "unknown",
    birthDateValue: {
      precision: "unknown",
      year: null,
      month: null,
      day: null,
      isEstimated: false,
    },
    deathDateValue: {
      precision: "unknown",
      year: null,
      month: null,
      day: null,
      isEstimated: false,
    },
    birthPlaceText: "",
    deathPlaceText: "",
    hometownText: "",
    burialPlaceText: "",
    occupationText: "",
    biography: "",
    verificationStatus: "unverified",
  });

  const [showFullFields, setShowFullFields] = React.useState(false);
  const [confirmSimilar, setConfirmSimilar] = React.useState(false);
  const [warningCandidates, setWarningCandidates] = React.useState<SimilarPersonCandidate[]>([]);
  const [isWarningOpen, setIsWarningOpen] = React.useState(false);

  // Xử lý khi server trả về cảnh báo hồ sơ tương tự
  React.useEffect(() => {
    if (state?.warning && state.warning.candidates.length > 0) {
      setWarningCandidates(state.warning.candidates);
      setIsWarningOpen(true);
    }
  }, [state]);

  // Debounced check khi người dùng nhập họ tên
  React.useEffect(() => {
    const trimmed = formData.fullName.trim();
    if (trimmed.length < 2) return;

    const timer = setTimeout(async () => {
      const birthYear =
        formData.birthDateValue.precision === "year" && formData.birthDateValue.year
          ? formData.birthDateValue.year
          : null;
      const candidates = await checkSimilarPersonsAction(treeId, trimmed, birthYear);
      if (candidates.length > 0) {
        setWarningCandidates(candidates);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [formData.fullName, formData.birthDateValue, treeId]);

  const handleConfirmedSubmit = () => {
    setIsWarningOpen(false);
    setConfirmSimilar(true);
    // Request submit với confirmSimilar = true
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    }, 50);
  };

  return (
    <>
      <form
        ref={formRef}
        action={formAction}
        className="max-w-2xl space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs sm:p-8"
      >
        <input type="hidden" name="treeId" value={treeId} />
        <input type="hidden" name="confirmSimilar" value={String(confirmSimilar)} />

        {state?.error && (
          <div
            role="alert"
            className="flex items-center space-x-2 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-800 sm:text-sm"
          >
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
            <span>{state.error}</span>
          </div>
        )}

        <PersonFormFields
          data={formData}
          onChange={(updates) => setFormData((prev) => ({ ...prev, ...updates }))}
          disabled={isPending}
          showFullFields={showFullFields}
        />

        {/* Nút bật/tắt nhập thông tin chi tiết */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowFullFields(!showFullFields)}
            className="inline-flex items-center rounded p-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
          >
            {showFullFields ? (
              <>
                <ChevronUp className="mr-1 h-4 w-4" aria-hidden="true" />
                Thu gọn bớt thông tin tùy chọn
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 h-4 w-4" aria-hidden="true" />
                Nhập thêm thông tin quê quán, nghề nghiệp, tiểu sử
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-neutral-100 pt-6">
          <Button asChild variant="outline" disabled={isPending}>
            <Link href={`/trees/${treeId}/people`}>Hủy bỏ</Link>
          </Button>

          <Button
            type="submit"
            loading={isPending}
            className="min-w-[130px] bg-emerald-700 text-white hover:bg-emerald-800"
          >
            <UserPlus className="mr-1.5 h-4 w-4" aria-hidden="true" />
            {isPending ? "Đang lưu..." : "Thêm nhân vật"}
          </Button>
        </div>
      </form>

      <SimilarPersonWarningDialog
        isOpen={isWarningOpen}
        onClose={() => setIsWarningOpen(false)}
        onConfirm={handleConfirmedSubmit}
        candidates={warningCandidates}
        isPending={isPending}
      />
    </>
  );
}
