"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { PlusCircle, Search, Edit, FileText, Globe, Edit3, Loader2, Trash2, Calendar, Tag } from "lucide-react";

export default function BlogAdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchPosts = React.useCallback(() => {
    const controller = new AbortController();
    setLoading(true);
    setErrorMsg("");

    fetch("/api/admin/blog", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.posts) {
          setPosts(data.posts);
        } else {
          setErrorMsg("Failed to retrieve blog posts.");
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setErrorMsg("Error fetching blog posts from server.");
          console.error(err);
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const handleDeleteClick = React.useCallback(
    async (slug, title) => {
      if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
        setPosts((prev) => prev.filter((p) => p.slug !== slug));
        try {
          const res = await fetch(`/api/admin/blog/${slug}`, { method: "DELETE" });
          const data = await res.json();
          if (!data.success) {
            alert(data.error || "Failed to delete post.");
            fetchPosts();
          }
        } catch (err) {
          alert("Error deleting post from server.");
          fetchPosts();
        }
      }
    },
    [fetchPosts]
  );

  useEffect(() => {
    const cleanup = fetchPosts();
    return () => cleanup && cleanup();
  }, [fetchPosts]);

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const query = searchQuery.toLowerCase().trim();
    return posts.filter((post) => {
      const title = (post.frontmatter?.title || "").toLowerCase();
      const slug = (post.slug || "").toLowerCase();
      return title.includes(query) || slug.includes(query);
    });
  }, [posts, searchQuery]);

  const metrics = useMemo(() => {
    const total = posts.length;
    const published = posts.filter((p) => p.frontmatter.status === "Published").length;
    const drafts = total - published;
    return { total, published, drafts };
  }, [posts]);

  return (
    <div className="space-y-6 sm:space-y-8 text-left">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="font-['Outfit'] font-black text-xl sm:text-2xl md:text-3xl text-white">
            Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-[#9494a3] mt-1 font-['Outfit']">
            Draft, edit, and organize local markdown guides and SEO content assets.
          </p>
        </div>
        <Link href="/admin/blog/new" className="no-underline shrink-0">
          <button className="admin-btn admin-btn-primary cursor-pointer w-full sm:w-auto justify-center min-h-[44px]">
            <PlusCircle size={16} /> Add New Article
          </button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-6">
        {[
          {
            label: "Total Articles",
            value: metrics.total,
            color: "text-white",
            bg: "bg-indigo-500/10",
            iconColor: "text-indigo-400",
            icon: <FileText size={20} />,
          },
          {
            label: "Published",
            value: metrics.published,
            color: "text-[#22c55e]",
            bg: "bg-emerald-500/10",
            iconColor: "text-emerald-400",
            icon: <Globe size={20} />,
          },
          {
            label: "Drafts",
            value: metrics.drafts,
            color: "text-[#f59e0b]",
            bg: "bg-amber-500/10",
            iconColor: "text-amber-400",
            icon: <Edit3 size={20} />,
          },
        ].map(({ label, value, color, bg, iconColor, icon }) => (
          <div key={label} className="admin-card py-4 sm:py-5 px-4 sm:px-6 flex items-center justify-between">
            <div>
              <span className="text-[10px] sm:text-xs text-[#9494a3] uppercase font-bold tracking-wider">
                {label}
              </span>
              <h2 className={`text-2xl sm:text-3xl font-bold mt-1 ${color}`}>{value}</h2>
            </div>
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${bg} flex items-center justify-center ${iconColor}`}>
              {icon}
            </div>
          </div>
        ))}
      </div>

      {/* Filter and Content panel */}
      <div className="admin-card">
        {/* Search row */}
        <div className="relative mb-5 sm:mb-6 w-full sm:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b6b7a]" size={16} />
          <input
            type="text"
            placeholder="Search by title or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-input text-sm w-full"
            style={{ paddingLeft: "2.75rem" }}
          />
        </div>

        {errorMsg && (
          <div className="p-4 mb-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm font-medium">
            {errorMsg}
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 space-y-3">
            <Loader2 className="animate-spin text-indigo-400" size={28} />
            <p className="text-xs text-[#cbd5e1] font-medium font-['Outfit']">
              Syncing markdown posts database...
            </p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 sm:py-16 border border-dashed border-[#2a2a38] rounded-2xl">
            <p className="text-[#9494a3] text-sm font-medium">
              No blog posts found matching your criteria.
            </p>
          </div>
        ) : (
          <>
            {/* ─── DESKTOP TABLE (md+) ─── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Article Title</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => {
                    const isPublished = post.frontmatter.status === "Published";
                    return (
                      <tr key={post.slug}>
                        <td className="font-semibold text-white max-w-[280px]">
                          <div>
                            <div className="truncate text-[0.95rem]">{post.frontmatter.title}</div>
                            <div className="text-xs font-mono text-[#6b6b7a] mt-0.5">/blog/{post.slug}</div>
                          </div>
                        </td>
                        <td className="text-[#cbd5e1] text-[0.9rem]">{post.frontmatter.date}</td>
                        <td>
                          <span
                            className={`admin-badge ${
                              isPublished ? "admin-badge-published" : "admin-badge-draft"
                            }`}
                          >
                            {post.frontmatter.status || "Draft"}
                          </span>
                        </td>
                        <td className="flex items-center gap-2">
                          <Link href={`/admin/blog/${post.slug}`} className="no-underline">
                            <button className="admin-btn admin-btn-secondary py-1.5 px-3 flex items-center gap-1.5 cursor-pointer text-xs">
                              <Edit size={12} /> Edit
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(post.slug, post.frontmatter.title)}
                            className="admin-btn bg-red-500/10 border border-red-500/30 hover:bg-red-600 text-red-400 hover:text-white py-1.5 px-3 flex items-center gap-1.5 cursor-pointer text-xs transition-all duration-150"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ─── MOBILE CARD LIST (< md) ─── */}
            <div className="md:hidden space-y-3">
              {filteredPosts.map((post) => {
                const isPublished = post.frontmatter.status === "Published";
                return (
                  <div
                    key={post.slug}
                    className="admin-card p-4 space-y-3 border border-white/8 hover:border-indigo-500/30 transition-colors"
                  >
                    {/* Title + Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white text-sm leading-snug line-clamp-2">
                          {post.frontmatter.title}
                        </p>
                        <p className="text-[10px] font-mono text-[#6b6b7a] mt-0.5 truncate">
                          /blog/{post.slug}
                        </p>
                      </div>
                      <span
                        className={`admin-badge shrink-0 ${
                          isPublished ? "admin-badge-published" : "admin-badge-draft"
                        }`}
                      >
                        {post.frontmatter.status || "Draft"}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-[#9494a3] text-xs">
                      <Calendar size={12} />
                      <span>{post.frontmatter.date}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-1 border-t border-white/5">
                      <Link href={`/admin/blog/${post.slug}`} className="no-underline flex-1">
                        <button className="admin-btn admin-btn-secondary w-full justify-center py-2 text-xs min-h-[40px] cursor-pointer">
                          <Edit size={13} /> Edit Post
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(post.slug, post.frontmatter.title)}
                        className="admin-btn bg-red-500/10 border border-red-500/30 hover:bg-red-600 text-red-400 hover:text-white py-2 px-4 flex items-center gap-1.5 cursor-pointer text-xs min-h-[40px] transition-all"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
