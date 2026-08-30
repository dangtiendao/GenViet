# ELK.js Layout Configuration & Generation Spacing

## 1. Cấu Hình Bố Cục Phân Tầng

```typescript
export const DEFAULT_ELK_LAYOUT_OPTIONS: Record<string, string> = {
  "elk.algorithm": "layered",
  "elk.direction": "DOWN",
  "elk.spacing.nodeNode": "40",
  "elk.layered.spacing.nodeNodeBetweenLayers": "80",
  "elk.layered.spacing.edgeNodeBetweenLayers": "25",
  "elk.layered.spacing.edgeEdgeBetweenLayers": "15",
  "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
  "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
  "elk.edgeRouting": "ORTHOGONAL",
  "elk.layered.unnecessaryBendpoints": "false",
};
```

## 2. Ý Nghĩa Các Tham Số
- `elk.direction = 'DOWN'`: Định hướng thế hệ từ trên xuống dưới (Tổ tiên $\rightarrow$ Con cháu).
- `elk.layered.spacing.nodeNodeBetweenLayers = '80'`: Đảm bảo khoảng cách 80px giữa các đời để đường nối rõ ràng và các nút mở rộng `+` không bị che lấp.
- `elk.spacing.nodeNode = '40'`: Khoảng cách 40px giữa các anh chị em cùng thế hệ để không bị đè chồng.
