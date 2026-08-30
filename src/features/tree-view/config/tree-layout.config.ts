/**
 * Cấu hình kích thước và khoảng cách layout phân tầng cây gia phả (GenViet Tree Layout Config)
 */
export const TREE_LAYOUT_CONFIG = {
  // Kích thước cố định của PersonNode
  PERSON_NODE_WIDTH: 220,
  PERSON_NODE_HEIGHT: 90,

  // Kích thước của UnionNode trung gian
  UNION_NODE_WIDTH: 16,
  UNION_NODE_HEIGHT: 16,

  // Khoảng cách giữa các thế hệ (khoảng cách trục Y khi direction = DOWN)
  LAYER_SPACING: 80,

  // Khoảng cách giữa các anh chị em / phối ngẫu trong cùng một thế hệ (khoảng cách trục X)
  NODE_SPACING: 40,

  // Khoảng cách giữa các cụm gia đình độc lập
  COMPONENT_SPACING: 60,

  // Hướng phân tầng cây gia phả mặc định (DOWN: Tổ tiên ở trên, hậu duệ ở dưới)
  DEFAULT_DIRECTION: "DOWN" as const,

  // Giới hạn zoom của React Flow Viewport
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 2.0,
  DEFAULT_ZOOM: 1.0,

  // Padding khi gọi fitView
  FIT_VIEW_PADDING: 0.2,

  // Bước tăng/giảm độ sâu khi mở rộng
  EXPANSION_STEP: 1,
} as const;
