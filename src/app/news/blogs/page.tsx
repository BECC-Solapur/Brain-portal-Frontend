"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PenSquare,
  ArrowRight,
  BookOpen,
  Calendar,
  User,
  X,
  Image as ImageIcon,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { BLOGS_DATA, BlogItem } from "@/data/blogsData";

function BlogImageArea({
  src,
  alt,
  category,
}: {
  src: string;
  alt: string;
  category: string;
}) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-slate-100 via-[#f4f2fa] to-indigo-50/50 border-b border-[#e5e7eb] flex flex-col items-center justify-center group">
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-xs border border-[#d8d5e6] text-[#3f2f7a] mb-1.5 transition-transform group-hover:scale-110">
            <ImageIcon className="h-5 w-5 stroke-[1.75]" />
          </div>
          <span className="text-[10px] font-semibold text-[#3f2f7a] uppercase tracking-wider">
            Image Area
          </span>
          <span className="text-[9px] text-slate-400 mt-0.5">Ready for update</span>
        </div>
      )}
      <div className="absolute top-2.5 left-2.5 z-10">
        <span className="rounded-full bg-white/95 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-bold text-[#3f2f7a] shadow-xs border border-[#d8d5e6]">
          {category}
        </span>
      </div>
    </div>
  );
}

export default function BlogsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeBlog, setActiveBlog] = useState<BlogItem | null>(null);

  const categories = ["All", "Intelligence", "Analysis", "Psychology", "Counselling"];

  const filteredBlogs =
    selectedCategory === "All"
      ? BLOGS_DATA
      : BLOGS_DATA.filter(
          (b) => b.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="min-h-screen bg-[#e9eaf1] text-[#171717] selection:bg-[#3f2f7a]/10 selection:text-[#3f2f7a] font-sans">
      <Navbar />

      <section className="py-14 bg-white border-b border-[#d8d5e6] bg-grid-dots text-center">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#fff1f0] text-[#e2231a] border border-[#f4b4b0]/60 mb-3">
            <PenSquare className="w-3.5 h-3.5" /> Research & Pedagogy
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-medium tracking-tight text-[#171717] leading-tight">
            Articles, Research & Educational Blogs
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#525252] max-w-xl mx-auto font-normal">
            Insights on cognitive learning, neuro-mapping, memory optimization, and global university admissions.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count =
                cat === "All"
                  ? BLOGS_DATA.length
                  : BLOGS_DATA.filter(
                      (b) => b.category.toLowerCase() === cat.toLowerCase()
                    ).length;

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-[#2c2159] text-white shadow-sm"
                      : "bg-[#f6f3fb] text-[#525252] hover:bg-[#eae6f5] hover:text-[#2c2159]"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      isSelected ? "bg-white/20 text-white" : "bg-[#e5e0f5] text-[#3f2f7a]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredBlogs.map((b) => (
            <div
              key={b._id}
              onClick={() => setActiveBlog(b)}
              className="bg-white rounded-[14px] border border-[#d8d5e6] overflow-hidden hover:border-[#2c2159] hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <BlogImageArea src={b.imageUrl} alt={b.title} category={b.category} />

                <div className="p-4">
                  <div className="flex items-center justify-between text-[10px] text-[#737373] mb-1.5">
                    <span>By {b.author}</span>
                    <span>
                      {new Date(b.createdAt).toLocaleDateString("en-GB", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-[#171717] group-hover:text-[#3f2f7a] transition-colors leading-snug line-clamp-2">
                    {b.title}
                  </h3>
                  <p className="text-xs text-[#525252] mt-1.5 line-clamp-3 leading-relaxed font-normal">
                    {b.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-[#f6f3fb] mt-1">
                <div className="text-xs font-medium text-[#3f2f7a] flex items-center justify-between pt-2.5">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/counselling/inquiry">
            <Button size="md" variant="primary" icon={<ArrowRight className="w-3.5 h-3.5" />} iconPosition="right">
              Explore Counselling & Mentorship
            </Button>
          </Link>
        </div>
      </section>

      {/* Blog Article Reader Modal */}
      {activeBlog && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveBlog(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveBlog(null)}
              className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md hover:bg-slate-100 hover:text-black transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative">
              <BlogImageArea
                src={activeBlog.imageUrl}
                alt={activeBlog.title}
                category={activeBlog.category}
              />
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mb-3">
                <span className="rounded-full bg-[#f6f3fb] px-3 py-1 font-semibold text-[#3f2f7a] border border-[#d8d5e6]">
                  {activeBlog.category}
                </span>
                <span className="flex items-center gap-1 text-[#737373]">
                  <Calendar className="h-3.5 w-3.5 text-[#3f2f7a]" />
                  {new Date(activeBlog.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1 text-[#737373]">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  By <strong className="text-slate-800 font-medium">{activeBlog.author}</strong>
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-semibold text-[#171717] leading-snug">
                {activeBlog.title}
              </h2>

              <p className="mt-3 text-sm text-[#525252] leading-relaxed border-l-2 border-[#3f2f7a] pl-3 py-0.5">
                {activeBlog.description}
              </p>

              <div className="mt-6 border-t border-slate-100 pt-6">
                <div
                  className="prose prose-sm max-w-none text-[#333333] leading-relaxed [&>h1]:text-lg [&>h1]:font-bold [&>h3]:text-base [&>h3]:font-semibold [&>h3]:mt-4 [&>h3]:mb-2 [&>p]:mb-3 [&>div]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3"
                  dangerouslySetInnerHTML={{ __html: activeBlog.content }}
                />
              </div>

              {activeBlog.tags && activeBlog.tags.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                  {activeBlog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveBlog(null)}
                  className="rounded-xl bg-[#2c2159] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3f2f7a]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
