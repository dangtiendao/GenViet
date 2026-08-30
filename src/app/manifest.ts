import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "GenViet - Quản lý Cây Gia phả",
    short_name: "GenViet",
    description: "Ứng dụng Responsive Web App quản lý cây gia phả cá nhân riêng tư",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#065f46",
    lang: "vi",
    orientation: "portrait",
    categories: ["utilities", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
