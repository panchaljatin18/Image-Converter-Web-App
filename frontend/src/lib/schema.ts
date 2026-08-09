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
      "url": `${SITE_URL}/C.webp`,
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
      "email": "jmpanchal394@gmail.com",
      "url": `${SITE_URL}/contact`
    }
  };
}

export const HOMEPAGE_FAQS: FAQItem[] = [
  {
    question: "Are my images stored on your servers?",
    answer: "No. All image processing happens entirely in your browser using client-side JavaScript and Canvas API. Your images never leave your device, ensuring complete privacy."
  },
  {
    question: "Is ConvertGalaxy completely free?",
    answer: "Yes! All tools on ConvertGalaxy are 100% free to use with no hidden costs, subscriptions, or account requirements."
  },
  {
    question: "What image formats do you support?",
    answer: "We support JPG/JPEG, PNG, WebP, GIF, BMP, and TIFF formats across our various tools."
  },
  {
    question: "Is there a file size limit?",
    answer: "Most tools support files up to 50MB. For batch operations, we recommend files under 20MB each for optimal performance."
  }
];

export const ALL_FAQS: FAQItem[] = [
  // Privacy & Security
  {
    question: "Are my images stored on your servers?",
    answer: "No. All image processing happens entirely in your browser using client-side JavaScript and the Canvas API. Your files never leave your device, ensuring complete privacy and security."
  },
  {
    question: "Do you collect any personal data?",
    answer: "We do not collect, store, or share any personal data or images. Our tools are fully client-side. We may use anonymous analytics (page views) to improve the service."
  },
  {
    question: "Is it safe to use ConvertGalaxy for sensitive images?",
    answer: "Yes. Since all processing is local to your browser and nothing is uploaded to our servers, your sensitive images remain completely private."
  },
  {
    question: "Do you use cookies?",
    answer: "We use minimal cookies for basic site functionality and anonymous analytics. We do not use tracking cookies for advertising purposes."
  },
  // Tools & Features
  {
    question: "What image formats do you support?",
    answer: "We support JPG/JPEG, PNG, WebP, GIF, and BMP across our various tools. Some tools like the PDF converter also handle PDF files."
  },
  {
    question: "Is there a file size limit?",
    answer: "Most tools support files up to 50MB. For batch operations and PDF tools, we recommend files under 20MB each for best performance."
  },
  {
    question: "Can I process multiple images at once?",
    answer: "Yes! Our Image Compressor and Image to PDF tools support batch/multiple file uploads. Other tools process one file at a time for maximum control."
  },
  {
    question: "Will image quality be affected during conversion?",
    answer: "It depends on the output format. PNG is lossless, so quality is preserved perfectly. JPEG and WebP use lossy compression — our quality sliders let you balance file size vs quality."
  },
  {
    question: "Why does the converted file look slightly different?",
    answer: "If converting from PNG with transparency to JPG, transparent areas are filled with a solid color (white by default). Use our color picker to choose a different fill."
  },
  // Pricing & Account
  {
    question: "Is ConvertGalaxy really free?",
    answer: "Yes, 100% free. All tools are available without any subscription, account, or payment. We are ad-supported to keep the service free."
  },
  {
    question: "Do I need to create an account?",
    answer: "No. You can use every tool immediately without registering or logging in. Just open a tool and start processing."
  },
  {
    question: "Will you add premium features?",
    answer: "We may introduce optional premium features in the future, but all current tools will remain free forever."
  },
  // Technical
  {
    question: "Which browsers are supported?",
    answer: "ConvertGalaxy works on all modern browsers: Chrome 80+, Firefox 75+, Safari 14+, and Edge 80+. We recommend Chrome or Firefox for the best experience."
  },
  {
    question: "Does it work on mobile?",
    answer: "Yes! All tools are fully responsive and work on iOS and Android browsers. The crop tool works with touch events too."
  },
  {
    question: "Why is processing slow on large files?",
    answer: "Large files require more memory and CPU time in the browser. For files over 10MB, processing may take a few seconds. Using a desktop browser helps with large files."
  },
  {
    question: "Can I use ConvertGalaxy offline?",
    answer: "Basic tools work offline once the page is loaded. PDF-related tools require an internet connection to load the PDF.js library."
  }
];

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
    getFAQSchema(HOMEPAGE_FAQS),
    getBreadcrumbSchema([
      { name: "Home", item: SITE_URL }
    ])
  ];
}

export interface StepItem {
  title: string;
  text: string;
}

/**
 * HowTo Schema
 */
export function getHowToSchema(tool: {
  name: string;
  url: string;
  description: string;
  steps: StepItem[];
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to Use ${tool.name}`,
    "description": tool.description,
    "image": tool.image || `${SITE_URL}/og-image.webp`,
    "step": tool.steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.title,
      "text": step.text,
      "url": `${tool.url}#step-${index + 1}`
    }))
  };
}

/**
 * SoftwareApplication Schema (for individual tool pages)
 */
export function getSoftwareApplicationSchema(tool: {
  name: string;
  path: string;
  description: string;
}) {
  const toolUrl = `${SITE_URL}/${tool.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${toolUrl}/#softwareapplication`,
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
  };
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
  steps?: StepItem[];
  image?: string;
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
    getSoftwareApplicationSchema(tool),
    getBreadcrumbSchema([
      { name: "Home", item: SITE_URL },
      { name: "Tools", item: `${SITE_URL}/tools` },
      { name: tool.name, item: toolUrl }
    ])
  ];

  if (tool.faqs && tool.faqs.length > 0) {
    schemas.push(getFAQSchema(tool.faqs));
  }

  if (tool.steps && tool.steps.length > 0) {
    schemas.push(
      getHowToSchema({
        name: tool.name,
        url: toolUrl,
        description: tool.description,
        steps: tool.steps,
        image: tool.image,
      })
    );
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
      "image": post.image || `${SITE_URL}/og-image.webp`,
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
