"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/api";
import { CheckCircle2, CircleDashed, MessageSquareText } from "lucide-react";

type ChildUpdate = {
  id: string;
  name: string;
  actions: { id: string; text: string; done: boolean; due: string }[];
  feedback: { text: string; date: string; counsellorName: string } | null;
};

export default function ParentDailyUpdates({ signedIn }: { signedIn: boolean }) {
  const [updates, setUpdates] = useState<ChildUpdate[]>([]);
  const [loading, setLoading] = useState(signedIn);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!signedIn) return;
    let active = true;
    apiCall<ChildUpdate[]>("/api/v1/student-portal/parent/daily-updates")
      .then((data) => { if (active) setUpdates(data); })
      .catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : "Could not load daily updates."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [signedIn]);

  if (!signedIn) return <p className="rounded-xl border border-[#d8d5e6] bg-white p-5 text-sm">Sign in with a parent account to see your child’s daily updates.</p>;
  if (loading) return <p className="text-sm text-[#737373]">Loading daily updates…</p>;
  if (error) return <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</p>;
  if (!updates.length) return <p className="rounded-xl border border-[#d8d5e6] bg-white p-5 text-sm">No child is linked to this parent account yet.</p>;

  return <div className="max-w-5xl space-y-6">{updates.map((child) => {
    const complete = child.actions.filter((action) => action.done).length;
    const remaining = child.actions.length - complete;
    const progress = child.actions.length ? Math.round((complete / child.actions.length) * 100) : 0;
    return <div key={child.id} className="space-y-5">
      <div><p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#3f2f7a]">Linked student</p><h2 className="mt-1 text-xl font-semibold text-[#171717]">{child.name}</h2></div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[#d8d5e6] bg-white p-4"><div className="flex items-start justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#737373]">Completed</p><p className="mt-2 text-2xl font-semibold text-[#171717]">{complete}</p></div><CheckCircle2 className="h-4 w-4 text-green-600" /></div><p className="mt-3 text-xs text-[#737373]">Today’s finished actions</p></div>
        <div className="rounded-xl border border-[#d8d5e6] bg-white p-4"><div className="flex items-start justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#737373]">Remaining</p><p className="mt-2 text-2xl font-semibold text-[#171717]">{remaining}</p></div><CircleDashed className="h-4 w-4 text-amber-500" /></div><p className="mt-3 text-xs text-[#737373]">Actions still in progress</p></div>
        <div className="rounded-xl border border-[#d8d5e6] bg-white p-4"><div className="flex items-start justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#737373]">Completion</p><p className="mt-2 text-2xl font-semibold text-[#171717]">{progress}%</p></div><MessageSquareText className="h-4 w-4 text-[#3f2f7a]" /></div><p className="mt-3 text-xs text-[#737373]">Daily action consistency</p></div>
      </div>
      <section className="rounded-xl border border-[#d8d5e6] bg-white p-5">
        <div className="flex items-end justify-between gap-4"><div><h3 className="text-base font-semibold">Daily actions report</h3><p className="mt-1 text-sm text-[#737373]">{complete} of {child.actions.length} actions completed today</p></div><span className="text-sm font-semibold text-[#3f2f7a]">{progress}%</span></div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#f6f3fb]"><div className="h-full rounded-full bg-[#3f2f7a] transition-all" style={{ width: `${progress}%` }} /></div>
        <div className="mt-4 space-y-2">{child.actions.map((action) => <div key={action.id} className="flex items-start justify-between gap-4 rounded-lg border border-[#d8d5e6] p-3 text-sm"><span>{action.text}</span><span className={action.done ? "shrink-0 font-medium text-green-700" : "shrink-0 font-medium text-amber-700"}>{action.done ? "Completed" : "Remaining"}</span></div>)}{!child.actions.length && <p className="text-sm text-[#737373]">No actions assigned for today.</p>}</div>
      </section>
      {child.feedback && <section className="rounded-xl border border-[#d8d5e6] bg-white p-5"><div className="flex items-center gap-2"><MessageSquareText className="h-4 w-4 text-[#3f2f7a]"/><h3 className="text-sm font-semibold">Latest counsellor note</h3></div><p className="mt-3 text-sm leading-6 text-[#525252]">{child.feedback.text}</p><p className="mt-3 text-xs text-[#737373]">{child.feedback.counsellorName} · {new Date(child.feedback.date).toLocaleDateString("en-IN")}</p></section>}
    </div>;
  })}</div>;
}
