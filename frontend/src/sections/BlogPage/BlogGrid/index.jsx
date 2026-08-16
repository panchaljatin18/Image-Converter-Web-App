"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Search, BookOpen } from "lucide-react";
import Container from "@/components/Container";
import Button from "@/components/Button";

const getPostCategory = (post) => {
  const toolSlug = (post?.frontmatter?.relatedToolSlug || "").toLowerCase();
  const slug = (post?.slug || "").toLowerCase();
  const title = (post?.frontmatter?.title || "").toLowerCase();
  const tags = (post?.frontmatter?.tags || "").toLowerCase();
  const focusKeyword = (post?.frontmatter?.focusKeyword || "").toLowerCase();

  const combined = `${toolSlug} ${slug} ${title} ${tags} ${focusKeyword}`;

  if (
    combined.includes("compress") ||
    combined.includes("optimiz") ||
    combined.includes("speed") ||
    combined.includes("vitals") ||
    combined.includes("quality")
  ) {
    return "Image Optimization";
  }

  if (
    combined.includes("crop") ||
    combined.includes("resize") ||
    combined.includes("resizer") ||
    combined.includes("dimension") ||
    combined.includes("scale")
  ) {
    return "Crop & Resize";
  }

  if (
    combined.includes("convert") ||
    combined.includes("heic") ||
    combined.includes("jpg") ||
    combined.includes("png") ||
    combined.includes("webp") ||
    combined.includes("pdf") ||
    combined.includes("avif") ||
    combined.includes("format")
  ) {
    return "Image Conversion";
  }

  return "Image Conversion";
};

export default function BlogGrid({ initialPosts = [] }) {
  const searchParams = useSearchParams();
  const query = searchParams ? searchParams.get("q") : null;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Guides");

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
    }
  }, [query]);

  const postsList = useMemo(() => {
    return (initialPosts || []).map((post) => ({
      ...post,
      category: getPostCategory(post),
    }));
  }, [initialPosts]);

  const categoriesList = useMemo(() => {
    const defaultCats = ["All Guides", "Image Conversion", "Image Optimization", "Crop & Resize"];
    const foundCats = new Set(defaultCats);
    postsList.forEach((p) => {
      if (p.category && p.category !== "General") foundCats.add(p.category);
    });
    return Array.from(foundCats);
  }, [postsList]);

  const filteredPosts = useMemo(() => {
    return postsList.filter((post) => {
      const matchesCategory = selectedCategory === "All Guides" || post.category === selectedCategory;
      const titleText = (post.frontmatter?.title || "").toLowerCase();
      const descText = (post.frontmatter?.description || "").toLowerCase();
      const contentText = (post.content || "").toLowerCase();
      const queryText = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !queryText ||
        titleText.includes(queryText) ||
        descText.includes(queryText) ||
        contentText.includes(queryText);

      return matchesCategory && matchesSearch;
    });
  }, [postsList, selectedCategory, searchQuery]);

  return (
    <Container className="py-16">
      {/* Search and Filters */}
      {postsList.length > 0 && (
        <div className="mb-12">
          <div className="max-w-md mx-auto mb-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
            <input
              type="text"
              placeholder="Search guides, tips, or articles..."
              aria-label="Search guides, tips, or articles"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-[#131325]/70 border border-white/10 rounded-2xl text-white placeholder-[#94a3b8] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-[0.95rem] shadow-inner font-['Outfit']"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                type="button"
                aria-label={`Filter by ${cat}`}
                aria-pressed={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-[0.85rem] font-semibold transition-all duration-200 border cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-[#6366f1] to-[#06b6d4] text-white border-transparent shadow-[0_4px_12px_rgba(99,102,241,0.25)] scale-102"
                    : "bg-white/5 text-[#cbd5e1] border-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid List of Posts */}
      {postsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 max-w-lg mx-auto bg-[#131325]/50 border border-white/6 p-10 rounded-3xl">
          <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <BookOpen size={28} />
          </div>
          <h3 className="text-xl font-bold text-white font-['Outfit']">Guides Coming Soon</h3>
          <p className="text-[#cbd5e1] text-sm leading-relaxed">
            Our content team is busy drafting detailed tutorials, visual optimization guides, and step-by-step image format manuals. Please check back shortly!
          </p>
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <div
              key={post.slug}
              className="bg-[#131325]/80 border border-white/8 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col hover:border-indigo-500/50 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(99,102,241,0.12)] group"
            >
              {/* Header Visual with Post Cover Image */}
              <div className="w-full h-[200px] relative overflow-hidden select-none border-b border-white/6 bg-[#090915]">
                {post.frontmatter.image && (
                  <Image
                    src={post.frontmatter.image}
                    alt={post.frontmatter.imageAlt || post.frontmatter.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-103"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    loading="lazy"
                  />
                )}
                <span
                  className="absolute top-4 right-4 py-1 px-3 rounded-full text-[0.7rem] font-bold uppercase tracking-wider border backdrop-blur-md bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                >
                  {post.category}
                </span>
              </div>

              {/* Card Contents */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[#94a3b8] text-[0.75rem] font-semibold uppercase tracking-wider mb-2 block">
                    {post.frontmatter.date} • {post.frontmatter.author || "ConvertGalaxy Team"}
                  </span>
                  <h3 className="text-lg font-bold font-['Outfit'] text-[#f8fafc] mb-3 group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {post.frontmatter.title}
                  </h3>
                  
                  <p className="text-[#cbd5e1] text-[0.875rem] leading-relaxed mb-6 line-clamp-3">
                    {post.frontmatter.description}
                  </p>
                </div>

                {/* Action Link Button */}
                <Link href={`/blog/${post.slug}`} aria-label={`Read ${post.frontmatter.title}`} className="no-underline w-full block mt-auto">
                  <Button variant="secondary" className="w-full justify-center group/btn text-[0.9rem] py-2.5">
                    Read Guide
                    <ArrowRight size={15} className="transition-transform duration-200 group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-[#cbd5e1] text-[1.1rem]">No guides found matching your search criteria.</p>
        </div>
      )}
    </Container>
  );
}


