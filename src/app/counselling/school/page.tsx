import Image from "next/image";
import {
  BarChart3,
  BrainCircuit,
  Check,
  GraduationCap,
  HeartHandshake,
  School,
  Sparkles,
  UsersRound,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const offerings = [
  {
    icon: BrainCircuit,
    title: "Batch-Wise Psychometric Testing",
    label: "Student insight",
    description: "On-campus assessment drives for Classes 8–12 with individual reports and structured cohort analysis.",
    features: ["Standardised administration", "Individual student reports", "Cohort-level patterns"],
  },
  {
    icon: UsersRound,
    title: "Palak Sabha",
    label: "Parent partnership",
    description: "Interactive parenting conclaves focused on adolescence, exam anxiety, study habits and healthy support systems.",
    features: ["Practical parent guidance", "Expert-led discussion", "Age-relevant strategies"],
  },
  {
    icon: GraduationCap,
    title: "Teacher Sensitivity Training",
    label: "Faculty development",
    description: "Help educators recognise learning differences, behavioural stress signals and emotional fatigue in the classroom.",
    features: ["Behavioural awareness", "Learning-style cues", "Early support protocols"],
  },
  {
    icon: BarChart3,
    title: "Institutional Analytics",
    label: "Leadership insight",
    description: "Management-ready summaries revealing aptitude patterns, guidance needs and emerging career interests.",
    features: ["Decision-ready dashboards", "Career trend mapping", "Programme recommendations"],
  },
];

const implementation = [
  ["Discover", "Understand the institution, student cohorts and counselling priorities."],
  ["Design", "Build an age-appropriate assessment and guidance programme."],
  ["Deliver", "Run student, parent and faculty sessions on campus or online."],
  ["Review", "Share insights, action priorities and measurable next steps."],
];

const impact = [
  ["Student clarity", "Better understanding of strengths, interests and future options."],
  ["Parent alignment", "More supportive conversations around academic and career choices."],
  ["Teacher readiness", "Earlier recognition of learning and emotional support needs."],
  ["Institutional insight", "Clearer visibility into cohort trends and programme priorities."],
  ["Career culture", "A structured guidance ecosystem embedded within the school."],
];

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`text-[11px] font-bold uppercase tracking-[.2em] ${light ? "text-violet-100" : "text-[#3f2f7a]"}`}>{children}</p>;
}

function HeroVisual() {
  return (
    <div className="relative mx-auto h-[440px] w-full max-w-[530px]">
      <div className="absolute inset-10 rounded-full bg-violet-300/25 blur-3xl" />
      <div className="absolute inset-x-0 top-10 h-[340px] overflow-hidden rounded-[28px] border border-white bg-white p-2 shadow-[0_30px_80px_rgba(63,47,122,.18)]">
        <div className="relative h-full overflow-hidden rounded-[22px]">
          <Image src="/images/gallery3.png" alt="School counselling session" fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2c2159]/70 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 text-white"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-violet-100">On-campus engagement</p><p className="mt-1 text-lg font-bold">Guidance where students learn</p></div>
        </div>
      </div>
      <div className="absolute right-0 top-0 rounded-2xl border border-violet-100 bg-white p-4 shadow-xl"><School className="h-6 w-6 text-[#3f2f7a]" /><p className="mt-3 text-xs text-slate-500">Institutional reach</p><p className="font-bold text-slate-950">120+ partners</p></div>
      <div className="absolute bottom-0 left-6 w-56 rounded-2xl bg-[#3f2f7a] p-5 text-white shadow-xl"><div className="flex items-center gap-2"><HeartHandshake className="h-5 w-5 text-violet-200" /><b className="text-sm">Whole-school support</b></div><p className="mt-3 text-xs leading-5 text-violet-100/70">Students · Parents · Teachers · Leadership</p></div>
    </div>
  );
}

function Programmes() {
  return (
    <section className="bg-[#f5f3f9] py-24">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="max-w-3xl"><Eyebrow>Institutional programmes</Eyebrow><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">A complete counselling ecosystem for schools.</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-slate-500">Integrated programmes connect student insight with the adults and systems that shape everyday learning.</p></div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {offerings.map(({ icon: Icon, title, label, description, features }, index) => (
            <article key={title} className="group relative overflow-hidden rounded-[26px] border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-[0_20px_55px_rgba(63,47,122,.12)] sm:p-8">
              <span className="absolute right-6 top-4 text-5xl font-bold text-slate-100">0{index + 1}</span>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0ebf8] text-[#3f2f7a]"><Icon className="h-6 w-6" /></div>
              <Eyebrow>{label}</Eyebrow>
              <h3 className="mt-3 text-xl font-bold text-slate-950">{title}</h3>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">{description}</p>
              <ul className="mt-6 grid gap-2 border-t border-slate-100 pt-5 sm:grid-cols-3">{features.map(feature => <li key={feature} className="flex items-start gap-2 text-xs leading-5 text-slate-600"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#3f2f7a]" />{feature}</li>)}</ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeliveryProcess() {
  return (
    <section className="bg-[#3f2f7a] py-24 text-white">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr]">
        <div><Eyebrow light>From partnership to impact</Eyebrow><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Designed with your school. Delivered for your community.</h2><p className="mt-5 max-w-md text-sm leading-7 text-violet-100/70">Every engagement adapts to the school calendar, cohort size and priorities while keeping the process structured and measurable.</p></div>
        <div className="grid gap-4 sm:grid-cols-2">
          {implementation.map(([title, description], index) => <article key={title} className="rounded-[24px] border border-white/15 bg-white/[.08] p-6"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xs font-bold text-[#3f2f7a]">0{index + 1}</span><h3 className="mt-6 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-violet-100/70">{description}</p></article>)}
        </div>
      </div>
    </section>
  );
}

function ImpactMarquee() {
  const cards = (copy: string) => impact.map(([title, description]) => <article key={`${copy}-${title}`} className="w-[290px] shrink-0 rounded-[22px] border border-slate-200 bg-white p-6 shadow-sm sm:w-[340px]"><Sparkles className="h-5 w-5 text-violet-500" /><h3 className="mt-7 text-xl font-bold text-slate-950">{title}</h3><p className="mt-3 text-sm leading-7 text-slate-500">{description}</p></article>);
  return <section className="overflow-hidden bg-white py-24"><div className="mx-auto max-w-[1240px] px-5 sm:px-8"><Eyebrow>School-wide impact</Eyebrow><h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-5xl">Guidance that strengthens the learning community.</h2></div><div className="school-marquee mt-12 flex w-max gap-5"><div className="flex gap-5">{cards("a")}</div><div className="flex gap-5" aria-hidden="true">{cards("b")}</div></div></section>;
}

export default function SchoolCounsellingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-violet-100">
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-[#f8f7fb] to-white py-20 sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_30%,rgba(124,58,237,.11),transparent_28%),radial-gradient(circle_at_60%_8%,rgba(63,47,122,.07),transparent_24%)]" />
          <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_.95fr]">
            <div><Eyebrow>School counselling</Eyebrow><h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-.035em] text-slate-950 sm:text-6xl lg:text-7xl">Build a school culture where every student finds direction.</h1><p className="mt-6 max-w-2xl text-base leading-8 text-slate-500">Bring psychometric insight, career guidance, parent partnership and teacher development together in one structured institutional programme.</p></div>
            <HeroVisual />
          </div>
        </section>
        <div id="programmes"><Programmes /></div>
        <DeliveryProcess />
        <ImpactMarquee />
      </main>
      <Footer />
      <style>{`@keyframes schoolMarquee{to{transform:translateX(calc(-50% - 10px))}}.school-marquee{animation:schoolMarquee 34s linear infinite}.school-marquee:hover{animation-play-state:paused}@media(prefers-reduced-motion:reduce){.school-marquee{animation:none}}`}</style>
    </div>
  );
}
