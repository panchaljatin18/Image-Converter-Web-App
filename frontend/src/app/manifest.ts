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
        src: "/C.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/C.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
