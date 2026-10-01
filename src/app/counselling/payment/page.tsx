"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  ShieldCheck,
  XCircle,
  ChevronLeft,
  ArrowRight,
  Lock,
  Receipt,
  Wallet,
  Building2,
  Check,
  Download,
} from "lucide-react";
import StepIndicator from "@/components/StepIndicator";
import Button from "@/components/Button";
import { PageHeader } from "@/components/FormFields";
import { useInquiry } from "@/lib/inquiry-context";
import { useAuth } from "@/lib/auth-context";
import { api } from "@/lib/api";
import { Sprout, Leaf, Target, Plane, Flame, Heart, type LucideIcon } from "lucide-react";

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal: { ondismiss: () => void };
}

interface RazorpayCheckout {
  open(): void;
  on(event: "payment.failed", callback: () => void): void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayCheckout;
  }
}

let checkoutScriptPromise: Promise<void> | null = null;

function loadRazorpayCheckout() {
  if (window.Razorpay) return Promise.resolve();
  if (checkoutScriptPromise) return checkoutScriptPromise;
  checkoutScriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      checkoutScriptPromise = null;
      reject(new Error("Unable to load Razorpay Checkout"));
    };
    document.head.appendChild(script);
  });
  return checkoutScriptPromise;
}

const iconMap: Record<string, LucideIcon> = {
  Sprout,
  Leaf,
  Target,
  Plane,
  Flame,
  Heart,
};

type PaymentState = "idle" | "processing" | "success" | "failed";

export default function PaymentPage() {
  const router = useRouter();
  const { user, accessToken, loading: authLoading } = useAuth();
  const { state, setPaymentStatus } = useInquiry();
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [paymentMethod, setPaymentMethod] = useState<string>("razorpay");
  const [paymentError, setPaymentError] = useState<string>("");

  useEffect(() => {
    if (!authLoading && !accessToken) {
      router.replace("/auth/login?next=%2Fcounselling%2Fpayment");
    } else if (!state.selectedProgram) {
      router.replace("/counselling/student");
    } else if (!state.appointment) {
      router.replace("/calendar");
    }
  }, [accessToken, authLoading, state.selectedProgram, state.appointment, router]);

  if (authLoading || !accessToken || !state.selectedProgram) return null;
  const program = state.selectedProgram;
  const Icon = iconMap[program.icon] ?? Target;

  const programFee = program.price;
  const gst = Math.round(programFee * 0.18);
  const total = programFee + gst;

  async function processPayment() {
    if (!accessToken) {
      router.push("/auth/login?next=%2Fcounselling%2Fpayment");
      return;
    }
    setPaymentStatus("pending");
    setPaymentState("processing");
    setPaymentError("");
    try {
      await loadRazorpayCheckout();
      const order = await api.payments.createOrder({
        inquiryId: state.inquiryId || undefined,
        programCode: program.id,
        counsellorId: state.appointment?.counsellorId,
        counsellorName: state.appointment?.counsellorName,
        appointmentDate: state.appointment?.date,
        slotTime: state.appointment?.time,
      });
      if (!window.Razorpay) throw new Error("Razorpay Checkout is unavailable");

      const checkout = new window.Razorpay({
        key: order.razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: "BRAIN Counselling & Consultancy",
        description: `${program.name} Counselling Program`,
        order_id: order.razorpayOrderId,
        prefill: order.prefill,
        theme: { color: "#3f2f7a" },
        handler: (response) => {
          void (async () => {
            try {
              const verified = await api.payments.verify({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                inquiryId: order.inquiryId,
              });
              setPaymentState("success");
              setPaymentStatus("paid", verified.receiptNumber);
            } catch (error) {
              setPaymentError(error instanceof Error ? error.message : "Payment verification failed");
              setPaymentState("failed");
              setPaymentStatus("failed");
            }
          })();
        },
        modal: {
          ondismiss: () => setPaymentState("idle"),
        },
      });
      checkout.on("payment.failed", () => {
        setPaymentError("The payment was declined or could not be completed.");
        setPaymentState("failed");
        setPaymentStatus("failed");
      });
      checkout.open();
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : "Unable to start payment");
      setPaymentState("failed");
      setPaymentStatus("failed");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#e9eaf1] text-[#171717]">
      <div className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 pt-6 pb-12 flex flex-col lg:flex-row items-start gap-6">
        <StepIndicator currentStep={paymentState === "success" ? "receipt" : "payment"} />

        <main className="flex-1 min-w-0">
          <PageHeader
            title="Counselling Payment & GST"
            mrTitle="सुरक्षित नोंदणी फी"
            icon={<CreditCard className="w-5 h-5" />}
          />

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Left: Payment Method Box */}
            <div className="lg:col-span-3 space-y-4">
              <div className="p-5 rounded-[12px] bg-white border border-[#d8d5e6]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#171717]">Payment Method</h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#dcfce7] text-[#16a34a] border border-[#bbf7d0]">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Encrypted
                  </span>
                </div>

                {paymentState === "success" ? (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-[#dcfce7] border border-[#bbf7d0] flex items-center justify-center text-[#16a34a]">
                      <Check className="w-7 h-7" />
                    </div>
                    <h2 className="text-lg font-semibold text-[#171717] mb-1">
                      Payment Confirmed
                    </h2>
                    <p className="text-xs text-[#525252] mb-5">
                      Registration invoice generated for{" "}
                      <span className="font-semibold text-[#171717]">{state.personalDetails?.fullName || `${user?.firstName || "Student"} ${user?.lastName || ""}`.trim()}</span>.
                    </p>
                    <div className="max-w-md mx-auto bg-[#f6f3fb] rounded-[10px] p-4 text-left mb-5 border border-[#d8d5e6] text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#737373]">Receipt ID:</span>
                        <span className="font-mono font-medium text-[#171717]">{state.paymentId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#737373]">Total Amount:</span>
                        <span className="font-semibold text-[#171717]">₹{total.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      <Button size="md" variant="outline" icon={<Download className="w-4 h-4" />} onClick={() => { window.print(); router.push("/portal"); }}>
                        Download Receipt &amp; Continue
                      </Button>
                      <Button size="md" variant="primary" icon={<ArrowRight className="w-4 h-4" />} iconPosition="right" onClick={() => router.push("/portal")}>
                        Open Student Portal
                      </Button>
                    </div>
                  </div>
                ) : paymentState === "failed" ? (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-[#ea580c]">
                      <XCircle className="w-7 h-7" />
                    </div>
                    <h2 className="text-lg font-semibold text-[#171717] mb-1">Payment Incomplete</h2>
                    <p className="text-xs text-[#525252] mb-5">
                      {paymentError || "The transaction could not be authorized. Please try again."}
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button size="md" variant="outline" onClick={() => router.push("/counselling/student")}>
                        Back to Programs
                      </Button>
                      <Button size="md" variant="primary" onClick={processPayment}>
                        Try Again
                      </Button>
                    </div>
                  </div>
                ) : paymentState === "processing" ? (
                  <div className="text-center py-10">
                    <div className="w-10 h-10 mx-auto mb-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <h2 className="text-sm font-semibold text-[#171717] mb-1">Authorizing Transaction...</h2>
                    <p className="text-xs text-[#737373]">Connecting to Razorpay gateway</p>
                  </div>
                ) : (
                  <>
                    <div
                      className={`p-4 rounded-[10px] border transition-all cursor-pointer mb-4 ${
                        paymentMethod === "razorpay"
                          ? "border-[#3f2f7a] bg-[#f6f3fb]"
                          : "border-[#d8d5e6] bg-white hover:border-[#a3a3a3]"
                      }`}
                      onClick={() => setPaymentMethod("razorpay")}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-[#2c2159] rounded-[6px] flex items-center justify-center text-white font-mono text-sm font-bold">
                            ₹
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-[#171717]">Razorpay Online Checkout</p>
                            <p className="text-[11px] text-[#737373]">UPI, Credit / Debit Cards, NetBanking</p>
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            paymentMethod === "razorpay" ? "border-black bg-black" : "border-[#c9c2e3]"
                          }`}
                        >
                          {paymentMethod === "razorpay" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>

                      {paymentMethod === "razorpay" && (
                        <div className="mt-3 pt-3 border-t border-[#d8d5e6] grid grid-cols-4 gap-2">
                          {[
                            { label: "UPI", icon: Wallet },
                            { label: "Cards", icon: CreditCard },
                            { label: "NetBanking", icon: Building2 },
                            { label: "Wallets", icon: Receipt },
                          ].map((m) => {
                            const I = m.icon;
                            return (
                              <div
                                key={m.label}
                                className="flex flex-col items-center gap-1 p-2 bg-white rounded-[6px] border border-[#d8d5e6] text-center"
                              >
                                <I className="w-4 h-4 text-[#525252]" />
                                <span className="text-[10px] font-medium text-[#525252]">{m.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-[#f6f3fb] border border-[#d8d5e6] rounded-[8px] flex items-start gap-2.5 mb-5 text-xs text-[#525252]">
                      <Lock className="w-4 h-4 text-[#171717] flex-shrink-0 mt-0.5" />
                      <p>Official registration confirmation will be generated upon successful checkout.</p>
                    </div>

                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        size="md"
                        icon={<ChevronLeft className="w-4 h-4" />}
                        onClick={() => router.push("/counselling/student")}
                      >
                        Back
                      </Button>
                      <Button
                        size="md"
                        variant="primary"
                        icon={<Lock className="w-4 h-4" />}
                        onClick={processPayment}
                      >
                        Pay ₹{total.toLocaleString("en-IN")}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-5 rounded-[12px] bg-white border border-[#d8d5e6]">
                <h3 className="text-xs uppercase font-semibold tracking-wider text-[#737373] mb-4">
                  Fee Breakdown
                </h3>

                <div className="p-3.5 rounded-[8px] bg-[#f6f3fb] border border-[#d8d5e6] mb-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[6px] bg-white border border-[#d8d5e6] flex items-center justify-center text-[#171717] flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#171717] truncate">{program.name}</p>
                    <p className="text-[11px] text-[#737373]">{program.gradeRange}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#525252] mb-4">
                  <div className="flex justify-between py-1 border-b border-[#f6f3fb]">
                    <span>Counselling Program Fee</span>
                    <span className="font-medium text-[#171717]">₹{programFee.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#f6f3fb]">
                    <span>GST (18%)</span>
                    <span className="font-medium text-[#171717]">₹{gst.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#d8d5e6] flex justify-between items-baseline">
                  <span className="text-xs font-semibold text-[#171717]">Total Payable</span>
                  <span className="text-xl font-semibold text-[#171717]">
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {state.personalDetails && (
                <div className="p-4 rounded-[12px] bg-[#f6f3fb] border border-[#d8d5e6] text-xs space-y-2">
                  <p className="text-[10px] uppercase font-semibold tracking-wider text-[#737373]">
                    Registered Candidate
                  </p>
                  <div className="flex justify-between">
                    <span className="text-[#737373]">Name:</span>
                    <span className="font-medium text-[#171717]">{state.personalDetails.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#737373]">Email:</span>
                    <span className="font-medium text-[#171717]">{state.personalDetails.email}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
