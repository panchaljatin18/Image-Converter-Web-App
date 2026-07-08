import { MetadataRoute } from "next";

/**
 * Generates the robots.txt file dynamically using Next.js Metadata Route API.
 * Follows the latest Google SEO recommendations.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
      ],
      disallow: [
        "/api/",
        "/dashboard/",
        "/login/",
        "/forgot-password/",
        "/reset-password/",
        "/admin/",
        "/auth/",
        "/private/",
      ],
    },
    sitemap: "https://www.convertgalaxy.com/sitemap.xml",
    host: "https://www.convertgalaxy.com",
  };
}
