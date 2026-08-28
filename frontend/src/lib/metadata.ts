import { Metadata } from "next";

export const SITE_URL = "https://www.convertgalaxy.com";

export const GLOBAL_SEO_DEFAULTS = {
  applicationName: "ConvertGalaxy",
  title: {
    default: "ConvertGalaxy – Free Online Image Converter & Compressor",
    template: "%s | ConvertGalaxy",
  },
  description:
    "Free online image converter to convert JPG, PNG, WebP, HEIC & PDF in your browser without losing quality. 100% private with no signup required.",
  keywords: [
    "free image converter",
    "online image converter",
    "jpg to png",
    "png to jpg",
    "webp converter",
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
    title: "Convert Galaxy – Free Online Image Converter & Compressor",
    description:
      "Free online image converter & batch compressor. Convert JPG, PNG, WebP, HEIC & PDF without losing quality. 100% private, no watermark.",
    images: [
      {
        url: `${SITE_URL}/og-image.webp`,
        width: 1200,
        height: 630,
        alt: "Convert Galaxy – Free Online Image Converter & Batch Compressor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Convert Galaxy – Free Online Image Converter & Compressor",
    description:
      "Compress and convert images online for free. Fast, private browser-based batch image converter for JPG, PNG, WebP, HEIC & PDF.",
    images: [`${SITE_URL}/og-image.webp`],
    creator: "@ConvertGalaxy",
    site: "@ConvertGalaxy",
  },
  verification: {
    google: "s0ab_86u6FyoQmZRSv69y4Ji4Q5IuJqM8lds-lyZ5HM",
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
    ogImage = `${SITE_URL}/og-image.webp`,
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
  const canonicalUrl = cleanPath ? `${SITE_URL}/${cleanPath}` : `${SITE_URL}/`;

  const robotsConfig = noIndex
    ? {
        index: false,
        follow: false,
      }
    : GLOBAL_SEO_DEFAULTS.robots;

  const resolvedTitle = title
    ? typeof title === "string"
      ? { absolute: title }
      : title
    : GLOBAL_SEO_DEFAULTS.title.default;

  const displayTitle = typeof title === "string" ? title : GLOBAL_SEO_DEFAULTS.title.default;

  return {
    ...GLOBAL_SEO_DEFAULTS,
    title: resolvedTitle,
    description: description || GLOBAL_SEO_DEFAULTS.description,
    keywords: keywords.length > 0 ? keywords : GLOBAL_SEO_DEFAULTS.keywords,
    robots: robotsConfig,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      ...GLOBAL_SEO_DEFAULTS.openGraph,
      title: displayTitle,
      description: description || GLOBAL_SEO_DEFAULTS.openGraph.description,
      type: ogType,
      url: canonicalUrl,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: displayTitle,
        },
      ],
    },
    twitter: {
      ...GLOBAL_SEO_DEFAULTS.twitter,
      title: displayTitle,
      description: description || GLOBAL_SEO_DEFAULTS.twitter.description,
      images: [ogImage],
    },
  };
}
