"use client";

import Link from "next/link";
import {
  ArrowRight,
  BrainCircuit,
  Check,
  Compass,
  GraduationCap,
  HeartHandshake,
  School,
  Sparkles,
  Target,
  UserRound,
  UsersRound,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const services = [
  {
    title: "Student Counselling",
    label: "1-on-1 guidance",
    description: "Personalised career mapping across every developmental stage—from early learning to higher education.",
    href: "/counselling/student",
    icon: UserRound,
    number: "01",
  },
  {
    title: "School Counselling",
    label: "Institutional programmes",
    description: "Campus assessment drives, student guidance, faculty alignment and parent development workshops.",
    href: "/counselling/school",
    icon: School,
    number: "02",
  },
  {
    title: "AI Competency Mapping",
    label: "Psychometric insight",
    description: "Structured assessment that turns behavioural and aptitude patterns into a clear growth report.",
    href: "/programs/cmt",
    icon: BrainCircuit,
    number: "03",
  },
  {
    title: "Higher Education Advisory",
    label: "Admissions support",
    description: "CAP guidance, cutoff analysis, course selection and college preference planning with expert support.",
    href: "/programs/higher-education",
    icon: GraduationCap,
    number: "04",
  },
];

const process = [
  ["Understand", "We listen to the student, family and academic context before suggesting a direction."],
  ["Assess", "Structured conversations and relevant assessments reveal aptitude, interests and behavioural patterns."],
  ["Interpret", "A counsellor connects the evidence to realistic academic and career opportunities."],
  ["Plan", "The student receives practical next steps, milestones and a roadmap that can evolve over time."],
];

const outcomes = [
  ["Clarity", "Understand interests, abilities and realistic possibilities."],
  ["Confidence", "Make education decisions with evidence and expert support."],
  ["Direction", "Turn broad aspirations into a focused academic pathway."],
  ["Action", "Leave with concrete priorities and achievable next steps."],
  ["Growth", "Review progress and adapt the roadmap as the student develops."],
];

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`text-[11px] font-bold uppercase tracking-[.2em] ${light ? "text-violet-100" : "text-[#3f2f7a]"}`}>{children}</p>;
}

function HeroVisual() {
  return (
    <div className="relative mx-auto h-[430px] w-full max-w-[520px]" aria-hidden="true">
      <div className="absolute inset-10 rounded-full bg-gradient-to-br from-violet-300/30 to-blue-200/30 blur-3xl" />
      <div className="absolute left-0 top-14 w-[76%] rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_28px_80px_rgba(63,47,122,.18)]">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#3f2f7a]">Student direction map</span>
          <Compass className="h-5 w-5 text-violet-500" />
        </div>
        <h3 className="mt-6 text-xl font-bold text-slate-950">From uncertainty to a clear next step.</h3>
        <div className="mt-6 space-y-3">
          {["Interests & motivation", "Aptitude & strengths", "Academic opportunities"].map((item, index) => (
            <div key={item} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-xs font-medium text-slate-600">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-[#3f2f7a]">{index + 1}</span>{item}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute right-0 top-2 w-44 rounded-2xl border border-violet-100 bg-white p-4 shadow-xl">
        <HeartHandshake className="h-6 w-6 text-[#3f2f7a]" />
        <p className="mt-3 text-xs text-slate-500">Guidance style</p>
        <p className="font-bold text-slate-900">Personal & practical</p>
      </div>
      <div className="absolute bottom-8 right-2 w-52 rounded-2xl border border-violet-100 bg-[#3f2f7a] p-5 text-white shadow-xl">
        <div className="flex items-center gap-2"><Target className="h-5 w-5 text-violet-200" /><b className="text-sm">Roadmap prepared</b></div>
        <div className="mt-4 h-1.5 rounded-full bg-white/15"><div className="h-full w-[86%] rounded-full bg-violet-300" /></div>
        <p className="mt-3 text-[10px] text-violet-100/70">Evidence-led student action plan</p>
      </div>
    </div>
  );
}

function Services() {
  return (
    <section className="bg-[#f5f3f9] py-24">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="max-w-2xl"><Eyebrow>Choose your pathway</Eyebrow><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">Guidance designed around where you are.</h2></div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {services.map(({ title, label, description, href, icon: Icon, number }) => (
            <Link key={title} href={href} className="group relative overflow-hidden rounded-[26px] border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-[0_20px_55px_rgba(63,47,122,.12)] sm:p-8">
              <span className="absolute right-6 top-4 text-5xl font-bold text-slate-100 transition group-hover:text-violet-50">{number}</span>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0ebf8] text-[#3f2f7a]"><Icon className="h-6 w-6" /></div>
              <Eyebrow>{label}</Eyebrow>
              <h3 className="mt-3 text-xl font-bold text-slate-950">{title}</h3>
              <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500">{description}</p>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#3f2f7a]">Explore pathway <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="overflow-hidden bg-[#3f2f7a] py-24 text-white">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow light>Our counselling approach</Eyebrow>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">A thoughtful process. A practical outcome.</h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-violet-100/70">No generic answers. Each stage turns conversation and evidence into guidance a student can actually use.</p>
          <div className="mt-8 flex items-center gap-3 text-xs font-semibold text-violet-100"><Check className="h-4 w-4" /> Confidential, student-centred and evidence-led</div>
        </div>
        <div className="space-y-4">
          {process.map(([title, description], index) => (
            <article key={title} className="rounded-[24px] border border-white/15 bg-white/[.08] p-6 backdrop-blur-sm sm:p-8">
              <div className="flex gap-5"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-[#3f2f7a]">0{index + 1}</span><div><h3 className="text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-violet-100/70">{description}</p></div></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhoWeHelp() {
  const groups = [
    [UserRound, "Students", "Find direction that reflects who you are—not only your marks."],
    [UsersRound, "Parents", "Support important decisions with clarity instead of pressure."],
    [School, "Schools", "Build scalable, structured guidance across the student community."],
  ] as const;
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <div className="text-center"><Eyebrow>Guidance for everyone</Eyebrow><h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-5xl">One purpose. Different perspectives.</h2></div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {groups.map(([Icon, title, text]) => <article key={title} className="rounded-[24px] border border-slate-200 p-7"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-[#3f2f7a]"><Icon className="h-6 w-6" /></div><h3 className="mt-6 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-500">{text}</p></article>)}
        </div>
      </div>
    </section>
  );
}

function OutcomeMarquee() {
  const cards = (copy: string) => outcomes.map(([title, text]) => <article key={`${copy}-${title}`} className="w-[290px] shrink-0 rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm sm:w-[330px]"><Sparkles className="h-5 w-5 text-violet-500" /><h3 className="mt-7 text-xl font-bold text-slate-950">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-500">{text}</p></article>);
  return <section className="overflow-hidden bg-[#f5f3f9] py-20"><div className="mx-auto max-w-[1240px] px-5 sm:px-8"><Eyebrow>Counselling outcomes</Eyebrow><h2 className="mt-3 text-3xl font-bold sm:text-5xl">What good guidance should create.</h2></div><div className="counselling-marquee mt-12 flex w-max gap-5"><div className="flex gap-5">{cards("a")}</div><div className="flex gap-5" aria-hidden="true">{cards("b")}</div></div></section>;
}

export default function CounsellingOverviewPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-violet-100">
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-[#f8f7fb] to-white py-20 sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_30%,rgba(124,58,237,.10),transparent_28%),radial-gradient(circle_at_58%_10%,rgba(63,47,122,.08),transparent_25%)]" />
          <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_.95fr]">
            <div><Eyebrow>Explore counselling</Eyebrow><h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-.035em] text-slate-950 sm:text-6xl lg:text-7xl">Direction begins with understanding.</h1><p className="mt-6 max-w-2xl text-base leading-8 text-slate-500">Scientific insight and human guidance come together to help students, parents and institutions make confident education and career decisions.</p></div>
            <HeroVisual />
          </div>
        </section>
        <Services />
        <Process />
        <WhoWeHelp />
        <OutcomeMarquee />
      </main>
      <Footer />
      <style jsx global>{`@keyframes counsellingMarquee{to{transform:translateX(calc(-50% - 10px))}}.counselling-marquee{animation:counsellingMarquee 32s linear infinite}.counselling-marquee:hover{animation-play-state:paused}@media(prefers-reduced-motion:reduce){.counselling-marquee{animation:none}}`}</style>
    </div>
  );
}
