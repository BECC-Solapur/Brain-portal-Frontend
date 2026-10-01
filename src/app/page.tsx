"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Megaphone,
  Play,
  Quote,
  X,
  Calendar,
  User,
  Image as ImageIcon,
  Video,
  ExternalLink,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WorkshopsInitiativesSection from "@/components/WorkshopsInitiativesSection";
import ThreeImageCloud from "@/components/ThreeImageCloud";
import { TESTIMONIALS_DATA } from "@/data/testimonialsData";
import { BLOGS_DATA, BlogItem } from "@/data/blogsData";
import { YOUTUBE_CLIPS_DATA, YouTubeClipItem } from "@/data/youtubeClipsData";

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
    <div className="relative h-44 sm:h-48 w-full overflow-hidden rounded-xl bg-[#f0f2f6] flex items-center justify-center">
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-3 text-center w-full h-full bg-slate-100">
          <ImageIcon className="h-6 w-6 text-[#3f2f7a] mb-1" />
          <span className="text-[10px] font-semibold text-[#3f2f7a] uppercase">{category}</span>
        </div>
      )}
    </div>
  );
}

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
    <div className="relative h-48 sm:h-52 w-full overflow-hidden rounded-xl bg-[#1e163b] flex items-center justify-center group/thumb">
      {thumbnailUrl && !hasError ? (
        <img
          src={thumbnailUrl}
          alt={title}
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center p-3 text-center">
          <Video className="h-6 w-6 text-white/50" />
        </div>
      )}

      {/* Center Play Button Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#e2231a] shadow-lg transition-transform group-hover:scale-110">
          <Play className="ml-0.5 h-4 w-4 fill-current" />
        </span>
      </div>
    </div>
  );
}

const testimonials = TESTIMONIALS_DATA.filter((t) => t.isActive).slice(0, 9);

function TestimonialAvatar({ src, name }: { src: string; name: string }) {
  const [hasError, setHasError] = useState(false);
  const initials = name
    .replace(/^Mr\.\s*|^Mrs\.\s*|^Dr\.\s*/i, "")
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#d8d5e6] bg-[#f6f3fb] text-[11px] font-bold text-[#3f2f7a]">
      {!hasError && src ? (
        <img
          src={src}
          alt={name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <span>{initials || "U"}</span>
      )}
    </div>
  );
}

function SectionHeading({ eyebrow, title, text, dark = false }: { eyebrow: string; title: string; text?: string; dark?: boolean }) {
  return (
    <div className="mb-8 max-w-2xl">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#3f2f7a]">{eyebrow}</p>
      <h2 className={`text-2xl font-medium tracking-tight sm:text-3xl ${dark ? "text-white" : "text-[#171717]"}`}>{title}</h2>
      {text && <p className={`mt-2 text-sm leading-relaxed ${dark ? "text-white/65" : "text-[#525252]"}`}>{text}</p>}
    </div>
  );
}

export default function HomePage() {
  const [activeBlog, setActiveBlog] = useState<BlogItem | null>(null);
  const [activeClip, setActiveClip] = useState<YouTubeClipItem | null>(null);

  return (
    <div className="min-h-screen bg-[#e9eaf1] font-sans text-[#171717] selection:bg-[#3f2f7a]/10 selection:text-[#3f2f7a]">
      <Navbar matchHeroBackground />

      <div className="px-3 pt-3 pb-6 sm:px-5 sm:pt-4 sm:pb-8 lg:px-6 lg:pt-3 lg:pb-10">
        {/* Hero Section Card */}
        <section className="relative min-h-[560px] w-full overflow-hidden rounded-t-[28px] sm:rounded-t-[36px] lg:rounded-t-[42px] rounded-b-none bg-[#2c2159] px-5 py-12 sm:px-8 sm:py-14 lg:min-h-[660px] lg:px-12 lg:py-16 flex items-center">
          {/* Subtle Ambient Gradients */}
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(63,47,122,0.75)_0%,rgba(23,17,47,0.92)_85%)]"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_65%,rgba(244,199,106,0.12)_0%,transparent_50%)]"
            aria-hidden="true"
          />

          <div className="relative z-10 grid w-full items-center gap-8 lg:grid-cols-[1.1fr_1.35fr] lg:gap-8 xl:gap-12">
            {/* Tagline & Content to the Left */}
            <div className="flex flex-col justify-center space-y-6 text-left">
              <h1 className="text-4xl font-medium leading-[1.08] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl xl:text-7xl">
                <span className="block">Understand Every Student.</span>
                <span className="block text-[#f4c76a] mt-1 sm:mt-2">Guide Every Future.</span>
              </h1>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/programs/cmt"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#f4c76a] px-6 text-sm font-semibold text-[#17112f] shadow-lg shadow-[#f4c76a]/20 transition-all hover:bg-white hover:text-[#17112f] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Explore AI CMT</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/counselling"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-xs transition-all hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Book Counselling</span>
                </Link>
              </div>

              {/* Trust & Performance Metrics */}
              <div className="grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white">10k+</div>
                  <div className="text-[11px] text-white/60">Students Mentored</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-[#f4c76a]">98%</div>
                  <div className="text-[11px] text-white/60">Clarity Rate</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-white">12+ Yrs</div>
                  <div className="text-[11px] text-white/60">Govt. Registered Trust</div>
                </div>
              </div>
            </div>

            {/* Animation to the Right */}
            <div className="relative w-full h-[460px] sm:h-[540px] lg:h-[620px] flex items-center justify-center">
              <ThreeImageCloud
                cardCount={36}
                className="h-full w-full"
              />
            </div>
          </div>
        </section>

        {/* All Remaining Section Cards - unified light background, zero gap */}
        <main className="w-full flex flex-col space-y-0">
          <WorkshopsInitiativesSection />

          {/* Featured CTA Section */}
          <section className="relative w-full overflow-hidden rounded-none border-b border-[#2c2159] bg-gradient-to-br from-[#3f2f7a] via-[#352768] to-[#2c2159] px-5 py-12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_18px_45px_rgba(44,33,89,0.2)] sm:px-8 sm:py-14 lg:px-12 lg:py-16">
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl" />
            <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto]">
              <div>
                <p className="mb-3 flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-violet-100">
                  <Megaphone className="h-4 w-4" /> Featured
                </p>
                <h2 className="max-w-2xl text-2xl font-semibold leading-tight text-white sm:text-3xl">
                  Discover the right career direction with AI-powered competency mapping.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-violet-100/80">
                  Book an AI CMT assessment and receive a personalized counselling roadmap built around aptitude, interests, and future opportunities.
                </p>
              </div>
              <Link
                href="/programs/cmt"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-[#2c2159] shadow-lg shadow-black/15 transition-all hover:-translate-y-0.5 hover:bg-violet-50 active:translate-y-0"
              >
                <span>Explore AI CMT</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* Blogs & Articles Section */}
          <section className="w-full rounded-none bg-white px-5 py-14 sm:px-8 lg:px-12 border-b border-slate-200/80">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading
                eyebrow="Ideas & guidance"
                title="Blogs & Articles"
              />
              <Link
                href="/news/blogs"
                className="mb-8 inline-flex items-center gap-1 text-sm font-semibold text-[#3f2f7a] transition-colors hover:text-[#2c2159]"
              >
                Browse articles <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {BLOGS_DATA.map((blog) => (
                <article
                  key={blog._id}
                  onClick={() => setActiveBlog(blog)}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200/85 bg-white p-3.5 transition-all duration-300 hover:shadow-lg hover:border-slate-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div>
                    {/* Clean visual preview */}
                    <BlogImageArea
                      src={blog.imageUrl}
                      alt={blog.title}
                      category={blog.category}
                    />
                    {/* Content below visual */}
                    <div className="pt-3.5 px-1 pb-1">
                      <h3 className="line-clamp-2 text-sm sm:text-[15px] font-semibold leading-snug text-[#171717] group-hover:text-[#3f2f7a] transition-colors">
                        {blog.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-[#64748b]">
                        {blog.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* YouTube Clips Section */}
          <section className="w-full rounded-none bg-white px-5 py-14 sm:px-8 lg:px-12 border-b border-slate-200/80">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading
                eyebrow="Watch & learn"
                title="YouTube Clips"
                text="Recorded lectures, career symposiums, and fair highlights from BRAIN counsellors."
              />
              <Link
                href="/news/youtube-clips"
                className="mb-8 inline-flex items-center gap-1 text-sm font-semibold text-[#3f2f7a] transition-colors hover:text-[#2c2159]"
              >
                View all clips <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {YOUTUBE_CLIPS_DATA.map((clip) => (
                <div
                  key={clip._id}
                  onClick={() => setActiveClip(clip)}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200/85 bg-white p-3.5 sm:p-4 transition-all duration-300 hover:shadow-lg hover:border-slate-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div>
                    {/* Clean video visual preview with play overlay */}
                    <ClipThumbnailArea
                      thumbnailUrl={clip.thumbnailUrl}
                      title={clip.title}
                      category={clip.category}
                    />
                    {/* Content below visual */}
                    <div className="pt-4 px-1 pb-1">
                      <h3 className="line-clamp-2 text-base sm:text-[17px] font-semibold leading-snug text-[#171717] group-hover:text-[#3f2f7a] transition-colors">
                        {clip.title}
                      </h3>
                      <div
                        className="mt-1.5 line-clamp-2 text-xs sm:text-[13px] leading-relaxed text-[#64748b] [&>div]:inline"
                        dangerouslySetInnerHTML={{ __html: clip.description }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials Section with Rounded Bottom Border */}
          <section className="w-full overflow-hidden rounded-b-[28px] sm:rounded-b-[36px] lg:rounded-b-[42px] bg-white px-5 py-14 sm:px-8 lg:px-12 border-b border-[#d8d5e6]/80">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <SectionHeading
                eyebrow="Community voices"
                title="Testimonials"
              />
              <Link
                href="/testimonials"
                className="mb-8 inline-flex items-center gap-1 text-sm font-semibold text-[#3f2f7a] transition-colors hover:text-[#2c2159]"
              >
                Read more stories <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* 3-Column Staggered Masonry Wall of Testimonials */}
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
              {testimonials.map((item) => (
                <article
                  key={item._id || item.name}
                  className="break-inside-avoid mb-5 flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
                >
                  {/* Testimonial Quote Text */}
                  <p className="text-[13.5px] sm:text-[14px] leading-relaxed text-[#374151]">
                    {item.quote}
                  </p>

                  {/* User Profile */}
                  <div className="mt-5 flex items-center gap-3 pt-1">
                    <TestimonialAvatar src={item.imageUrl} name={item.name} />
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-[13px] font-semibold text-[#111827] truncate">
                        {item.name}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-400 font-normal truncate mt-0.5">
                        {item.handle || `@${item.name.replace(/^(Mr\.|Mrs\.|Dr\.|Principal)\s*/i, "").toLowerCase().replace(/\s+/g, "")}`}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
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
        </main>
      </div>

      <Footer />
    </div>
  );
}
