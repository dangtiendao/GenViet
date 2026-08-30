/**
 * Ngân sách hiệu năng chuẩn mực cho GenViet (Performance Budget Config - P23-T01)
 */
export const PERFORMANCE_BUDGET = {
  // 1. Dashboard Metrics
  DASHBOARD: {
    MAX_LOAD_MS: 500, // Tối đa 500ms cho việc sẵn sàng dữ liệu dashboard
    TARGET_FCP_MS: 300,
    TARGET_LCP_MS: 600,
  },

  // 2. Graph API & Database Query Metrics
  GRAPH_QUERY: {
    TARGET_100_NODES_MS: 50,
    MAX_100_NODES_MS: 100,
    TARGET_250_NODES_MS: 80,
    MAX_250_NODES_MS: 150,
    MAX_PAYLOAD_BYTES: 250 * 1024, // Tối đa 250 KB cho một lát cắt đồ thị
  },

  // 3. ELK Layout & Web Worker Metrics
  LAYOUT: {
    TARGET_100_NODES_MS: 100,
    MAX_100_NODES_MS: 200,
    TARGET_250_NODES_MS: 180,
    MAX_250_NODES_MS: 350,
    MAX_MAIN_THREAD_BLOCKING_MS: 16, // Không gây nghẽn main-thread > 1 khung hình (16.6ms)
  },

  // 4. React Flow Render Metrics
  RENDER: {
    MAX_FIRST_RENDER_MS: 50,
    MAX_PAN_ZOOM_FRAME_DROP: 0,
    MAX_SELECT_NODE_RENDER_MS: 16,
  },

  // 5. Search & List Virtualization Metrics
  SEARCH: {
    MAX_QUERY_MS: 100,
    MAX_DOM_ROWS_RENDERED: 25, // Chỉ render tối đa 20-25 DOM rows bất kể danh sách có 1000 kết quả
  },

  // 6. Media & Thumbnail Metrics
  THUMBNAIL: {
    MAX_SIZE_BYTES: 30 * 1024, // Tối đa 30 KB cho mỗi ảnh WebP thumbnail
    DEFAULT_DIMENSION_PX: 64,
  },
} as const;
