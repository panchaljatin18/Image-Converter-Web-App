import React from "react";
import StructuredData from "./StructuredData";
import {
  getHomepageSchema,
  getAboutSchema,
  getContactSchema,
  getFAQSchema,
  getWebApplicationSchema,
  getBlogSchema,
  getBlogPostingSchema,
  FAQItem,
} from "@/lib/schema";

interface SEOProps {
  type: "homepage" | "about" | "contact" | "faq" | "tool" | "blog" | "blogpost";
  tool?: {
    name: string;
    path: string;
    description: string;
    category: string;
    faqs?: FAQItem[];
  };
  faqs?: FAQItem[];
  posts?: Array<{ title: string; desc: string; url: string; date: string }>;
  post?: {
    title: string;
    description: string;
    url: string;
    datePublished: string;
    dateModified?: string;
    image?: string;
    authorName?: string;
  };
}

/**
 * SEO Helper Component to inject the appropriate JSON-LD structured schema
 * onto the page based on the page type.
 */
export default function SEO({ type, tool, faqs, posts, post }: SEOProps) {
  let schemaData: any = null;

  switch (type) {
    case "homepage":
      schemaData = getHomepageSchema();
      break;
    case "about":
      schemaData = getAboutSchema();
      break;
    case "contact":
      schemaData = getContactSchema();
      break;
    case "faq":
      if (faqs) schemaData = getFAQSchema(faqs);
      break;
    case "tool":
      if (tool) schemaData = getWebApplicationSchema(tool);
      break;
    case "blog":
      if (posts) schemaData = getBlogSchema(posts);
      break;
    case "blogpost":
      if (post) schemaData = getBlogPostingSchema(post);
      break;
    default:
      break;
  }

  if (!schemaData) return null;

  return <StructuredData data={schemaData} />;
}
