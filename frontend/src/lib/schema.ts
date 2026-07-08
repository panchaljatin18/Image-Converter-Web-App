import { SITE_URL } from "./metadata";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  item: string;
}

/**
 * Base Organization Schema
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    "name": "Convert Galaxy",
    "url": SITE_URL,
    "logo": {
      "@type": "ImageObject",
      "url": `${SITE_URL}/C.png`,
      "width": "512",
      "height": "512"
    },
    "sameAs": [
      "https://x.com/ConvertGalaxy",
      "https://facebook.com/ConvertGalaxy"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "support@convertgalaxy.com",
      "url": `${SITE_URL}/contact`
    }
  };
}

/**
 * Homepage Schema (Combined WebSite, Organization, SoftwareApplication suite, and SearchAction)
 */
export function getHomepageSchema() {
  return [
    getOrganizationSchema(),
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      "url": SITE_URL,
      "name": "Convert Galaxy",
      "description": "Free Online Image Converter, Compressor & Editor",
      "publisher": {
        "@id": `${SITE_URL}/#organization`
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${SITE_URL}/blog?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#application_suite`,
      "name": "Convert Galaxy Tools Suite",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires HTML5, WebAssembly support. Runs offline locally.",
      "url": SITE_URL,
      "description": "Enterprise-grade local browser-based image conversions, compression, resizing and editing toolsuite.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "publisher": {
        "@id": `${SITE_URL}/#organization`
      }
    },
    getBreadcrumbSchema([
      { name: "Home", item: SITE_URL }
    ])
  ];
}

/**
 * Dynamic Tool/WebApplication Schema
 */
export function getWebApplicationSchema(tool: {
  name: string;
  path: string;
  description: string;
  category: string;
  faqs?: FAQItem[];
}) {
  const toolUrl = `${SITE_URL}/${tool.path}`;
  const schemas: any[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "@id": `${toolUrl}/#webapplication`,
      "name": tool.name,
      "url": toolUrl,
      "description": tool.description,
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires HTML5 browser.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "publisher": {
        "@id": `${SITE_URL}/#organization`
      }
    },
    getBreadcrumbSchema([
      { name: "Home", item: SITE_URL },
      { name: "Tools", item: `${SITE_URL}/tools` },
      { name: tool.name, item: toolUrl }
    ])
  ];

  if (tool.faqs && tool.faqs.length > 0) {
    schemas.push(getFAQSchema(tool.faqs));
  }

  return schemas;
}

/**
 * FAQ Schema
 */
export function getFAQSchema(faqs: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * Breadcrumb Schema
 */
export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item
    }))
  };
}

/**
 * Blog/Guide Page Listing Schema
 */
export function getBlogSchema(posts: Array<{ title: string; desc: string; url: string; date: string }>) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      "@id": `${SITE_URL}/blog/#blog`,
      "name": "Convert Galaxy Guides",
      "description": "Learn tips and tricks for image conversions, resizing, compression, and visual asset workflows.",
      "publisher": {
        "@id": `${SITE_URL}/#organization`
      },
      "blogPost": posts.map((post) => ({
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.desc,
        "url": post.url,
        "datePublished": post.date
      }))
    },
    getBreadcrumbSchema([
      { name: "Home", item: SITE_URL },
      { name: "Blog", item: `${SITE_URL}/blog` }
    ])
  ];
}

/**
 * Detailed BlogPosting Schema
 */
export function getBlogPostingSchema(post: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  authorName?: string;
}) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.description,
      "image": post.image || `${SITE_URL}/og-image.png`,
      "datePublished": post.datePublished,
      "dateModified": post.dateModified || post.datePublished,
      "url": post.url,
      "author": {
        "@type": "Person",
        "name": post.authorName || "Convert Galaxy Team",
        "url": SITE_URL
      },
      "publisher": {
        "@id": `${SITE_URL}/#organization`
      }
    },
    getBreadcrumbSchema([
      { name: "Home", item: SITE_URL },
      { name: "Blog", item: `${SITE_URL}/blog` },
      { name: post.title, item: post.url }
    ])
  ];
}

/**
 * Contact Page Schema
 */
export function getContactSchema() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "@id": `${SITE_URL}/contact/#contact`,
      "url": `${SITE_URL}/contact`,
      "name": "Contact Convert Galaxy",
      "description": "Reach out to the Convert Galaxy team for feedback, feature requests, or technical support.",
      "mainEntity": {
        "@id": `${SITE_URL}/#organization`
      }
    },
    getBreadcrumbSchema([
      { name: "Home", item: SITE_URL },
      { name: "Contact", item: `${SITE_URL}/contact` }
    ])
  ];
}

/**
 * About Page Schema
 */
export function getAboutSchema() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "@id": `${SITE_URL}/about/#about`,
      "url": `${SITE_URL}/about`,
      "name": "About Convert Galaxy",
      "description": "Learn about the mission, architecture, and technology behind Convert Galaxy browser-based image editor.",
      "mainEntity": {
        "@id": `${SITE_URL}/#organization`
      }
    },
    getBreadcrumbSchema([
      { name: "Home", item: SITE_URL },
      { name: "About", item: `${SITE_URL}/about` }
    ])
  ];
}
