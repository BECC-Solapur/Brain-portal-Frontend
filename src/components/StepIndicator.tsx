"use client";

import Link from "next/link";
import {
  ClipboardList,
  CreditCard,
  CalendarDays,
  FileCheck2,
  Check,
} from "lucide-react";

const steps = [
  { key: "calendar", label: "Book a Slot", icon: CalendarDays, href: "/calendar" },
  { key: "payment", label: "Razorpay + GST (18%)", icon: CreditCard, href: "/counselling/payment" },
  { key: "receipt", label: "Receipt & Portal", icon: FileCheck2, href: "/counselling/payment" },
  { key: "portal", label: "Inquiry & Daily Plan", icon: ClipboardList, href: "/portal" },
];

interface StepIndicatorProps {
  currentStep: string;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  if (currentIndex < 0) return null;

  return (
    <aside className="print-hidden w-full lg:w-56 flex-shrink-0">
      <div className="bg-white rounded-[12px] border border-[#d8d5e6] p-3.5 sticky top-20">
        <div className="hidden lg:flex items-center justify-between mb-4 pb-3 border-b border-[#d8d5e6]">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#171717]">
            Progress
          </h2>
          <span className="text-[11px] font-medium text-[#171717] bg-[#f6f3fb] border border-[#d8d5e6] px-2 py-0.5 rounded-full">
            {currentIndex + 1} of {steps.length}
          </span>
        </div>

        {/* DESKTOP VERTICAL STEPPER */}
        <div className="hidden lg:block relative space-y-4">
          {/* Vertical Connecting Line */}
          <div className="absolute left-4 top-4 bottom-4 w-[1px] bg-[#d8d5e6] -z-0">
            <div
              className="w-full bg-[#171717] transition-all duration-300"
              style={{
                height: `${currentIndex > 0 ? (currentIndex / (steps.length - 1)) * 100 : 0}%`,
              }}
            />
          </div>

          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx < currentIndex;
            const isActive = idx === currentIndex;

            return (
              <Link
                key={step.key}
                href={step.href}
                className={`relative z-10 flex items-center gap-3 group ${
                  idx <= currentIndex ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-[8px] flex items-center justify-center transition-all duration-150 flex-shrink-0 ${
                    isCompleted
                      ? "bg-[#dcfce7] text-[#16a34a] border border-[#bbf7d0]"
                      : isActive
                      ? "bg-[#2c2159] text-white shadow-sm"
                      : "bg-white border border-[#d8d5e6] text-[#737373]"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="min-w-0">
                  <span
                    className={`text-xs font-medium block leading-tight truncate ${
                      isActive
                        ? "text-[#171717] font-semibold"
                        : isCompleted
                        ? "text-[#404040]"
                        : "text-[#737373]"
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-[10px] text-[#737373] font-normal">
                    {isCompleted ? "Completed" : isActive ? "Current" : `Step ${idx + 1}`}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* MOBILE COMPACT STEPPER */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#171717]">
              Step {currentIndex + 1}: {steps[currentIndex]?.label}
            </span>
            <span className="text-xs text-[#737373]">
              {currentIndex + 1}/{steps.length}
            </span>
          </div>
          <div className="w-full bg-[#f6f3fb] h-1.5 rounded-full overflow-hidden border border-[#d8d5e6]">
            <div
              className="bg-[#2c2159] h-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
