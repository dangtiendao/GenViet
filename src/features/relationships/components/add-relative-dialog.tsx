"use client";

import { useState, useTransition } from "react";
import { UserPlus, Link2, Loader2 } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PartialDateInput, type PartialDateValue } from "@/components/forms/partial-date-input";
import { ExistingPersonSelector } from "./existing-person-selector";
import { RelationshipPreviewCard } from "./relationship-preview";
import {
  addNewParentAction,
  linkExistingParentAction,
  addNewChildAction,
  linkExistingChildAction,
  createUnionWithNewPersonAction,
  createUnionWithExistingPersonAction,
} from "../actions/relationship.actions";
import { buildRelationshipPreview } from "../utils/relationship-preview";
import type {
  RelationActionType,
  RelationshipKind,
  ParentRole,
  VerificationStatus,
  RelatedPersonCandidate,
} from "../types/relationship.types";
import { mapPartialDateToDatabase } from "@/features/persons/utils/partial-date-mapper";

export function AddRelativeDialog({
  isOpen,
  onClose,
  treeId,
  subjectPersonId,
  subjectPersonName,
  actionType,
}: {
  isOpen: boolean;
  onClose: () => void;
  treeId: string;
  subjectPersonId: string;
  subjectPersonName: string;
  actionType: RelationActionType;
}) {
  const [tab, setTab] = useState<"new" | "existing">("new");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "unknown">(
    actionType === "add_father" ? "male" : actionType === "add_mother" ? "female" : "unknown"
  );
  const [livingStatus, setLivingStatus] = useState<"living" | "deceased" | "unknown">("living");
  const [birthDateVal, setBirthDateVal] = useState<PartialDateValue>({
    precision: "unknown",
    year: null,
    month: null,
    day: null,
    isEstimated: false,
  });
  const [relationshipKind] = useState<RelationshipKind>(
    actionType === "add_adoptive_parent" ? "adoptive" : "biological"
  );
  const [verificationStatus] = useState<VerificationStatus>("unverified");

  const [selectedCandidate, setSelectedCandidate] = useState<RelatedPersonCandidate | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmWarnings, setConfirmWarnings] = useState(false);
  const [isPending, startTransition] = useTransition();

  const getParentRole = (): ParentRole => {
    if (actionType === "add_father" || actionType === "link_father") return "father";
    if (actionType === "add_mother" || actionType === "link_mother") return "mother";
    return "unspecified";
  };

  const getActionTitle = () => {
    switch (actionType) {
      case "add_father":
        return "Thêm Cha";
      case "add_mother":
        return "Thêm Mẹ";
      case "add_adoptive_parent":
        return "Thêm Cha/Mẹ Nuôi";
      case "add_spouse":
        return "Thêm Vợ/Chồng (Kết đôi)";
      case "add_child":
        return "Thêm Con";
      default:
        return "Thêm người thân";
    }
  };

  const targetName =
    tab === "new"
      ? fullName.trim() || "(Người mới)"
      : selectedCandidate?.fullName || "(Chọn nhân vật)";
  const preview = buildRelationshipPreview({
    subjectPersonName,
    relatedPersonName: targetName,
    actionType,
    relationshipKind,
    parentRole: getParentRole(),
    verificationStatus,
  });

  const handleSubmit = () => {
    setErrorMessage(null);
    startTransition(async () => {
      let res;
      const mappedBirth = mapPartialDateToDatabase(birthDateVal);

      if (
        actionType === "add_father" ||
        actionType === "add_mother" ||
        actionType === "add_adoptive_parent"
      ) {
        if (tab === "new") {
          res = await addNewParentAction({
            treeId,
            childId: subjectPersonId,
            fullName: fullName.trim(),
            gender,
            livingStatus,
            birthPrecision: mappedBirth.precision,
            birthDate: mappedBirth.date,
            birthYear: mappedBirth.year,
            birthIsEstimated: mappedBirth.isEstimated,
            parentRole: getParentRole(),
            relationshipKind,
            verificationStatus,
            confirmWarnings,
          });
        } else {
          if (!selectedCandidate) {
            setErrorMessage("Vui lòng chọn một nhân vật để liên kết.");
            return;
          }
          res = await linkExistingParentAction({
            treeId,
            parentId: selectedCandidate.id,
            childId: subjectPersonId,
            parentRole: getParentRole(),
            relationshipKind,
            verificationStatus,
            confirmWarnings,
          });
        }
      } else if (actionType === "add_child") {
        if (tab === "new") {
          res = await addNewChildAction({
            treeId,
            parentId: subjectPersonId,
            fullName: fullName.trim(),
            gender,
            livingStatus,
            birthPrecision: mappedBirth.precision,
            birthDate: mappedBirth.date,
            birthYear: mappedBirth.year,
            birthIsEstimated: mappedBirth.isEstimated,
            parentRole: getParentRole(),
            relationshipKind,
            verificationStatus,
            confirmWarnings,
          });
        } else {
          if (!selectedCandidate) {
            setErrorMessage("Vui lòng chọn một nhân vật để liên kết.");
            return;
          }
          res = await linkExistingChildAction({
            treeId,
            parentId: subjectPersonId,
            childId: selectedCandidate.id,
            parentRole: getParentRole(),
            relationshipKind,
            verificationStatus,
            confirmWarnings,
          });
        }
      } else if (actionType === "add_spouse") {
        if (tab === "new") {
          res = await createUnionWithNewPersonAction({
            treeId,
            subjectPersonId,
            fullName: fullName.trim(),
            gender,
            livingStatus,
            birthPrecision: mappedBirth.precision,
            birthDate: mappedBirth.date,
            birthYear: mappedBirth.year,
            birthIsEstimated: mappedBirth.isEstimated,
            confirmWarnings,
          });
        } else {
          if (!selectedCandidate) {
            setErrorMessage("Vui lòng chọn một nhân vật để kết đôi.");
            return;
          }
          res = await createUnionWithExistingPersonAction({
            treeId,
            person1Id: subjectPersonId,
            person2Id: selectedCandidate.id,
            confirmWarnings,
          });
        }
      }

      if (res?.success) {
        onClose();
      } else if (res?.isWarning) {
        setWarningMessage(res.message || "Cần xác nhận cảnh báo.");
        setConfirmWarnings(true);
      } else {
        setErrorMessage(res?.message || "Thao tác không thành công.");
      }
    });
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={getActionTitle()}
      description={`Thiết lập quan hệ cho nhân vật ${subjectPersonName}`}
    >
      <div className="space-y-4">
        {/* Tab Selector */}
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-neutral-100 p-1">
          <button
            type="button"
            onClick={() => {
              setTab("new");
              setErrorMessage(null);
            }}
            className={`flex items-center justify-center gap-2 rounded-md py-1.5 text-xs font-semibold transition-all ${
              tab === "new"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            Tạo người mới
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("existing");
              setErrorMessage(null);
            }}
            className={`flex items-center justify-center gap-2 rounded-md py-1.5 text-xs font-semibold transition-all ${
              tab === "existing"
                ? "bg-white text-neutral-900 shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Link2 className="h-3.5 w-3.5" />
            Chọn người có sẵn
          </button>
        </div>

        {tab === "new" ? (
          <div className="space-y-4 py-1">
            <div>
              <label htmlFor="rel-name" className="text-xs font-medium text-neutral-700">
                Họ và tên *
              </label>
              <Input
                id="rel-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn An"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-neutral-700">Giới tính</label>
                <Select
                  value={gender}
                  onChange={(e) =>
                    setGender(e.target.value as "male" | "female" | "other" | "unknown")
                  }
                  className="mt-1"
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                  <option value="unknown">Chưa rõ</option>
                </Select>
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-700">Trạng thái sống</label>
                <Select
                  value={livingStatus}
                  onChange={(e) =>
                    setLivingStatus(e.target.value as "living" | "deceased" | "unknown")
                  }
                  className="mt-1"
                >
                  <option value="living">Còn sống</option>
                  <option value="deceased">Đã mất</option>
                  <option value="unknown">Chưa rõ</option>
                </Select>
              </div>
            </div>

            <PartialDateInput
              label="Ngày / Năm sinh"
              value={birthDateVal}
              onChange={setBirthDateVal}
            />
          </div>
        ) : (
          <div className="py-1">
            <ExistingPersonSelector
              treeId={treeId}
              excludePersonId={subjectPersonId}
              selectedPersonId={selectedCandidate?.id}
              onSelectPerson={(c) => setSelectedCandidate(c)}
            />
          </div>
        )}

        <RelationshipPreviewCard
          preview={preview}
          warningMessage={warningMessage}
          errorMessage={errorMessage}
        />

        <div className="flex items-center justify-end gap-2 border-t border-neutral-100 pt-4">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isPending ||
              (tab === "new" && !fullName.trim()) ||
              (tab === "existing" && !selectedCandidate)
            }
            className="bg-emerald-700 hover:bg-emerald-800"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : confirmWarnings ? (
              "Xác nhận & Vẫn lưu"
            ) : (
              "Lưu quan hệ"
            )}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
