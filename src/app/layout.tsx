import type { Metadata, Viewport } from "next";
import { ServiceWorkerRegistration } from "@/features/pwa/components/service-worker-registration";
import { OfflineStatusBanner } from "@/features/pwa/components/offline-status-banner";
import { PwaUpdateBanner } from "@/features/pwa/components/pwa-update-banner";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#065f46",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "GenViet - Quản lý Cây Gia phả",
  description: "Ứng dụng Responsive Web App quản lý cây gia phả cá nhân riêng tư",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "GenViet",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
        <ServiceWorkerRegistration />
        <OfflineStatusBanner />
        {children}
        <PwaUpdateBanner />
      </body>
    </html>
  );
}
