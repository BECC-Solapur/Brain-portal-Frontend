"use client";

import React, { useState } from "react";
import {
  Monitor,
  GraduationCap,
  Users,
  Presentation,
  Coffee,
  CheckCircle2,
  Briefcase,
  ArrowRight,
  Check,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";

export default function ConsultancyPage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", org: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const consultancyPoints = [
    {
      title: "IT Solutions & Infrastructure",
      desc: "Digital campus architecture, automated student portals, data security, and cloud exam systems for schools and colleges.",
      icon: <Monitor className="w-5 h-5 text-[#3f2f7a]" />,
      features: ["Campus Portal Integration", "Digital Exam Systems", "Infrastructure Audit"],
    },
    {
      title: "Professional & Staff Training",
      desc: "Customized soft skills, advanced pedagogy methods, classroom psychological management, and leadership workshops.",
      icon: <GraduationCap className="w-5 h-5 text-[#e2231a]" />,
      features: ["Faculty Upskilling", "Classroom Psychology", "Leadership Modules"],
    },
    {
      title: "Institutional IT Counselling",
      desc: "Academic and technological strategy aligning institutional syllabus with high-growth future industry tracks.",
      icon: <Users className="w-5 h-5 text-[#ea580c]" />,
      features: ["Curriculum Auditing", "Career Cell Setup", "Industry Roadmaps"],
    },
    {
      title: "Interactive Workshops",
      desc: "High-impact, hands-on student bootcamps covering AI fundamentals, design thinking, stress resilience, and competitive readiness.",
      icon: <Presentation className="w-5 h-5 text-[#16a34a]" />,
      features: ["Hands-on Tools", "Interactive Q&A", "Assessment Reports"],
    },
    {
      title: "Tech & Career Meetups",
      desc: "Community conclaves connecting students, educators, and industry leaders for live mentorship panels and networking.",
      icon: <Coffee className="w-5 h-5 text-[#3f2f7a]" />,
      features: ["Industry Panels", "Networking Sessions", "Emerging Tech Trends"],
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedService(null);
      setFormData({ name: "", email: "", phone: "", org: "", message: "" });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-violet-100 font-sans">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-b from-[#f8f7fb] to-white py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_30%,rgba(124,58,237,.11),transparent_28%),radial-gradient(circle_at_60%_8%,rgba(63,47,122,.07),transparent_24%)]" />
        <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#3f2f7a]">Institutional consultancy</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-.035em] text-slate-950 sm:text-6xl lg:text-7xl">Strategy that moves institutions forward.</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-500">Technology, faculty development and academic strategy come together in practical solutions designed for schools, colleges and organisations.</p>
          </div>
          <div className="relative mx-auto h-[420px] w-full max-w-[510px]" aria-hidden="true">
            <div className="absolute inset-10 rounded-full bg-violet-300/25 blur-3xl" />
            <div className="absolute left-0 top-12 w-[78%] rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_28px_80px_rgba(63,47,122,.18)]">
              <div className="flex items-center justify-between"><span className="text-[11px] font-bold uppercase tracking-wider text-[#3f2f7a]">Institution growth plan</span><Briefcase className="h-5 w-5 text-violet-500" /></div>
              <h3 className="mt-6 text-xl font-bold text-slate-950">From operational challenge to structured solution.</h3>
              <div className="mt-6 grid grid-cols-2 gap-3">{["Digital systems", "Faculty capability", "Academic strategy", "Industry connection"].map((item, index) => <div key={item} className="rounded-xl bg-slate-50 p-3"><span className="text-[10px] font-bold text-violet-500">0{index + 1}</span><p className="mt-2 text-xs font-semibold text-slate-700">{item}</p></div>)}</div>
            </div>
            <div className="absolute right-0 top-2 rounded-2xl border border-violet-100 bg-white p-4 shadow-xl"><Monitor className="h-6 w-6 text-[#3f2f7a]" /><p className="mt-3 text-xs text-slate-500">Approach</p><p className="font-bold">Built to implement</p></div>
            <div className="absolute bottom-7 right-2 w-52 rounded-2xl bg-[#3f2f7a] p-5 text-white shadow-xl"><CheckCircle2 className="h-5 w-5 text-violet-200" /><p className="mt-3 text-xs text-violet-100/70">Consultancy outcome</p><p className="font-bold">Clear action roadmap</p></div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f3f9] py-24">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#3f2f7a]">Consultancy services</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">Specialist support for institutional growth.</h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-500">Choose a focused engagement or combine services into a coordinated transformation programme.</p>
          </div>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {consultancyPoints.map((item, index) => (
            <div
              key={item.title}
              className="group relative flex flex-col justify-between overflow-hidden rounded-[26px] border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-[0_20px_55px_rgba(63,47,122,.12)] sm:p-7"
            >
              <span className="absolute right-5 top-3 text-5xl font-bold text-slate-100">0{index + 1}</span>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-2xl bg-[#f0ebf8] p-3">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-slate-950">{item.title}</h3>

                <p className="mb-5 mt-3 text-sm font-normal leading-7 text-slate-500">
                  {item.desc}
                </p>

                <ul className="mb-6 space-y-2 border-t border-slate-100 pt-5">
                  {item.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-xs text-slate-700">
                      <Check className="mr-2 h-3.5 w-3.5 flex-shrink-0 text-[#3f2f7a]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setSelectedService(item.title)}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#3f2f7a] py-3 text-xs font-bold text-white transition-colors hover:bg-[#2c2159]"
              >
                Request Service <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-6 rounded-[30px] bg-[#3f2f7a] p-7 text-white sm:p-10 lg:grid-cols-[.85fr_1.15fr]">
          <div><p className="text-[11px] font-bold uppercase tracking-[.2em] text-violet-100">How we engage</p><h2 className="mt-3 text-3xl font-bold">Structured thinking. Practical implementation.</h2><p className="mt-4 text-sm leading-7 text-violet-100/70">Every engagement is scoped around the institution&apos;s context, capacity and measurable priorities.</p></div>
          <div className="grid gap-3 sm:grid-cols-3">{[["01","Diagnose","Understand the current system and priority gaps."],["02","Design","Shape a practical solution and implementation plan."],["03","Deliver","Execute, train and review against agreed outcomes."]].map(([number,title,text]) => <div key={title} className="rounded-2xl border border-white/15 bg-white/[.08] p-5"><span className="text-xs font-bold text-violet-200">{number}</span><h3 className="mt-5 font-bold">{title}</h3><p className="mt-2 text-xs leading-6 text-violet-100/65">{text}</p></div>)}</div>
        </div>

        {/* Modal */}
        {selectedService && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="relative w-full max-w-lg rounded-[26px] border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl sm:p-8">
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 text-[#737373] hover:text-[#171717] text-xs font-bold p-1 cursor-pointer"
              >
                ✕
              </button>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#16a34a] border border-emerald-200 flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-[#171717]">Consultancy Request Received!</h3>
                  <p className="text-xs text-[#525252] mt-1">
                    Our institutional liaison officer will reach out within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3.5">
                  <div>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-[#3f2f7a]">
                      Service Inquiry
                    </span>
                    <h3 className="text-base font-semibold text-[#171717] mt-0.5">
                      {selectedService}
                    </h3>
                    <p className="text-xs text-[#737373]">
                      Submit your organization details to schedule an initial consultation.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-medium text-[#171717]">Organization / School Name</label>
                      <input
                        required
                        type="text"
                        value={formData.org}
                        onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                        placeholder="e.g. Solapur Institute of Technology"
                        className="w-full mt-1 p-2 text-xs rounded-[6px] border border-[#3f2f7a] focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-medium text-[#171717]">Contact Person</label>
                        <input
                          required
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Dean / Director"
                          className="w-full mt-1 p-2 text-xs rounded-[6px] border border-[#3f2f7a] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-[#171717]">Phone</label>
                        <input
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91"
                          className="w-full mt-1 p-2 text-xs rounded-[6px] border border-[#3f2f7a] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-[#171717]">Official Email</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="contact@org.edu"
                        className="w-full mt-1 p-2 text-xs rounded-[6px] border border-[#3f2f7a] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button fullWidth variant="primary" type="submit">
                      Send Request
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
