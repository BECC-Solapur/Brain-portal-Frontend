"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Video, Play, ExternalLink, ArrowRight, X, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { YOUTUBE_CLIPS_DATA, YouTubeClipItem } from "@/data/youtubeClipsData";

function ClipThumbnailArea({
  thumbnailUrl,
  title,
  category,
}: {
  thumbnailUrl: string;
  title: string;
  category: string;
}) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-[#1e163b] via-[#2c2159] to-[#120d26] border-b border-slate-100 flex items-center justify-center group">
      {thumbnailUrl && !hasError ? (
        <img
          src={thumbnailUrl}
          alt={title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover opacity-90 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-3 text-center">
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white border border-white/20 transition-transform group-hover:scale-110">
            <Video className="h-6 w-6" />
          </div>
          <span className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">
            Video Preview Area
          </span>
          <span className="text-[9px] text-white/50 mt-0.5">Ready for update</span>
        </div>
      )}

      {/* Center Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#e2231a] shadow-xl transition-transform group-hover:scale-110">
          <Play className="ml-0.5 h-6 w-6 fill-current" />
        </span>
      </div>

      {/* Category Overlay Tag */}
      <div className="absolute top-3 left-3 z-10">
        <span className="rounded-full bg-black/70 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-semibold text-white border border-white/20">
          {category}
        </span>
      </div>
    </div>
  );
}

export default function YouTubeClipsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeClip, setActiveClip] = useState<YouTubeClipItem | null>(null);

  const categories = ["All", "Career Counselling"];

  const filteredClips =
    selectedCategory === "All"
      ? YOUTUBE_CLIPS_DATA
      : YOUTUBE_CLIPS_DATA.filter(
          (c) => c.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="min-h-screen bg-[#e9eaf1] text-[#171717] selection:bg-[#3f2f7a]/10 selection:text-[#3f2f7a] font-sans">
      <Navbar />

      <section className="py-14 bg-white border-b border-[#d8d5e6] bg-grid-dots text-center">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200/60 mb-3">
            <Video className="w-3.5 h-3.5 text-red-600" /> Video Learning Center
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-medium tracking-tight text-[#171717] leading-tight">
            YouTube Clips & Career Masterclasses
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#525252] max-w-xl mx-auto font-normal">
            Watch recorded expert lectures, counselling symposiums, education fairs, and student guidance masterclasses.
          </p>

          {/* Category Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count =
                cat === "All"
                  ? YOUTUBE_CLIPS_DATA.length
                  : YOUTUBE_CLIPS_DATA.filter(
                      (c) => c.category.toLowerCase() === cat.toLowerCase()
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredClips.map((clip) => (
            <div
              key={clip._id}
              onClick={() => setActiveClip(clip)}
              className="bg-white rounded-[16px] border border-[#d8d5e6] overflow-hidden hover:border-[#2c2159] hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <ClipThumbnailArea
                  thumbnailUrl={clip.thumbnailUrl}
                  title={clip.title}
                  category={clip.category}
                />

                <div className="p-5">
                  <div className="flex items-center justify-between text-[11px] text-[#737373] mb-1.5">
                    <span className="font-semibold text-[#3f2f7a]">{clip.category}</span>
                    <span>By {clip.author}</span>
                  </div>
                  <h3 className="text-base font-semibold text-[#171717] group-hover:text-[#3f2f7a] transition-colors leading-snug">
                    {clip.title}
                  </h3>
                  <div
                    className="mt-2 text-xs leading-relaxed text-[#525252] line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: clip.description }}
                  />
                </div>
              </div>

              <div className="px-5 pb-4 pt-3 flex items-center justify-between border-t border-[#f6f3fb] text-xs">
                <span className="text-[#3f2f7a] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  <Play className="h-3.5 w-3.5 fill-[#3f2f7a]" /> Watch Masterclass
                </span>
                <a
                  href={clip.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-medium text-red-600 hover:text-red-700 flex items-center gap-1 text-xs"
                >
                  YouTube <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/counselling/inquiry">
            <Button size="md" variant="primary" icon={<ArrowRight className="w-3.5 h-3.5" />} iconPosition="right">
              Book a 1-on-1 Counselling Session
            </Button>
          </Link>
        </div>
      </section>

      {/* YouTube Video Player Modal */}
      {activeClip && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveClip(null)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-[#17112f] text-white shadow-2xl border border-white/15"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveClip(null)}
              className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white shadow-md hover:bg-white/20 transition-colors"
              aria-label="Close video"
            >
              <X className="h-5 w-5" />
            </button>

            {/* YouTube Video Embed Player */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`${activeClip.embedUrl}?autoplay=1`}
                title={activeClip.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>

            <div className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-white/70 mb-2">
                <span className="rounded-full bg-white/10 px-3 py-1 font-semibold text-[#f4c76a] border border-white/15">
                  {activeClip.category}
                </span>
                <a
                  href={activeClip.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#f4c76a] hover:underline"
                >
                  Open on YouTube <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <h2 className="text-lg font-semibold text-white leading-snug">
                {activeClip.title}
              </h2>

              <div
                className="mt-3 text-xs sm:text-sm text-white/75 leading-relaxed border-t border-white/10 pt-3"
                dangerouslySetInnerHTML={{ __html: activeClip.description }}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
