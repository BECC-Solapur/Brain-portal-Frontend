"use client";

import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Button from "@/components/Button";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "", stage: "Class 8 to 10 (Lakshya)" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-violet-100 font-sans">
      <Navbar />

      <section className="relative overflow-hidden bg-gradient-to-b from-[#f8f7fb] to-white py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_30%,rgba(124,58,237,.11),transparent_28%),radial-gradient(circle_at_60%_8%,rgba(63,47,122,.07),transparent_24%)]" />
        <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#3f2f7a]">Contact BECC</p>
            <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-.035em] text-slate-950 sm:text-6xl lg:text-7xl">The right conversation can clarify the next step.</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-500">Connect with our counselling, assessment or institutional team in Solapur. Tell us what you need and we&apos;ll route your inquiry to the right person.</p>
          </div>
          <div className="relative mx-auto h-[410px] w-full max-w-[500px]" aria-hidden="true">
            <div className="absolute inset-10 rounded-full bg-violet-300/25 blur-3xl" />
            <div className="absolute left-0 top-12 w-[78%] rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_28px_80px_rgba(63,47,122,.18)]">
              <div className="flex items-center justify-between"><span className="text-[11px] font-bold uppercase tracking-wider text-[#3f2f7a]">Central assistance desk</span><Phone className="h-5 w-5 text-violet-500" /></div>
              <h3 className="mt-6 text-xl font-bold text-slate-950">How can we help you today?</h3>
              <div className="mt-6 space-y-3">{["Student counselling", "School collaboration", "Assessment support"].map((item, index) => <div key={item} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-xs font-semibold text-slate-600"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-[#3f2f7a]">0{index + 1}</span>{item}</div>)}</div>
            </div>
            <div className="absolute right-0 top-2 rounded-2xl border border-violet-100 bg-white p-4 shadow-xl"><Clock className="h-6 w-6 text-[#3f2f7a]" /><p className="mt-3 text-xs text-slate-500">Response window</p><p className="font-bold">Within 24 hours</p></div>
            <div className="absolute bottom-8 right-2 w-52 rounded-2xl bg-[#3f2f7a] p-5 text-white shadow-xl"><Mail className="h-5 w-5 text-violet-200" /><p className="mt-3 text-xs text-violet-100/70">One message</p><p className="font-bold">The right team</p></div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f3f9] py-24">
        <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
          <div className="mb-12 max-w-2xl"><p className="text-[11px] font-bold uppercase tracking-[.2em] text-[#3f2f7a]">Reach the right desk</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">Contact details and inquiry support.</h2></div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Contact Details */}
          <div className="space-y-4 lg:col-span-5">
            <div className="flex items-start gap-4 rounded-[22px] border border-slate-200 bg-white p-5 transition hover:border-violet-200 hover:shadow-md">
              <div className="flex-shrink-0 rounded-2xl bg-[#f0ebf8] p-3 text-[#3f2f7a]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-[#171717]">Headquarters Address</h3>
                <p className="text-xs text-[#525252] mt-0.5 leading-relaxed font-normal">
                  BECC Centre, Near Old Employment Chowk, Solapur, Maharashtra - 413001
                </p>
                <p className="text-[11px] text-[#3f2f7a] font-medium mt-1">
                  (In-person counseling rooms & test center available on campus)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-[22px] border border-slate-200 bg-white p-5 transition hover:border-violet-200 hover:shadow-md">
              <div className="flex-shrink-0 rounded-2xl bg-[#f0ebf8] p-3 text-[#3f2f7a]">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-[#171717]">Direct Helpline Numbers</h3>
                <p className="text-xs text-[#525252] mt-0.5 font-normal">
                  General Inquiry: <strong>+91 94220 12345</strong>
                </p>
                <p className="text-xs text-[#525252] mt-0.5 font-normal">
                  Landline: <strong>0217-2345678</strong>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-[22px] border border-slate-200 bg-white p-5 transition hover:border-violet-200 hover:shadow-md">
              <div className="flex-shrink-0 rounded-2xl bg-[#f0ebf8] p-3 text-[#3f2f7a]">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-[#171717]">Email Inquiries</h3>
                <p className="text-xs text-[#525252] mt-0.5 font-normal">
                  General: <strong>contact@becc-solapur.org</strong>
                </p>
                <p className="text-xs text-[#525252] mt-0.5 font-normal">
                  Schools & Associates: <strong>info@brain-education.org</strong>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 rounded-[22px] border border-slate-200 bg-white p-5 transition hover:border-violet-200 hover:shadow-md">
              <div className="flex-shrink-0 rounded-2xl bg-[#f0ebf8] p-3 text-[#3f2f7a]">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-[#171717]">Operating Hours</h3>
                <p className="text-xs text-[#525252] mt-0.5 font-normal">
                  Monday – Saturday: 9:30 AM to 6:30 PM (IST)
                </p>
                <p className="text-[11px] text-[#737373] mt-0.5">
                  Sunday: Closed (Pre-scheduled online sessions only)
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(63,47,122,.10)] sm:p-8 lg:col-span-7">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#16a34a] border border-emerald-200 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-semibold text-[#171717]">Message Dispatched!</h3>
                <p className="text-xs text-[#525252] mt-1 max-w-sm mx-auto">
                  Thank you for contacting BECC. A dedicated academic counselor will review your inquiry and get back to you shortly.
                </p>
                <div className="mt-5">
                  <Button variant="primary" size="sm" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="border-b border-slate-100 pb-5">
                  <p className="text-[11px] font-bold uppercase tracking-[.18em] text-[#3f2f7a]">Inquiry form</p>
                  <h3 className="mt-2 text-2xl font-bold text-slate-950">Send us a message</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Fill out the form below to receive a counseling roadmap consultation.
                  </p>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#171717]">Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Candidate or Parent Name"
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-[#3f2f7a] focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-[#171717]">Email Address</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@domain.com"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-[#3f2f7a] focus:bg-white focus:ring-4 focus:ring-violet-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-[#171717]">Phone Number</label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91"
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-[#3f2f7a] focus:bg-white focus:ring-4 focus:ring-violet-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#171717]">Student Stage / Track</label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-[#3f2f7a] focus:bg-white focus:ring-4 focus:ring-violet-100"
                  >
                    <option>Class 8 to 10 (Lakshya)</option>
                    <option>Class 11 to 12 (Disha)</option>
                    <option>KG to Class 4 (Ankur)</option>
                    <option>Class 5 to 7 (Palavi)</option>
                    <option>Graduate (Udaan)</option>
                    <option>Special Support (Phoenix)</option>
                    <option>School Institutional Tie-up</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-[#171717]">Message / Career Query</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your current academic challenges or queries..."
                    className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none transition focus:border-[#3f2f7a] focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                <div className="pt-2">
                  <Button fullWidth size="md" variant="primary" type="submit" icon={<Send className="w-3.5 h-3.5" />} iconPosition="right">
                    Dispatch Message to BECC
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
