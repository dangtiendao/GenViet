import type { TreeGraphDto } from "../types/tree-graph.types";
import { buildTreeGraphCacheKey } from "./tree-graph-cache-key";
import type { TreeGraphQueryInput } from "../schemas/tree-graph-query.schema";

interface CacheEntry {
  data: TreeGraphDto;
  timestamp: number;
  ttlMs: number;
}

export class TreeRegionCache {
  private static instance: TreeRegionCache | null = null;
  private cache = new Map<string, CacheEntry>();
  private inFlightRequests = new Map<string, Promise<TreeGraphDto>>();
  private maxEntries = 100;
  private defaultTtlMs = 5 * 60 * 1000; // 5 phút
  private hitCount = 0;
  private missCount = 0;

  static getInstance(): TreeRegionCache {
    if (!TreeRegionCache.instance) {
      TreeRegionCache.instance = new TreeRegionCache();
    }
    return TreeRegionCache.instance;
  }

  static resetInstance(): void {
    if (TreeRegionCache.instance) {
      TreeRegionCache.instance.clearAll();
      TreeRegionCache.instance = null;
    }
  }

  /**
   * Lấy dữ liệu đồ thị từ Cache nếu còn hiệu lực
   */
  get(key: string): TreeGraphDto | null {
    const entry = this.cache.get(key);
    if (!entry) {
      this.missCount++;
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > entry.ttlMs) {
      this.cache.delete(key);
      this.missCount++;
      return null;
    }

    this.hitCount++;
    return entry.data;
  }

  /**
   * Lưu trữ dữ liệu lát cắt đồ thị vào Cache với LRU Eviction
   */
  set(key: string, data: TreeGraphDto, ttlMs: number = this.defaultTtlMs): void {
    if (this.cache.size >= this.maxEntries) {
      // LRU Eviction: Xóa phần tử đầu tiên (oldest inserted)
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttlMs,
    });
  }

  /**
   * Khử trùng lặp (Deduplicate) các yêu cầu mạng đồng thời giống hệt nhau
   */
  async deduplicate(key: string, fetcher: () => Promise<TreeGraphDto>): Promise<TreeGraphDto> {
    const cached = this.get(key);
    if (cached) {
      return cached;
    }

    const inFlight = this.inFlightRequests.get(key);
    if (inFlight) {
      return inFlight;
    }

    const requestPromise = (async () => {
      try {
        const result = await fetcher();
        this.set(key, result);
        return result;
      } finally {
        this.inFlightRequests.delete(key);
      }
    })();

    this.inFlightRequests.set(key, requestPromise);
    return requestPromise;
  }

  /**
   * Vô hiệu hóa toàn bộ cache của một cây gia phả (Selective Invalidation)
   */
  invalidateTree(treeId: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(`:${treeId}:`)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Vô hiệu hóa cache liên quan đến một nhân vật cụ thể trong cây
   */
  invalidatePerson(treeId: string, personId: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(`:${treeId}:`) && key.includes(`:${personId}:`)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Xóa toàn bộ cache riêng tư khi người dùng đăng xuất hoặc đổi tài khoản
   */
  clearUserCache(userScope?: string): void {
    if (!userScope) {
      this.clearAll();
      return;
    }
    for (const key of this.cache.keys()) {
      if (key.startsWith(`tree-graph:${userScope}:`)) {
        this.cache.delete(key);
      }
    }
  }

  clearAll(): void {
    this.cache.clear();
    this.inFlightRequests.clear();
    this.hitCount = 0;
    this.missCount = 0;
  }

  getStats() {
    return {
      size: this.cache.size,
      inFlightCount: this.inFlightRequests.size,
      hits: this.hitCount,
      misses: this.missCount,
    };
  }
}
