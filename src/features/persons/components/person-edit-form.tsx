"use client";

import * as React from "react";
import Link from "next/link";
import { useActionState } from "react";
import { updatePersonAction } from "../actions/person.actions";
import { PersonFormFields, type PersonFormData } from "./person-form-fields";
import { DeletePersonDialog } from "./delete-person-dialog";
import { mapDatabaseToPartialDate } from "../utils/partial-date-mapper";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { AlertCircle, Trash2, Save, RotateCcw } from "lucide-react";
import type { Person } from "../types/person.types";

export function PersonEditForm({ person }: { person: Person }) {
  const [state, formAction, isPending] = useActionState(updatePersonAction, null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const [formData, setFormData] = React.useState<PersonFormData>({
    fullName: person.fullName,
    gender: person.gender,
    livingStatus: person.livingStatus,
    birthDateValue: mapDatabaseToPartialDate(
      person.birthDate,
      person.birthYear,
      person.birthDatePrecision,
      person.birthIsEstimated
    ),
    deathDateValue: mapDatabaseToPartialDate(
      person.deathDate,
      person.deathYear,
      person.deathDatePrecision,
      person.deathIsEstimated
    ),
    birthPlaceText: person.birthPlaceText || "",
    deathPlaceText: person.deathPlaceText || "",
    hometownText: person.hometownText || "",
    burialPlaceText: person.burialPlaceText || "",
    occupationText: person.occupationText || "",
    biography: person.biography || "",
    verificationStatus: person.verificationStatus,
  });

  React.useEffect(() => {
    if (state?.success) {
      toast.success("Đã cập nhật thông tin nhân vật thành công!");
    }
  }, [state]);

  const isConflict = state?.errorCode === "PERSON_VERSION_CONFLICT";

  return (
    <div className="max-w-2xl space-y-8">
      <form
        action={formAction}
        className="space-y-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs sm:p-8"
      >
        <input type="hidden" name="treeId" value={person.treeId} />
        <input type="hidden" name="personId" value={person.id} />
        <input type="hidden" name="expectedVersion" value={person.version} />

        {state?.error && (
          <div
            role="alert"
            className="flex items-center justify-between space-x-2 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-800 sm:text-sm"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
              <span>{state.error}</span>
            </div>

            {isConflict && (
              <Button
                type="button"
                variant="outline"
                onClick={() => window.location.reload()}
                className="shrink-0 bg-white text-xs text-red-700 hover:bg-red-50"
              >
                <RotateCcw className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                Tải lại dữ liệu mới nhất
              </Button>
            )}
          </div>
        )}

        <PersonFormFields
          data={formData}
          onChange={(updates) => setFormData((prev) => ({ ...prev, ...updates }))}
          disabled={isPending}
          showFullFields={true}
        />

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-6">
          <Button asChild variant="outline" disabled={isPending}>
            <Link href={`/trees/${person.treeId}/people/${person.id}`}>Quay lại</Link>
          </Button>

          <Button
            type="submit"
            loading={isPending}
            className="min-w-[130px] bg-emerald-700 text-white hover:bg-emerald-800"
          >
            <Save className="mr-1.5 h-4 w-4" aria-hidden="true" />
            {isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-200 bg-red-50/40 p-6 shadow-xs">
        <h2 className="mb-3 border-b border-red-200 pb-2.5 text-sm font-bold text-red-900">
          Vùng thao tác nguy hiểm
        </h2>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xs font-semibold text-neutral-900">Xóa nhân vật này</h3>
            <p className="mt-0.5 text-xs text-neutral-500">
              Hồ sơ sẽ được chuyển vào thùng rác. Các liên kết quan hệ gia đình vẫn được bảo toàn.
            </p>
          </div>

          <Button
            type="button"
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="shrink-0 bg-red-600 text-white hover:bg-red-700"
          >
            <Trash2 className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Xóa nhân vật
          </Button>
        </div>
      </div>

      <DeletePersonDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        treeId={person.treeId}
        personId={person.id}
        personName={person.fullName}
        version={person.version}
      />
    </div>
  );
}
