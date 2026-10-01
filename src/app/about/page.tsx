import {
  Award,
  Brain,
  Compass,
  Heart,
  Lightbulb,
  ShieldCheck,
  Target,
  UsersRound,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const stats = [
  ["10k+", "Students Mentored", "Guidance across academic and career stages"],
  ["98%", "Clarity Rate", "Students reporting clearer next steps"],
  ["12+ Yrs", "Registered Trust", "A sustained commitment to student development"],
];

const framework = [
  {
    icon: Brain,
    short: "IQ",
    title: "Intellectual Quotient",
    subtitle: "Cognitive potential",
    description: "Logical reasoning, numerical ability, spatial thinking and natural aptitude reveal how a student learns and solves problems.",
    points: ["Aptitude patterns", "Learning strengths", "Academic alignment"],
  },
  {
    icon: Heart,
    short: "EQ",
    title: "Emotional Quotient",
    subtitle: "Resilience & mindset",
    description: "Emotional awareness, confidence and response to pressure shape how students navigate exams, setbacks and decisions.",
    points: ["Self-awareness", "Stress response", "Decision confidence"],
  },
  {
    icon: UsersRound,
    short: "SQ",
    title: "Social & Spiritual Quotient",
    subtitle: "Values & leadership",
    description: "Communication, empathy, values and social responsibility help students grow into grounded and capable individuals.",
    points: ["Communication", "Values & empathy", "Leadership potential"],
  },
];

const principles = [
  [Lightbulb, "Clarity before choice", "We help students understand themselves before asking them to choose a path."],
  [ShieldCheck, "Evidence with empathy", "Structured insight is always interpreted through a student-centred human conversation."],
  [Compass, "Direction with action", "Every recommendation should become a realistic next step—not remain a report on a shelf."],
  [Award, "Growth over time", "A student&apos;s roadmap should evolve as their abilities, ambitions and opportunities change."],
] as const;

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return <p className={`text-[11px] font-bold uppercase tracking-[.2em] ${light ? "text-violet-100" : "text-[#3f2f7a]"}`}>{children}</p>;
}

function HeroVisual() {
  return (
    <div className="relative mx-auto h-[430px] w-full max-w-[520px]" aria-hidden="true">
      <div className="absolute inset-10 rounded-full bg-violet-300/25 blur-3xl" />
      <div className="absolute left-0 top-12 w-[78%] rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_28px_80px_rgba(63,47,122,.18)]">
        <div className="flex items-center justify-between"><span className="text-[11px] font-bold uppercase tracking-wider text-[#3f2f7a]">The BRAIN approach</span><Brain className="h-5 w-5 text-violet-500" /></div>
        <h3 className="mt-6 text-xl font-bold text-slate-950">Understand the whole student.</h3>
        <div className="mt-6 space-y-3">{[["IQ", "How they think"], ["EQ", "How they respond"], ["SQ", "How they relate & lead"]].map(([key, text]) => <div key={key} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-[#3f2f7a]">{key}</span><span className="text-xs font-semibold text-slate-600">{text}</span></div>)}</div>
      </div>
      <div className="absolute right-0 top-2 rounded-2xl border border-violet-100 bg-white p-4 shadow-xl"><ShieldCheck className="h-6 w-6 text-[#3f2f7a]" /><p className="mt-3 text-xs text-slate-500">Established</p><p className="font-bold text-slate-950">Government trust</p></div>
      <div className="absolute bottom-7 right-2 w-52 rounded-2xl bg-[#3f2f7a] p-5 text-white shadow-xl"><Target className="h-5 w-5 text-violet-200" /><p className="mt-3 text-xs text-violet-100/70">Our purpose</p><p className="font-bold">Potential into direction</p></div>
    </div>
  );
}

function Statistics() {
  return <section className="border-y border-slate-100 bg-white"><div className="mx-auto grid max-w-[1240px] divide-y divide-slate-100 px-5 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-8">{stats.map(([number, label, note]) => <div key={label} className="py-9 sm:px-8 first:pl-0 last:pr-0"><p className="text-4xl font-bold tracking-tight text-[#3f2f7a]">{number}</p><p className="mt-2 text-sm font-bold text-slate-900">{label}</p><p className="mt-1 text-xs leading-5 text-slate-400">{note}</p></div>)}</div></section>;
}

function VisionMission() {
  return (
    <section className="bg-[#f5f3f9] py-24">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="max-w-3xl"><Eyebrow>Why we exist</Eyebrow><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">Career clarity is part of human development.</h2><p className="mt-5 max-w-2xl text-sm leading-7 text-slate-500">BECC was built on a simple belief: education decisions become stronger when students understand their abilities, emotions, values and opportunities together.</p></div>
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <article className="rounded-[28px] border border-slate-200 bg-white p-7 sm:p-9"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0ebf8] text-[#3f2f7a]"><Target className="h-6 w-6" /></div><Eyebrow>Our vision</Eyebrow><h3 className="mt-3 text-2xl font-bold text-slate-950">Every student sees a future that fits.</h3><p className="mt-4 text-sm leading-7 text-slate-500">To be a trusted educational counselling centre that helps young people discover fulfilling careers while developing balanced human potential.</p></article>
          <article className="rounded-[28px] border border-slate-200 bg-white p-7 sm:p-9"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f0ebf8] text-[#3f2f7a]"><Award className="h-6 w-6" /></div><Eyebrow>Our mission</Eyebrow><h3 className="mt-3 text-2xl font-bold text-slate-950">Turn confusion into a practical roadmap.</h3><p className="mt-4 text-sm leading-7 text-slate-500">Empower students, parents and educators through psychometric insight, academic guidance, emotional support and lifelong career adaptability.</p></article>
        </div>
      </div>
    </section>
  );
}

function IntelligenceFramework() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <div className="text-center"><Eyebrow>The scientific foundation</Eyebrow><h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-5xl">The IQ · EQ · SQ framework</h2><p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-500">A multidimensional view of intelligence creates a more useful picture than marks or aptitude alone.</p></div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">{framework.map(({ icon: Icon, short, title, subtitle, description, points }) => <article key={short} className="group rounded-[26px] border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-[0_20px_55px_rgba(63,47,122,.12)]"><div className="flex items-center justify-between"><div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#3f2f7a] text-xl font-bold text-white">{short}</div><Icon className="h-6 w-6 text-violet-400" /></div><Eyebrow>{subtitle}</Eyebrow><h3 className="mt-3 text-xl font-bold text-slate-950">{title}</h3><p className="mt-4 text-sm leading-7 text-slate-500">{description}</p><ul className="mt-6 space-y-2 border-t border-slate-100 pt-5">{points.map(point => <li key={point} className="flex items-center gap-2 text-xs text-slate-600"><span className="h-1.5 w-1.5 rounded-full bg-violet-500" />{point}</li>)}</ul></article>)}</div>
      </div>
    </section>
  );
}

function Principles() {
  return <section className="bg-[#3f2f7a] py-24 text-white"><div className="mx-auto grid max-w-[1240px] gap-12 px-5 sm:px-8 lg:grid-cols-[.75fr_1.25fr]"><div><Eyebrow light>What guides our work</Eyebrow><h2 className="mt-3 text-3xl font-bold sm:text-5xl">Principles before programmes.</h2><p className="mt-5 max-w-md text-sm leading-7 text-violet-100/70">Methods may evolve. These commitments remain central to every student, parent and institution we support.</p></div><div className="grid gap-4 sm:grid-cols-2">{principles.map(([Icon, title, text]) => <article key={title} className="rounded-[24px] border border-white/15 bg-white/[.08] p-6"><Icon className="h-6 w-6 text-violet-200" /><h3 className="mt-6 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-7 text-violet-100/70">{text}</p></article>)}</div></div></section>;
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-violet-100">
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-[#f8f7fb] to-white py-20 sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_30%,rgba(124,58,237,.11),transparent_28%),radial-gradient(circle_at_60%_8%,rgba(63,47,122,.07),transparent_24%)]" />
          <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_.95fr]">
            <div><Eyebrow>About BRAIN</Eyebrow><h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-.035em] text-slate-950 sm:text-6xl lg:text-7xl">Helping students understand who they are—and where they can go.</h1><p className="mt-6 max-w-2xl text-base leading-8 text-slate-500">Brain Educational Counselling & Consultancy Centre, Solapur combines psychometric insight, educational expertise and human guidance to turn student potential into meaningful direction.</p></div>
            <HeroVisual />
          </div>
        </section>
        <Statistics />
        <VisionMission />
        <IntelligenceFramework />
        <Principles />
      </main>
      <Footer />
    </div>
  );
}
