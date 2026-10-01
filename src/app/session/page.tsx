"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Video,
  Mic,
  VideoOff,
  MicOff,
  MonitorUp,
  Clock,
  MapPin,
  FileText,
  Plus,
  Trash2,
  Save,
  ArrowRight,
  ChevronLeft,
  Sprout,
  Leaf,
  Target,
  Plane,
  Flame,
  Heart,
  type LucideIcon,
  Check,
} from "lucide-react";
import StepIndicator from "@/components/StepIndicator";
import Button from "@/components/Button";
import { PageHeader, FormTextArea, FormInput } from "@/components/FormFields";
import { useInquiry } from "@/lib/inquiry-context";
import { CounsellingConclusion } from "@/lib/types";

const iconMap: Record<string, LucideIcon> = {
  Sprout,
  Leaf,
  Target,
  Plane,
  Flame,
  Heart,
};

const conclusionSchema = z.object({
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  observations: z.string().min(10, "Observations must be at least 10 characters"),
  recommendations: z.string().min(10, "Recommendations must be at least 10 characters"),
  counsellorSignature: z.string().min(2, "Counsellor name/signature is required"),
  nextFollowUp: z.string().optional(),
});

type ConclusionFormData = z.infer<typeof conclusionSchema>;

export default function SessionPage() {
  const router = useRouter();
  const { state, setConclusion } = useInquiry();
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [actionItems, setActionItems] = useState<string[]>([
    "Review suggested stream pathways",
    "Complete career interest worksheet",
  ]);
  const [newItem, setNewItem] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConclusionFormData>({
    resolver: zodResolver(conclusionSchema),
    defaultValues: {
      summary: state.conclusion?.summary || "Conducted 1-on-1 counseling session reviewing student aptitude, academic performance, and career preferences.",
      observations: state.conclusion?.observations || "Demonstrates strong analytical thinking and curiosity in technological domains.",
      recommendations: state.conclusion?.recommendations || "Recommended targeted entrance preparation and personalized skill enrichment roadmap.",
      counsellorSignature: state.conclusion?.counsellorSignature || state.appointment?.counsellorName || "Certified Counsellor",
      nextFollowUp: state.conclusion?.nextFollowUp || "2026-09-22",
    },
  });

  useEffect(() => {
    if (!state.appointment) {
      router.replace("/calendar");
    }
  }, [state, router]);

  if (!state.appointment || !state.selectedProgram) return null;
  const { appointment, selectedProgram } = state;

  const handleAddAction = () => {
    if (newItem.trim()) {
      setActionItems([...actionItems, newItem.trim()]);
      setNewItem("");
    }
  };

  const handleRemoveAction = (idx: number) => {
    setActionItems(actionItems.filter((_, i) => i !== idx));
  };

  const onSubmit = (data: ConclusionFormData) => {
    const conclusionData: CounsellingConclusion = {
      date: new Date().toISOString().slice(0, 10),
      summary: data.summary,
      observations: data.observations,
      recommendations: data.recommendations,
      actionItems,
      counsellorSignature: data.counsellorSignature,
      counsellorName: data.counsellorSignature || "Dr. Anand Joshi",
      nextFollowUp: data.nextFollowUp,
    };
    setConclusion(conclusionData);
    setIsSaved(true);
    setTimeout(() => {
      router.push("/conclusion");
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e9eaf1] text-[#171717]">
      <div className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 pt-6 pb-12 flex flex-col lg:flex-row items-start gap-6">
        <StepIndicator currentStep="session" />

        <main className="flex-1 min-w-0">
          <PageHeader
            title="Counselling Session & Notes"
            mrTitle="सत्र आणि निष्कर्ष नोंदी"
            subtitle="Conduct the consultation session and record clinical observations & recommendations."
            icon={<Video className="w-5 h-5" />}
          />

          <div className="grid lg:grid-cols-12 gap-6">
            {/* Left: Video Mock Room & Session Info */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-4 rounded-[12px] bg-white border border-[#d8d5e6]">
                <div className="relative aspect-video rounded-[8px] bg-[#2c2159] flex items-center justify-center overflow-hidden mb-3">
                  <div className="text-center text-white/80">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-2">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs font-medium">Session in Progress</p>
                    <p className="text-[10px] text-[#a3a3a3] mt-0.5">
                      {appointment.counsellorName} · {state.personalDetails?.fullName}
                    </p>
                  </div>

                  {/* Room Toolbar */}
                  <div className="absolute bottom-2 inset-x-2 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setMicOn(!micOn)}
                      className={`p-2 rounded-full text-xs font-medium transition-colors ${
                        micOn ? "bg-white/20 text-white" : "bg-[#ea580c] text-white"
                      }`}
                    >
                      {micOn ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => setVideoOn(!videoOn)}
                      className={`p-2 rounded-full text-xs font-medium transition-colors ${
                        videoOn ? "bg-white/20 text-white" : "bg-[#ea580c] text-white"
                      }`}
                    >
                      {videoOn ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                    </button>
                    <button className="p-2 rounded-full bg-white/20 text-white text-xs hover:bg-white/30">
                      <MonitorUp className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#525252]">
                  <div className="flex justify-between">
                    <span className="text-[#737373]">Program:</span>
                    <span className="font-medium text-[#171717]">{selectedProgram.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#737373]">Slot:</span>
                    <span className="font-medium text-[#171717]">{appointment.date} · {appointment.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#737373]">Location:</span>
                    <span className="font-medium text-[#171717]">{appointment.location}</span>
                  </div>
                </div>
              </div>

              {/* Action Items List */}
              <div className="p-4 rounded-[12px] bg-[#f6f3fb] border border-[#d8d5e6]">
                <h3 className="text-xs uppercase font-semibold tracking-wider text-[#737373] mb-3">
                  Student Action Items
                </h3>

                <div className="space-y-2 mb-3">
                  {actionItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-[6px] bg-white border border-[#d8d5e6] text-xs text-[#171717]"
                    >
                      <span className="truncate mr-2">{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAction(idx)}
                        className="text-[#737373] hover:text-[#ea580c]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add follow-up task..."
                    className="flex-1 h-8 px-2.5 rounded-[6px] border border-[#d8d5e6] bg-white text-xs text-[#171717] focus:outline-none focus:border-[#3f2f7a]"
                  />
                  <Button size="sm" variant="outline" onClick={handleAddAction} icon={<Plus className="w-3 h-3" />}>
                    Add
                  </Button>
                </div>
              </div>
            </div>

            {/* Right: Counsellor Observations Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit(onSubmit)} className="p-5 rounded-[12px] bg-white border border-[#d8d5e6] space-y-4">
                <h3 className="text-xs uppercase font-semibold tracking-wider text-[#737373]">
                  Diagnostic Evaluation &amp; Record
                </h3>

                <FormTextArea
                  label="Session Summary"
                  mrLabel="सत्र सारांश"
                  {...register("summary")}
                  error={errors.summary?.message}
                />

                <FormTextArea
                  label="Aptitude & Behavioral Observations"
                  mrLabel="निरीक्षणे"
                  {...register("observations")}
                  error={errors.observations?.message}
                />

                <FormTextArea
                  label="Roadmap & Career Recommendations"
                  mrLabel="शिफारशी"
                  {...register("recommendations")}
                  error={errors.recommendations?.message}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Assigned Counsellor"
                    {...register("counsellorSignature")}
                    error={errors.counsellorSignature?.message}
                  />

                  <FormInput
                    label="Next Follow-up Date"
                    type="date"
                    {...register("nextFollowUp")}
                    error={errors.nextFollowUp?.message}
                  />
                </div>

                <div className="pt-3 border-t border-[#d8d5e6] flex justify-between items-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    icon={<ChevronLeft className="w-4 h-4" />}
                    onClick={() => router.push("/calendar")}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    icon={isSaved ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                    iconPosition="right"
                  >
                    {isSaved ? "Saved! Finalizing..." : "Save & Generate Summary Report"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
