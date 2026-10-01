"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, CheckCircle2, ShieldCheck, ArrowRight, HeartHandshake, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";

export default function AssociateRegistrationPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    city: "",
    experience: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#e9eaf1] text-[#171717] selection:bg-[#3f2f7a]/10 selection:text-[#3f2f7a] font-sans">
      <Navbar />

      <section className="py-14 bg-white border-b border-[#d8d5e6] bg-grid-dots text-center">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-[#16a34a] border border-emerald-200/60 mb-3">
            <HeartHandshake className="w-3.5 h-3.5" /> Educational Partnership
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-medium tracking-tight text-[#171717] leading-tight">
            Associate & Partner Registration
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#525252] max-w-xl mx-auto font-normal">
            Collaborate with BECC Trust to conduct standardized Competency Mapping Tests (CMT) and career guidance programs in your institution or locality.
          </p>
        </div>
      </section>

      <section className="py-16 max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Info & Benefits */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#171717] tracking-tight">
              Why Partner with BECC Trust?
            </h2>
            <p className="text-xs sm:text-sm text-[#525252] leading-relaxed font-normal">
              As an accredited BECC Associate, you gain direct access to our standardized psychometric batteries, digital report generation systems, and state-wide academic network.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-[12px] bg-white border border-[#d8d5e6] flex items-start gap-3">
                <Check className="w-4 h-4 text-[#16a34a] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-semibold text-[#171717]">Accredited Testing Center</h3>
                  <p className="text-xs text-[#737373] mt-0.5 font-normal">
                    Authorized to conduct proctored CMT assessments for school and college batches.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-[12px] bg-white border border-[#d8d5e6] flex items-start gap-3">
                <Check className="w-4 h-4 text-[#16a34a] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-semibold text-[#171717]">Certified Counselor Training</h3>
                  <p className="text-xs text-[#737373] mt-0.5 font-normal">
                    Continuous professional development workshops led by senior educational psychologists.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-[12px] bg-white border border-[#d8d5e6] flex items-start gap-3">
                <Check className="w-4 h-4 text-[#16a34a] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-semibold text-[#171717]">Attractive Revenue Sharing</h3>
                  <p className="text-xs text-[#737373] mt-0.5 font-normal">
                    Transparent compensation for every evaluated candidate and institutional event.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-7 rounded-[16px] border border-[#d8d5e6] shadow-[rgba(0,0,0,0.05)_0px_1px_2px_0px]">
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#16a34a] border border-emerald-200 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-[#171717]">Application Submitted!</h3>
                <p className="text-xs text-[#525252] mt-1 max-w-sm mx-auto">
                  Thank you for applying. Our institutional trustee team will verify your credentials and contact you within 48 hours.
                </p>
                <div className="mt-5">
                  <Link href="/">
                    <Button variant="primary" size="sm">Return to Home</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <h3 className="text-base font-semibold text-[#171717]">Associate Application Form</h3>
                  <p className="text-xs text-[#737373]">
                    Provide your professional or institutional credentials below.
                  </p>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#171717]">Full Name / Organization Name</label>
                  <input
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Prof. Ramesh Deshmukh / Solapur Career Hub"
                    className="w-full mt-1 p-2 text-xs rounded-[6px] border border-[#3f2f7a] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-[#171717]">Official Email</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@domain.com"
                      className="w-full mt-1 p-2 text-xs rounded-[6px] border border-[#3f2f7a] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-[#171717]">Mobile Phone</label>
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-[#171717]">City / District</label>
                    <input
                      required
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Solapur, Pune"
                      className="w-full mt-1 p-2 text-xs rounded-[6px] border border-[#3f2f7a] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-[#171717]">Experience</label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="e.g. 5+ Years"
                      className="w-full mt-1 p-2 text-xs rounded-[6px] border border-[#3f2f7a] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#171717]">Message / Intent of Collaboration</label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Briefly describe your institution or counseling practice..."
                    className="w-full mt-1 p-2 text-xs rounded-[6px] border border-[#3f2f7a] focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <Button fullWidth size="md" variant="primary" type="submit">
                    Submit Associate Application
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
