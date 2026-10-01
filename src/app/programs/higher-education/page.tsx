"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { GraduationCap, CheckCircle2, ArrowRight, ShieldCheck, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";

export default function HigherEducationPage() {
  return (
    <div className="min-h-screen bg-[#e9eaf1] text-[#171717] selection:bg-[#3f2f7a]/10 selection:text-[#3f2f7a] font-sans">
      <Navbar />

      <section className="py-14 bg-white border-b border-[#d8d5e6] bg-grid-dots text-center">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#efeaf9] text-[#3f2f7a] border border-[#c9c2e3]/60 mb-3">
            <GraduationCap className="w-3.5 h-3.5" /> Degree & Professional Admissions
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-medium tracking-tight text-[#171717] leading-tight">
            Higher Education & Centralized Admission (CAP) Advisory
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#525252] max-w-xl mx-auto font-normal">
            Strategic college, branch, and seat allotment guidance for engineering, medical, architecture, management, and global study aspirants.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#171717] tracking-tight">
              Eliminate Risk in Maharashtra State & Central CAP Rounds
            </h2>
            <p className="text-xs sm:text-sm text-[#525252] leading-relaxed font-normal">
              A single error in option form sequencing can cost an entire academic year or misallocate a student to an unaccredited institute. BECC counselors audit percentiles, historical category cutoffs, and campus placements to secure your highest possible tier seat.
            </p>

            <div className="space-y-2.5 pt-2">
              {[
                "Option Form Sequencing (Preventing Automatic Freeze & Seat Loss)",
                "Campus Accreditation, Faculty Ratio & Placement Verification",
                "Entrance Strategy for JEE, NEET, MHT-CET, CUET, NDA, CAT & GATE",
                "Scholarship, Category & EBC Tuition Waiver Verification",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-xs text-[#171717]">
                  <Check className="w-3.5 h-3.5 text-[#16a34a] flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="pt-3">
              <Link href="/counselling/inquiry">
                <Button size="md" variant="primary">
                  Book CAP Round Counseling Session
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-80 sm:h-96 rounded-[16px] overflow-hidden border border-[#d8d5e6] bg-[#f6f3fb]">
            <Image
              src="/images/higher-Education.png"
              alt="Higher Education Admissions"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
