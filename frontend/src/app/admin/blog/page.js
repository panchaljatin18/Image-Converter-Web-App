"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { PlusCircle, Search, Edit, FileText, Globe, Edit3, Loader2, Trash2 } from "lucide-react";

export default function BlogAdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Load posts with AbortController for clean teardown
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

  const handleDeleteClick = React.useCallback(async (slug, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      // Optimistic state update
      setPosts((prev) => prev.filter((p) => p.slug !== slug));

      try {
        const res = await fetch(`/api/admin/blog/${slug}`, { method: "DELETE" });
        const data = await res.json();
        if (!data.success) {
          alert(data.error || "Failed to delete post.");
          fetchPosts(); // Rollback if server fails
        }
      } catch (err) {
        alert("Error deleting post from server.");
        fetchPosts(); // Rollback
      }
    }
  }, [fetchPosts]);

  useEffect(() => {
    const cleanup = fetchPosts();
    return () => cleanup && cleanup();
  }, [fetchPosts]);

  // Filter posts efficiently
  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const query = searchQuery.toLowerCase().trim();
    return posts.filter((post) => {
      const title = (post.frontmatter?.title || "").toLowerCase();
      const slug = (post.slug || "").toLowerCase();
      return title.includes(query) || slug.includes(query);
    });
  }, [posts, searchQuery]);

  // Status metrics
  const metrics = useMemo(() => {
    const total = posts.length;
    const published = posts.filter((p) => p.frontmatter.status === "Published").length;
    const drafts = total - published;
    return { total, published, drafts };
  }, [posts]);

  return (
    <div className="space-y-8 text-left">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Outfit'] font-black text-2xl md:text-3xl text-white">
            Admin Dashboard
          </h1>
          <p className="text-sm text-[#9494a3] mt-1 font-['Outfit']">
            Draft, edit, and organize local markdown guides and SEO content assets.
          </p>
        </div>
        <Link href="/admin/blog/new" className="no-underline">
          <button className="admin-btn admin-btn-primary shrink-0 cursor-pointer">
            <PlusCircle size={16} /> Add New Article
          </button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="admin-card py-5 px-6 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#9494a3] uppercase font-bold tracking-wider">Total Articles</span>
            <h2 className="text-3xl font-bold text-white mt-1">{metrics.total}</h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
            <FileText size={20} />
          </div>
        </div>

        <div className="admin-card py-5 px-6 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#9494a3] uppercase font-bold tracking-wider">Published</span>
            <h2 className="text-3xl font-bold text-[#22c55e] mt-1">{metrics.published}</h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Globe size={20} />
          </div>
        </div>

        <div className="admin-card py-5 px-6 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#9494a3] uppercase font-bold tracking-wider">Drafts</span>
            <h2 className="text-3xl font-bold text-[#f59e0b] mt-1">{metrics.drafts}</h2>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
            <Edit3 size={20} />
          </div>
        </div>
      </div>

      {/* Filter and Content panel */}
      <div className="admin-card">
        {/* Search row */}
        <div className="relative mb-6 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b6b7a]" size={16} />
          <input
            type="text"
            placeholder="Search articles by title or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-input text-sm"
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
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <Loader2 className="animate-spin text-indigo-400" size={28} />
            <p className="text-xs text-[#cbd5e1] font-medium font-['Outfit']">Syncing markdown posts database...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-[#2a2a38] rounded-2xl">
            <p className="text-[#9494a3] text-sm font-medium">No blog posts found matching your criteria.</p>
          </div>
        ) : (
          /* Table listing posts */
          <div className="overflow-x-auto">
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
                      <td className="font-semibold text-white max-w-[280px] truncate">
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
        )}
      </div>
    </div>
  );
}
