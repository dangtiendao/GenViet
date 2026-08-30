import type { Node, Edge } from "@xyflow/react";
import type {
  GraphPersonDto,
  ExpansionDto,
  ParentChildRelationshipDto,
  UnionDto,
} from "@/features/tree-graph/types/tree-graph.types";

export interface PersonNodeData extends Record<string, unknown> {
  person: GraphPersonDto;
  isCenter: boolean;
  isSelected: boolean;
  expansion?: ExpansionDto;
  isCollapsed?: boolean;
  treeId: string;
  canWrite?: boolean;
  onSelect?: (personId: string) => void;
  onExpandAncestors?: (personId: string) => void;
  onExpandDescendants?: (personId: string) => void;
  onToggleCollapse?: (personId: string) => void;
  onChangeCenter?: (personId: string) => void;
}

export interface UnionNodeData extends Record<string, unknown> {
  unionId: string;
  status: UnionDto["status"];
  verificationStatus: UnionDto["verificationStatus"];
}

export interface ParentChildEdgeData extends Record<string, unknown> {
  relationshipId: string;
  parentRole: ParentChildRelationshipDto["parentRole"];
  relationshipKind: ParentChildRelationshipDto["relationshipKind"];
  verificationStatus: ParentChildRelationshipDto["verificationStatus"];
}

export interface UnionEdgeData extends Record<string, unknown> {
  unionId: string;
  personId: string;
  memberRole: string;
}

export type ReactFlowPersonNode = Node<PersonNodeData, "person">;
export type ReactFlowUnionNode = Node<UnionNodeData, "union">;
export type ReactFlowTreeNode = ReactFlowPersonNode | ReactFlowUnionNode;

export type ReactFlowParentChildEdge = Edge<ParentChildEdgeData, "parent-child">;
export type ReactFlowUnionEdge = Edge<UnionEdgeData, "union-member">;
export type ReactFlowTreeEdge = ReactFlowParentChildEdge | ReactFlowUnionEdge;
