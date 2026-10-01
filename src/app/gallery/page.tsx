"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Move3d, Compass, Image as ImageIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThreeImageCloud from "@/components/ThreeImageCloud";

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-[#0d0c0b] text-[#f5f1ec] selection:bg-[#f4c76a]/20 selection:text-[#f4c76a] font-sans">
      <Navbar />

      <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation & Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#f4c76a] hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#9d978f] mb-2">
              <Sparkles className="h-3.5 w-3.5 text-[#f4c76a]" />
              <span>3D Interactive Archive</span>
            </div>
            <h1 className="text-3xl font-medium tracking-tight sm:text-5xl text-white">
              Moments That Matter.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#8f8982]">
              A continuous, multi-lane 3D image cloud representing seminars, training sessions,
              career workshops, and school events across the BRAIN ecosystem. Move your cursor
              around the viewport to explore dynamic parallax depth.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-[#9d978f]">
              <Move3d className="h-3.5 w-3.5 text-[#f4c76a]" /> Real-time GPU Shader SDF
            </span>
          </div>
        </div>

        {/* 3D Scene Container */}
        <div className="relative rounded-3xl border border-white/10 bg-[#120f24] overflow-hidden shadow-2xl">
          <ThreeImageCloud theme="dark" cardCount={36} className="h-[65vh] min-h-[500px] lg:h-[75vh]" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
