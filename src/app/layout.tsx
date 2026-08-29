import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GenViet - Quản lý Cây Gia phả",
  description: "Ứng dụng Responsive Web App quản lý cây gia phả cá nhân riêng tư",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">{children}</body>
    </html>
  );
}
