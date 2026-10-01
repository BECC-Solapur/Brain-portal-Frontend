"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileCheck2,
  Printer,
  Home,
  CheckCircle2,
  Sparkles,
  Check,
  Calendar,
  User,
  Shield,
  BookOpen,
} from "lucide-react";
import StepIndicator from "@/components/StepIndicator";
import Button from "@/components/Button";
import { PageHeader } from "@/components/FormFields";
import { useInquiry } from "@/lib/inquiry-context";

export default function ConclusionPage() {
  const router = useRouter();
  const { state } = useInquiry();

  useEffect(() => {
    if (!state.appointment || !state.conclusion) {
      router.replace("/counselling/inquiry");
    }
  }, [state, router]);

  if (!state.personalDetails || !state.selectedProgram || !state.conclusion) {
    return null;
  }

  const { personalDetails, selectedProgram, appointment, conclusion } = state;

  return (
    <div className="min-h-screen flex flex-col bg-[#e9eaf1] text-[#171717]">
      <div className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 pt-6 pb-12 flex flex-col lg:flex-row items-start gap-6">
        <StepIndicator currentStep="conclusion" />

        <main className="flex-1 min-w-0">
          <PageHeader
            title="Counselling Dossier & Conclusion"
            mrTitle="समुपदेशन निष्कर्ष अहवाल"
            subtitle="Official completed student guidance summary and career recommendations."
            icon={<FileCheck2 className="w-5 h-5" />}
          />

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-[12px] bg-[#f6f3fb] border border-[#d8d5e6] mb-6 print:hidden">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#dcfce7] text-[#16a34a] border border-[#bbf7d0]">
                <Check className="w-3.5 h-3.5" /> Full Cycle Complete
              </span>
              <span className="text-xs text-[#737373]">
                Inquiry Ref: <span className="font-mono text-[#171717]">{state.inquiryId}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<Printer className="w-3.5 h-3.5" />}
                onClick={() => window.print()}
              >
                Print Report
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Home className="w-3.5 h-3.5" />}
                onClick={() => router.push("/portal")}
              >
                Go to Workspace
              </Button>
            </div>
          </div>

          {/* Official Printable Report Container */}
          <div className="rounded-[16px] border border-[#d8d5e6] bg-white p-6 sm:p-8 space-y-6 shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#d8d5e6] pb-5">
              <div>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-[#737373]">
                  BRAIN Educational Counselling Center
                </span>
                <h2 className="text-lg font-semibold text-[#171717]">Student Guidance Dossier</h2>
                <p className="text-xs text-[#525252] mt-0.5">Program: {selectedProgram.name} ({selectedProgram.gradeRange})</p>
              </div>
              <div className="text-left sm:text-right text-xs space-y-0.5 text-[#525252]">
                <p><span className="text-[#737373]">Date:</span> {new Date().toLocaleDateString("en-IN")}</p>
                <p><span className="text-[#737373]">Counsellor:</span> {conclusion.counsellorSignature}</p>
              </div>
            </div>

            {/* Student & Session Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-[8px] bg-[#f6f3fb] border border-[#d8d5e6] text-xs">
              <div>
                <span className="text-[#737373] block">Student Name</span>
                <span className="font-semibold text-[#171717] mt-0.5 block">{personalDetails.fullName}</span>
              </div>
              <div>
                <span className="text-[#737373] block">Contact</span>
                <span className="font-semibold text-[#171717] mt-0.5 block">{personalDetails.phone}</span>
              </div>
              <div>
                <span className="text-[#737373] block">Session Date</span>
                <span className="font-semibold text-[#171717] mt-0.5 block">{appointment?.date || "Completed"}</span>
              </div>
              <div>
                <span className="text-[#737373] block">Next Review</span>
                <span className="font-semibold text-[#3f2f7a] mt-0.5 block">{conclusion.nextFollowUp || "In 3 weeks"}</span>
              </div>
            </div>

            {/* Diagnostic Sections */}
            <div className="space-y-4 text-xs leading-relaxed">
              <div className="p-4 rounded-[8px] border border-[#d8d5e6] bg-white">
                <h3 className="text-[11px] uppercase font-semibold tracking-wider text-[#737373] mb-1.5">
                  1. Clinical Session Summary
                </h3>
                <p className="text-[#171717]">{conclusion.summary}</p>
              </div>

              <div className="p-4 rounded-[8px] border border-[#d8d5e6] bg-white">
                <h3 className="text-[11px] uppercase font-semibold tracking-wider text-[#737373] mb-1.5">
                  2. Behavioral &amp; Aptitude Observations
                </h3>
                <p className="text-[#171717]">{conclusion.observations}</p>
              </div>

              <div className="p-4 rounded-[8px] border border-[#d8d5e6] bg-white">
                <h3 className="text-[11px] uppercase font-semibold tracking-wider text-[#737373] mb-1.5">
                  3. Strategic Recommendations &amp; Pathways
                </h3>
                <p className="text-[#171717]">{conclusion.recommendations}</p>
              </div>

              {conclusion.actionItems && conclusion.actionItems.length > 0 && (
                <div className="p-4 rounded-[8px] border border-[#d8d5e6] bg-[#f6f3fb]">
                  <h3 className="text-[11px] uppercase font-semibold tracking-wider text-[#737373] mb-2">
                    Action Plan &amp; Milestones
                  </h3>
                  <ul className="space-y-1.5">
                    {conclusion.actionItems.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-[#171717]">
                        <Check className="w-3.5 h-3.5 text-[#16a34a] flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer Signature */}
            <div className="pt-6 border-t border-[#d8d5e6] flex justify-between items-end text-xs">
              <div>
                <p className="font-semibold text-[#171717]">BRAIN Educational Counseling System</p>
                <p className="text-[#737373]">Authorized &amp; Signed electronically</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-semibold text-[#171717]">{conclusion.counsellorSignature}</p>
                <p className="text-[#737373]">Certified Career Coach</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
