"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/api";

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
    return <div key={child.id} className="space-y-5">
      <h2 className="text-xl font-semibold text-[#171717]">{child.name}</h2>
      <section className="rounded-xl border border-[#d8d5e6] bg-white p-5">
        <h3 className="text-base font-semibold">Daily actions report</h3>
        <p className="mt-1 text-sm text-[#737373]">{complete} of {child.actions.length} actions completed today</p>
        <div className="mt-4 space-y-2">{child.actions.map((action) => <div key={action.id} className="flex items-start justify-between gap-4 rounded-lg border border-[#d8d5e6] p-3 text-sm"><span>{action.text}</span><span className={action.done ? "shrink-0 font-medium text-green-700" : "shrink-0 font-medium text-amber-700"}>{action.done ? "Completed" : "Remaining"}</span></div>)}{!child.actions.length && <p className="text-sm text-[#737373]">No actions assigned for today.</p>}</div>
      </section>
    </div>;
  })}</div>;
}
