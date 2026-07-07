import { MetadataRoute } from "next";

/**
 * Dynamically generates sitemap.xml according to Google and Bing SEO guidelines.
 * Includes all public endpoints with optimal priority and update frequency,
 * while excluding private administrative/authentication paths.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://convertgalaxy.com";
  const currentDate = new Date();

  // Define public indexable URLs
  const publicRoutes = [
    { url: `${baseUrl}/`, changeFrequency: "daily" as const, priority: 1.0 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/privacy`, changeFrequency: "yearly" as const, priority: 0.5 },
    { url: `${baseUrl}/terms`, changeFrequency: "yearly" as const, priority: 0.5 },
    { url: `${baseUrl}/disclaimer`, changeFrequency: "yearly" as const, priority: 0.5 },
    { url: `${baseUrl}/faq`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/tools`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/tools/crop-image`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/tools/image-compressor`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/tools/image-resizer`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/tools/image-to-pdf`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/tools/jpg-to-png`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/tools/pdf-to-image`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/tools/png-to-jpg`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/tools/webp-converter`, changeFrequency: "weekly" as const, priority: 0.9 },
  ];

  return publicRoutes.map((route) => ({
    ...route,
    lastModified: currentDate,
  }));
}
