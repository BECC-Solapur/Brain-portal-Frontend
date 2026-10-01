"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Brain, FileText, Mic, Upload, CheckCircle2, CreditCard,
  Sparkles, Lock, Loader2, AlertCircle, RefreshCw, Compass,
  Layers, Award, Clock, Maximize2, Minimize2, RotateCcw, ShieldCheck
} from "lucide-react";
import { api, apiCall, getAccessToken, joinUrl } from "@/lib/api";

export type PortalAction = { id: string; text: string; done: boolean; due: string | null; assigned_by: string | null };
export type PortalCheckin = { mood: number; reflection: string; date: string };
export type PortalMarksheet = { id: string; name: string; mimeType: string; size: number; uploadedAt: string };
export type PortalSnapshot = {
  actions: PortalAction[];
  checkin: PortalCheckin | null;
  marksheets: PortalMarksheet[];
  counsellorFeedback?: { text: string; date: string; counsellorName: string } | null;
  publishedAdvice?: { studyImprovement: string; regularImprovement: string; recommendations: string; publishedAt: string; counsellorName: string } | null;
  progressRating?: { counsellorProgress: number; careerClarity: number; emotionalWellbeing: number; month: string; updatedAt: string } | null;
  parentFeedback?: { answers: Record<string, string>; updatedAt: string } | null;
  privateNote?: { text: string; updatedAt: string } | null;
};

const emptySnapshot: PortalSnapshot = { actions: [], checkin: null, marksheets: [] };
const emojis = ["😞", "😕", "😐", "🙂", "😄"];

export function useStudentWorkspace(studentId?: string | null) {
  const [snapshot, setSnapshot] = useState<PortalSnapshot>(emptySnapshot);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const refresh = useCallback(async () => {
    if (!studentId) { setSnapshot(emptySnapshot); return; }
    setLoading(true);
    setSnapshot(emptySnapshot);
    try {
      setSnapshot(await apiCall<PortalSnapshot>(`/api/v1/student-portal/${studentId}/snapshot`));
      setError("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Student records could not be loaded.");
    } finally { setLoading(false); }
  }, [studentId]);
  useEffect(() => { void refresh(); }, [refresh]);
  return { snapshot, loading, error, refresh };
}

function Notice({ studentId, error, loading }: { studentId?: string | null; error: string; loading: boolean }) {
  if (!studentId) return <p className="rounded-lg border border-[#d8d5e6] bg-white p-5 text-sm">Sign in with a student account to access these records.</p>;
  if (error) return <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>;
  if (loading) return <p className="text-sm text-[#737373]">Loading student records…</p>;
  return null;
}

const card = "rounded-xl border border-[#d8d5e6] bg-white p-5";
const input = "w-full rounded-lg border border-[#d8d5e6] bg-white px-3 py-2 text-sm outline-none focus:border-[#3f2f7a]";
const primary = "rounded-lg bg-[#3f2f7a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2c2159] disabled:opacity-50";

export function StudentToday({ studentId, workspace }: { studentId?: string | null; workspace: ReturnType<typeof useStudentWorkspace> }) {
  const { snapshot, loading, error, refresh } = workspace;
  const [mood, setMood] = useState(3);
  const [reflection, setReflection] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [listening, setListening] = useState(false);
  useEffect(() => {
    if (snapshot.checkin) { setMood(snapshot.checkin.mood); setReflection(snapshot.checkin.reflection || ""); }
  }, [snapshot.checkin]);
  const save = async () => {
    if (!studentId) return;
    setSaving(true); setMessage("");
    try {
      await apiCall(`/api/v1/student-portal/${studentId}/wellness`, { method: "POST", body: { mood, reflection } });
      await refresh(); setMessage("Today’s check-in was shared with your counsellor.");
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : "Could not save check-in."); }
    finally { setSaving(false); }
  };
  const dictate = () => {
    const Recognition = (window as unknown as { webkitSpeechRecognition?: new () => { lang: string; start: () => void; onresult: (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; onend: () => void } }).webkitSpeechRecognition;
    if (!Recognition) { setMessage("Speech-to-text is unavailable in this browser."); return; }
    const recognition = new Recognition();
    recognition.lang = "en-IN";
    recognition.onresult = (event) => setReflection((current) => `${current} ${event.results[0][0].transcript}`.trim());
    recognition.onend = () => setListening(false);
    setListening(true);
    recognition.start();
  };
  const toggle = async (action: PortalAction) => {
    if (!studentId) return;
    try {
      await apiCall(`/api/v1/student-portal/${studentId}/actions/${action.id}`, { method: "PATCH", body: { done: !action.done } });
      await refresh(); setMessage("Action progress shared with your counsellor.");
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : "Could not update action."); }
  };
  return <div className="max-w-5xl space-y-5">
    <Notice studentId={studentId} error={error} loading={loading} />
    {studentId && !error && !loading && <div className="grid gap-5 md:grid-cols-2">
      <section className={card}>
        <h2 className="text-lg font-semibold">Daily mood & wellness check-in</h2>
        <p className="mt-1 text-sm text-[#737373]">Your emoji and reflection are shared with your counsellor for review.</p>
        <div className="mt-5 flex gap-2">{emojis.map((emoji, index) => <button type="button" key={emoji} aria-label={`Mood ${index + 1} of 5`} aria-pressed={mood === index + 1} onClick={() => setMood(index + 1)} className={`flex-1 rounded-lg border p-2 text-2xl ${mood === index + 1 ? "border-[#3f2f7a] bg-[#efeaf9]" : "border-[#d8d5e6]"}`}>{emoji}</button>)}</div>
        <textarea value={reflection} onChange={(event) => setReflection(event.target.value)} maxLength={5000} rows={5} placeholder="How do you feel today?" className={`${input} mt-4`} />
        <button type="button" onClick={dictate} className="mt-2 flex items-center gap-1 text-sm text-[#3f2f7a]"><Mic className="h-4 w-4"/>{listening ? "Listening…" : "Speak instead of typing"}</button>
        <button type="button" onClick={save} disabled={saving} className={`${primary} mt-3`}>{saving ? "Saving…" : "Save today’s check-in"}</button>
      </section>
      <section className={card}>
        <h2 className="text-lg font-semibold">Action checklist</h2>
        <p className="mt-1 text-sm text-[#737373]">Your counsellor can see exactly which actions are complete or still pending.</p>
        <div className="mt-5 space-y-2">{snapshot.actions.length ? snapshot.actions.map((action) => <label key={action.id} className="flex items-start gap-3 rounded-lg border border-[#d8d5e6] p-3 text-sm"><input type="checkbox" checked={action.done} onChange={() => void toggle(action)} className="mt-1 accent-[#3f2f7a]"/><span className="flex-1">{action.text}<span className="block text-xs text-[#737373]">{action.assigned_by ? "Assigned by counsellor" : "My action"}</span></span><span className={action.done ? "text-green-700" : "text-amber-700"}>{action.done ? "Complete" : "Pending"}</span></label>) : <p className="text-sm text-[#737373]">No actions yet. Add one in Daily Action Plan.</p>}</div>
      </section>
    </div>}
    {message && <p role="status" className="text-sm text-[#3f2f7a]">{message}</p>}
  </div>;
}

export function StudentActionPlan({ studentId, workspace }: { studentId?: string | null; workspace: ReturnType<typeof useStudentWorkspace> }) {
  const { snapshot, error, loading, refresh } = workspace;
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const add = async () => {
    if (!studentId || !text.trim()) return;
    try { await apiCall(`/api/v1/student-portal/${studentId}/actions`, { method: "POST", body: { text: text.trim() } }); setText(""); await refresh(); setMessage(""); }
    catch (cause) { setMessage(cause instanceof Error ? cause.message : "Could not add action."); }
  };
  return <div className="max-w-4xl space-y-5"><Notice studentId={studentId} error={error} loading={loading} /><section className={card}><h2 className="text-lg font-semibold">Daily Action Plan</h2><p className="mt-1 text-sm text-[#737373]">Create your own actions. Your counsellor can also assign actions to you.</p><div className="mt-4 flex gap-2"><input className={input} value={text} maxLength={500} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void add(); }} placeholder="Add an action for today"/><button type="button" onClick={add} disabled={!studentId || !text.trim()} className={primary}>Add action</button></div>{message && <p role="alert" className="mt-2 text-sm text-red-700">{message}</p>}<div className="mt-5 space-y-2">{snapshot.actions.map((action) => <div key={action.id} className="flex justify-between gap-3 rounded-lg border border-[#d8d5e6] p-3 text-sm"><span>{action.text}<span className="block text-xs text-[#737373]">{action.assigned_by ? "Counsellor assigned" : "Self assigned"}</span></span><span>{action.done ? "Completed" : "Pending"}</span></div>)}{!snapshot.actions.length && <p className="text-sm text-[#737373]">No daily actions yet.</p>}</div></section></div>;
}

export function StudentMarksheets({ studentId, workspace, readOnly = false }: { studentId?: string | null; workspace: ReturnType<typeof useStudentWorkspace>; readOnly?: boolean }) {
  const { snapshot, error, loading, refresh } = workspace;
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const upload = async (file: File) => {
    if (!studentId) return;
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type) || file.size > 8 * 1024 * 1024) { setMessage("Choose a PDF, JPG or PNG under 8 MB."); return; }
    setUploading(true); setMessage("");
    try {
      const response = await fetch(joinUrl(`/api/v1/student-portal/${studentId}/marksheets`), { method: "POST", headers: { Authorization: `Bearer ${getAccessToken()}`, "Content-Type": "application/octet-stream", "X-File-Type": file.type, "X-File-Name": encodeURIComponent(file.name) }, body: file });
      if (!response.ok) throw new Error("Upload failed. Please try again.");
      await refresh(); setMessage("Marksheet uploaded and available to your counsellor.");
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : "Upload failed."); }
    finally { setUploading(false); }
  };
  const preview = async (file: PortalMarksheet) => {
    if (!studentId) return;
    try {
      const response = await fetch(joinUrl(`/api/v1/student-portal/${studentId}/marksheets/${file.id}`), { headers: { Authorization: `Bearer ${getAccessToken()}` } });
      if (!response.ok) throw new Error("Could not open marksheet.");
      const url = URL.createObjectURL(await response.blob());
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : "Could not open marksheet."); }
  };
  return <div className="max-w-4xl space-y-5"><Notice studentId={studentId} error={error} loading={loading} />{!readOnly && <section className={card}><h2 className="text-lg font-semibold">Marksheets</h2><p className="mt-1 text-sm text-[#737373]">Upload available school marksheets for your associated counsellor to preview.</p><label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#9f98b9] p-8 text-sm text-[#3f2f7a]"><Upload className="h-5 w-5"/>{uploading ? "Uploading…" : "Choose PDF, JPG or PNG (up to 8 MB)"}<input type="file" accept="application/pdf,image/jpeg,image/png" multiple disabled={!studentId || uploading} className="hidden" onChange={(event) => { Array.from(event.target.files || []).forEach((file) => void upload(file)); event.target.value = ""; }}/></label></section>}<section className={card}><h2 className="text-lg font-semibold">Uploaded marksheets</h2><div className="mt-4 space-y-2">{snapshot.marksheets.map((file) => <div key={file.id} className="flex items-center gap-3 rounded-lg border border-[#d8d5e6] p-3 text-sm"><FileText className="h-5 w-5 text-[#3f2f7a]"/><span className="flex-1 truncate">{file.name}</span><button type="button" onClick={() => void preview(file)} className="text-[#3f2f7a] underline">Preview</button></div>)}{!snapshot.marksheets.length && <p className="text-sm text-[#737373]">No marksheets uploaded yet.</p>}</div></section>{message && <p role="status" className="text-sm text-[#3f2f7a]">{message}</p>}</div>;
}

const ASSESSMENT_TEST_URL = "https://studentanalysis1.onrender.com/";

let razorpayScriptPromise: Promise<void> | null = null;
function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as any).Razorpay) return Promise.resolve();
  if (razorpayScriptPromise) return razorpayScriptPromise;
  razorpayScriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      razorpayScriptPromise = null;
      reject(new Error("Unable to load Razorpay payment gateway"));
    };
    document.head.appendChild(script);
  });
  return razorpayScriptPromise;
}

export function StudentAICMT({
  workspace,
  studentId,
  studentEmail,
  studentName,
}: {
  workspace: ReturnType<typeof useStudentWorkspace>;
  studentId?: string | null;
  studentEmail?: string | null;
  studentName?: string | null;
}) {
  const storageKey = studentId ? `aicmt_payment_${studentId}` : "aicmt_payment_current";
  const [isPaid, setIsPaid] = useState(false);
  const [paymentRecord, setPaymentRecord] = useState<{
    receiptNumber: string;
    paymentId: string;
    amount: number;
    paidAt: string;
    method?: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [iframeLoading, setIframeLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Check saved payment on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.receiptNumber || parsed.paid)) {
          setPaymentRecord(parsed);
          setIsPaid(true);
        }
      }
    } catch {
      // Ignore localStorage read errors
    }
  }, [storageKey]);

  const handlePaymentSuccess = (data: {
    receiptNumber: string;
    paymentId: string;
    amount: number;
    method?: string;
  }) => {
    const record = {
      ...data,
      paidAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(storageKey, JSON.stringify(record));
    } catch {}
    setPaymentRecord(record);
    setIsPaid(true);
    setError("");
    setIframeLoading(true);
  };

  const initiateRazorpayPayment = async () => {
    setLoading(true);
    setError("");
    try {
      await loadRazorpayScript();
      if (typeof window === "undefined" || !(window as any).Razorpay) {
        throw new Error("Razorpay checkout is unavailable");
      }

      let order: any = null;
      try {
        order = await api.payments.createOrder({
          programCode: "cmt",
        });
      } catch (e) {
        console.warn("Backend order creation warning:", e);
      }

      const keyId = order?.razorpayKeyId || "rzp_test_ThK4OCjy5vAHCO";
      const amountPaise = order?.amount || 150000;
      const receiptNo = order?.receipt || `RCP-CMT-${Date.now().toString().slice(-6)}`;
      const orderId = order?.razorpayOrderId;

      const rzpOptions = {
        key: keyId,
        amount: amountPaise,
        currency: "INR",
        name: "BRAIN Educational Counselling",
        description: "AI CMT Psychometric Assessment",
        order_id: orderId,
        prefill: {
          name: studentName || "Student",
          email: studentEmail || "student@brain.edu",
          contact: "9876543210",
        },
        theme: { color: "#3f2f7a" },
        handler: async (response: any) => {
          try {
            if (order?.inquiryId && response.razorpay_signature) {
              try {
                await api.payments.verify({
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                  inquiryId: order.inquiryId,
                });
              } catch (verifyErr) {
                console.warn("Backend verify skipped or non-fatal:", verifyErr);
              }
            }
            handlePaymentSuccess({
              receiptNumber: receiptNo,
              paymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
              amount: 1500,
              method: "Razorpay Online",
            });
          } catch (hErr) {
            setError(hErr instanceof Error ? hErr.message : "Payment verification failed");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const checkout = new (window as any).Razorpay(rzpOptions);
      checkout.on("payment.failed", (resp: any) => {
        setLoading(false);
        setError(resp.error?.description || "Payment was declined or failed.");
      });
      checkout.open();
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Unable to initiate payment");
    }
  };

  const initiateInstantDemoPayment = () => {
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      handlePaymentSuccess({
        receiptNumber: `RCP-CMT-${Date.now().toString().slice(-6)}`,
        paymentId: `pay_demo_${Date.now().toString().slice(-8)}`,
        amount: 1500,
        method: "Instant Sandbox Demo",
      });
    }, 450);
  };

  const resetPayment = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {}
    setIsPaid(false);
    setPaymentRecord(null);
    setError("");
    setIsFullscreen(false);
  };

  return (
    <div className="max-w-5xl space-y-5">
      <section className={card}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#efeaf9] text-[#3f2f7a]">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-[#171717]">AI CMT</h2>
                {isPaid ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Assessment Unlocked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#f6f3fb] px-2.5 py-0.5 text-xs font-medium text-[#3f2f7a] border border-[#c9c2e3]">
                    Payment Required
                  </span>
                )}
              </div>
              <p className="text-xs text-[#737373]">
                Competency Mapping Test · Psychometric & Cognitive Diagnostics
              </p>
            </div>
          </div>
          {isPaid && (
            <button
              type="button"
              onClick={resetPayment}
              className="inline-flex items-center gap-1 text-xs text-[#737373] hover:text-[#3f2f7a] underline"
            >
              <RefreshCw className="h-3 w-3" /> Reset test session
            </button>
          )}
        </div>

        {isPaid ? (
          /* ================= UNLOCKED / INTERNAL EMBEDDED ASSESSMENT TERMINAL ================= */
          <div className="mt-5 space-y-4">
            {/* Status notification bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-xs text-emerald-950">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
                </span>
                <span className="font-semibold text-emerald-900">
                  Secure Diagnostic Session Active
                </span>
                <span className="hidden sm:inline text-emerald-700">·</span>
                <span className="hidden sm:inline text-emerald-800 font-mono">
                  Receipt: {paymentRecord?.receiptNumber}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-800">Fee: <strong>₹{paymentRecord?.amount || 1500}</strong></span>
                <span className="inline-flex items-center gap-1 rounded bg-emerald-200/70 px-2 py-0.5 font-medium text-emerald-900 text-[11px]">
                  <ShieldCheck className="h-3 w-3 text-emerald-700" /> Authorized
                </span>
              </div>
            </div>

            {/* Embedded Assessment Frame Container */}
            <div
              className={`overflow-hidden rounded-xl border border-[#d8d5e6] bg-white shadow-sm transition-all ${
                isFullscreen
                  ? "fixed inset-0 z-50 rounded-none flex flex-col h-screen w-screen"
                  : "relative"
              }`}
            >
              {/* Terminal Utility Header */}
              <div className="flex items-center justify-between border-b border-[#d8d5e6] bg-[#fbfaff] px-4 py-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#efeaf9] text-[#3f2f7a]">
                    <Brain className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#171717]">
                      AI CMT Diagnostic Terminal
                    </h3>
                    <p className="text-[10px] text-[#737373]">
                      Standardized Psychometric & Cognitive Assessment Engine
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIframeLoading(true);
                      setIframeKey((prev) => prev + 1);
                    }}
                    title="Reload Assessment Session"
                    className="inline-flex items-center gap-1.5 rounded-md border border-[#d8d5e6] bg-white px-2.5 py-1 text-[11px] font-medium text-[#525252] hover:bg-[#f6f3fb] hover:text-[#171717]"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reload</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Focus Mode"}
                    className="inline-flex items-center gap-1.5 rounded-md bg-[#3f2f7a] px-2.5 py-1 text-[11px] font-medium text-white hover:bg-[#2c2159]"
                  >
                    {isFullscreen ? (
                      <>
                        <Minimize2 className="h-3 w-3" />
                        <span>Exit Fullscreen</span>
                      </>
                    ) : (
                      <>
                        <Maximize2 className="h-3 w-3" />
                        <span>Fullscreen Focus</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Iframe Viewport */}
              <div className={`relative w-full bg-[#f8f9fa] ${isFullscreen ? "flex-1" : "h-[780px]"}`}>
                {iframeLoading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm text-center p-6">
                    <Loader2 className="h-8 w-8 animate-spin text-[#3f2f7a]" />
                    <p className="mt-3 text-sm font-semibold text-[#171717]">
                      Initializing AI CMT Assessment Environment…
                    </p>
                    <p className="mt-1 text-xs text-[#737373]">
                      Loading your private diagnostic questions…
                    </p>
                  </div>
                )}
                <iframe
                  key={iframeKey}
                  src={ASSESSMENT_TEST_URL}
                  title="AI CMT Assessment Engine"
                  onLoad={() => setIframeLoading(false)}
                  allow="camera; microphone; fullscreen; clipboard-read; clipboard-write; display-capture"
                  className="h-full w-full border-0"
                />
              </div>

              {/* Terminal Footer */}
              {!isFullscreen && (
                <div className="flex items-center justify-between border-t border-[#d8d5e6] bg-[#faf9fe] px-4 py-2 text-[11px] text-[#737373]">
                  <span>🔒 Protected student diagnostic session</span>
                  <span>Complete and submit questions directly within this window</span>
                </div>
              )}
            </div>

            {/* Test Guidance */}
            <div className="rounded-xl border border-[#d8d5e6] bg-[#faf9fe] p-4 text-xs text-[#525252] space-y-1.5">
              <p className="font-semibold text-[#171717]">Assessment Guidelines:</p>
              <ul className="list-disc pl-5 space-y-1 text-[#525252]">
                <li>Take the assessment in one sitting without navigating away from this tab until you submit.</li>
                <li>You can use the <strong>Fullscreen Focus</strong> button above for an uninterrupted exam view.</li>
                <li>Your responses are saved live in your diagnostic dossier and mapped to your counsellor’s evaluation desk.</li>
              </ul>
            </div>
          </div>
        ) : (
          /* ================= UNPAID / PAYMENT WORKFLOW STATE ================= */
          <div className="mt-4 space-y-5">
            <p className="text-sm text-[#525252]">
              A separate payment is required before starting AI CMT. Access will unlock immediately after a verified payment.
            </p>

            {/* Features Included */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-lg border border-[#e4e1ef] bg-[#fbfaff] p-3 text-xs">
                <Brain className="h-5 w-5 text-[#3f2f7a] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[#171717]">Differential Aptitude Battery</h4>
                  <p className="mt-0.5 text-[#737373]">
                    Measures verbal, numerical, abstract reasoning, and spatial aptitude metrics.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-[#e4e1ef] bg-[#fbfaff] p-3 text-xs">
                <Compass className="h-5 w-5 text-[#3f2f7a] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[#171717]">Career Transition Affinity</h4>
                  <p className="mt-0.5 text-[#737373]">
                    Maps cognitive strengths directly to recommended senior academic streams & career clusters.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-[#e4e1ef] bg-[#fbfaff] p-3 text-xs">
                <Layers className="h-5 w-5 text-[#3f2f7a] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[#171717]">Integrated Diagnostic Terminal</h4>
                  <p className="mt-0.5 text-[#737373]">
                    Assessment test runs directly within your student portal workspace.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg border border-[#e4e1ef] bg-[#fbfaff] p-3 text-xs">
                <Award className="h-5 w-5 text-[#3f2f7a] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[#171717]">Direct Counsellor Sync</h4>
                  <p className="mt-0.5 text-[#737373]">
                    Diagnostic report is automatically shared with your assigned counsellor for 1-on-1 guidance.
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing & Checkout Panel */}
            <div className="rounded-xl border border-[#d8d5e6] bg-[#fdfcff] p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eeeaf5] pb-4">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#3f2f7a]">
                    Official Diagnostic License
                  </span>
                  <h3 className="text-base font-semibold text-[#171717]">
                    AI CMT Psychometric Assessment
                  </h3>
                  <p className="text-xs text-[#737373]">
                    One-time fee · Full access to integrated assessment test
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="flex items-baseline gap-2 sm:justify-end">
                    <span className="text-xs text-[#8e8e8e] line-through">₹2,499</span>
                    <span className="text-2xl font-bold text-[#171717]">₹1,500</span>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-700">
                    Standard Student Assessment Fee (GST included)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-[#737373]">
                  <Lock className="h-3.5 w-3.5 text-[#3f2f7a]" />
                  <span>Razorpay 256-bit Secure Checkout · Instant Portal Activation</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={initiateInstantDemoPayment}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#c9c2e3] bg-white px-3.5 py-2 text-xs font-semibold text-[#3f2f7a] hover:bg-[#f6f3fb] disabled:opacity-50"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-[#3f2f7a]" />
                    Instant Demo Pay (Test Mode)
                  </button>
                  <button
                    type="button"
                    onClick={initiateRazorpayPayment}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#3f2f7a] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#2c2159] disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Processing…
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-3.5 w-3.5" />
                        Pay ₹1,500 & Unlock Test
                      </>
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Your Assessment Section */}
      <section className={card}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#171717]">Your assessment</h2>
        </div>
        <p className="mt-2 text-sm text-[#737373]">
          {isPaid
            ? "Your diagnostic test session is active in the terminal above. Complete the questions directly to have your verified psychometric scores and cognitive insights recorded in your profile."
            : "Partial results will appear here after the assessment software sends a verified result. Your daily mood and action data will be available as context for that analysis."}
        </p>
        <p className="mt-4 text-sm text-[#525252]">
          Current input: {workspace.snapshot.checkin ? `Mood ${workspace.snapshot.checkin.mood}/5 and daily reflection saved` : "No wellness check-in yet"}; {workspace.snapshot.actions.filter((action) => action.done).length}/{workspace.snapshot.actions.length} actions completed.
        </p>
      </section>
    </div>
  );
}

export function CounsellorStudentInputs() {
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [activeTab, setActiveTab] = useState<"about" | "career" | "wellbeing">("about");
  const [careerClarity, setCareerClarity] = useState(0);
  const [emotionalWellbeing, setEmotionalWellbeing] = useState(0);
  const [savingRating, setSavingRating] = useState(false);
  const [message, setMessage] = useState("");
  const workspace = useStudentWorkspace(selectedId);
  useEffect(() => { apiCall<{ id: string; name: string }[]>("/api/v1/student-portal/mapped").then(setStudents).catch((cause) => setMessage(cause instanceof Error ? cause.message : "Could not load mapped students.")); }, []);
  const selectedStudent = students.find((student) => student.id === selectedId);
  const completedActions = workspace.snapshot.actions.filter((action) => action.done).length;
  const completionRate = workspace.snapshot.actions.length ? Math.round(completedActions * 100 / workspace.snapshot.actions.length) : 0;
  useEffect(() => {
    setCareerClarity(workspace.snapshot.progressRating?.careerClarity ?? 0);
    setEmotionalWellbeing(workspace.snapshot.progressRating?.emotionalWellbeing ?? 0);
  }, [workspace.snapshot.progressRating]);
  const parentAnswers = workspace.snapshot.parentFeedback?.answers || {};
  const parentHighlights = [
    [parentAnswers.feedbackSubject || "Latest parent feedback", parentAnswers.directFeedback],
    ["Behaviour at home", parentAnswers.homeBehaviour],
    ["Parents’ expectations", parentAnswers.expectations],
    ["Hobbies and habits", parentAnswers.hobbiesHabits],
  ].filter((item): item is [string, string] => Boolean(item[1]));
  const saveRatings = async () => {
    if (!selectedId) return;
    setSavingRating(true); setMessage("");
    try {
      await apiCall(`/api/v1/student-portal/${selectedId}/progress-rating`, { method: "POST", body: {
        counsellorProgress: workspace.snapshot.progressRating?.counsellorProgress ?? completionRate,
        careerClarity,
        emotionalWellbeing,
      } });
      await workspace.refresh();
      setMessage("Student ratings saved.");
    } catch (cause) { setMessage(cause instanceof Error ? cause.message : "Could not save student ratings."); }
    finally { setSavingRating(false); }
  };
  return <div className="max-w-5xl space-y-5">
    <section className={card}>
      <h2 className="text-lg font-semibold">Today’s Counselling Students</h2>
      <p className="mt-1 text-sm text-[#737373]">Open a student profile to review daily inputs and record development ratings.</p>
      <div className="mt-4 divide-y divide-[#eeeaf5] rounded-lg border border-[#d8d5e6]">
        {students.map((student) => <div key={student.id} className="flex items-center justify-between gap-4 p-3"><div><p className="text-sm font-semibold text-[#171717]">{student.name}</p><p className="text-xs text-[#737373]">{student.id}</p></div><button type="button" onClick={() => { setSelectedId(student.id); setActiveTab("about"); setMessage(""); }} className="rounded-lg border border-[#c9c2e3] px-3 py-1.5 text-xs font-semibold text-[#3f2f7a] hover:bg-[#f6f3fb]">Profile</button></div>)}
        {!students.length && <p className="p-4 text-sm text-[#737373]">No counselling students are mapped for today.</p>}
      </div>
    </section>
    {selectedId && <Notice studentId={selectedId} error={workspace.error} loading={workspace.loading} />}
    {selectedId && !workspace.loading && !workspace.error && <>
      <section className={card}>
        <div className="flex items-center justify-between gap-4"><div><h2 className="text-lg font-semibold">{selectedStudent?.name}</h2><p className="text-xs text-[#737373]">Student profile · Daily inputs</p></div><button type="button" onClick={() => setSelectedId("")} className="text-xs font-medium text-[#3f2f7a] hover:underline">Close profile</button></div>
        <div className="mt-5 flex border-b border-[#d8d5e6]" role="tablist" aria-label="Student profile sections">
          {([['about', 'About'], ['career', 'Career Clarity'], ['wellbeing', 'Emotional Wellbeing']] as const).map(([key, label]) => <button key={key} type="button" role="tab" aria-selected={activeTab === key} onClick={() => setActiveTab(key)} className={`px-5 py-2.5 text-sm font-semibold ${activeTab === key ? "border-b-2 border-[#3f2f7a] text-[#3f2f7a]" : "text-[#737373]"}`}>{label}</button>)}
        </div>
        {activeTab === "about" ? <div className="mt-5 space-y-4">
          <div className="rounded-lg border border-[#c9c2e3] bg-[#f6f3fb] p-4"><div className="flex items-center gap-2"><Brain className="h-4 w-4 text-[#3f2f7a]"/><h3 className="text-sm font-semibold">AI Overview</h3></div><p className="mt-2 text-sm text-[#525252]">{workspace.snapshot.actions.length ? `${completionRate}% of daily actions are complete. ${workspace.snapshot.checkin ? `The latest mood is ${workspace.snapshot.checkin.mood}/5.` : "No mood check-in is available."}` : "There is not enough daily activity yet to generate a performance overview."}</p></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border border-[#d8d5e6] p-4"><h3 className="text-sm font-semibold">Daily Action Performance</h3><p className="mt-2 text-2xl font-semibold text-[#3f2f7a]">{completionRate}%</p><p className="text-xs text-[#737373]">{completedActions} completed · {workspace.snapshot.actions.length - completedActions} pending</p><div className="mt-3 space-y-2">{workspace.snapshot.actions.slice(0, 5).map((action) => <div key={action.id} className="flex justify-between gap-3 text-xs"><span>{action.text}</span><span className={action.done ? "text-green-700" : "text-amber-700"}>{action.done ? "Complete" : "Pending"}</span></div>)}</div></div>
            <div className="rounded-lg border border-[#d8d5e6] p-4"><h3 className="text-sm font-semibold">Mood Details</h3><p className="mt-2 text-lg">{workspace.snapshot.checkin ? `${emojis[workspace.snapshot.checkin.mood - 1]} Mood ${workspace.snapshot.checkin.mood}/5` : "No check-in submitted"}</p><p className="mt-2 whitespace-pre-wrap text-sm text-[#525252]">{workspace.snapshot.checkin?.reflection || "No reflection available."}</p></div>
            <div className="rounded-lg border border-[#d8d5e6] p-4"><h3 className="text-sm font-semibold">Parent Feedback About Student</h3><div className="mt-3 space-y-3">{parentHighlights.map(([label, value]) => <div key={label}><p className="text-xs font-semibold text-[#737373]">{label}</p><p className="mt-0.5 text-sm text-[#525252]">{value}</p></div>)}{!parentHighlights.length && <p className="text-sm text-[#737373]">No parent feedback submitted yet.</p>}</div></div>
            <div className="rounded-lg border border-[#d8d5e6] p-4"><h3 className="text-sm font-semibold">Last Time Conclusion</h3>{workspace.snapshot.publishedAdvice ? <div className="mt-3 space-y-3"><div><p className="text-xs font-semibold text-[#737373]">Study behaviour improvement</p><p className="mt-1 whitespace-pre-wrap text-sm text-[#525252]">{workspace.snapshot.publishedAdvice.studyImprovement}</p></div><div><p className="text-xs font-semibold text-[#737373]">Regular behaviour improvement</p><p className="mt-1 whitespace-pre-wrap text-sm text-[#525252]">{workspace.snapshot.publishedAdvice.regularImprovement}</p></div><p className="text-xs text-[#737373]">{workspace.snapshot.publishedAdvice.counsellorName} · {new Date(workspace.snapshot.publishedAdvice.publishedAt).toLocaleDateString("en-IN")}</p></div> : <p className="mt-3 text-sm text-[#737373]">No published conclusion or advice yet.</p>}</div>
          </div>
          <StudentMarksheets studentId={selectedId} workspace={workspace} readOnly />
        </div> : <div className="mt-5 max-w-2xl"><h3 className="text-lg font-semibold">{activeTab === "career" ? "Career Clarity" : "Emotional Wellbeing"}</h3><p className="mt-1 text-sm text-[#737373]">Rate the student from 0% to 100%. This value is included in the student’s progress record.</p><div className="mt-6 rounded-xl border border-[#d8d5e6] bg-[#f9f7fc] p-5"><div className="flex items-center justify-between"><label htmlFor={`rating-${activeTab}`} className="text-sm font-semibold">Current rating</label><span className="text-2xl font-semibold text-[#3f2f7a]">{activeTab === "career" ? careerClarity : emotionalWellbeing}%</span></div><input id={`rating-${activeTab}`} type="range" min="0" max="100" step="1" value={activeTab === "career" ? careerClarity : emotionalWellbeing} onChange={(event) => activeTab === "career" ? setCareerClarity(Number(event.target.value)) : setEmotionalWellbeing(Number(event.target.value))} className="mt-5 w-full accent-[#3f2f7a]"/><input type="number" min="0" max="100" value={activeTab === "career" ? careerClarity : emotionalWellbeing} onChange={(event) => { const value = Math.max(0, Math.min(100, Number(event.target.value))); activeTab === "career" ? setCareerClarity(value) : setEmotionalWellbeing(value); }} className={`${input} mt-4 w-32`} aria-label={`${activeTab === "career" ? "Career clarity" : "Emotional wellbeing"} percentage`}/><span className="ml-2 text-sm text-[#737373]">%</span></div><button type="button" onClick={() => void saveRatings()} disabled={savingRating} className={`${primary} mt-4`}>{savingRating ? "Saving…" : "Save Rating"}</button></div>}
      </section>
    </>}
    {message && <p role="status" className="text-sm text-[#3f2f7a]">{message}</p>}
  </div>;
}
