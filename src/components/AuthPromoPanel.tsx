import Image from "next/image";
import { Check } from "lucide-react";

export default function AuthPromoPanel() {
  return (
    <div className="relative hidden min-h-[650px] overflow-hidden bg-[#2c2159] text-white lg:block">
      <Image
        src="/images/hero-student.png"
        alt=""
        fill
        sizes="(max-width: 1024px) 0px, 530px"
        className="object-cover object-[42%_center] opacity-75"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#2c2159]/95 via-[#3f2f7a]/75 to-[#2c2159]/25" />
      <div className="relative z-10 px-12 pt-16">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#f4c76a]">BRAIN</p>
        <h2 className="max-w-sm text-4xl font-semibold leading-tight">Every future starts with understanding.</h2>
        <ul className="mt-9 space-y-5 text-lg text-white/95">
          <li className="flex items-start gap-3"><Check className="mt-1 h-5 w-5 shrink-0 text-[#f4c76a]" /> Personal counselling guidance</li>
          <li className="flex items-start gap-3"><Check className="mt-1 h-5 w-5 shrink-0 text-[#f4c76a]" /> Progress shared with your family</li>
          <li className="flex items-start gap-3"><Check className="mt-1 h-5 w-5 shrink-0 text-[#f4c76a]" /> A clear plan for your next step</li>
        </ul>
      </div>
    </div>
  );
}
