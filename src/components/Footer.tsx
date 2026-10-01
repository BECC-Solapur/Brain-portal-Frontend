import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AtSign, Mail, MapPin, Phone } from "lucide-react";

function SocialIcon({ name }: { name: string }) {
  if (name === "Threads") return <AtSign className="h-4 w-4" />;

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {name === "Instagram" && <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" /></>}
      {name === "Facebook" && <path d="M14 21v-8h3l.5-3H14V8.5C14 7.4 14.4 7 15.6 7H18V4.2c-.8-.1-1.8-.2-3-.2-3 0-5 1.8-5 5.2V10H7v3h3v8" />}
      {name === "X / Twitter" && <><path d="M4 4l16 16" /><path d="M20 4L4 20" /></>}
      {name === "YouTube" && <><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" /></>}
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-white text-[#737373] py-12 border-t border-[#d8d5e6] text-xs">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Col 1: BRAIN Overview */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="relative w-6 h-6 rounded-[6px] overflow-hidden bg-white border border-[#d8d5e6]">
                <Image src="/images/Logo.png" alt="BECC Logo" fill className="object-contain" />
              </div>
              <span className="font-semibold text-sm text-[#171717]">BRAIN Portal</span>
            </div>
            <p className="text-xs text-[#737373] leading-relaxed max-w-sm mb-3">
              A complete student development and counselling platform bringing psychometric assessments, wellbeing tracking, and personalized career roadmaps into one connected ecosystem.
            </p>
            <div className="mt-5">
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Instagram", href: "https://www.instagram.com/braineducationconsultancy?utm_source=qr&stkn=MTBtem04ZmtldzRweg==" },
                  { label: "Facebook", href: "https://www.facebook.com/share/1C9N3ZGgbg/" },
                  { label: "X / Twitter", href: "https://x.com/BrainEduCon" },
                  { label: "YouTube", href: "https://www.youtube.com/@braineduconsultancy?app=desktop&si=mLyStr5uXL3b7QpV" }
                ].map((social) => {
                  return (
                    <a key={social.label} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label} className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d8d5e6] text-[#525252] transition-colors hover:border-[#3f2f7a] hover:bg-[#f6f3fb] hover:text-[#3f2f7a]">
                      <SocialIcon name={social.label} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Col 2: Platform */}
          <div>
            <h4 className="font-semibold text-xs text-[#171717] mb-3">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-[#171717] transition-colors">Student 360°</Link></li>
              <li><Link href="/counselling" className="hover:text-[#171717] transition-colors">Counselling Management</Link></li>
              <li><Link href="/programs/cmt" className="hover:text-[#171717] transition-colors">AI CMT Assessments</Link></li>
            </ul>
          </div>

          {/* Col 3: Solutions */}
          <div>
            <h4 className="font-semibold text-xs text-[#171717] mb-3">Solutions</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-[#171717] transition-colors">For Students</Link></li>
              <li><Link href="/" className="hover:text-[#171717] transition-colors">For Parents</Link></li>
              <li><Link href="/" className="hover:text-[#171717] transition-colors">For Counsellors</Link></li>
              <li><Link href="/" className="hover:text-[#171717] transition-colors">For Schools & Colleges</Link></li>
            </ul>
          </div>

          {/* Col 4: Central Office */}
          <div>
            <h4 className="font-semibold text-xs text-[#171717] mb-3">Central Office</h4>
            <ul className="space-y-2 text-[#737373]">
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#171717] flex-shrink-0 mt-0.5" />
                <span>B-2, Yashshree Apartment, Bhagatsingh Market, Solapur - 413001.</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#171717] flex-shrink-0" />
                <span>+91-9270350701|+91-9423068031|+91-8446448450</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#171717] flex-shrink-0" />
                <span>brained.consultancy@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-[#d8d5e6] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#a3a3a3]">
          <p>© {new Date().getFullYear()} BRAIN Educational Trust. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-[#171717]">Privacy</Link>
            <Link href="/about" className="hover:text-[#171717]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
