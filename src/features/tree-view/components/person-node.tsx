import React, { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { CheckCircle2, AlertCircle, HelpCircle, Plus, Crown, MoreVertical } from "lucide-react";
import type { ReactFlowPersonNode } from "../types/tree-presentation.types";
import { TREE_LAYOUT_CONFIG } from "../config/tree-layout.config";
import { RelationshipActionMenu } from "@/features/relationships/components/relationship-action-menu";

export const PersonNode = memo(function PersonNode({
  data,
  selected,
}: NodeProps<ReactFlowPersonNode>) {
  const {
    person,
    isCenter,
    isSelected,
    expansion,
    treeId,
    canWrite = false,
    onSelect,
    onExpandAncestors,
    onExpandDescendants,
  } = data;

  const isDeceased = person.livingStatus === "deceased";
  const isMale = person.gender === "male";
  const isFemale = person.gender === "female";

  // Định dạng năm sinh - năm mất vắn tắt
  const birthText = person.birthYear ? String(person.birthYear) : "?";
  const deathText = isDeceased ? (person.deathYear ? String(person.deathYear) : "Mất") : "";
  const lifespanText = isDeceased ? `${birthText} - ${deathText}` : `Sinh: ${birthText}`;

  // Trạng thái xác minh
  const isVerified = person.verificationStatus === "verified";
  const isDisputed = person.verificationStatus === "disputed";

  // Initial chữ cái đầu cho Avatar placeholder
  const initials = person.fullName
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(person.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect?.(person.id);
    }
  };

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={`Thành viên: ${person.fullName}, ${lifespanText}`}
      onClick={handleNodeClick}
      onKeyDown={handleKeyDown}
      style={{
        width: TREE_LAYOUT_CONFIG.PERSON_NODE_WIDTH,
        height: TREE_LAYOUT_CONFIG.PERSON_NODE_HEIGHT,
      }}
      className={`group relative flex flex-col justify-between rounded-xl border bg-white p-2.5 text-left shadow-xs transition-all outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
        isCenter
          ? "border-emerald-600 bg-emerald-50/20 ring-2 ring-emerald-500/30"
          : isSelected || selected
            ? "border-blue-600 ring-2 ring-blue-400/40"
            : "border-neutral-200 hover:border-emerald-300 hover:shadow-md"
      }`}
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
        type="source"
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
          aria-label={`Mở rộng thêm tổ tiên của ${person.fullName}`}
          onClick={(e) => {
            e.stopPropagation();
            onExpandAncestors?.(person.id);
          }}
          className="absolute -top-3.5 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border border-emerald-600 bg-emerald-600 text-white shadow-xs transition-transform hover:scale-110 hover:bg-emerald-700"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}

      {/* Thông tin phần đầu: Avatar + Tên + Action Menu */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 overflow-hidden">
          {/* Avatar Initial Placeholder */}
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              isMale
                ? "bg-blue-100 text-blue-800"
                : isFemale
                  ? "bg-rose-100 text-rose-800"
                  : "bg-neutral-100 text-neutral-800"
            } ${isDeceased ? "opacity-75" : ""}`}
          >
            {initials || "GV"}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="truncate text-xs font-bold text-neutral-900" title={person.fullName}>
                {person.fullName}
              </span>
              {isCenter && (
                <Crown
                  className="h-3.5 w-3.5 shrink-0 text-amber-500"
                  aria-label="Nhân vật trung tâm"
                />
              )}
            </div>
            <p className="truncate font-mono text-[11px] text-neutral-500">{lifespanText}</p>
          </div>
        </div>

        {/* Action Menu Button */}
        {canWrite && (
          <div onClick={(e) => e.stopPropagation()}>
            <RelationshipActionMenu
              treeId={treeId}
              personId={person.id}
              personName={person.fullName}
              canWrite={canWrite}
            />
          </div>
        )}
      </div>

      {/* Thông tin phần chân: Badges trạng thái */}
      <div className="flex items-center justify-between border-t border-neutral-100 pt-1.5 text-[10px]">
        {/* Verification Status */}
        <div className="flex items-center gap-1">
          {isVerified ? (
            <span className="inline-flex items-center font-medium text-emerald-700">
              <CheckCircle2 className="mr-0.5 h-3 w-3" /> Xác thực
            </span>
          ) : isDisputed ? (
            <span className="inline-flex items-center font-medium text-rose-600">
              <AlertCircle className="mr-0.5 h-3 w-3" /> Tranh chấp
            </span>
          ) : (
            <span className="inline-flex items-center font-medium text-amber-600">
              <HelpCircle className="mr-0.5 h-3 w-3" /> Chưa xác thực
            </span>
          )}
        </div>

        {/* Living / Deceased badge */}
        <span
          className={`py-0.2 rounded px-1.5 font-medium ${
            isDeceased ? "bg-neutral-100 text-neutral-600" : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {isDeceased ? "Đã mất" : "Còn sống"}
        </span>
      </div>

      {/* Nút mở rộng hậu duệ phía dưới */}
      {expansion?.hasMoreDescendants && (
        <button
          type="button"
          aria-label={`Mở rộng thêm hậu duệ của ${person.fullName}`}
          onClick={(e) => {
            e.stopPropagation();
            onExpandDescendants?.(person.id);
          }}
          className="absolute -bottom-3.5 left-1/2 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border border-emerald-600 bg-emerald-600 text-white shadow-xs transition-transform hover:scale-110 hover:bg-emerald-700"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
});
