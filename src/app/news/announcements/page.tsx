"use client";

import React from "react";
import Link from "next/link";
import { Megaphone, ArrowRight, Calendar, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";

export default function AnnouncementsPage() {
  const announcements = [
    {
      badge: "HIGH PRIORITY",
      badgeColor: "bg-[#fff7e8] text-[#ea580c] border-[#f4c76a]/60",
      title: "CMT Aptitude Diagnostic Batches Open for Academic Year 2026-27",
      date: "Registration Closes in 10 Days",
      desc: "Slots available for both in-person Solapur test center and home-proctored online portal assessment. Mandatory for 10th and 12th standard students.",
      actionText: "Register for Test",
      actionHref: "/counselling/inquiry",
    },
    {
      badge: "NEW INITIATIVE",
      badgeColor: "bg-emerald-50 text-[#16a34a] border-emerald-200/60",
      title: "Special Scholarship Guidance Desk for Girls in STEM Fields",
      date: "Ongoing Daily Desk",
      desc: "Free personalized counseling for high-merit candidates seeking central, state, and private corporate fellowship programs.",
      actionText: "Book Scholarship Desk",
      actionHref: "/counselling/inquiry",
    },
    {
      badge: "CAMPUS DRIVE",
      badgeColor: "bg-[#efeaf9] text-[#3f2f7a] border-[#c9c2e3]/60",
      title: "School Tie-Up Enrolment for 2026-27 'Palak Sabha' Parenting Workshops",
      date: "Affiliation Open",
      desc: "School principals and trustees can register their institutions for our subsidized comprehensive student psychometric program.",
      actionText: "Register School",
      actionHref: "/registrations/associate",
    },
  ];

  return (
    <div className="min-h-screen bg-[#e9eaf1] text-[#171717] selection:bg-[#3f2f7a]/10 selection:text-[#3f2f7a] font-sans">
      <Navbar />

      <section className="py-14 bg-white border-b border-[#d8d5e6] bg-grid-dots text-center">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#fff7e8] text-[#ea580c] border border-[#f4c76a]/60 mb-3">
            <Megaphone className="w-3.5 h-3.5" /> Official Circulars
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-medium tracking-tight text-[#171717] leading-tight">
            Official Announcements & Alerts
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#525252] max-w-xl mx-auto font-normal">
            Urgent notices, test dates, admission deadlines, and institutional initiatives from BECC Trust.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann.title}
              className="p-6 rounded-[12px] bg-white border border-[#d8d5e6] hover:border-[#2c2159] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="max-w-2xl space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border ${ann.badgeColor}`}>
                    {ann.badge}
                  </span>
                  <span className="text-[11px] text-[#737373]">{ann.date}</span>
                </div>
                <h3 className="text-base font-semibold text-[#171717]">{ann.title}</h3>
                <p className="text-xs text-[#525252] leading-relaxed font-normal">
                  {ann.desc}
                </p>
              </div>

              <div className="flex-shrink-0">
                <Link href={ann.actionHref}>
                  <Button size="sm" variant="primary" icon={<ArrowRight className="w-3.5 h-3.5" />} iconPosition="right">
                    {ann.actionText}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
