import React from "react";

interface StructuredDataProps {
  data: Record<string, any> | Array<Record<string, any>>;
}

/**
 * Next.js Server Component to inject Structured Data (JSON-LD) dynamically in page bodies or heads.
 */
export default function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
