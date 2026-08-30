"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";

import { UserPlus, Link2, Loader2, Users, Heart, PlusCircle } from "lucide-react";
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
  addNewSiblingAction,
  linkExistingSiblingAction,
  getParentsForPersonAction,
  getSpousesForPersonAction,
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
  ParentWithDetails,
  SpouseWithDetails,
} from "../types/relationship.types";
import { mapPartialDateToDatabase } from "@/features/persons/utils/partial-date-mapper";

export function AddRelativeDialog({
  isOpen,
  onClose,
  treeId,
  subjectPersonId,
  subjectPersonName,
  actionType,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  treeId: string;
  subjectPersonId: string;
  subjectPersonName: string;
  actionType: RelationActionType;
  onSuccess?: () => void;
}) {
  const router = useRouter();
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

  // State hỗ trợ chọn Cha / Mẹ khi thêm Anh / Chị / Em
  const [siblingParents, setSiblingParents] = useState<ParentWithDetails[]>([]);
  const [selectedParentIds, setSelectedParentIds] = useState<string[]>([]);
  const [isLoadingParents, setIsLoadingParents] = useState(false);

  // State hỗ trợ chọn Mẹ / Cha (Phối ngẫu) khi thêm Con
  const [spouses, setSpouses] = useState<SpouseWithDetails[]>([]);
  const [selectedSpouseId, setSelectedSpouseId] = useState<string | null>(null);
  const [isLoadingSpouses, setIsLoadingSpouses] = useState(false);

  useEffect(() => {
    if (isOpen && actionType === "add_sibling") {
      setIsLoadingParents(true);
      getParentsForPersonAction(treeId, subjectPersonId).then((res) => {
        setIsLoadingParents(false);
        if (res.success && res.parents) {
          setSiblingParents(res.parents);
          setSelectedParentIds(res.parents.map((p) => p.parentId));
        }
      });
    } else if (isOpen && actionType === "add_child") {
      setIsLoadingSpouses(true);
      getSpousesForPersonAction(treeId, subjectPersonId).then((res) => {
        setIsLoadingSpouses(false);
        if (res.success && res.spouses) {
          setSpouses(res.spouses);
          if (res.spouses.length > 0) {
            setSelectedSpouseId(res.spouses[0].spouseId);
          } else {
            setSelectedSpouseId(null);
          }
        }
      });
    }
  }, [isOpen, actionType, treeId, subjectPersonId]);

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
        return "Thêm Cha / Mẹ Nuôi";
      case "add_spouse":
        return "Thêm Vợ / Chồng (Kết đôi)";
      case "add_child":
        return "Thêm Con";
      case "add_sibling":
        return "Thêm Anh / Chị / Em";
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
        const selectedSpouse = spouses.find((s) => s.spouseId === selectedSpouseId);
        const otherParentId = selectedSpouse ? selectedSpouse.spouseId : null;
        const otherParentRole: ParentRole = selectedSpouse
          ? selectedSpouse.gender === "female"
            ? "mother"
            : selectedSpouse.gender === "male"
              ? "father"
              : "unspecified"
          : "unspecified";

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
            otherParentId,
            otherParentRole,
            otherRelationshipKind: "biological",
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
            otherParentId,
            otherParentRole,
            otherRelationshipKind: "biological",
            confirmWarnings,
          });
        }
      } else if (actionType === "add_sibling") {
        if (tab === "new") {
          res = await addNewSiblingAction({
            treeId,
            siblingId: subjectPersonId,
            fullName: fullName.trim(),
            gender,
            livingStatus,
            birthPrecision: mappedBirth.precision,
            birthDate: mappedBirth.date,
            birthYear: mappedBirth.year,
            birthIsEstimated: mappedBirth.isEstimated,
            parentIds: selectedParentIds,
            relationshipKind,
            verificationStatus,
            confirmWarnings,
          });
        } else {
          if (!selectedCandidate) {
            setErrorMessage("Vui lòng chọn một nhân vật để liên kết.");
            return;
          }
          res = await linkExistingSiblingAction({
            treeId,
            siblingId: subjectPersonId,
            targetPersonId: selectedCandidate.id,
            parentIds: selectedParentIds,
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
        onSuccess?.();
        router.refresh();
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
      description={`Thiết lập quan hệ cho: ${subjectPersonName}`}
      size="3xl"
      footer={
        <>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="h-11 rounded-lg px-5 text-sm font-medium"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isPending ||
              (tab === "new" && !fullName.trim()) ||
              (tab === "existing" && !selectedCandidate)
            }
            className="h-11 rounded-lg bg-emerald-700 px-6 text-sm font-semibold text-white shadow-xs hover:bg-emerald-800"
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
        </>
      }
    >
      <div className="space-y-5">
        {/* Tab Selector */}
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-neutral-100 p-1.5">
          <button
            type="button"
            onClick={() => {
              setTab("new");
              setErrorMessage(null);
            }}
            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              tab === "new"
                ? "border border-neutral-200/50 bg-white text-emerald-800 shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <UserPlus className="h-4 w-4" />
            Tạo người mới
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("existing");
              setErrorMessage(null);
            }}
            className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              tab === "existing"
                ? "border border-neutral-200/50 bg-white text-emerald-800 shadow-xs"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Link2 className="h-4 w-4" />
            Chọn người có sẵn trong cây
          </button>
        </div>

        {tab === "new" ? (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="rel-name"
                className="mb-1.5 block text-sm font-semibold text-neutral-800"
              >
                Họ và tên <span className="text-rose-500">*</span>
              </label>
              <Input
                id="rel-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ví dụ: Nguyễn Văn An"
                className="h-11 rounded-lg text-sm"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-neutral-800">
                  Giới tính
                </label>
                <Select
                  value={gender}
                  onChange={(e) =>
                    setGender(e.target.value as "male" | "female" | "other" | "unknown")
                  }
                  className="h-11 rounded-lg text-sm"
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                  <option value="unknown">Chưa rõ</option>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-neutral-800">
                  Trạng thái sống
                </label>
                <Select
                  value={livingStatus}
                  onChange={(e) =>
                    setLivingStatus(e.target.value as "living" | "deceased" | "unknown")
                  }
                  className="h-11 rounded-lg text-sm"
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

        {/* Khối lựa chọn Cha / Mẹ chung khi Thêm Anh / Chị / Em */}
        {actionType === "add_sibling" && (
          <div className="space-y-2.5 rounded-xl border border-neutral-200 bg-neutral-50/80 p-3.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-neutral-800 uppercase">
                <Users className="h-3.5 w-3.5 text-indigo-600" />
                Cha / Mẹ chung của anh chị em
              </label>
              <span className="text-[11px] text-neutral-500">Tự động liên kết khi lưu</span>
            </div>

            {isLoadingParents ? (
              <div className="flex items-center gap-2 py-2 text-xs text-neutral-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Đang kiểm tra thông tin cha mẹ...</span>
              </div>
            ) : siblingParents.length === 0 ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">
                «{subjectPersonName}» hiện chưa có thông tin Cha/Mẹ trong cây gia phả. Nhân vật này
                sẽ được tạo độc lập và bạn có thể gán cha mẹ sau.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {siblingParents.map((parent) => {
                  const isChecked = selectedParentIds.includes(parent.parentId);
                  const roleTitle =
                    parent.parentRole === "father"
                      ? "Cha"
                      : parent.parentRole === "mother"
                        ? "Mẹ"
                        : "Cha/Mẹ";
                  return (
                    <label
                      key={parent.parentId}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-lg border p-2.5 text-xs font-medium transition-all ${
                        isChecked
                          ? "border-indigo-300 bg-indigo-50/60 font-semibold text-indigo-950"
                          : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedParentIds([...selectedParentIds, parent.parentId]);
                          } else {
                            setSelectedParentIds(
                              selectedParentIds.filter((id) => id !== parent.parentId)
                            );
                          }
                        }}
                        className="h-4 w-4 rounded border-neutral-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div className="flex flex-col">
                        <span>{parent.parentName}</span>
                        <span className="text-[10px] font-normal text-neutral-500">
                          ({roleTitle} của {subjectPersonName})
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Khối lựa chọn Mẹ / Cha của con (Người phối ngẫu) khi Thêm Con */}
        {actionType === "add_child" && (
          <div className="space-y-2.5 rounded-xl border border-neutral-200 bg-neutral-50/80 p-3.5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-bold tracking-wide text-neutral-800 uppercase">
                <Heart className="h-3.5 w-3.5 text-rose-600" />
                Mẹ / Cha của con (Người phối ngẫu)
              </label>
              <span className="text-[11px] text-neutral-500">Tự động liên kết khi lưu</span>
            </div>

            {isLoadingSpouses ? (
              <div className="flex items-center gap-2 py-2 text-xs text-neutral-500">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Đang kiểm tra thông tin vợ/chồng...</span>
              </div>
            ) : spouses.length === 0 ? (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">
                «{subjectPersonName}» hiện chưa có thông tin Vợ/Chồng trong cây gia phả. Người con
                sẽ được tạo với 1 người cha/mẹ và bạn có thể gán thêm người kia sau.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {spouses.map((spouse) => {
                  const isChecked = selectedSpouseId === spouse.spouseId;
                  const roleTitle =
                    spouse.gender === "female" ? "Mẹ" : spouse.gender === "male" ? "Cha" : "Cha/Mẹ";
                  return (
                    <label
                      key={spouse.spouseId}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-lg border p-2.5 text-xs font-medium transition-all ${
                        isChecked
                          ? "border-rose-300 bg-rose-50/60 font-semibold text-rose-950 shadow-xs"
                          : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSpouseId(spouse.spouseId);
                          } else {
                            setSelectedSpouseId(null);
                          }
                        }}
                        className="h-4 w-4 rounded border-neutral-300 text-rose-600 focus:ring-rose-500"
                      />
                      <div className="flex flex-col">
                        <span>{spouse.spouseName}</span>
                        <span className="text-[10px] font-normal text-neutral-500">
                          (Đồng thời làm {roleTitle} của người con này)
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <RelationshipPreviewCard
          preview={preview}
          warningMessage={warningMessage}
          errorMessage={errorMessage}
        />
      </div>
    </Dialog>
  );
}
