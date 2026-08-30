/**
 * GenViet UI & Design System Configuration (Phase P10)
 *
 * Source of truth for Breakpoints, Layout Dimensions, Z-Index Hierarchy,
 * and WCAG 2.2 AA Accessibility Thresholds.
 */

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export const LAYOUT_DIMENSIONS = {
  headerHeightDesktop: 64, // 4rem (h-16)
  headerHeightMobile: 56, // 3.5rem (h-14)
  sidebarWidthExpanded: 256, // 16rem (w-64)
  sidebarWidthCollapsed: 72, // 4.5rem (w-[72px])
  mobileNavHeight: 64, // 4rem (h-16)
  minTouchTargetSize: 44, // 44px min touch target (WCAG 2.2 AA)
  contentMaxWidth: 1280, // max-w-7xl
} as const;

export const Z_INDEX = {
  base: 0,
  stickyHeader: 30,
  mobileNav: 40,
  sidebar: 40,
  drawerBackdrop: 50,
  drawerContent: 55,
  dialogBackdrop: 60,
  dialogContent: 65,
  toast: 100,
  tooltip: 110,
} as const;

export const ACCESSIBILITY_BASELINE = {
  contrastNormalText: 4.5,
  contrastLargeText: 3.0,
  contrastUiComponent: 3.0,
  focusOutlineWidth: "2px",
  minTouchTargetPx: 44,
} as const;
