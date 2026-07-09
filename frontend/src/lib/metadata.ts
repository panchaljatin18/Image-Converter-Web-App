import { Metadata } from "next";

export const SITE_URL = "https://www.convertgalaxy.com";

export const GLOBAL_SEO_DEFAULTS = {
  applicationName: "Convert Galaxy",
  title: {
    default: "Convert Galaxy – Free Online Image Converter, Compressor & Editor",
    template: "%s | Convert Galaxy",
  },
  description:
    "Convert JPG to PNG, PNG to JPG, WebP conversion, compress images, resize, crop, and convert images to PDF — all free, fast, and secure in your browser.",
  keywords: [
    "Convert Galaxy",
    "convertgalaxy",
    "image converter",
    "JPG to PNG",
    "PNG to JPG",
    "WebP converter",
    "image compressor",
    "image resizer",
    "crop image",
    "image to PDF",
    "PDF to image",
    "free image tools",
    "online image editor",
    "browser image tools",
    "compress jpeg online"
  ],
  authors: [{ name: "Convert Galaxy Team", url: SITE_URL }],
  creator: "Convert Galaxy",
  publisher: "Convert Galaxy",
  category: "utility",
  metadataBase: new URL(SITE_URL),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Convert Galaxy",
    title: "Convert Galaxy – Free Online Image Converter, Compressor & Editor",
    description:
      "Convert JPG to PNG, PNG to JPG, WebP conversion, compress images, resize, crop, and convert images to PDF — all free, fast, and secure in your browser.",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Convert Galaxy – Free Online Image Converter",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Convert Galaxy – Free Online Image Converter & Editor",
    description:
      "Convert, compress, resize, crop, and edit images instantly in your browser. 100% free, fast, and private.",
    images: [`${SITE_URL}/og-image.png`],
    creator: "@ConvertGalaxy",
    site: "@ConvertGalaxy",
  },
  verification: {
    google: "s0ab_86u6FyoQmZRSv69y4Ji4Q5IuJqM8lds-lyZ5HM",
    yandex: "yandex-verification-placeholder",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "ConvertGalaxy",
    "ai-agent": "index, follow",
    "gptbot": "index, follow",
    "claudebot": "index, follow",
    "google-extended": "index, follow",
    "perplexity": "index, follow",
    "chatgpt-crawler": "index, follow",
    "bingbot": "index, follow",
  },
};

interface MetadataOptions {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  keywords?: string[];
  noIndex?: boolean;
}

export function constructMetadata(options: MetadataOptions = {}): Metadata {
  const {
    title,
    description,
    canonicalPath = "",
    ogImage = `${SITE_URL}/og-image.png`,
    ogType = "website",
    keywords = [],
    noIndex = false,
  } = options;

  let cleanPath = canonicalPath.trim();
  if (cleanPath.startsWith("/")) {
    cleanPath = cleanPath.slice(1);
  }
  if (cleanPath.endsWith("/")) {
    cleanPath = cleanPath.slice(0, -1);
  }
  const canonicalUrl = cleanPath ? `${SITE_URL}/${cleanPath}` : SITE_URL;

  const robotsConfig = noIndex
    ? {
        index: false,
        follow: false,
      }
    : GLOBAL_SEO_DEFAULTS.robots;

  return {
    ...GLOBAL_SEO_DEFAULTS,
    title: title ? title : GLOBAL_SEO_DEFAULTS.title.default,
    description: description || GLOBAL_SEO_DEFAULTS.description,
    keywords: [...GLOBAL_SEO_DEFAULTS.keywords, ...keywords],
    robots: robotsConfig,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      ...GLOBAL_SEO_DEFAULTS.openGraph,
      title: title || GLOBAL_SEO_DEFAULTS.openGraph.title,
      description: description || GLOBAL_SEO_DEFAULTS.openGraph.description,
      type: ogType,
      url: canonicalUrl,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || "Convert Galaxy – Free Online Image Tools",
        },
      ],
    },
    twitter: {
      ...GLOBAL_SEO_DEFAULTS.twitter,
      title: title || GLOBAL_SEO_DEFAULTS.twitter.title,
      description: description || GLOBAL_SEO_DEFAULTS.twitter.description,
      images: [ogImage],
    },
  };
}
