"use client";

import * as React from "react";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";
import { MobileNavigation } from "./mobile-navigation";
import { Toaster } from "@/components/ui/toast";

export interface AppShellProps {
  displayName?: string | null;
  email?: string | null;
  children: React.ReactNode;
}

export function AppShell({ displayName, email, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen w-full bg-neutral-50/60">
      {/* Skip link for keyboard users (WCAG 2.2 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-emerald-700 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:ring-2 focus:ring-offset-2 focus:outline-none"
      >
        Chuyển thẳng đến nội dung chính
      </a>

      {/* Desktop Sidebar (lg breakpoint and up) */}
      <AppSidebar />

      {/* Main App Layout Container */}
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader displayName={displayName} email={email} />

        <main id="main-content" tabIndex={-1} className="flex-1 p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation (below lg breakpoint) */}
      <MobileNavigation />

      {/* Global Application Toast Notifications */}
      <Toaster />
    </div>
  );
}
