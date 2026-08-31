import { Home, GitFork, Search, User } from "lucide-react";

export interface NavigationItem {
  key: string;
  label: string;
  href: string;
  icon: typeof Home;
  isImplemented: boolean;
  showInMobileNav: boolean;
  showInDesktopSidebar: boolean;
}

export const MAIN_NAVIGATION: NavigationItem[] = [
  {
    key: "dashboard",
    label: "Tổng quan",
    href: "/dashboard",
    icon: Home,
    isImplemented: true,
    showInMobileNav: true,
    showInDesktopSidebar: true,
  },
  {
    key: "trees",
    label: "Cây gia phả",
    href: "/trees",
    icon: GitFork,
    isImplemented: true,
    showInMobileNav: true,
    showInDesktopSidebar: true,
  },
  {
    key: "search",
    label: "Tìm kiếm",
    href: "/search",
    icon: Search,
    isImplemented: true,
    showInMobileNav: true,
    showInDesktopSidebar: true,
  },
  {
    key: "account",
    label: "Tài khoản",
    href: "/account",
    icon: User,
    isImplemented: true,
    showInMobileNav: true,
    showInDesktopSidebar: true,
  },
];
