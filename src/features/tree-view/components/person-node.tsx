import React, { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { CheckCircle2, AlertCircle, HelpCircle, Crown, ChevronDown, ChevronUp } from "lucide-react";
import type { ReactFlowPersonNode } from "../types/tree-presentation.types";
import { TREE_LAYOUT_CONFIG } from "../config/tree-layout.config";
import { RelationshipActionMenu } from "@/features/relationships/components/relationship-action-menu";
import { AvatarThumbnail } from "@/features/media/components/avatar-thumbnail";

export const PersonNode = memo(
  function PersonNode({ data, selected }: NodeProps<ReactFlowPersonNode>) {
    const {
      person,
      isCenter,
      isSelected,
      expansion,
      isCollapsed = false,
      childCount = 0,
      treeId,
      canWrite = false,
      onSelect,
      onExpandAncestors,
      onExpandDescendants,
      onToggleCollapse,
    } = data;

    const isDeceased = person.livingStatus === "deceased";

    // Trích xuất hiển thị ngày/năm sinh chuẩn xác
    let birthText: string | null = null;
    if (person.birthDate) {
      const parts = person.birthDate.split("-");
      if (parts.length === 3) {
        birthText = `${parseInt(parts[2], 10)}/${parseInt(parts[1], 10)}/${parts[0]}`;
      } else {
        birthText = person.birthDate;
      }
    } else if (person.birthYear) {
      birthText = String(person.birthYear);
    }
    if (person.birthIsEstimated && birthText) {
      birthText = `~${birthText}`;
    }

    // Trích xuất hiển thị ngày/năm mất chuẩn xác
    let deathText: string | null = null;
    if (isDeceased) {
      if (person.deathDate) {
        const parts = person.deathDate.split("-");
        if (parts.length === 3) {
          deathText = `${parseInt(parts[2], 10)}/${parseInt(parts[1], 10)}/${parts[0]}`;
        } else {
          deathText = person.deathDate;
        }
      } else if (person.deathYear) {
        deathText = String(person.deathYear);
      }
      if (person.deathIsEstimated && deathText) {
        deathText = `~${deathText}`;
      }
    }

    // Ghép chuỗi vòng đời (Sinh - Mất)
    let lifespanText = "Chưa rõ năm sinh";
    if (birthText && deathText) {
      lifespanText = `${birthText} - ${deathText}`;
    } else if (birthText) {
      lifespanText = isDeceased ? `${birthText} - ?` : `Sinh ${birthText}`;
    } else if (deathText) {
      lifespanText = `? - ${deathText}`;
    } else if (isDeceased) {
      lifespanText = "Đã mất";
    }

    const isVerified = person.verificationStatus === "verified";
    const isDisputed = person.verificationStatus === "disputed";

    return (
      <div
        tabIndex={0}
        role="button"
        aria-label={`Thành viên: ${person.fullName || "Chưa đặt tên"}`}
        style={{
          width: TREE_LAYOUT_CONFIG.PERSON_NODE_WIDTH,
          minHeight: TREE_LAYOUT_CONFIG.PERSON_NODE_HEIGHT,
        }}
        onClick={() => onSelect?.(person.id)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect?.(person.id);
          }
        }}
        className={`group relative flex flex-col justify-between rounded-xl border bg-white p-3 text-left shadow-xs transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden ${
          isCenter
            ? "border-amber-400 shadow-sm ring-2 ring-amber-400/40"
            : isSelected || selected
              ? "border-emerald-600 shadow-md ring-2 ring-emerald-600/30"
              : "border-neutral-200 hover:border-neutral-300 hover:shadow-md"
        } ${isDeceased ? "bg-neutral-50/70" : "bg-white"}`}
      >
        {/* 4 Handles cho định tuyến layout */}
        <Handle
          type="target"
          position={Position.Top}
          id={`${person.id}-north`}
          className="!h-1 !w-1 !opacity-0"
          isConnectable={false}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id={`${person.id}-south`}
          className="!h-1 !w-1 !opacity-0"
          isConnectable={false}
        />
        <Handle
          type="target"
          position={Position.Left}
          id={`${person.id}-west`}
          className="!h-1 !w-1 !opacity-0"
          isConnectable={false}
        />
        <Handle
          type="source"
          position={Position.Right}
          id={`${person.id}-east`}
          className="!h-1 !w-1 !opacity-0"
          isConnectable={false}
        />

        {/* Nút mở rộng tổ tiên phía trên */}
        {expansion?.hasMoreAncestors && (
          <button
            type="button"
            aria-label={`Tải thêm tổ tiên của ${person.fullName}`}
            onClick={(e) => {
              e.stopPropagation();
              onExpandAncestors?.(person.id);
            }}
            className="absolute -top-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border border-emerald-600 bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white shadow-md transition-transform hover:scale-105 hover:bg-emerald-700"
            title="Tải thêm đời tổ tiên phía trên"
          >
            <ChevronUp className="h-3 w-3" aria-hidden="true" />
            <span>+ Đời trước</span>
          </button>
        )}

        {/* Thông tin phần đầu: Avatar + Tên + Action Menu */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <AvatarThumbnail
              treeId={treeId}
              personId={person.id}
              fullName={person.fullName || "Thành viên"}
              avatarPath={person.avatarPath}
              gender={person.gender}
              isDeceased={isDeceased}
              size="md"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span
                  className="truncate text-sm font-bold text-neutral-900"
                  title={person.fullName || "Chưa đặt tên"}
                >
                  {person.fullName || "Chưa đặt tên"}
                </span>
                {isCenter && (
                  <Crown
                    className="h-4 w-4 shrink-0 text-amber-500"
                    aria-label="Nhân vật trung tâm"
                  />
                )}
              </div>
              <p className="truncate font-mono text-xs text-neutral-600">{lifespanText}</p>
            </div>
          </div>

          {canWrite && (
            <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
              <RelationshipActionMenu
                treeId={treeId}
                personId={person.id}
                personName={person.fullName || "Thành viên"}
                canWrite={canWrite}
                variant="icon"
                onSuccess={data.onRefresh}
              />
            </div>
          )}
        </div>

        {/* Thông tin phần chân: Badges trạng thái */}
        <div className="flex items-center justify-between border-t border-neutral-100 pt-1.5 text-[11px]">
          <div className="flex items-center gap-1">
            {isVerified ? (
              <span className="inline-flex items-center font-medium text-emerald-700">
                <CheckCircle2 className="mr-0.5 h-3.5 w-3.5" /> Xác thực
              </span>
            ) : isDisputed ? (
              <span className="inline-flex items-center font-medium text-rose-600">
                <AlertCircle className="mr-0.5 h-3.5 w-3.5" /> Tranh chấp
              </span>
            ) : (
              <span className="inline-flex items-center font-medium text-amber-600">
                <HelpCircle className="mr-0.5 h-3.5 w-3.5" /> Chưa xác thực
              </span>
            )}
          </div>

          <span
            className={`rounded px-2 py-0.5 font-medium ${
              isDeceased ? "bg-neutral-100 text-neutral-600" : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {isDeceased ? "Đã mất" : "Còn sống"}
          </span>
        </div>

        {/* Nút Thu gọn / Mở rộng nhánh con */}
        {childCount > 0 && (
          <button
            type="button"
            aria-label={
              isCollapsed
                ? `Hiện lại nhánh con của ${person.fullName}`
                : `Thu gọn nhánh con của ${person.fullName}`
            }
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapse?.(person.id);
            }}
            className={`absolute -bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium shadow-md transition-all hover:scale-105 ${
              isCollapsed
                ? "border-amber-500 bg-amber-500 text-white hover:bg-amber-600"
                : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
            }`}
            title={
              isCollapsed ? `Hiện lại ${childCount} người con` : `Ẩn tạm ${childCount} người con`
            }
          >
            {isCollapsed ? (
              <>
                <ChevronDown className="h-3 w-3" aria-hidden="true" />
                <span>+{childCount} con</span>
              </>
            ) : (
              <>
                <ChevronUp className="h-3 w-3" aria-hidden="true" />
                <span>{childCount} con</span>
              </>
            )}
          </button>
        )}

        {/* Nút tải thêm con cháu từ DB nếu người này chưa có con nào trong slice */}
        {expansion?.hasMoreDescendants && childCount === 0 && (
          <button
            type="button"
            aria-label={`Tải thêm con cháu của ${person.fullName}`}
            onClick={(e) => {
              e.stopPropagation();
              onExpandDescendants?.(person.id);
            }}
            className="absolute -bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border border-emerald-600 bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white shadow-md transition-transform hover:scale-105 hover:bg-emerald-700"
            title="Tải thêm đời con cháu phía dưới"
          >
            <ChevronDown className="h-3 w-3" aria-hidden="true" />
            <span>+ Đời sau</span>
          </button>
        )}
      </div>
    );
  },
  (prev, next) => {
    return (
      prev.selected === next.selected &&
      prev.data.isSelected === next.data.isSelected &&
      prev.data.isCenter === next.data.isCenter &&
      prev.data.canWrite === next.data.canWrite &&
      prev.data.treeId === next.data.treeId &&
      prev.data.isCollapsed === next.data.isCollapsed &&
      prev.data.childCount === next.data.childCount &&
      prev.data.person.id === next.data.person.id &&
      prev.data.person.fullName === next.data.person.fullName &&
      prev.data.person.livingStatus === next.data.person.livingStatus &&
      prev.data.person.birthDate === next.data.person.birthDate &&
      prev.data.person.birthYear === next.data.person.birthYear &&
      prev.data.person.deathDate === next.data.person.deathDate &&
      prev.data.person.deathYear === next.data.person.deathYear &&
      prev.data.person.verificationStatus === next.data.person.verificationStatus &&
      prev.data.person.avatarPath === next.data.person.avatarPath &&
      prev.data.expansion?.hasMoreAncestors === next.data.expansion?.hasMoreAncestors &&
      prev.data.expansion?.hasMoreDescendants === next.data.expansion?.hasMoreDescendants
    );
  }
);
