"use client";

import * as React from "react";
import { useState, useMemo, useRef, useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  type Node,
  type Edge,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import Link from "next/link";
import { PublicModeBanner } from "./public-mode-banner";
import { PublicPersonDetailSheet } from "./public-person-detail-sheet";
import { PrivateBranchIndicator } from "./private-branch-indicator";
import { Button } from "@/components/ui/button";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Crosshair,
  Shield,
  Lock,
  User,
  Info,
  Home,
} from "lucide-react";
import type { PublicGraphDto } from "../contracts/public-graph.dto";
import type { PublicPersonDto, PublicPersonProfileDto } from "../contracts/public-person.dto";
import { getPublicPersonProfile } from "../services/get-public-person";
import { calculateElkLayout } from "@/features/tree-view/layout/elk-layout-adapter";
import { projectDtoToLayoutGraph } from "@/features/tree-view/layout/graph-projection";
import type { PositionedLayoutGraph } from "@/features/tree-view/layout/layout-graph.types";
import type { TreeGraphDto } from "@/features/tree-graph/types/tree-graph.types";
import { TREE_LAYOUT_CONFIG } from "@/features/tree-view/config/tree-layout.config";

interface PublicTreeViewProps {
  initialGraph: PublicGraphDto;
  slug: string;
  isLoggedIn?: boolean;
  isMember?: boolean;
}

function publicGraphToTreeGraphDto(graph: PublicGraphDto): TreeGraphDto {
  return {
    schemaVersion: graph.schemaVersion,
    treeId: graph.tree.id,
    centerPersonId: graph.centerPersonId || graph.persons[0]?.id || "",
    descendantTraversalMode: (graph.limits.traversalMode as any) || "PATERNAL_LINE",
    persons: graph.persons.map((p) => ({
      id: p.id,
      fullName: p.displayName,
      gender: p.gender,
      livingStatus: p.livingState.toLowerCase() as any,
      birthDate: null,
      birthYear: p.birthYear,
      birthDatePrecision: p.birthYear ? "year" : "unknown",
      birthIsEstimated: p.isEstimated,
      deathDate: null,
      deathYear: p.deathYear,
      deathDatePrecision: p.deathYear ? "year" : "unknown",
      deathIsEstimated: p.isEstimated,
      verificationStatus: "verified",
      avatarPath: null,
      isCenter: Boolean(p.isCenter),
    })),
    parentChildRelationships: graph.parentChildRelationships.map((r) => ({
      id: r.id,
      parentId: r.parentId,
      childId: r.childId,
      parentRole: r.parentRole,
      relationshipKind: r.relationshipKind,
      verificationStatus: r.verificationStatus,
    })),
    unions: graph.unions.map((u) => ({
      id: u.id,
      status: u.status,
      startDate: null,
      startYear: null,
      startDatePrecision: "unknown",
      endDate: null,
      endYear: null,
      endDatePrecision: "unknown",
      verificationStatus: u.verificationStatus,
    })),
    unionMembers: graph.unionMembers.map((um) => ({
      unionId: um.unionId,
      personId: um.personId,
      memberRole: um.memberRole,
    })),
    expansion: Object.fromEntries(
      Object.entries(graph.expansion).map(([k, v]) => [
        k,
        {
          hasMoreAncestors: v.hasMoreAncestors,
          hasMoreDescendants: v.hasMoreDescendants,
          canAddFather: false,
          canAddMother: false,
          canExpandAncestors: v.hasMoreAncestors,
          canExpandDescendants: v.hasMoreDescendants,
          hasVerifiedBiologicalFather: true,
          hasVerifiedBiologicalMother: true,
          hasHiddenDescendants: v.hiddenReason === "PATERNAL_LINE",
          descendantsTruncated: false,
          truncationReason: v.hiddenReason === "PATERNAL_LINE" ? "PATERNAL_LINE" : null,
        },
      ])
    ),
    limits: {
      requestedAncestorDepth: graph.limits.requestedAncestorDepth || 5,
      requestedDescendantDepth: graph.limits.requestedDescendantDepth || 5,
      appliedAncestorDepth: graph.limits.appliedAncestorDepth || 5,
      appliedDescendantDepth: graph.limits.appliedDescendantDepth || 5,
      maxAncestorDepth: graph.limits.maxAncestorDepth || 5,
      maxDescendantDepth: graph.limits.maxDescendantDepth || 5,
      maxPersonsBudget: 1000,
      maxRelationshipsBudget: 2000,
      maxUnionsBudget: 500,
      returnedPersonCount: graph.persons.length,
      returnedRelationshipCount: graph.parentChildRelationships.length,
      returnedUnionCount: graph.unions.length,
      truncated: graph.limits.truncated,
      truncatedReason: null,
    },
    truncated: graph.limits.truncated,
    warnings: [],
  };
}

function computePublicPersonProfile(
  graph: PublicGraphDto,
  personId: string,
  slug: string
): PublicPersonProfileDto | null {
  const person = graph.persons.find((p) => p.id === personId);
  if (!person) return null;

  const personMap = new Map(graph.persons.map((p) => [p.id, p]));

  // Find father and mother
  const parentRels = graph.parentChildRelationships.filter((r) => r.childId === personId);
  let father: { id: string; displayName: string } | null = null;
  let mother: { id: string; displayName: string } | null = null;

  for (const rel of parentRels) {
    const parentPerson = personMap.get(rel.parentId);
    if (!parentPerson) continue;

    if (rel.parentRole === "father" || parentPerson.gender === "male") {
      father = { id: parentPerson.id, displayName: parentPerson.displayName };
    } else if (rel.parentRole === "mother" || parentPerson.gender === "female") {
      mother = { id: parentPerson.id, displayName: parentPerson.displayName };
    }
  }

  // Find spouses
  const myUnionIds = new Set(
    graph.unionMembers.filter((um) => um.personId === personId).map((um) => um.unionId)
  );
  const spousePersonIds = Array.from(
    new Set(
      graph.unionMembers
        .filter((um) => myUnionIds.has(um.unionId) && um.personId !== personId)
        .map((um) => um.personId)
    )
  );
  const spouses = spousePersonIds
    .map((spId) => {
      const sp = personMap.get(spId);
      if (!sp) return null;
      return {
        id: sp.id,
        displayName: sp.displayName,
        gender: sp.gender,
        livingState: sp.livingState,
      };
    })
    .filter(Boolean) as { id: string; displayName: string; gender: any; livingState: any }[];

  // Find children
  const childRels = graph.parentChildRelationships.filter((r) => r.parentId === personId);
  const childPersonIds = Array.from(new Set(childRels.map((r) => r.childId)));
  const children = childPersonIds
    .map((cId) => {
      const ch = personMap.get(cId);
      if (!ch) return null;
      return {
        id: ch.id,
        displayName: ch.displayName,
        gender: ch.gender,
        livingState: ch.livingState,
        birthYear: ch.birthYear,
      };
    })
    .filter(Boolean) as {
    id: string;
    displayName: string;
    gender: any;
    livingState: any;
    birthYear?: number | null;
  }[];

  // Find siblings (sharing at least one parent)
  const myParentIds = new Set(parentRels.map((r) => r.parentId));
  const siblingRels = graph.parentChildRelationships.filter(
    (r) => myParentIds.has(r.parentId) && r.childId !== personId
  );
  const siblingPersonIds = Array.from(new Set(siblingRels.map((r) => r.childId)));
  const siblings = siblingPersonIds
    .map((sId) => {
      const sib = personMap.get(sId);
      if (!sib) return null;
      return {
        id: sib.id,
        displayName: sib.displayName,
        gender: sib.gender,
        livingState: sib.livingState,
        birthYear: sib.birthYear,
      };
    })
    .filter(Boolean) as {
    id: string;
    displayName: string;
    gender: any;
    livingState: any;
    birthYear?: number | null;
  }[];

  return {
    ...person,
    treeSlug: slug,
    treeName: graph.tree.name,
    father,
    mother,
    spouses,
    children,
    siblings,
  };
}

// 1. Custom Public Person Node
function PublicPersonNodeComponent({
  data,
}: {
  data: {
    person: PublicPersonDto;
    isCenter: boolean;
    hiddenReason?: string;
    onSelect: (person: PublicPersonDto) => void;
  };
}) {
  const { person, isCenter, hiddenReason, onSelect } = data;
  const isLiving = person.livingState === "LIVING" || person.livingState === "UNKNOWN";
  const isRedacted = person.visibility === "PUBLIC_REDACTED";

  const genderBg =
    person.gender === "male"
      ? "bg-blue-50/95 border-blue-300 text-blue-950"
      : person.gender === "female"
        ? "bg-rose-50/95 border-rose-300 text-rose-950"
        : "bg-neutral-50/95 border-neutral-300 text-neutral-950";

  return (
    <div
      onClick={() => onSelect(person)}
      role="button"
      tabIndex={0}
      style={{
        width: TREE_LAYOUT_CONFIG.PERSON_NODE_WIDTH,
        minHeight: TREE_LAYOUT_CONFIG.PERSON_NODE_HEIGHT,
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(person);
        }
      }}
      className={`relative flex cursor-pointer flex-col justify-between rounded-xl border p-3 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md focus:ring-2 focus:ring-emerald-600 focus:outline-none ${genderBg} ${
        isCenter ? "ring-2 ring-emerald-600 ring-offset-2" : ""
      }`}
    >
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

      <div className="flex items-center space-x-2.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-xs">
          {isRedacted ? (
            <Shield className="h-5 w-5 text-emerald-600" aria-hidden="true" />
          ) : (
            <User className="h-5 w-5 text-neutral-600" aria-hidden="true" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{person.displayName}</p>
          <div className="mt-0.5 flex items-center text-xs text-neutral-600">
            {isLiving ? (
              <span className="flex items-center font-medium text-emerald-700">
                <Lock className="mr-1 h-3 w-3" aria-hidden="true" />
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

      {isCenter && (
        <span className="absolute -top-2.5 right-2 rounded-full bg-emerald-700 px-2 py-0.5 text-[9px] font-bold text-white shadow-xs">
          Mốc xem
        </span>
      )}

      {hiddenReason && (
        <div className="mt-2 flex justify-end border-t border-black/5 pt-1">
          <PrivateBranchIndicator reason={hiddenReason as any} />
        </div>
      )}
    </div>
  );
}

// 2. Custom Union Node for Marriage connections
function PublicUnionNodeComponent({ id }: { id?: string }) {
  const rawId = id || "union";
  return (
    <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-emerald-400 bg-white shadow-2xs">
      <Handle
        type="target"
        position={Position.Top}
        id={`${rawId}-north`}
        className="!h-1 !w-1 !opacity-0"
        isConnectable={false}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id={`${rawId}-south`}
        className="!h-1 !w-1 !opacity-0"
        isConnectable={false}
      />
      <Handle
        type="target"
        position={Position.Left}
        id={`${rawId}-west`}
        className="!h-1 !w-1 !opacity-0"
        isConnectable={false}
      />
      <Handle
        type="source"
        position={Position.Right}
        id={`${rawId}-east`}
        className="!h-1 !w-1 !opacity-0"
        isConnectable={false}
      />
      <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
    </div>
  );
}

const PUBLIC_NODE_TYPES = {
  person: PublicPersonNodeComponent,
  union: PublicUnionNodeComponent,
};

function PublicTreeCanvasInternal({
  graph,
  slug,
  isLoggedIn,
  isMember,
}: {
  graph: PublicGraphDto;
  slug: string;
  isLoggedIn?: boolean;
  isMember?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reactFlow = useReactFlow();

  const [selectedPerson, setSelectedPerson] = useState<PublicPersonProfileDto | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [positionedGraph, setPositionedGraph] = useState<PositionedLayoutGraph | null>(null);

  // Run ELK layout calculation
  React.useEffect(() => {
    let active = true;
    const treeDto = publicGraphToTreeGraphDto(graph);
    const layoutGraph = projectDtoToLayoutGraph(treeDto);

    calculateElkLayout(layoutGraph)
      .then((res) => {
        if (active) {
          setPositionedGraph(res);
        }
      })
      .catch((err) => {
        console.error("[PublicTreeView] ELK Layout failed, using fallback:", err);
      });

    return () => {
      active = false;
    };
  }, [graph]);

  // Position calculation for tree nodes matching original mode
  const { nodes, edges } = useMemo(() => {
    const calculatedNodes: Node[] = [];
    const calculatedEdges: Edge[] = [];

    const personMap = new Map(graph.persons.map((p) => [p.id, p]));

    if (positionedGraph && positionedGraph.nodes.length > 0) {
      for (const pNode of positionedGraph.nodes) {
        if (pNode.type === "person") {
          const person = personMap.get(pNode.id);
          if (!person) continue;
          const expansion = graph.expansion[person.id];

          calculatedNodes.push({
            id: person.id,
            type: "person",
            position: { x: pNode.x, y: pNode.y },
            data: {
              person,
              isCenter: person.id === graph.centerPersonId,
              hiddenReason: expansion?.hiddenReason,
              onSelect: (p: PublicPersonDto) => {
                const profile = computePublicPersonProfile(graph, p.id, slug);
                if (profile) {
                  setSelectedPerson(profile);
                  setIsDetailOpen(true);
                }
              },
            },
          });
        } else if (pNode.type === "union") {
          calculatedNodes.push({
            id: pNode.id,
            type: "union",
            position: { x: pNode.x, y: pNode.y },
            data: {
              id: pNode.id,
            },
          });
        }
      }

      // Parent-Child edges
      for (const rel of graph.parentChildRelationships) {
        if (personMap.has(rel.parentId) && personMap.has(rel.childId)) {
          calculatedEdges.push({
            id: `rel-${rel.id}`,
            source: rel.parentId,
            target: rel.childId,
            sourceHandle: `${rel.parentId}-south`,
            targetHandle: `${rel.childId}-north`,
            type: "smoothstep",
            style: { stroke: "#059669", strokeWidth: 2 },
          });
        }
      }

      // Union member edges (between spouses and union nodes)
      for (const e of positionedGraph.edges) {
        if (e.type === "union-member") {
          calculatedEdges.push({
            id: e.id,
            source: e.source,
            target: e.target,
            sourceHandle: e.sourcePort || undefined,
            targetHandle: e.targetPort || undefined,
            type: "straight",
            style: { stroke: "#c026d3", strokeWidth: 2, strokeDasharray: "4,4" },
          });
        }
      }

      return { nodes: calculatedNodes, edges: calculatedEdges };
    }

    // Fallback simple grid before ELK positions ready
    graph.persons.forEach((person, idx) => {
      calculatedNodes.push({
        id: person.id,
        type: "person",
        position: { x: idx * 280, y: 100 },
        data: {
          person,
          isCenter: person.id === graph.centerPersonId,
          hiddenReason: graph.expansion[person.id]?.hiddenReason,
          onSelect: (p: PublicPersonDto) => {
            const profile = computePublicPersonProfile(graph, p.id, slug);
            if (profile) {
              setSelectedPerson(profile);
              setIsDetailOpen(true);
            }
          },
        },
      });
    });

    return { nodes: calculatedNodes, edges: calculatedEdges };
  }, [graph, positionedGraph, slug]);

  const handleFitView = useCallback(() => {
    reactFlow.fitView({ padding: 0.2, duration: 400 });
  }, [reactFlow]);

  const handleZoomIn = useCallback(() => {
    reactFlow.zoomIn({ duration: 300 });
  }, [reactFlow]);

  const handleZoomOut = useCallback(() => {
    reactFlow.zoomOut({ duration: 300 });
  }, [reactFlow]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex h-screen w-screen flex-col overflow-hidden bg-neutral-100"
    >
      {/* 1. Public Mode Banner */}
      <PublicModeBanner
        slug={slug}
        treeId={graph.tree.id}
        isLoggedIn={isLoggedIn}
        isMember={isMember}
      />

      {/* 2. Top Family Tree Header Info */}
      <div className="absolute top-14 left-4 z-10 max-w-sm rounded-xl border border-neutral-200/80 bg-white/90 p-3.5 shadow-sm backdrop-blur-xs sm:left-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-bold text-neutral-900 sm:text-base">
              {graph.tree.name}
            </h1>
            <p className="mt-0.5 line-clamp-2 text-xs text-neutral-500">
              {graph.persons.length} nhân vật hiển thị • Chế độ dòng họ nội tộc
            </p>
          </div>
          <Link
            href="/"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-600 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:outline-none"
            title="Quay lại trang chủ GenViet"
            aria-label="Quay lại trang chủ GenViet"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* 3. React Flow Canvas */}
      <div className="h-full w-full flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={PUBLIC_NODE_TYPES}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          fitView
          minZoom={0.2}
          maxZoom={2.0}
          className="h-full w-full"
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#cbd5e1" />
        </ReactFlow>
      </div>

      {/* 4. Read-Only Floating Viewport Controls */}
      <nav
        aria-label="Điều khiển bản đồ gia phả"
        className="absolute bottom-6 left-4 z-20 flex items-center space-x-1.5 rounded-xl border border-neutral-200 bg-white/95 p-1.5 shadow-md backdrop-blur-xs sm:left-6"
      >
        <Button
          size="sm"
          variant="ghost"
          onClick={handleZoomIn}
          className="h-8 w-8 p-0"
          aria-label="Phóng to"
        >
          <ZoomIn className="h-4 w-4 text-neutral-700" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleZoomOut}
          className="h-8 w-8 p-0"
          aria-label="Thu nhỏ"
        >
          <ZoomOut className="h-4 w-4 text-neutral-700" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleFitView}
          className="h-8 w-8 p-0"
          aria-label="Vừa khung nhìn"
        >
          <Crosshair className="h-4 w-4 text-neutral-700" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={toggleFullscreen}
          className="h-8 w-8 p-0"
          aria-label={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4 text-neutral-700" />
          ) : (
            <Maximize2 className="h-4 w-4 text-neutral-700" />
          )}
        </Button>
      </nav>

      {/* 5. Public Person Detail Sheet */}
      <PublicPersonDetailSheet
        person={selectedPerson}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onSelectPerson={(personId) => {
          const profile = computePublicPersonProfile(graph, personId, slug);
          if (profile) {
            setSelectedPerson(profile);
            const targetNode = nodes.find((n) => n.id === personId);
            if (targetNode) {
              reactFlow.setCenter(targetNode.position.x + 130, targetNode.position.y + 50, {
                zoom: 1,
                duration: 400,
              });
            }
          }
        }}
      />
    </div>
  );
}

export function PublicTreeView(props: PublicTreeViewProps) {
  return (
    <ReactFlowProvider>
      <PublicTreeCanvasInternal
        graph={props.initialGraph}
        slug={props.slug}
        isLoggedIn={props.isLoggedIn}
        isMember={props.isMember}
      />
    </ReactFlowProvider>
  );
}
