"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sprout,
  Leaf,
  Target,
  Compass,
  Plane,
  Flame,
  Check,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";
import AuthModal, { type AuthMode } from "@/components/AuthModal";
import { useAuth } from "@/lib/auth-context";
import { useInquiry } from "@/lib/inquiry-context";
import { COUNSELLING_PROGRAMS } from "@/lib/types";

export default function StudentCounsellingPage() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const { setSelectedProgram } = useInquiry();
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  function handleSelectTrack(programId: string) {
    const selectedProgram = COUNSELLING_PROGRAMS.find((program) => program.id === programId);
    if (!selectedProgram) return;
    setSelectedProgram(selectedProgram);
    if (accessToken) router.push("/calendar");
    else setAuthMode("join");
  }

  const beccPrograms = [
    {
      id: "ankur",
      name: "Ankur",
      target: "KG to Class 4",
      category: "school",
      badgeBg: "bg-[#efeaf9] text-[#3f2f7a] border-[#c9c2e3]/60",
      price: "₹1,499",
      desc: "Parental and teacher counseling workshops focusing on early cognitive curiosity, cultural values, behavioral etiquette, and holistic foundation building.",
      features: [
        "Early Learning Style Diagnostics",
        "Parent-Teacher Alignment Sessions",
        "Curiosity & Activity-based Learning",
        "Behavioral & Habit Formation",
      ],
      icon: <Sprout className="w-5 h-5 text-[#3f2f7a]" />,
    },
    {
      id: "palavi",
      name: "Palavi",
      target: "Class 5 to 7",
      category: "school",
      badgeBg: "bg-emerald-50 text-[#16a34a] border-emerald-200/60",
      price: "₹1,999",
      desc: "Structured cognitive analysis during formative transition years. Helps students cultivate disciplined study routines, time management, and interest mapping.",
      features: [
        "Study Habit & Time Management",
        "Initial Aptitude Exploration",
        "Parenting Guidance Workshops",
        "Self-Confidence Acceleration",
      ],
      icon: <Leaf className="w-5 h-5 text-[#16a34a]" />,
    },
    {
      id: "lakshya",
      name: "Lakshya",
      target: "Class 8 to 10",
      category: "school",
      badgeBg: "bg-[#fff1f0] text-[#e2231a] border-[#f4b4b0]/60",
      price: "₹2,499",
      desc: "Crucial board exam readiness and senior secondary stream selection (Science, Commerce, Arts, Vocational). Rigorous psychometric testing and problem-solving roadmaps.",
      features: [
        "Science / Commerce / Arts Stream Mapping",
        "Board Exam Strategy & Focus",
        "Comprehensive Psychometric Profile",
        "Career Trajectory Roadmapping",
      ],
      icon: <Target className="w-5 h-5 text-[#e2231a]" />,
    },
    {
      id: "disha",
      name: "Disha",
      target: "Class 11 to 12",
      category: "college",
      badgeBg: "bg-[#fff7e8] text-[#ea580c] border-[#f4c76a]/60",
      price: "₹2,999",
      desc: "Specialized college, degree branch, and entrance exam navigation (JEE, NEET, MHT-CET, CUET, NDA, Design). Complete CAP round admission support and scholarship guidance.",
      features: [
        "Branch & Institute Selection Matrix",
        "Entrance & Competitive Exam Strategy",
        "CAP Round Counseling & Admission Support",
        "Scholarship & Fellowship Navigation",
      ],
      icon: <Compass className="w-5 h-5 text-[#ea580c]" />,
    },
    {
      id: "udaan",
      name: "Udaan",
      target: "Graduates & Job Seekers",
      category: "college",
      badgeBg: "bg-[#efeaf9] text-[#3f2f7a] border-[#c9c2e3]/60",
      price: "₹3,499",
      desc: "Global career positioning, post-graduate study roadmaps (CAT, GRE, GATE, UPSC/MPSC), employability skill enhancement, and entrepreneurship incubation.",
      features: [
        "Higher Education Roadmap (Domestic & Abroad)",
        "Resume Building & Mock Interviews",
        "Job Readiness & Industry Placement",
        "Startup & Self-Employment Mentoring",
      ],
      icon: <Plane className="w-5 h-5 text-[#3f2f7a]" />,
    },
    {
      id: "phoenix",
      name: "Phoenix",
      target: "Special Support / Dropouts",
      category: "special",
      badgeBg: "bg-rose-50 text-rose-700 border-rose-200/60",
      price: "₹3,999",
      desc: "Empathetic, deep psychological analysis for academically weak students, dropouts, or career-stressed individuals. Re-ignites motivation and builds fresh customized pathways.",
      features: [
        "In-depth Stress & Depression Counseling",
        "Alternative Career & Skill Arena Mapping",
        "Personalized Academic Recovery Plan",
        "Continuous 1-on-1 Mentor Supervision",
      ],
      icon: <Flame className="w-5 h-5 text-rose-600" />,
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-violet-100 font-sans">
      <Navbar />

      <section className="bg-[#f5f3f9] py-20">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#3f2f7a]">Six developmental stages</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">Find the right support for this stage.</h2>
        </div>
      </section>

      <section className="bg-[#f5f3f9] pb-24">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [column-fill:_balance]">
          {beccPrograms.map((prog) => (
            <div
              key={prog.id}
              className="group mb-5 flex break-inside-avoid flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md sm:p-6"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-2xl bg-[#f0ebf8] p-3">
                      {prog.icon}
                    </div>
                    <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border ${prog.badgeBg}`}>
                      {prog.target}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-[#171717]">{prog.price}</span>
                </div>

                <h3 className="mt-2 text-xl font-bold text-slate-950">
                  {prog.name}
                </h3>
                <p className="mt-3 min-h-[68px] text-sm font-normal leading-7 text-slate-500">
                  {prog.desc}
                </p>

                <div className="mt-5 border-t border-slate-100 pt-4">
                  <p className="text-[10px] font-medium text-[#737373] uppercase tracking-wider mb-2">
                    Key Deliverables
                  </p>
                  <ul className="space-y-1.5">
                    {prog.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-slate-700">
                        <Check className="h-3.5 w-3.5 flex-shrink-0 text-[#3f2f7a]" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-[11px] text-[#737373]">Includes 1-on-1 Session</span>
                <Button onClick={() => handleSelectTrack(prog.id)} size="sm" variant="primary" icon={<ChevronRight className="w-3.5 h-3.5" />} iconPosition="right">
                    Select Module
                  </Button>
              </div>
            </div>
          ))}
        </div>

        </div>
      </section>

      <Footer />
      {authMode && (
        <AuthModal
          mode={authMode}
          nextPath="/calendar"
          onClose={() => setAuthMode(null)}
          onModeChange={setAuthMode}
        />
      )}
    </div>
  );
}
