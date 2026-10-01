"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, ArrowRight, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import { TESTIMONIALS_DATA } from "@/data/testimonialsData";

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
    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#d8d5e6] bg-[#f6f3fb] text-xs font-bold text-[#3f2f7a]">
      {!hasError && src ? (
        <img
          src={src}
          alt={name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <span>{initials || <User className="h-4 w-4" />}</span>
      )}
    </div>
  );
}

export default function TestimonialsPage() {
  const testimonials = TESTIMONIALS_DATA.filter((t) => t.isActive);

  return (
    <div className="min-h-screen bg-[#e9eaf1] text-[#171717] selection:bg-[#3f2f7a]/10 selection:text-[#3f2f7a] font-sans">
      <Navbar />

      <section className="py-14 bg-white border-b border-[#d8d5e6] bg-grid-dots text-center">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-[#16a34a] border border-emerald-200/60 mb-3">
            <Star className="w-3.5 h-3.5 fill-current" /> Student & Professional Voices
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-medium tracking-tight text-[#171717] leading-tight">
            Real Stories, Real Transformations
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#525252] max-w-xl mx-auto font-normal">
            Read how BRAIN&apos;s structured scientific counselling and study method guidance has transformed career journeys across India and abroad.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* 3-Column Staggered Masonry Wall of Testimonials */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {testimonials.map((t) => (
            <article
              key={t._id}
              className="break-inside-avoid mb-5 flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <p className="text-[13.5px] sm:text-[14px] leading-relaxed text-[#374151]">
                {t.quote}
              </p>

              <div className="mt-5 flex items-center gap-3 pt-1">
                <TestimonialAvatar src={t.imageUrl} name={t.name} />
                <div className="min-w-0">
                  <h3 className="text-xs sm:text-[13px] font-semibold text-[#111827] truncate">
                    {t.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 font-normal truncate mt-0.5">
                    {t.handle || `@${t.name.replace(/^(Mr\.|Mrs\.|Dr\.|Principal)\s*/i, "").toLowerCase().replace(/\s+/g, "")}`}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/counselling/inquiry">
            <Button size="md" variant="primary" icon={<ArrowRight className="w-3.5 h-3.5" />} iconPosition="right">
              Start Your Own Counseling Journey
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
