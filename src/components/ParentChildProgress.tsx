"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/api";

type ChildProgress = {
  id: string;
  name: string;
  overall: number | null;
  consistency: number | null;
  monthlyActions: { total: number; completed: number };
  rating: { counsellorProgress: number; careerClarity: number; emotionalWellbeing: number; month: string; counsellorName: string } | null;
};

function Metric({ label, value, note }: { label: string; value: number | null; note: string }) {
  return <div className="rounded-xl border border-[#d8d5e6] bg-white p-5">
    <p className="text-sm font-medium text-[#525252]">{label}</p>
    <p className="mt-2 text-3xl font-semibold text-[#3f2f7a]">{value === null ? "—" : `${value}%`}</p>
    <p className="mt-2 text-xs text-[#737373]">{note}</p>
  </div>;
}

export default function ParentChildProgress({ signedIn }: { signedIn: boolean }) {
  const [reports, setReports] = useState<ChildProgress[]>([]);
  const [loading, setLoading] = useState(signedIn);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!signedIn) return;
    let active = true;
    apiCall<ChildProgress[]>("/api/v1/student-portal/parent/child-progress")
      .then((data) => { if (active) setReports(data); })
      .catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : "Could not load child progress."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [signedIn]);

  if (!signedIn) return <p className="rounded-xl border border-[#d8d5e6] bg-white p-5 text-sm">Sign in with a parent account to view child progress.</p>;
  if (loading) return <p className="text-sm text-[#737373]">Loading child progress…</p>;
  if (error) return <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</p>;
  if (!reports.length) return <p className="rounded-xl border border-[#d8d5e6] bg-white p-5 text-sm">No child is linked to this parent account yet.</p>;

  return <div className="max-w-5xl space-y-8">{reports.map((child) => <section key={child.id} className="space-y-5">
    <h2 className="text-xl font-semibold text-[#171717]">{child.name}</h2>
    <Metric label="Overall progress" value={child.overall} note={child.rating ? "Calculated from the counsellor’s ratings and this month’s action consistency." : "Waiting for a counsellor progress assessment."} />
    <div className="rounded-xl border border-[#d8d5e6] bg-white p-5">
      <h3 className="text-base font-semibold">Child Progress Report</h3>
      <p className="mt-1 text-xs text-[#737373]">{child.rating ? `Latest counsellor assessment by ${child.rating.counsellorName}` : "Counsellor assessment pending"}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Metric label="Study-plan consistency" value={child.consistency} note={child.monthlyActions.total ? `Average daily completion this month · ${child.monthlyActions.completed} of ${child.monthlyActions.total} actions completed.` : "No daily actions recorded this month."} />
        <Metric label="Career clarity" value={child.rating?.careerClarity ?? null} note="Entered by the counsellor." />
        <Metric label="Emotional wellbeing" value={child.rating?.emotionalWellbeing ?? null} note="Entered by the counsellor." />
      </div>
    </div>
  </section>)}</div>;
}
