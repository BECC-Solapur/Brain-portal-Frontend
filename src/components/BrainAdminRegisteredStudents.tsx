"use client";

import { useEffect, useState } from "react";
import { apiCall } from "@/lib/api";

type Module = { id: string; name: string; count: number };
type Student = {
  id: string;
  name: string;
  registrationNumber: string | null;
  email: string | null;
  phone: string | null;
  registeredAt: string;
  moduleName: string | null;
  address: string | null;
  schoolCollegeName: string | null;
};
type Page = { students: Student[]; total: number; page: number; perPage: number; pages: number };

export default function BrainAdminRegisteredStudents({ modules, onBack }: { modules: Module[]; onBack: () => void }) {
  const [search, setSearch] = useState("");
  const [programId, setProgramId] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      setLoading(true);
      apiCall<Page>("/api/v1/admin/registered-students", { query: { page, search, programId } })
        .then((data) => { if (active) { setResult(data); setError(""); } })
        .catch((cause) => { if (active) setError(cause instanceof Error ? cause.message : "Could not load registered students."); })
        .finally(() => { if (active) setLoading(false); });
    }, search ? 250 : 0);
    return () => { active = false; clearTimeout(timer); };
  }, [page, search, programId]);

  return <div className="max-w-6xl space-y-5">
    <button type="button" onClick={onBack} className="text-sm font-medium text-[#3f2f7a] hover:underline">← Back to Daily Overview</button>
    <section className="rounded-xl border border-[#d8d5e6] bg-white">
      <div className="border-b border-[#d8d5e6] p-5"><h2 className="text-lg font-semibold">Registered Students</h2><p className="mt-1 text-sm text-[#737373]">{result?.total ?? "—"} registered students · 10 records per page</p></div>
      <div className="grid gap-3 p-5 sm:grid-cols-[1fr_16rem]">
        <label className="text-xs font-medium text-[#525252]">Search by name<input type="search" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Enter student name" className="mt-1.5 w-full rounded-lg border border-[#d8d5e6] px-3 py-2.5 text-sm outline-none focus:border-[#3f2f7a]" /></label>
        <label className="text-xs font-medium text-[#525252]">Counselling module<select value={programId} onChange={(event) => { setProgramId(event.target.value); setPage(1); }} className="mt-1.5 w-full rounded-lg border border-[#d8d5e6] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#3f2f7a]"><option value="">All modules</option>{modules.map((module) => <option key={module.id} value={module.id}>{module.name}</option>)}</select></label>
      </div>
      {error ? <p role="alert" className="px-5 pb-5 text-sm text-red-700">{error}</p> : loading ? <p className="px-5 pb-5 text-sm text-[#737373]">Loading students…</p> : !result?.students.length ? <p className="px-5 pb-5 text-sm text-[#737373]">No students match this search.</p> : <div className="overflow-x-auto px-5"><table className="w-full min-w-[1050px] text-left text-sm"><thead><tr className="border-b border-[#d8d5e6] text-xs text-[#737373]"><th className="py-3 pr-4 font-semibold">Reg No</th><th className="py-3 pr-4 font-semibold">Date</th><th className="py-3 pr-4 font-semibold">Student Name</th><th className="py-3 pr-4 font-semibold">Address</th><th className="py-3 pr-4 font-semibold">Contact</th><th className="py-3 pr-4 font-semibold">Module</th><th className="py-3 font-semibold">School / College Name</th></tr></thead><tbody>{result.students.map((student) => <tr key={student.id} className="border-b border-[#eeeaf5] align-top last:border-0"><td className="py-3 pr-4 text-[#525252]">{student.registrationNumber || "—"}</td><td className="whitespace-nowrap py-3 pr-4 text-[#525252]">{new Date(student.registeredAt).toLocaleDateString("en-IN")}</td><td className="py-3 pr-4 font-medium">{student.name}</td><td className="max-w-64 py-3 pr-4 text-[#525252]">{student.address || "—"}</td><td className="py-3 pr-4 text-[#525252]"><span className="block">{student.phone || "—"}</span><span className="block text-xs">{student.email}</span></td><td className="py-3 pr-4 text-[#525252]">{student.moduleName || "Not selected"}</td><td className="py-3 text-[#525252]">{student.schoolCollegeName || "—"}</td></tr>)}</tbody></table></div>}
      <div className="flex items-center justify-between border-t border-[#d8d5e6] p-5 text-sm"><span className="text-[#737373]">Page {result?.page || page} of {result?.pages || 1}</span><div className="flex gap-2"><button type="button" disabled={page <= 1 || loading} onClick={() => setPage((current) => current - 1)} className="rounded-lg border border-[#d8d5e6] px-3 py-1.5 disabled:opacity-40">Previous</button><button type="button" disabled={!result || page >= result.pages || loading} onClick={() => setPage((current) => current + 1)} className="rounded-lg border border-[#d8d5e6] px-3 py-1.5 disabled:opacity-40">Next</button></div></div>
    </section>
  </div>;
}
