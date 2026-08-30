import "server-only";
import { TreeGraphRepository } from "../repositories/tree-graph.repository";
import { TreeGraphMapper } from "../mappers/tree-graph.mapper";
import { treeGraphQuerySchema, type TreeGraphQueryInput } from "../schemas/tree-graph-query.schema";
import { buildTreeGraphCacheKey } from "../cache/tree-graph-cache-key";
import type { TreeGraphDto } from "../types/tree-graph.types";
import { TreeGraphDomainError, TREE_GRAPH_ERROR_CODES } from "../errors/tree-graph.errors";

export class TreeGraphService {
  /**
   * Truy vấn lát cắt đồ thị cây gia phả quanh Center Person
   */
  static async getTreeGraphSlice(
    userId: string,
    rawInput: unknown
  ): Promise<{ data: TreeGraphDto; cacheKey: string }> {
    const parseResult = treeGraphQuerySchema.safeParse(rawInput);
    if (!parseResult.success) {
      const issue = parseResult.error.issues[0];
      throw new TreeGraphDomainError(
        TREE_GRAPH_ERROR_CODES.DEPTH_INVALID,
        issue?.message || "Tham số truy vấn đồ thị không hợp lệ."
      );
    }

    const input: TreeGraphQueryInput = parseResult.data;

    // 1. Fetch raw data via Database RPC
    const rawData = await TreeGraphRepository.fetchTreeGraphSlice(input);

    // 2. Validate consistency & map to domain TreeGraphDto
    const data = TreeGraphMapper.mapToTreeGraphDto(rawData);

    // 3. Build deterministic cache key
    const cacheKey = buildTreeGraphCacheKey(userId, input, data.schemaVersion);

    return { data, cacheKey };
  }
}
