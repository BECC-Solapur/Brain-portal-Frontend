"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import { CheckCircle2, Save } from "lucide-react";
import { apiCall } from "@/lib/api";

type Answers = Record<string, string>;
type SavedForm = { answers: Answers; status: "draft" | "submitted"; submittedAt: string | null; updatedAt: string | null };

const questions = [
  { number: 3, key: "address", label: "Full address", marathi: "संपूर्ण पत्ता", long: true },
  { number: 4, key: "mobile", label: "Mobile number", marathi: "मोबाईल नं.", type: "tel" },
  { number: 7, key: "fatherRelationship", label: "Father’s relationship with the student", marathi: "वडिलांचे पाल्याशी असलेले संबंध कसे आहेत?", long: true },
  { number: 8, key: "afraidOfFather", label: "Is the student afraid of their father?", marathi: "पाल्याला वडिलांची धाक वाटतो का?", choices: ["Yes", "No", "Sometimes", "Not applicable"] },
  { number: 9, key: "fatherPassion", label: "Father’s passionate area", marathi: "वडिलांचे आवडीचे क्षेत्र" },
  { number: 10, key: "fatherWork", label: "Father’s area of work", marathi: "वडील कोणत्या क्षेत्रात कार्यरत आहेत?" },
  { number: 11, key: "motherPassion", label: "Mother’s passionate area", marathi: "आईचे आवडीचे क्षेत्र" },
  { number: 12, key: "financialCondition", label: "Family financial condition", marathi: "कुटुंबाची आर्थिक परिस्थिती" },
  { number: 13, key: "homeBehaviour", label: "Student’s behaviour at home", marathi: "पाल्याचे घरात वागणे कसे आहे?", long: true },
  { number: 14, key: "closeTo", label: "Is the student closer to father or mother?", marathi: "पाल्याचे आई/वडील या दोघांपैकी कोणाशी जवळीक आहे?", choices: ["Father", "Mother", "Both", "Neither", "Other"] },
  { number: 15, key: "otherRelatives", label: "Other relatives living at home", marathi: "घरातील इतर नातेवाईक" },
  { number: 16, key: "relativeInfluence", label: "Influence of other relatives on the student", marathi: "पाल्यावर इतर कोणत्या नातेवाईकांचा प्रभाव आहे का?", long: true },
  { number: 17, key: "siblingsRelationship", label: "Relationship with brothers and sisters", marathi: "पाल्याचे भावाबहिणींशी संबंध कसे आहेत?", long: true },
  { number: 18, key: "closeFriends", label: "Names of the student’s close friends", marathi: "पाल्याचे जवळचे मित्र किंवा मैत्रिणींची नावे" },
  { number: 19, key: "friendsInfluence", label: "Influence of friends on the student", marathi: "पाल्यावर मित्र मैत्रिणींचा प्रभाव कसा आहे?", long: true },
  { number: 20, key: "hobbiesHabits", label: "Student’s hobbies, habits or addictions", marathi: "पाल्याला इतर काही छंद, सवयी किंवा व्यसन आहेत का?", long: true },
  { number: 21, key: "mobileUsage", label: "Which mobile does the student use, and for how long?", marathi: "पाल्य कोणता मोबाईल वापरतो? किती वेळ वापरतो?", long: true },
  { number: 22, key: "mobileDuringStudy", label: "Does the student use a mobile during study time?", marathi: "अभ्यासाच्या वेळी मोबाईल बंद असतो का?", choices: ["Yes", "No", "Sometimes"] },
  { number: 23, key: "selfDependent", label: "Is the student independent in their work?", marathi: "स्वतःची कामे स्वतः करतो का?", choices: ["Yes", "No", "Sometimes"] },
  { number: 24, key: "expectations", label: "Parents’ expectations from the student", marathi: "पाल्याने भविष्यात काय व्हावे असे वाटते?", long: true },
] as const;

const fieldClass = "w-full rounded-lg border border-[#c9c2e3] bg-white px-3 py-2.5 text-sm text-[#171717] outline-none focus:border-[#3f2f7a] focus:ring-2 focus:ring-[#efeaf9]";

export default function ParentInformationForm({ signedIn }: { signedIn: boolean }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [loading, setLoading] = useState(signedIn);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"draft" | "submitted">("draft");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!signedIn) return;
    let active = true;
    apiCall<SavedForm>("/api/v1/student-portal/parent/information-form")
      .then((form) => { if (active) { setAnswers(form.answers || {}); setStatus(form.status); } })
      .catch((cause) => { if (active) setNotice(cause instanceof Error ? cause.message : "Could not load your saved form."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [signedIn]);

  const update = (key: string, value: string) => { setAnswers((current) => ({ ...current, [key]: value })); setNotice(""); };
  const save = async (submit: boolean) => {
    if (!signedIn) { setNotice("Please sign in with a parent account to save this form."); return; }
    if (submit && (!answers.studentName?.trim() || !answers.parentSignature?.trim())) {
      setNotice("Please enter the student’s name and your typed signature before submitting.");
      return;
    }
    setSaving(true); setNotice("");
    try {
      const result = await apiCall<SavedForm>("/api/v1/student-portal/parent/information-form", { method: "PUT", body: { answers, submit } });
      setStatus(result.status);
      setNotice(submit ? "Parent information form submitted successfully." : "Draft saved successfully.");
    } catch (cause) { setNotice(cause instanceof Error ? cause.message : "Could not save the form."); }
    finally { setSaving(false); }
  };

  const textField = (key: string, label: string, marathi: string, options?: { long?: boolean; type?: string; placeholder?: string }) => <label className="block" htmlFor={`parent-${key}`}>
    <span className="block text-sm font-medium text-[#171717]">{label}</span><span className="block text-xs text-[#737373]">{marathi}</span>
    {options?.long ? <textarea id={`parent-${key}`} rows={3} maxLength={4000} value={answers[key] || ""} onChange={(event) => update(key, event.target.value)} placeholder={options.placeholder} className={`${fieldClass} mt-2`} /> : <input id={`parent-${key}`} type={options?.type || "text"} maxLength={4000} value={answers[key] || ""} onChange={(event) => update(key, event.target.value)} placeholder={options?.placeholder} className={`${fieldClass} mt-2`} />}
  </label>;
  const numbered = (number: string | number, children: React.ReactNode) => <div className="grid gap-3 border-b border-[#eeeaf5] py-5 last:border-0 sm:grid-cols-[2.5rem_1fr]" key={number}><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#efeaf9] text-xs font-semibold text-[#3f2f7a]">{number}</span><div>{children}</div></div>;

  return <div className="mx-auto max-w-5xl pb-12">
    <div className="overflow-hidden rounded-2xl border border-[#c9c2e3] bg-white shadow-sm">
      <div className="border-b border-[#d8d5e6] bg-gradient-to-r from-[#f0e9f8] via-white to-[#fff4e1] p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-4"><Image src="/brain-logo.svg" width={48} height={58} alt="BRAIN logo" className="h-14 w-12 object-contain"/><div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#3f2f7a]">BRAIN Educational Counselling & Consultancy Center</p><h2 className="mt-1 text-2xl font-bold text-[#171717] sm:text-3xl">Disha Career Guidance</h2><p className="mt-1 text-sm font-medium text-[#525252]">Counselling Form for Parents · पालकांसाठी समुपदेशन फॉर्म</p></div></div>
        <p className="mt-5 max-w-2xl text-sm text-[#525252]">Please answer as openly as possible. Your responses help the counsellor understand your child’s home environment, relationships, habits and aspirations.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">{textField("registrationNumber", "Registration number", "नोंदणी क्रमांक")}{textField("formDate", "Date", "दिनांक", { type: "date" })}</div>
      </div>
      <form onSubmit={(event: FormEvent) => { event.preventDefault(); void save(true); }} className="p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-[#3f2f7a]">Family details <span className="text-sm font-normal text-[#737373]">· कुटुंबाची माहिती</span></h3>
        {numbered(1, <div className="grid gap-4 sm:grid-cols-2">{textField("studentName", "Student’s name", "पाल्याचे नाव")}{textField("fatherName", "Father’s name", "वडिलांचे नाव")}</div>)}
        {numbered(2, textField("motherName", "Mother’s name", "आईचे नाव"))}
        {questions.filter((item) => item.number === 3 || item.number === 4).map((item) => numbered(item.number, textField(item.key, item.label, item.marathi, { long: "long" in item && item.long, type: "type" in item ? item.type : undefined })))}
        {numbered(5, <div><p className="mb-3 text-sm font-medium">Father’s details <span className="text-xs font-normal text-[#737373]">· वडिलांची माहिती</span></p><div className="grid gap-4 sm:grid-cols-3">{textField("fatherAge", "Age", "वय", { type: "number" })}{textField("fatherEducation", "Education", "शिक्षण")}{textField("fatherOccupation", "Occupation", "व्यवसाय")}</div></div>)}
        {numbered(6, <div><p className="mb-3 text-sm font-medium">Mother’s details <span className="text-xs font-normal text-[#737373]">· आईची माहिती</span></p><div className="grid gap-4 sm:grid-cols-3">{textField("motherAge", "Age", "वय", { type: "number" })}{textField("motherEducation", "Education", "शिक्षण")}{textField("motherOccupation", "Occupation", "व्यवसाय")}</div></div>)}
        <h3 className="mt-8 text-lg font-semibold text-[#3f2f7a]">Home & family context <span className="text-sm font-normal text-[#737373]">· घर व कौटुंबिक वातावरण</span></h3>
        {questions.filter((item) => item.number >= 7 && item.number <= 16).map((item) => numbered(item.number, <div><label className="block text-sm font-medium" htmlFor={`parent-${item.key}`}>{item.label}<span className="block text-xs font-normal text-[#737373]">{item.marathi}</span></label>{"choices" in item ? <select id={`parent-${item.key}`} value={answers[item.key] || ""} onChange={(event) => update(item.key, event.target.value)} className={`${fieldClass} mt-2`}><option value="">Select an answer</option>{item.choices.map((choice) => <option key={choice}>{choice}</option>)}</select> : "long" in item && item.long ? <textarea id={`parent-${item.key}`} rows={3} maxLength={4000} value={answers[item.key] || ""} onChange={(event) => update(item.key, event.target.value)} className={`${fieldClass} mt-2`} /> : <input id={`parent-${item.key}`} maxLength={4000} value={answers[item.key] || ""} onChange={(event) => update(item.key, event.target.value)} className={`${fieldClass} mt-2`} />}</div>))}
        <h3 className="mt-8 text-lg font-semibold text-[#3f2f7a]">Student habits & aspirations <span className="text-sm font-normal text-[#737373]">· सवयी व अपेक्षा</span></h3>
        {questions.filter((item) => item.number >= 17).map((item) => numbered(item.number, <div><label className="block text-sm font-medium" htmlFor={`parent-${item.key}`}>{item.label}<span className="block text-xs font-normal text-[#737373]">{item.marathi}</span></label>{"choices" in item ? <select id={`parent-${item.key}`} value={answers[item.key] || ""} onChange={(event) => update(item.key, event.target.value)} className={`${fieldClass} mt-2`}><option value="">Select an answer</option>{item.choices.map((choice) => <option key={choice}>{choice}</option>)}</select> : "long" in item && item.long ? <textarea id={`parent-${item.key}`} rows={3} maxLength={4000} value={answers[item.key] || ""} onChange={(event) => update(item.key, event.target.value)} className={`${fieldClass} mt-2`} /> : <input id={`parent-${item.key}`} maxLength={4000} value={answers[item.key] || ""} onChange={(event) => update(item.key, event.target.value)} className={`${fieldClass} mt-2`} />}</div>))}
        <div className="mt-8 rounded-xl border border-dashed border-[#c9c2e3] bg-[#f9f7fc] p-5"><p className="font-semibold text-[#171717]">Counsellor’s observations · समुपदेशकाचे निरीक्षण</p><p className="mt-1 text-sm text-[#737373]">This section will be completed by the counsellor during your consultation.</p></div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">{textField("parentSignature", "Parent’s typed signature", "आई-वडील सही", { placeholder: "Enter your full name" })}<div className="rounded-lg border border-[#eeeaf5] bg-[#faf9fc] p-4"><p className="text-sm font-medium">Counsellor’s signature</p><p className="text-xs text-[#737373]">समुपदेशक सही · completed by your counsellor</p></div></div>
        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-[#eeeaf5] pt-6"><button type="button" onClick={() => void save(false)} disabled={saving || loading || !signedIn} className="inline-flex items-center gap-2 rounded-lg border border-[#3f2f7a] px-5 py-2.5 text-sm font-semibold text-[#3f2f7a] disabled:opacity-50"><Save className="h-4 w-4"/>Save draft</button><button type="submit" disabled={saving || loading || !signedIn} className="inline-flex items-center gap-2 rounded-lg bg-[#3f2f7a] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"><CheckCircle2 className="h-4 w-4"/>{saving ? "Saving…" : "Submit parent form"}</button><span className="text-xs text-[#737373]">{status === "submitted" ? "Previously submitted · you can update and resubmit" : "Draft"}</span></div>
        {!signedIn && <p className="mt-3 text-sm text-amber-700">Sign in as a parent to save this form.</p>}
        {notice && <p role="status" className="mt-3 text-sm text-[#3f2f7a]">{notice}</p>}
      </form>
    </div>
  </div>;
}
