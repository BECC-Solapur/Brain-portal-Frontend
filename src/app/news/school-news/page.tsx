"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Newspaper, ArrowRight, Calendar, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";

interface NewsItem {
  title: string;
  date: string;
  desc: string;
  tag: string;
  image: string;
  badgeColor: string;
}

export default function SchoolNewsPage() {
  const newsList: NewsItem[] = [
    {
      title: "State-Wide Career Guidance Conclave Announced for Solapur & Pune",
      date: "September 12, 2026",
      desc: "BECC will host its flagship annual academic symposium for 10th and 12th standard candidates with top psychologists and university delegates.",
      tag: "Conclave",
      image: "/images/gallery1.png",
      badgeColor: "bg-[#efeaf9] text-[#3f2f7a] border-[#c9c2e3]/60",
    },
    {
      title: "Maharashtra CAP Round Guidelines Released: Key Strategy Tips",
      date: "August 28, 2026",
      desc: "BECC advisory team releases essential dos and don'ts for engineering and pharmacy option form submissions to prevent seat loss.",
      tag: "Admissions",
      image: "/images/gallery4.png",
      badgeColor: "bg-[#fff1f0] text-[#e2231a] border-[#f4b4b0]/60",
    },
    {
      title: "Parenting Workshop 'Palak Sabha' Expands to 50 Partner Schools",
      date: "August 15, 2026",
      desc: "Helping over 5,000 parents manage student screen time, stress levels, and emotional balance during board exam preparation years.",
      tag: "School Drive",
      image: "/images/gallery3.png",
      badgeColor: "bg-emerald-50 text-[#16a34a] border-emerald-200/60",
    },
    {
      title: "Merit Award Ceremony: Honoring Top CMT Diagnostic Achievers",
      date: "July 30, 2026",
      desc: "Recognizing outstanding students who achieved top percentile scores and successfully mapped their dream careers.",
      tag: "Awards",
      image: "/images/gallery5.png",
      badgeColor: "bg-[#fff7e8] text-[#ea580c] border-[#f4c76a]/60",
    },
  ];

  return (
    <div className="min-h-screen bg-[#e9eaf1] text-[#171717] selection:bg-[#3f2f7a]/10 selection:text-[#3f2f7a] font-sans">
      <Navbar />

      <section className="py-14 bg-white border-b border-[#d8d5e6] bg-grid-dots text-center">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#efeaf9] text-[#3f2f7a] border border-[#c9c2e3]/60 mb-3">
            <Newspaper className="w-3.5 h-3.5" /> Media & Institutional Updates
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-medium tracking-tight text-[#171717] leading-tight">
            School News & Institutional Bulletins
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#525252] max-w-xl mx-auto font-normal">
            Stay informed with the latest updates on board exam schedules, counseling conclaves, and state academic guidelines.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {newsList.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-[12px] border border-[#d8d5e6] overflow-hidden hover:border-[#2c2159] transition-colors flex flex-col justify-between group"
            >
              <div>
                <div className="relative w-full h-48 bg-[#f6f3fb] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${item.badgeColor} bg-white/90 backdrop-blur-xs`}>
                    {item.tag}
                  </div>
                </div>

                <div className="p-5">
                  <span className="text-[11px] text-[#737373]">{item.date}</span>
                  <h3 className="text-sm font-semibold text-[#171717] mt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#525252] mt-1.5 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-1">
                <Link href="/counselling/inquiry">
                  <Button size="sm" variant="outline" icon={<ArrowRight className="w-3.5 h-3.5" />} iconPosition="right">
                    Inquire About Event
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
