import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Convert Galaxy",
    short_name: "ConvertGalaxy",
    description: "Free Online Image Converter, Compressor & Editor — fast, secure, browser-based",
    start_url: "/",
    display: "standalone",
    background_color: "#0f0f1a",
    theme_color: "#6366f1",
    icons: [
      {
        src: "/C.webp",
        sizes: "192x192",
        type: "image/webp",
      },
      {
        src: "/C.webp",
        sizes: "512x512",
        type: "image/webp",
        purpose: "maskable",
      },
    ],
  };
}
