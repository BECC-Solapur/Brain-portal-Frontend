"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Activity,
  Bell,
  BookOpen,
  Brain,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  Download,
  FileText,
  IndianRupee,
  LayoutDashboard,
  MessageSquareText,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRound,
  UsersRound,
  Video,
  LogOut,
  ArrowRight,
  Check,
  Filter,
  Phone,
  Mail,
  Calendar,
  MoreVertical,
  ChevronRight,
  Printer,
  FileSpreadsheet,
  AlertCircle,
  ExternalLink,
  MapPin,
  Clock,
  Send,
  Inbox,
  Layers,
  CreditCard,
  Sliders,
  Settings,
  Building2,
  Smartphone,
  Lock,
  Award,
  Menu,
  X,
  HelpCircle,
  CheckSquare,
  Globe,
  Share2,
  Mic,
  Upload,
  UserPlus,
  History,
  KeyRound,
  ListChecks,
  ScrollText,
} from "lucide-react";
import Button from "@/components/Button";
import { useAuth } from "@/lib/auth-context";
import { CounsellorStudentInputs, StudentActionPlan, StudentAICMT, StudentMarksheets, StudentToday, useStudentWorkspace } from "@/components/StudentPortalWorkspace";
import ParentDailyUpdates from "@/components/ParentDailyUpdates";
import ParentChildProgress from "@/components/ParentChildProgress";
import ParentInformationForm from "@/components/ParentInformationForm";
import BrainAdminRegisteredStudents from "@/components/BrainAdminRegisteredStudents";
import api, { apiCall } from "@/lib/api";
import type { CounsellingSessionItem } from "@/lib/api-types";
import { OfficialInquiryForm } from "@/app/counselling/inquiry/page";
import StudentProfileModal from "@/components/StudentProfileModal";

type Role = "SuperAdmin" | "Brain Admin" | "Counsellor" | "Student" | "Parent";
type SidebarSection =
  | "overview"
  | "inquiries"
  | "students"
  | "assessments"
  | "followups"
  | "sessions"
  | "reports"
  | "billing"
  | "daily-plan"
  | "conclusions"
  | "access"
  | "audit"
  | "feedback"
  | "parent-form"
  | "documents"
  | "settings";
type Todo = { id: number; text: string; done: boolean; due: string };

const subscribeToHydration = () => () => {};

const roles: { name: Role; note: string }[] = [
  { name: "SuperAdmin", note: "Multi-tenant system & full audit" },
  { name: "Brain Admin", note: "Operations & registration queue" },
  { name: "Counsellor", note: "Student dossiers & session tracking" },
  { name: "Student", note: "Personal milestones & action items" },
  { name: "Parent", note: "Progress report & mentor notes" },
];

const studentsData = [
  { id: "BR-24091", name: "Aarav Kulkarni", email: "aarav.k@example.com", phone: "+91 98231 44512", school: "Symbiosis High School, Pune", standard: "10th", program: "Lakshya", counsellor: "Unassigned", fee: "Paid", feeAmount: 2999, progress: 72, next: "Today, 4:00 PM", followUpCadence: "Weekly", status: "Active" },
  { id: "BR-24092", name: "Siya Patil", email: "siya.patil@example.com", phone: "+91 98452 11094", school: "Bishop's Co-Ed, Pune", standard: "7th", program: "Palavi", counsellor: "Unassigned", fee: "Pending", feeAmount: 1999, progress: 54, next: "Tomorrow, 11:00 AM", followUpCadence: "3 Days", status: "Inquiry" },
  { id: "BR-24093", name: "Vihaan Joshi", email: "v.joshi@example.com", phone: "+91 97632 88412", school: "Loyola Junior College, Pune", standard: "12th", program: "CMT", counsellor: "Unassigned", fee: "Paid", feeAmount: 4999, progress: 81, next: "23 Aug, 2:00 PM", followUpCadence: "Monthly", status: "Active" },
  { id: "BR-24094", name: "Anaya Deshmukh", email: "anaya.d@example.com", phone: "+91 91580 22394", school: "Podar International, Solapur", standard: "4th", program: "Ankur", counsellor: "Unassigned", fee: "Paid", feeAmount: 1499, progress: 64, next: "25 Aug, 10:00 AM", followUpCadence: "Weekly", status: "Active" },
  { id: "BR-24095", name: "Rohan Kute", email: "rohan.k@example.com", phone: "+91 98220 77123", school: "St. Vincent's High School", standard: "11th", program: "Udaan", counsellor: "Unassigned", fee: "Paid", feeAmount: 3499, progress: 40, next: "26 Aug, 3:30 PM", followUpCadence: "Weekly", status: "Active" },
  { id: "BR-24096", name: "Ishani Mehra", email: "ishani.m@example.com", phone: "+91 94220 99881", school: "Delhi Public School, Pune", standard: "Graduate", program: "Phoenix", counsellor: "Unassigned", fee: "Pending", feeAmount: 5999, progress: 20, next: "27 Aug, 11:30 AM", followUpCadence: "3 Days", status: "Intake" },
];

const initialInquiries = [
  { id: "INQ-901", name: "Aditi Sane", parentName: "Mahesh Sane", phone: "+91 98234 55102", email: "m.sane@gmail.com", grade: "9th Grade", targetTrack: "Lakshya", source: "Online Portal", status: "New", date: "Today, 10:30 AM", counsellor: "Unassigned" },
  { id: "INQ-902", name: "Karan Wagh", parentName: "Sunita Wagh", phone: "+91 94220 11984", email: "karan.wagh@outlook.com", grade: "12th Science", targetTrack: "CMT", source: "Pune Campus Walk-in", status: "Diagnostic Scheduled", date: "Today, 9:15 AM", counsellor: "Unassigned" },
  { id: "INQ-903", name: "Samaira Shaikh", parentName: "Farhan Shaikh", phone: "+91 91588 33410", email: "farhan.s@corp.in", grade: "6th Grade", targetTrack: "Palavi", source: "School Referral (Bishop's)", status: "Contacted", date: "Yesterday", counsellor: "Unassigned" },
  { id: "INQ-904", name: "Tanmay Bhalerao", parentName: "Sachin Bhalerao", phone: "+91 98223 99401", email: "s.bhalerao@tcs.com", grade: "11th Commerce", targetTrack: "Udaan", source: "Web Webinar", status: "Converted", date: "16 Aug 2026", counsellor: "Unassigned" },
  { id: "INQ-905", name: "Meera Kulkarni", parentName: "Radha Kulkarni", phone: "+91 97631 22849", email: "radha.k@yahoo.co.in", grade: "B.Tech Final Year", targetTrack: "Phoenix", source: "Direct Inquiry", status: "Contacted", date: "15 Aug 2026", counsellor: "Unassigned" },
];

const initialAssessments = [
  { id: "BAT-101", code: "DAB-26", title: "Differential Aptitude Battery", duration: "45 mins", questions: 60, focus: "Numerical, Spatial, Logical & Verbal Reasoning", validity: "99.4% Psychometric Reliability", status: "Standard" },
  { id: "BAT-102", code: "BHCII", title: "Holistic Career Interest Inventory", duration: "30 mins", questions: 80, focus: "Holland RIASEC Occupational Codes", validity: "Standardized on 14,000+ Indian Cohorts", status: "Active" },
  { id: "BAT-103", code: "FCLS", title: "Foundational Cognitive Learning Style", duration: "20 mins", questions: 40, focus: "Visual, Auditory & Kinesthetic Retention Index", validity: "Early Development Benchmark", status: "Active" },
  { id: "BAT-104", code: "SRSI", title: "Stream Readiness & Stress Index", duration: "25 mins", questions: 50, focus: "Board Exam Stress Resilience & Academic Pacing", validity: "Clinical Advisory Backed", status: "Active" },
];

const assessmentSubmissions = [
  { id: "ASG-801", studentId: "BR-24091", studentName: "Aarav Kulkarni", battery: "DAB-26", date: "14 Aug 2026", score: "88th Percentile", dominantArea: "Spatial & Analytical Reasoning", status: "Evaluated", counsellor: "Unassigned" },
  { id: "ASG-802", studentId: "BR-24093", studentName: "Vihaan Joshi", battery: "BHCII", date: "12 Aug 2026", score: "94th Percentile", dominantArea: "Investigative & Enterprising (IE)", status: "Evaluated", counsellor: "Unassigned" },
  { id: "ASG-803", studentId: "BR-24092", studentName: "Siya Patil", battery: "FCLS", date: "15 Aug 2026", score: "Pending Review", dominantArea: "Visual-Kinesthetic Dominant", status: "Submitted", counsellor: "Unassigned" },
  { id: "ASG-804", studentId: "BR-24095", studentName: "Rohan Kute", battery: "SRSI", date: "16 Aug 2026", score: "74th Percentile", dominantArea: "Moderate Resilience / High Focus", status: "Evaluated", counsellor: "Unassigned" },
];

const billingTransactions = [
  { id: "INV-2026-081", studentId: "BR-24091", studentName: "Aarav Kulkarni", program: "Lakshya (8th–10th)", amount: 2999, gst: 540, razorpayId: "pay_Np982K198a", date: "15 Aug 2026", status: "Paid", method: "UPI / PhonePe" },
  { id: "INV-2026-082", studentId: "BR-24093", studentName: "Vihaan Joshi", program: "CMT (Career Transitions)", amount: 4999, gst: 900, razorpayId: "pay_Nq312A771c", date: "14 Aug 2026", status: "Paid", method: "Credit Card (HDFC)" },
  { id: "INV-2026-083", studentId: "BR-24094", studentName: "Anaya Deshmukh", program: "Ankur (KG–4th)", amount: 1499, gst: 270, razorpayId: "pay_Nr481F902e", date: "12 Aug 2026", status: "Paid", method: "Net Banking (SBI)" },
  { id: "INV-2026-084", studentId: "BR-24095", studentName: "Rohan Kute", program: "Udaan (11th–12th)", amount: 3499, gst: 630, razorpayId: "pay_Ns902X331p", date: "10 Aug 2026", status: "Paid", method: "Razorpay UPI" },
  { id: "INV-2026-085", studentId: "BR-24092", studentName: "Siya Patil", program: "Palavi (5th–7th)", amount: 1999, gst: 360, razorpayId: "—", date: "16 Aug 2026", status: "Pending", method: "Awaiting Confirmation" },
  { id: "INV-2026-086", studentId: "BR-24096", studentName: "Ishani Mehra", program: "Phoenix (Graduates)", amount: 5999, gst: 1080, razorpayId: "—", date: "15 Aug 2026", status: "Pending", method: "Invoice Dispatched" },
];

const initialFollowups = [
  { id: 1, studentId: "BR-24091", studentName: "Aarav Kulkarni", program: "Lakshya", counsellor: "Unassigned", type: "Weekly Progress Review", dueDate: "Today", status: "Due", note: "Review science stream aptitude test results." },
  { id: 2, studentId: "BR-24092", studentName: "Siya Patil", program: "Palavi", counsellor: "Unassigned", type: "Intake Verification", dueDate: "Tomorrow", status: "Upcoming", note: "Verify pending registration fee and schedule diagnostic slot." },
  { id: 3, studentId: "BR-24096", studentName: "Ishani Mehra", program: "Phoenix", counsellor: "Unassigned", type: "Intake Follow-up", dueDate: "24 Aug", status: "Upcoming", note: "Candidate requested call back regarding career transition module." },
  { id: 4, studentId: "BR-24094", studentName: "Anaya Deshmukh", program: "Ankur", counsellor: "Unassigned", type: "Parent Alignment", dueDate: "Yesterday", status: "Overdue", note: "Discuss foundational learning style assessment outcomes." },
];

const sessionsList = [
  { id: "SES-101", studentName: "Aarav Kulkarni", program: "Lakshya", counsellor: "Unassigned", date: "Today", time: "4:00 PM – 4:45 PM", mode: "In-Person", location: "Pune Campus · Room 2B", status: "Confirmed" },
  { id: "SES-102", studentName: "Siya Patil", program: "Palavi", counsellor: "Unassigned", date: "Tomorrow", time: "11:00 AM – 11:45 AM", mode: "Online Room", location: "portal.brain.edu/session/live-siya", status: "Upcoming" },
  { id: "SES-103", studentName: "Vihaan Joshi", program: "CMT", counsellor: "Unassigned", date: "23 Aug 2026", time: "2:00 PM – 2:45 PM", mode: "In-Person", location: "Pune Campus · Room 1A", status: "Upcoming" },
  { id: "SES-104", studentName: "Anaya Deshmukh", program: "Ankur", counsellor: "Unassigned", date: "25 Aug 2026", time: "10:00 AM – 10:45 AM", mode: "Online Room", location: "portal.brain.edu/session/live-anaya", status: "Upcoming" },
  { id: "SES-100", studentName: "Rohan Kute", program: "Udaan", counsellor: "Unassigned", date: "18 Aug 2026", time: "3:30 PM – 4:15 PM", mode: "In-Person", location: "Pune Campus · Room 2A", status: "Completed" },
];

const initialTodos: Todo[] = [
  { id: 1, text: "Complete psychographic assessment worksheet", done: true, due: "Today" },
  { id: 2, text: "Compare engineering stream vs design pathways", done: false, due: "Today" },
  { id: 3, text: "Upload recent term marksheet", done: false, due: "Tomorrow" },
];

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  highlight = false,
}: {
  icon: typeof UsersRound;
  label: string;
  value: string;
  hint: string;
  highlight?: boolean;
}) {
  return (
    <div className="p-4 rounded-[12px] bg-white border border-[#d8d5e6] flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase font-semibold tracking-wider text-[#737373]">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-[#171717]">{value}</p>
        </div>
        <div className={`p-2 rounded-[8px] border ${highlight ? "bg-[#efeaf9] text-[#3f2f7a] border-[#c9c2e3]" : "bg-[#f6f3fb] text-[#525252] border-[#d8d5e6]"}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="mt-3 text-xs text-[#737373]">{hint}</p>
    </div>
  );
}

function SectionPanel({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-[12px] border border-[#d8d5e6] bg-white">
      <div className="flex items-center justify-between border-b border-[#d8d5e6] px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-[#171717]">{title}</h2>
          {subtitle && <p className="text-[11px] text-[#737373] mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

export default function PortalPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const studentWorkspace = useStudentWorkspace(user?.primaryRole === "student" ? user.studentId : null);
  const isHydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const authenticatedRole = ({
    superadmin: "SuperAdmin",
    brain_admin: "Brain Admin",
    counsellor: "Counsellor",
    student: "Student",
    parent: "Parent",
  } as Record<string, Role>)[isHydrated ? user?.primaryRole || "" : ""];
  const [selectedRole, setRole] = useState<Role>("Brain Admin");
  const role = authenticatedRole || selectedRole;
  const displayName = isHydrated && user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || role
    : role;
  const [roleOpen, setRoleOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const fallbackPhoto =
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80";
  const userPhoto = isHydrated
    ? user?.photoUrl || user?.avatarUrl || fallbackPhoto
    : fallbackPhoto;
  const [activeSection, setActiveSection] = useState<SidebarSection>("overview");
  const [counsellorReviewTab, setCounsellorReviewTab] = useState<"ai" | "conclusions" | "followups">("ai");

  const [todos, setTodos] = useState(initialTodos);
  const [mood, setMood] = useState(4);
  const [checkInSaved, setCheckInSaved] = useState(false);
  const current = roles.find((item) => item.name === role)!;

  const completed = useMemo(() => todos.filter((todo) => todo.done).length, [todos]);

  const downloadReport = () => {
    const rows = [
      ["Registration ID", "Student", "Email", "Phone", "School", "Program", "Counsellor", "Fee Status", "Progress"],
      ...studentsData.map((s) => [s.id, s.name, s.email, s.phone, s.school, s.program, s.counsellor, s.fee, `${s.progress}%`]),
    ];
    const blob = new Blob([rows.map((row) => row.join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "brain-student-dossier-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navItems = useMemo(() => {
    if (role === "SuperAdmin") {
      return [
        { key: "overview" as SidebarSection, icon: LayoutDashboard, label: "Overview" },
        { key: "access" as SidebarSection, icon: KeyRound, label: "User Access" },
        { key: "audit" as SidebarSection, icon: ScrollText, label: "Audit Log" },
      ];
    }
    if (role === "Brain Admin") {
      return [
        { key: "overview" as SidebarSection, icon: LayoutDashboard, label: "Daily Overview" },
        { key: "billing" as SidebarSection, icon: CreditCard, label: "Invoices" },
        { key: "sessions" as SidebarSection, icon: CalendarDays, label: "Open Slots" },
        { key: "followups" as SidebarSection, icon: Bell, label: "Follow-up Reminders" },
      ];
    }
    if (role === "Parent") {
      return [
        { key: "overview" as SidebarSection, icon: Bell, label: "Daily Updates" },
        { key: "conclusions" as SidebarSection, icon: MessageSquareText, label: "Counsellor Review" },
        { key: "reports" as SidebarSection, icon: TrendingUp, label: "Child Progress" },
        { key: "feedback" as SidebarSection, icon: Send, label: "Feedback" },
        { key: "parent-form" as SidebarSection, icon: ClipboardCheck, label: "Parent Form" },
      ];
    }
    if (role === "Student") {
      return [
        { key: "overview" as SidebarSection, icon: Activity, label: "Today" },
        { key: "inquiries" as SidebarSection, icon: ClipboardCheck, label: "Inquiry Form" },
        { key: "conclusions" as SidebarSection, icon: MessageSquareText, label: "Counsellor Advice" },
        { key: "daily-plan" as SidebarSection, icon: ListChecks, label: "Daily Action Plan" },
        { key: "assessments" as SidebarSection, icon: Brain, label: "AI CMT" },
        { key: "documents" as SidebarSection, icon: Upload, label: "Marksheets" },
      ];
    }
    return [
      { key: "overview" as SidebarSection, icon: LayoutDashboard, label: "Overview" },
      { key: "students" as SidebarSection, icon: UsersRound, label: "Mapped Students" },
      { key: "daily-plan" as SidebarSection, icon: ListChecks, label: "Student Daily Inputs" },
      { key: "assessments" as SidebarSection, icon: BookOpen, label: "Review" },
      { key: "sessions" as SidebarSection, icon: CalendarDays, label: "Sessions" },
    ];
  }, [role]);

  // Do not mount a fallback-role dashboard before the persisted authenticated
  // identity has hydrated. The previous "Brain Admin" fallback briefly mounted
  // its effects for counsellor logins and generated forbidden admin requests.
  if (!isHydrated) {
    return <div className="min-h-screen bg-[#e9eaf1]" aria-label="Loading portal" />;
  }

  return (
    <div className="min-h-screen bg-[#e9eaf1] text-[#171717]">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-[#d8d5e6] bg-white/95 backdrop-blur-sm">
        <div className="flex h-14 w-full items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="p-1.5 rounded-[6px] border border-[#d8d5e6] text-[#525252] lg:hidden hover:bg-[#f6f3fb]"
              aria-label="Toggle navigation"
            >
              {mobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            <div className="flex items-center gap-2.5">
              <Image src="/brain-logo.svg" alt="BRAIN logo" width={28} height={28} className="h-7 w-7 object-contain" priority />
              <span className="font-semibold text-sm text-[#171717]">
                BRAIN <span className="text-[#737373] font-normal">{role === "Brain Admin" ? "Admin" : role} Workspace</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button aria-label="Notifications" className="p-2 rounded-[6px] border border-[#d8d5e6] hover:bg-[#f6f3fb] text-[#525252]">
              <Bell className="h-4 w-4" />
            </button>

            {/* Clickable Profile & Role Switcher */}
            <div className="relative flex items-center">
              <button
                type="button"
                id="portal-profile-button"
                onClick={() => setProfileModalOpen(true)}
                title={`Click to view ${role} profile`}
                className="group flex items-center gap-2.5 rounded-[8px] border border-[#d8d5e6] bg-white px-2.5 py-1.5 text-left transition-all hover:border-[#3f2f7a] hover:bg-[#faf8fd] hover:shadow-sm cursor-pointer"
              >
                <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full border border-[#d8d5e6] bg-[#f6f3fb]">
                  <img
                    src={userPhoto}
                    alt={displayName}
                    suppressHydrationWarning
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="text-xs font-medium text-[#171717] flex items-center gap-1.5">
                  <span>{displayName}</span>
                </div>
              </button>

              {!authenticatedRole && (
                <button
                  type="button"
                  onClick={() => setRoleOpen(!roleOpen)}
                  title="Switch Role Preview"
                  className="ml-1 p-1 rounded-md text-[#737373] hover:text-[#171717] hover:bg-[#f6f3fb]"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              )}

              {roleOpen && !authenticatedRole && (
                <div className="absolute right-0 top-full mt-1.5 w-60 rounded-[10px] border border-[#d8d5e6] bg-white p-1 shadow-lg z-50 animate-fade-in">
                  {roles.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        setRole(item.name);
                        setActiveSection("overview");
                        setRoleOpen(false);
                      }}
                      className={`flex w-full items-start gap-2 rounded-[6px] px-2.5 py-2 text-left text-xs transition-colors ${
                        role === item.name ? "bg-[#f6f3fb] font-semibold text-[#171717]" : "hover:bg-[#f6f3fb] text-[#525252]"
                      }`}
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-[#3f2f7a] mt-0.5" />
                      <div>
                        <span className="block">{item.name}</span>
                        <span className="block text-[10px] text-[#737373] font-normal">{item.note}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Quick Tab Bar */}
        <div className="flex lg:hidden overflow-x-auto border-t border-[#d8d5e6] px-4 py-2 gap-1.5 bg-[#f6f3fb]">
          {navItems.map(({ key, label }) => {
            const isActive = activeSection === key;
            return (
              <button
                key={key}
                onClick={() => {
                  if (role === "Counsellor" && key === "assessments") setCounsellorReviewTab("ai");
                  setActiveSection(key);
                  setMobileNavOpen(false);
                }}
                className={`px-3 py-1 text-xs rounded-full whitespace-nowrap border transition-colors ${
                  isActive
                    ? "bg-[#3f2f7a] text-white border-[#3f2f7a] font-medium"
                    : "bg-white text-[#525252] border-[#d8d5e6] hover:bg-[#f6f3fb]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main 2-Column Shell */}
      <div className="flex w-full">
        {/* Sidebar */}
        <aside
          className={`${
            mobileNavOpen ? "fixed inset-y-14 left-0 z-40 w-64 shadow-2xl" : "hidden"
          } lg:flex lg:static min-h-[calc(100vh-3.5rem)] w-56 shrink-0 border-r border-[#d8d5e6] bg-white p-3 flex-col`}
        >
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-[#737373]">
            Navigation
          </p>

          <div className="space-y-0.5">
            {navItems.map(({ key, icon: Icon, label }) => {
              const isActive = activeSection === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    if (role === "Counsellor" && key === "assessments") setCounsellorReviewTab("ai");
                    setActiveSection(key);
                    setMobileNavOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "bg-[#efeaf9] text-[#3f2f7a]"
                      : "text-[#525252] hover:bg-[#f6f3fb] hover:text-[#171717]"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={async () => {
              await logout();
              router.replace("/");
            }}
            className="mt-auto flex items-center gap-2 rounded-[8px] px-3 py-2 text-xs font-medium text-[#737373] hover:bg-[#f6f3fb] hover:text-[#171717]"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="min-w-0 flex-1 p-4 sm:p-6">
          {!(activeSection === "overview" && role === "SuperAdmin") && <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center border-b border-[#d8d5e6] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-[#3f2f7a] capitalize">{activeSection}</span>
                <span className="text-[#737373]">·</span>
                <span className="text-xs text-[#737373]">{role}</span>
              </div>
              <h1 className="text-xl font-semibold text-[#171717] mt-0.5">
                {activeSection === "overview" && (role === "Student" ? `Student Dashboard${displayName ? ` · ${displayName}` : ""}` : role === "Parent" ? "Parent Guardian Portal" : "Administrative Console")}
                {activeSection === "inquiries" && "Prospective Inquiries & Lead Triage Queue"}
                {activeSection === "students" && (role === "Student" || role === "Parent" ? "Assigned Counsellor & Advisor" : "Student Directory & Intake Roster")}
                {activeSection === "assessments" && (role === "Counsellor" ? "Review" : role === "Student" || role === "Parent" ? "My Psychometric & Cognitive Diagnostics" : "Assessment Batteries & Evaluation Ledger")}
                {activeSection === "followups" && (role === "Counsellor" ? "Meetings & Follow-ups" : "Follow-up & Milestone Tracker")}
                {activeSection === "sessions" && "Counselling Sessions & Schedules"}
                {activeSection === "reports" && (role === "Parent" ? "Child Progress Report" : "Diagnostics, Analytics & Dossier Reports")}
                {activeSection === "billing" && (role === "Student" || role === "Parent" ? "Official Fee Receipts & GST Invoices" : "Billing, Payments & Razorpay Reconciliation")}
                {activeSection === "daily-plan" && (role === "Counsellor" ? "Student Daily Inputs & Action Assignment" : "Daily Action Plan")}
                {activeSection === "conclusions" && (role === "Counsellor" ? "Counselling Conclusions & Student Advice" : "Advice from Your Counsellor")}
                {activeSection === "access" && "User Credentials & Access Control"}
                {activeSection === "audit" && "System Audit Trail"}
                {activeSection === "feedback" && "Feedback to Counsellor"}
                {activeSection === "parent-form" && "Parent Information Form"}
                {activeSection === "documents" && "Academic Marksheets"}
                {activeSection === "settings" && "Institute Profile & System Configuration"}
              </h1>
            </div>

          </div>}

          {/* Section Routing */}
          {activeSection === "overview" && (
            <>
              {role === "SuperAdmin" && <SuperAdminView />}
              {role === "Brain Admin" && (
                <BrainAdminDashboard onNavigateFollowups={() => setActiveSection("followups")} />
              )}
              {role === "Counsellor" && <CounsellorView onNavigateStudents={() => setActiveSection("students")} onNavigateMeetings={() => { setCounsellorReviewTab("followups"); setActiveSection("assessments"); }} />}
              {role === "Student" && <StudentToday studentId={user?.studentId} workspace={studentWorkspace} />}
              {role === "Parent" && <ParentDailyUpdates signedIn={user?.primaryRole === "parent"} />}
            </>
          )}

          {activeSection === "inquiries" && (
            role === "Student" ? <StudentInquiryView /> : <InquiriesSectionView />
          )}

          {activeSection === "students" && (
            <StudentsSectionView role={role} />
          )}

          {activeSection === "assessments" && (
            role === "Student" ? (
              <StudentAICMT
                workspace={studentWorkspace}
                studentId={user?.studentId}
                studentEmail={user?.email}
                studentName={displayName}
              />
            ) : role === "Counsellor" ? (
              <CounsellorReviewHub initialTab={counsellorReviewTab} />
            ) : (
              <AssessmentsSectionView role={role} />
            )
          )}

          {activeSection === "followups" && (
            <FollowupsSectionView role={role} />
          )}

          {activeSection === "sessions" && (
            <SessionsSectionView role={role} />
          )}

          {activeSection === "reports" && (
            role === "Parent" ? <ParentChildProgress signedIn={user?.primaryRole === "parent"} /> : role === "Counsellor" ? <CounsellorTrackingView /> : <ReportsSectionView />
          )}

          {activeSection === "billing" && (
            <BillingSectionView role={role} />
          )}

          {activeSection === "daily-plan" && (role === "Counsellor" ? <CounsellorStudentInputs /> : <StudentActionPlan studentId={user?.studentId} workspace={studentWorkspace} />)}

          {activeSection === "conclusions" && <ConclusionsView role={role} />}

          {activeSection === "access" && role === "SuperAdmin" && <AccessControlView />}

          {activeSection === "audit" && <AuditLogView />}

          {activeSection === "feedback" && <ParentFeedbackView />}

          {activeSection === "parent-form" && <ParentInformationForm signedIn={user?.primaryRole === "parent"} />}


          {activeSection === "documents" && <StudentMarksheets studentId={user?.studentId} workspace={studentWorkspace} />}

          {activeSection === "settings" && (
            <SettingsSectionView role={role} />
          )}
        </main>
      </div>

      <StudentProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        role={role}
      />
    </div>
  );
}

// ==========================================
// 1. OVERVIEW SUB-VIEWS
// ==========================================

function SuperAdminView() {
  const [counsellors, setCounsellors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    title: "Certified Career Counsellor",
    qualifications: "",
    specializations: "Career Guidance, Aptitude Assessment",
    password: "Brain@1234",
  });

  const [studentCount, setStudentCount] = useState<number | null>(null);

  const loadCounsellors = () => {
    setLoading(true);
    api.counsellors.list()
      .then((data) => {
        setCounsellors(data || []);
      })
      .catch((err) => {
        console.error("Failed to load counsellors", err);
      })
      .finally(() => setLoading(false));

    apiCall<{ registeredStudents: number }>("/api/v1/admin/stats")
      .then((res) => {
        if (res && typeof res.registeredStudents === "number") {
          setStudentCount(res.registeredStudents);
        }
      })
      .catch(() => setStudentCount(0));
  };

  useEffect(() => {
    loadCounsellors();
  }, []);

  const handleCreateCounsellor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim()) {
      setErrorMsg("Full name and email are required");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const specs = form.specializations.split(",").map((s) => s.trim()).filter(Boolean);
      await api.counsellors.create({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        title: form.title.trim() || undefined,
        qualifications: form.qualifications.trim() || undefined,
        specializations: specs,
        password: form.password || "Brain@1234",
      });
      setSuccessMsg(`Counsellor "${form.fullName}" registered successfully.`);
      setForm({
        fullName: "",
        email: "",
        phone: "",
        title: "Certified Career Counsellor",
        qualifications: "",
        specializations: "Career Guidance, Aptitude Assessment",
        password: "Brain@1234",
      });
      setShowAddModal(false);
      loadCounsellors();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to add counsellor");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCounsellor = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove counsellor "${name}"? This will deactivate their portal access.`)) {
      return;
    }
    try {
      await api.counsellors.delete(id);
      setSuccessMsg(`Counsellor "${name}" removed.`);
      loadCounsellors();
    } catch (err: any) {
      alert(err.message || "Failed to remove counsellor");
    }
  };

  return (
    <div className="max-w-5xl space-y-6">
      {/* Overview Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={UsersRound}
          label="Active / Registered Students"
          value={studentCount === null ? "…" : String(studentCount)}
          hint={studentCount === 0 ? "0 in database" : `${studentCount} active enrolled candidate${studentCount === 1 ? "" : "s"}`}
          highlight
        />
        <StatCard icon={ShieldCheck} label="Super Admin" value="Arpita Kulkarni" hint="arpskulkarni99@gmail.com" />
        <StatCard
          icon={UserRound}
          label="Active Counsellors"
          value={loading ? "…" : String(counsellors.length)}
          hint={counsellors.length === 0 ? "0 in database · Add below" : `${counsellors.length} active counsellor${counsellors.length === 1 ? "" : "s"}`}
        />
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-[8px] flex items-center justify-between">
          <span className="font-medium">{successMsg}</span>
          <button onClick={() => setSuccessMsg("")} className="font-bold text-emerald-900 hover:opacity-75">×</button>
        </div>
      )}

      {/* Counsellor Management Section */}
      <SectionPanel
        title="Certified Counsellors Roster"
        subtitle="Manage counsellor accounts, specialized domains, and assignable mentors"
        action={
          <Button
            size="sm"
            variant="primary"
            icon={<UserPlus className="h-3.5 w-3.5" />}
            onClick={() => {
              setErrorMsg("");
              setShowAddModal(true);
            }}
          >
            Add Counsellor
          </Button>
        }
      >
        {loading ? (
          <div className="py-8 text-center text-xs text-[#737373]">Loading counsellors from database…</div>
        ) : counsellors.length === 0 ? (
          <div className="rounded-[10px] border border-dashed border-[#d8d5e6] bg-[#fcfbfe] p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#f1ecf9] text-[#3f2f7a] flex items-center justify-center mx-auto mb-3">
              <UserRound className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-[#171717] mb-1">No Counsellors Added Yet</h3>
            <p className="text-xs text-[#737373] max-w-md mx-auto mb-5 leading-relaxed">
              All mock counsellor data has been cleared. As SuperAdmin, you can now add real certified counsellors.
              Their accounts will immediately be active and selectable for student sessions.
            </p>
            <Button
              size="sm"
              variant="primary"
              icon={<UserPlus className="h-3.5 w-3.5" />}
              onClick={() => {
                setErrorMsg("");
                setShowAddModal(true);
              }}
            >
              Add First Counsellor
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#d8d5e6] text-[#737373]">
                  <th className="pb-2.5 font-semibold">Counsellor</th>
                  <th className="pb-2.5 font-semibold">Specializations</th>
                  <th className="pb-2.5 font-semibold">Contact</th>
                  <th className="pb-2.5 font-semibold">Status</th>
                  <th className="pb-2.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f6f3fb]">
                {counsellors.map((c) => (
                  <tr key={c.id} className="hover:bg-[#fcfbfe]">
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#f1ecf9] border border-[#d8d5e6] flex items-center justify-center font-bold text-[#3f2f7a] text-xs">
                          {c.fullName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-[#171717]">{c.fullName}</p>
                          <p className="text-[11px] text-[#737373]">{c.title || "Counsellor"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(c.specializations && c.specializations.length > 0) ? (
                          c.specializations.map((spec: string) => (
                            <span key={spec} className="rounded-full bg-[#f6f3fb] border border-[#e4dff2] px-2 py-0.5 text-[10px] text-[#3f2f7a]">
                              {spec}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-[#a3a3a3]">General Guidance</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-3">
                      <p className="text-[#171717]">{c.email || "—"}</p>
                      {c.phone && <p className="text-[11px] text-[#737373]">{c.phone}</p>}
                    </td>
                    <td className="py-3 pr-3">
                      <span className="rounded-full bg-[#dcfce7] px-2 py-0.5 text-[10px] font-medium text-[#16a34a] border border-[#bbf7d0]">
                        Active
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteCounsellor(c.id, c.fullName)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionPanel>

      {/* Add Counsellor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[12px] bg-white p-6 shadow-xl border border-[#d8d5e6]">
            <div className="flex items-center justify-between mb-4 border-b border-[#f0edf7] pb-3">
              <div>
                <h3 className="text-base font-semibold text-[#171717]">Add Certified Counsellor</h3>
                <p className="text-xs text-[#737373]">Create login access and counsellor profile for the portal</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#737373] hover:text-[#171717] text-lg font-bold"
              >
                ×
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-2.5 rounded-[6px] bg-red-50 border border-red-200 text-red-700 text-xs">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateCounsellor} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium text-[#171717] mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Priya Sharma"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  className="w-full h-9 rounded-[6px] border border-[#d8d5e6] px-3 focus:outline-none focus:border-[#3f2f7a]"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-medium text-[#171717] mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. priya.sharma@brain.edu"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full h-9 rounded-[6px] border border-[#d8d5e6] px-3 focus:outline-none focus:border-[#3f2f7a]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#171717] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98230 11990"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full h-9 rounded-[6px] border border-[#d8d5e6] px-3 focus:outline-none focus:border-[#3f2f7a]"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-medium text-[#171717] mb-1">
                    Title / Role
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Career Psychologist"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full h-9 rounded-[6px] border border-[#d8d5e6] px-3 focus:outline-none focus:border-[#3f2f7a]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-[#171717] mb-1">
                    Initial Password
                  </label>
                  <input
                    type="text"
                    placeholder="Default: Brain@1234"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full h-9 rounded-[6px] border border-[#d8d5e6] px-3 focus:outline-none focus:border-[#3f2f7a]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#171717] mb-1">
                  Qualifications
                </label>
                <input
                  type="text"
                  placeholder="e.g. PhD, Cognitive Counseling · M.A. Applied Psychology"
                  value={form.qualifications}
                  onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
                  className="w-full h-9 rounded-[6px] border border-[#d8d5e6] px-3 focus:outline-none focus:border-[#3f2f7a]"
                />
              </div>

              <div>
                <label className="block font-medium text-[#171717] mb-1">
                  Specializations (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Career Guidance, Aptitude Assessment, Lakshya Track"
                  value={form.specializations}
                  onChange={(e) => setForm({ ...form, specializations: e.target.value })}
                  className="w-full h-9 rounded-[6px] border border-[#d8d5e6] px-3 focus:outline-none focus:border-[#3f2f7a]"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-3 border-t border-[#f0edf7]">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  disabled={submitting}
                  icon={<UserPlus className="h-3.5 w-3.5" />}
                >
                  {submitting ? "Adding…" : "Register Counsellor"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function BrainAdminDashboard({
  onNavigateFollowups,
}: {
  onNavigateFollowups: () => void;
}) {
  type DailyAppointment = {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    timeDisplay: string | null;
    mode: string;
    status: string;
    location: string | null;
    meetingLinkUrl: string | null;
    studentName: string;
    studentPhone: string | null;
    counsellorName: string;
    programName: string | null;
  };
  const [dailyData, setDailyData] = useState<{ date: string; appointments: DailyAppointment[] } | null>(null);
  const [dailyError, setDailyError] = useState("");
  const [appointmentsOpen, setAppointmentsOpen] = useState(false);
  const [studentsOpen, setStudentsOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<DailyAppointment | null>(null);
  const [overview, setOverview] = useState<{ registeredStudents: number; availableSlots: number; upcomingFollowups: number; modules: { id: string; name: string; count: number }[] } | null>(null);
  const [overviewError, setOverviewError] = useState("");
  useEffect(() => {
    let active = true;
    apiCall<{ date: string; appointments: DailyAppointment[] }>("/api/v1/admin/daily-appointments")
      .then((result) => { if (active) setDailyData(result); })
      .catch((cause) => { if (active) setDailyError(cause instanceof Error ? cause.message : "Could not load today's appointments."); });
    apiCall<{ registeredStudents: number; availableSlots: number; upcomingFollowups: number; modules: { id: string; name: string; count: number }[] }>("/api/v1/admin/brain-overview")
      .then((result) => { if (active) setOverview(result); })
      .catch((cause) => { if (active) setOverviewError(cause instanceof Error ? cause.message : "Could not load overview data."); });
    return () => { active = false; };
  }, []);
  const appointments = dailyData?.appointments || [];
  const onlineCount = appointments.filter((appointment) => appointment.mode === "online").length;
  const appointmentDate = dailyData?.date ? new Date(dailyData.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "today";
  const formatTime = (value: string) => {
    const [hours, minutes] = value.split(":").map(Number);
    return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
  };
  if (studentsOpen) return <BrainAdminRegisteredStudents modules={overview?.modules || []} onBack={() => setStudentsOpen(false)} />;

  if (appointmentsOpen) return <div className="max-w-5xl space-y-5">
    <button type="button" onClick={() => { if (selectedAppointment) setSelectedAppointment(null); else setAppointmentsOpen(false); }} className="text-sm font-medium text-[#3f2f7a] hover:underline">← {selectedAppointment ? "Back to appointments" : "Back to Daily Overview"}</button>
    {selectedAppointment ? <SectionPanel title="Appointment Details" subtitle={selectedAppointment.studentName}>
      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        {[
          ["Time", `${formatTime(selectedAppointment.startTime)} – ${formatTime(selectedAppointment.endTime)}`],
          ["Student", selectedAppointment.studentName],
          ["Mode", selectedAppointment.mode === "online" ? "Online" : "Offline"],
          ["Counsellor", selectedAppointment.counsellorName],
          ["Module", selectedAppointment.programName || "Not selected"],
          ["Status", selectedAppointment.status],
          ["Location", selectedAppointment.mode === "online" ? "Online counselling" : selectedAppointment.location || "Not specified"],
          ["Student phone", selectedAppointment.studentPhone || "Not provided"],
        ].map(([label, value]) => <div key={label} className="rounded-lg border border-[#d8d5e6] p-3"><dt className="text-xs text-[#737373]">{label}</dt><dd className="mt-1 font-medium text-[#171717]">{value}</dd></div>)}
      </dl>
    </SectionPanel> : <SectionPanel title="Daily Appointments Booked" subtitle={`${appointmentDate} · ${appointments.length} appointment${appointments.length === 1 ? "" : "s"} · in time order`}>
      {dailyError ? <p role="alert" className="text-sm text-red-700">{dailyError}</p> : !dailyData ? <p className="text-sm text-[#737373]">Loading today’s appointments…</p> : appointments.length === 0 ? <p className="text-sm text-[#737373]">No appointments booked for today.</p> : <div className="space-y-2">{appointments.map((appointment) => <button type="button" key={appointment.id} onClick={() => setSelectedAppointment(appointment)} className="grid w-full gap-2 rounded-lg border border-[#d8d5e6] p-4 text-left text-sm transition-colors hover:border-[#3f2f7a] hover:bg-[#f6f3fb] sm:grid-cols-[7rem_1fr_7rem_1fr_auto] sm:items-center"><span className="font-semibold text-[#3f2f7a]">{formatTime(appointment.startTime)}</span><span className="font-semibold text-[#171717]">{appointment.studentName}</span><span className="text-[#525252]">{appointment.mode === "online" ? "Online" : "Offline"}</span><span className="text-[#525252]">{appointment.counsellorName}</span><ChevronRight className="h-4 w-4 text-[#737373]"/></button>)}</div>}
    </SectionPanel>}
  </div>;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <button type="button" onClick={() => setAppointmentsOpen(true)} aria-label="View daily appointments booked" className="rounded-[12px] text-left transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3f2f7a]"><StatCard icon={Video} label="Appointments Booked" value={dailyData ? String(appointments.length) : dailyError ? "—" : "…"} hint={dailyData ? `Today · ${onlineCount} online, ${appointments.length - onlineCount} offline · View list` : dailyError || "Loading today’s appointments…"} highlight /></button>
        <button type="button" onClick={() => setStudentsOpen(true)} aria-label="View registered students" className="rounded-[12px] text-left transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3f2f7a]"><StatCard icon={UsersRound} label="Students Registered" value={overview ? String(overview.registeredStudents) : overviewError ? "—" : "…"} hint="View registered students" /></button>
        <StatCard icon={CalendarDays} label="Available Slots" value={overview ? String(overview.availableSlots) : overviewError ? "—" : "…"} hint="Open in the next 7 days" />
        <button type="button" onClick={onNavigateFollowups} aria-label="View follow-up reminders" className="rounded-[12px] text-left transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3f2f7a]"><StatCard icon={Bell} label="Upcoming Follow-ups" value={overview ? String(overview.upcomingFollowups) : overviewError ? "—" : "…"} hint="View reminders" /></button>
      </div>
      {overviewError && <p role="alert" className="text-sm text-red-700">{overviewError}</p>}

      <SectionPanel title="Module-wise Student Registrations" subtitle="Active registrations across counselling modules">
        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {(overview?.modules || []).map((module) => (
            <div key={module.id} className="rounded-[8px] border border-[#d8d5e6] bg-[#f6f3fb] p-3 text-xs">
              <p className="text-[#737373]">{module.name}</p>
              <p className="mt-1 text-xl font-semibold text-[#171717]">{module.count}</p>
              <p className="text-[10px] text-[#737373]">students</p>
            </div>
          ))}
          {!overview && !overviewError && <p className="text-xs text-[#737373]">Loading module registrations…</p>}
          {overview && overview.modules.length === 0 && <p className="text-xs text-[#737373]">No active counselling modules.</p>}
        </div>
      </SectionPanel>
    </div>
  );
}

function AdminView({
  superAdmin,
  downloadReport,
  onNavigateStudents,
}: {
  superAdmin: boolean;
  downloadReport: () => void;
  onNavigateStudents: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={UsersRound} label="Students Registered" value="18" hint="Today · 248 active" highlight />
        <StatCard icon={CalendarDays} label="Open Slots" value="7" hint="Available for phone booking" />
        <StatCard icon={IndianRupee} label="Fees Collected" value="₹4.82L" hint="92% of target" />
        <StatCard icon={Video} label="Sessions Today" value="12" hint="3 online · 9 in-person" />
      </div>

      {superAdmin && (
        <div className="rounded-[12px] border border-[#c9c2e3] bg-[#efeaf9]/40 p-4 text-xs text-[#2c2159] flex items-start gap-3">
          <ShieldCheck className="h-4 w-4 text-[#3f2f7a] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-[#171717]">SuperAdmin Audit Mode Enabled</p>
            <p className="mt-0.5 text-[#525252]">Full cross-branch visibility across registration forms, fee ledgers, and psychological notes.</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.65fr_1fr]">
        <SectionPanel
          title="Student Registration Roster"
          subtitle="Recent inquiries and fee status"
          action={
            <Button size="sm" variant="ghost" onClick={onNavigateStudents}>
              View All →
            </Button>
          }
        >
          <StudentTable compact />
        </SectionPanel>

        <SectionPanel title="Action Queue" subtitle="Pending items requiring advisor attention">
          <div className="space-y-2.5">
            {[
              ["6 overdue follow-up calls", "Counsellors notified", "text-[#ea580c]"],
              ["3 fee reconciliations pending", "Due within 48h", "text-[#ea580c]"],
              ["12 new inquiries submitted", "Ready for program assignment", "text-[#3f2f7a]"],
            ].map(([a, b, c]) => (
              <div key={a} className="p-3 rounded-[8px] border border-[#d8d5e6] bg-[#f6f3fb] text-xs flex justify-between items-center">
                <div>
                  <p className="font-medium text-[#171717]">{a}</p>
                  <p className="text-[11px] text-[#737373]">{b}</p>
                </div>
                <span className={`text-[10px] font-semibold uppercase ${c}`}>Active</span>
              </div>
            ))}
          </div>

          <Button size="sm" variant="outline" fullWidth className="mt-4" onClick={downloadReport}>
            Download Action Summary
          </Button>
        </SectionPanel>
      </div>
    </div>
  );
}

function StudentTable({ compact = false, priority = false }: { compact?: boolean; priority?: boolean }) {
  const displayList = compact ? studentsData.slice(0, 4) : studentsData;
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] text-left text-xs">
        <thead>
          <tr className="text-[#737373] border-b border-[#d8d5e6]">
            {(priority ? ["Candidate", "Program", "Progress", "Slot"] : ["Candidate", "Program", "Counsellor", "Fee", "Progress", "Next Slot"]).map((h) => (
              <th key={h} className="pb-2.5 font-semibold text-[11px] uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayList.map((s) => (
            <tr key={s.id} className="border-b border-[#f6f3fb] hover:bg-[#f6f3fb]/60 transition-colors">
              <td className="py-2.5">
                <p className="font-medium text-[#171717]">{s.name}</p>
                <p className="text-[10px] text-[#737373]">{s.id}</p>
              </td>
              <td>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-[#f6f3fb] border border-[#d8d5e6] text-[#171717]">
                  {s.program}
                </span>
              </td>
              {!priority && <td className="text-[#525252]">{s.counsellor}</td>}
              {!priority && <td>
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                    s.fee === "Paid" ? "bg-[#dcfce7] text-[#16a34a] border-[#bbf7d0]" : "bg-amber-50 text-[#ea580c] border-amber-200"
                  }`}
                >
                  {s.fee}
                </span>
              </td>}
              <td>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-14 rounded-full bg-[#d8d5e6] overflow-hidden">
                    <div className="h-full bg-[#171717]" style={{ width: `${s.progress}%` }} />
                  </div>
                  <span className="text-[11px] text-[#737373]">{s.progress}%</span>
                </div>
              </td>
              <td className="text-[#525252]">{s.next}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CounsellorView({ onNavigateStudents, onNavigateMeetings }: { onNavigateStudents: () => void; onNavigateMeetings: () => void }) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({ meetingsToday: 0, pendingReports: 0 });

  useEffect(() => {
    let active = true;
    apiCall<any[]>("/api/v1/student-portal/mapped")
      .then((data) => {
        if (active) setStudents(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setStudents([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    apiCall<{ meetingsToday: number; pendingReports: number }>("/api/v1/student-portal/counsellor/dashboard-stats")
      .then((data) => { if (active) setDashboardStats(data); })
      .catch(() => { if (active) setDashboardStats({ meetingsToday: 0, pendingReports: 0 }); });
    return () => { active = false; };
  }, []);

  const programCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    students.forEach((s) => {
      const prog = s.program || "General Counselling";
      counts[prog] = (counts[prog] || 0) + 1;
    });
    return Object.entries(counts);
  }, [students]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <button type="button" onClick={onNavigateStudents} className="text-left">
          <StatCard
            icon={UsersRound}
            label="My Students"
            value={loading ? "…" : String(students.length)}
            hint={students.length === 0 ? "0 mapped in database" : `${students.length} mapped candidate${students.length === 1 ? "" : "s"}`}
            highlight
          />
        </button>
        <button type="button" onClick={onNavigateMeetings} className="text-left">
          <StatCard
            icon={Clock3}
            label="Meetings Today"
            value={loading ? "…" : String(dashboardStats.meetingsToday)}
            hint={dashboardStats.meetingsToday ? `${dashboardStats.meetingsToday} scheduled session${dashboardStats.meetingsToday === 1 ? "" : "s"} today` : "No sessions scheduled for today"}
          />
        </button>
      </div>

      <div>
        <SectionPanel title="Module Enrollment" subtitle="Current assigned roster by module">
          {programCounts.length > 0 ? (
            <div className="space-y-3">
              {programCounts.map(([name, count]) => {
                const pct = students.length > 0 ? Math.round((count / students.length) * 100) : 0;
                return (
                  <div key={name}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="font-medium text-[#171717]">{name}</span>
                      <span className="text-[#737373]">{count} candidate{count === 1 ? "" : "s"}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#f6f3fb] border border-[#d8d5e6]">
                      <div className="h-full rounded-full bg-[#3f2f7a]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-[#737373]">
              <p className="font-semibold text-[#171717]">No Module Enrollments</p>
              <p className="mt-1">Assigned roster will appear here once candidates are mapped to your caseload by Admin.</p>
            </div>
          )}
        </SectionPanel>
      </div>

      <SectionPanel title="Priority Counsellings" subtitle="Scheduled appointments for today">
        {students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-left text-xs">
              <thead>
                <tr className="text-[#737373] border-b border-[#d8d5e6]">
                  <th className="pb-2.5 font-semibold text-[11px] uppercase tracking-wider">Candidate</th>
                  <th className="pb-2.5 font-semibold text-[11px] uppercase tracking-wider">Module</th>
                  <th className="pb-2.5 font-semibold text-[11px] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b border-[#f6f3fb]">
                    <td className="py-2.5">
                      <p className="font-medium text-[#171717]">{s.name}</p>
                      <p className="text-[10px] text-[#737373]">{s.id}</p>
                    </td>
                    <td>
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-[#f6f3fb] border border-[#d8d5e6] text-[#171717]">
                        {s.program || "General"}
                      </span>
                    </td>
                    <td>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#16a34a] border border-[#bbf7d0]">
                        Mapped
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-[#737373]">
            <CalendarDays className="w-8 h-8 text-[#9f98b9] mx-auto mb-2" />
            <p className="font-semibold text-[#171717]">No Priority Counsellings Scheduled</p>
            <p className="mt-1">Scheduled appointments and priority sessions will appear here.</p>
          </div>
        )}
      </SectionPanel>
    </div>
  );
}

function StudentView({
  todos,
  setTodos,
  completed,
  mood,
  setMood,
  saved,
  onSave,
}: {
  todos: Todo[];
  setTodos: (v: Todo[]) => void;
  completed: number;
  mood: number;
  setMood: (v: number)=>void;
  saved: boolean;
  onSave: ()=>void;
}) {
  const [reflection, setReflection] = useState("");
  const [listening, setListening] = useState(false);
  const startDictation = () => {
    const Recognition = (window as unknown as { webkitSpeechRecognition?: new () => { lang: string; start: () => void; onresult: (event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; onend: () => void } }).webkitSpeechRecognition;
    if (!Recognition) return setReflection((value) => value || "Speech-to-text is not available in this browser.");
    const recognition = new Recognition();
    recognition.lang = "en-IN";
    recognition.onresult = (event) => setReflection((value) => `${value} ${event.results[0][0].transcript}`.trim());
    recognition.onend = () => setListening(false);
    setListening(true);
    recognition.start();
  };
  const moods = ["😞", "😕", "😐", "🙂", "😄"];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={TrendingUp} label="Progress Score" value="72%" hint="+8% this cycle" highlight />
        <StatCard icon={ClipboardCheck} label="Action Items" value={`${completed}/${todos.length}`} hint="Tasks completed" />
        <StatCard icon={CalendarDays} label="Upcoming Session" value="4:00 PM" hint="Assigned Counsellor" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionPanel title="Daily Mood &amp; Wellness Check-in" subtitle="Share your state with your assigned counsellor">
          <div className="flex gap-2">
            {moods.map((item, i) => (
              <button
                key={item}
                onClick={() => setMood(i + 1)}
                className={`flex h-11 flex-1 items-center justify-center rounded-[8px] text-xl transition-all border ${
                  mood === i + 1 ? "bg-[#f6f3fb] border-black scale-105" : "bg-white border-[#d8d5e6] hover:bg-[#f6f3fb]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <textarea
            value={reflection}
            onChange={(event) => setReflection(event.target.value)}
            className="mt-3 w-full rounded-[6px] border border-[#d8d5e6] p-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#3f2f7a]"
            rows={2}
            placeholder="Any reflections or questions for your advisor?"
          />
          <button type="button" onClick={startDictation} className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#3f2f7a] hover:underline">
            <Mic className="h-3.5 w-3.5" /> {listening ? "Listening…" : "Speak instead of typing"}
          </button>
          <Button size="sm" variant="primary" fullWidth className="mt-2" onClick={onSave}>
            {saved ? "Check-in Saved ✓" : "Save Today’s Check-in"}
          </Button>
        </SectionPanel>

        <SectionPanel title="My Action Checklist" subtitle="Updated by your mentor">
          <div className="space-y-2">
            {todos.map((todo) => (
              <label
                key={todo.id}
                className="flex cursor-pointer items-center gap-2.5 rounded-[6px] border border-[#d8d5e6] p-2.5 text-xs hover:bg-[#f6f3fb]"
              >
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() =>
                    setTodos(todos.map((t) => (t.id === todo.id ? { ...t, done: !t.done } : t)))
                  }
                  className="accent-black"
                />
                <span className={`flex-1 ${todo.done ? "text-[#a3a3a3] line-through" : "text-[#171717]"}`}>
                  {todo.text}
                </span>
                <span className="text-[10px] text-[#737373]">{todo.due}</span>
              </label>
            ))}
          </div>
        </SectionPanel>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <SectionPanel title="AI Behaviour Review" subtitle="Daily analysis based on check-ins and completed actions">
          <div className="rounded-[8px] border border-[#c9c2e3] bg-[#f6f3fb] p-3 text-xs text-[#525252]"><p className="font-semibold text-[#171717]">Consistency needs attention</p><p className="mt-1">1 of 3 actions is complete. Incomplete actions stay marked false and are included in today’s counsellor review.</p></div>
        </SectionPanel>
      </div>
    </div>
  );
}

function StudentInquiryView() {
  return <OfficialInquiryForm embedded />;
}

function StudentAICMTView({ todos }: { todos: Todo[] }) {
  const completed = todos.filter(todo => todo.done).length;
  const percentage = Math.round((completed / Math.max(todos.length, 1)) * 100);
  return <div className="max-w-5xl space-y-6"><div className="grid gap-4 sm:grid-cols-3"><StatCard icon={Brain} label="AI CMT Score" value="74/100" hint="Daily adaptive score" highlight/><StatCard icon={CheckCircle2} label="Task Consistency" value={`${percentage}%`} hint={`${completed} of ${todos.length} completed`}/><StatCard icon={Activity} label="Behaviour Trend" value="Improving" hint="Based on 7 daily reviews"/></div><SectionPanel title="AI CMT Behaviour Analysis" subtitle="Daily LLM-assisted review of actions, reflections and consistency"><div className="rounded-[8px] border border-[#c9c2e3] bg-[#f6f3fb] p-4 text-xs"><p className="font-semibold text-[#171717]">Today’s analysis</p><p className="mt-2 leading-relaxed text-[#525252]">You show positive engagement when tasks are specific and time-boxed. {todos.length-completed} incomplete action{todos.length-completed === 1 ? " remains" : "s remain"} marked false today. Complete the highest-priority study action before adding another task.</p></div><div className="mt-4 space-y-2">{todos.map(todo=><div key={todo.id} className="flex items-center justify-between rounded-[8px] border border-[#d8d5e6] p-3 text-xs"><span>{todo.text}</span><span className={`rounded-full px-2 py-0.5 text-[10px] ${todo.done ? "bg-[#dcfce7] text-[#16a34a]" : "bg-red-50 text-red-600"}`}>{todo.done ? "True · completed" : "False · incomplete"}</span></div>)}</div></SectionPanel></div>;
}

function StudentDocumentsView() {
  const [documents, setDocuments] = useState([{ name: "Class-9-final-marksheet.pdf", date: "12 Aug 2026", status: "Shared with counsellor" }]);
  const addFiles = (files: FileList | null) => { if (!files) return; setDocuments([...documents,...Array.from(files).map(file=>({name:file.name,date:"Today",status:"Shared with counsellor"}))]); };
  return <div className="max-w-4xl space-y-6"><SectionPanel title="Upload School Marksheets" subtitle="PDF or image files are shared securely with your assigned counsellor"><label className="flex cursor-pointer flex-col items-center rounded-[10px] border border-dashed border-[#a3a3a3] p-8 text-center text-xs hover:bg-[#f6f3fb]"><Upload className="mb-2 h-6 w-6 text-[#3f2f7a]"/><span className="font-semibold">Choose marksheets to upload</span><span className="mt-1 text-[#737373]">PDF, JPG or PNG</span><input type="file" multiple accept=".pdf,image/*" className="hidden" onChange={e=>addFiles(e.target.files)}/></label></SectionPanel><SectionPanel title="Uploaded Documents" subtitle={`${documents.length} academic document${documents.length === 1 ? "" : "s"}`}><div className="space-y-2">{documents.map((document,index)=><div key={`${document.name}-${index}`} className="flex items-center justify-between rounded-[8px] border border-[#d8d5e6] p-3 text-xs"><div className="flex items-center gap-2"><FileText className="h-4 w-4 text-[#3f2f7a]"/><div><p className="font-medium">{document.name}</p><p className="text-[10px] text-[#737373]">Uploaded {document.date}</p></div></div><span className="rounded-full bg-[#dcfce7] px-2 py-0.5 text-[10px] text-[#16a34a]">{document.status}</span></div>)}</div></SectionPanel></div>;
}

function ParentFeedbackView() {
  const [subject, setSubject] = useState("About my child");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const recognitionRef = useRef<{ start: () => void; stop: () => void } | null>(null);
  useEffect(() => () => recognitionRef.current?.stop(), []);
  const toggleDictation = () => {
    if (listening) { recognitionRef.current?.stop(); return; }
    type SpeechResult = { resultIndex: number; results: ArrayLike<ArrayLike<{ transcript: string }>> };
    type SpeechEngine = { lang: string; continuous: boolean; interimResults: boolean; start: () => void; stop: () => void; onresult: ((event: SpeechResult) => void) | null; onerror: (() => void) | null; onend: (() => void) | null };
    const browser = window as unknown as { SpeechRecognition?: new () => SpeechEngine; webkitSpeechRecognition?: new () => SpeechEngine };
    const Recognition = browser.SpeechRecognition || browser.webkitSpeechRecognition;
    if (!Recognition) { setVoiceError("Speech-to-text is not available in this browser. You can still type your feedback."); return; }
    const recognition = new Recognition();
    recognition.lang = "en-IN";
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).slice(event.resultIndex).map((result) => result[0]?.transcript || "").join(" ").trim();
      if (transcript) setMessage((current) => `${current} ${transcript}`.trim());
    };
    recognition.onerror = () => setVoiceError("Microphone recognition stopped. Check microphone permission and try again.");
    recognition.onend = () => { setListening(false); recognitionRef.current = null; };
    recognitionRef.current = recognition;
    setVoiceError("");
    try { recognition.start(); setListening(true); }
    catch { setVoiceError("Could not start the microphone. Please try again."); recognitionRef.current = null; }
  };
  const sendFeedback = async () => {
    if (!message.trim()) return;
    setSending(true); setVoiceError("");
    try {
      await apiCall("/api/v1/student-portal/parent/feedback", { method: "POST", body: { subject, message: message.trim() } });
      setSent(true);
    } catch (cause) { setVoiceError(cause instanceof Error ? cause.message : "Feedback could not be sent."); }
    finally { setSending(false); }
  };
  return <div className="max-w-3xl"><SectionPanel title="Send Feedback to Counsellor" subtitle="Share an observation about your child or request support for yourself"><div className="space-y-4 text-xs"><div><label className="mb-1 block font-medium">Feedback regarding</label><select value={subject} onChange={e=>setSubject(e.target.value)} className="h-9 w-full rounded-[6px] border border-[#d8d5e6] px-3"><option>About my child</option><option>About myself</option><option>Counselling experience</option></select></div><div><label className="mb-1 block font-medium">Message for Assigned Counsellor</label><textarea value={message} onChange={e=>{setMessage(e.target.value);setSent(false);}} rows={6} placeholder="Describe the change or concern you have observed…" className="w-full rounded-[6px] border border-[#d8d5e6] p-3 focus:border-[#3f2f7a] focus:outline-none"/><button type="button" onClick={toggleDictation} aria-pressed={listening} className="mt-2 inline-flex items-center gap-1.5 font-medium text-[#3f2f7a] hover:underline"><Mic className="h-4 w-4"/>{listening ? "Stop recording" : "Speak instead of typing"}</button>{voiceError && <p role="alert" className="mt-2 text-red-700">{voiceError}</p>}</div><Button size="sm" variant="primary" icon={<Send className="h-3.5 w-3.5"/>} disabled={!message.trim() || sending} onClick={() => void sendFeedback()}>{sending ? "Sending…" : sent ? "Feedback Sent ✓" : "Send Feedback"}</Button></div></SectionPanel></div>;
}

// ==========================================
// 2. STUDENTS / MY COUNSELLOR SECTION VIEW
// ==========================================

function StudentsSectionView({ role }: { role: Role }) {
  const isStudentOrParent = role === "Student" || role === "Parent";
  const isCounsellor = role === "Counsellor";
  const [searchTerm, setSearchTerm] = useState("");
  const [programFilter, setProgramFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [activeCounsellor, setActiveCounsellor] = useState<any>(null);
  const [counsellorStudents, setCounsellorStudents] = useState<any[]>([]);
  const [counsellorLoading, setCounsellorLoading] = useState(false);

  useEffect(() => {
    if (isStudentOrParent) {
      api.counsellors.list()
        .then((list) => {
          if (list && list.length > 0) setActiveCounsellor(list[0]);
        })
        .catch(() => {});
    } else if (isCounsellor) {
      setCounsellorLoading(true);
      apiCall<any[]>("/api/v1/student-portal/mapped")
        .then((data) => setCounsellorStudents(Array.isArray(data) ? data : []))
        .catch(() => setCounsellorStudents([]))
        .finally(() => setCounsellorLoading(false));
    }
  }, [isStudentOrParent, isCounsellor]);

  const sourceList = isCounsellor ? counsellorStudents : studentsData;

  const filteredStudents = useMemo(() => {
    return sourceList.filter((s) => {
      const matchesSearch =
        (s.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.school || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProgram = programFilter === "All" || s.program === programFilter;
      return matchesSearch && matchesProgram;
    });
  }, [sourceList, searchTerm, programFilter]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const displayedStudents = filteredStudents.slice((page - 1) * pageSize, page * pageSize);

  if (isStudentOrParent) {
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="p-6 rounded-[12px] bg-white border border-[#d8d5e6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#f6f3fb] border border-[#d8d5e6] flex items-center justify-center text-lg font-semibold text-[#171717]">
              {activeCounsellor ? activeCounsellor.fullName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "AC"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-[#171717]">
                  {activeCounsellor ? activeCounsellor.fullName : "Assigned Counsellor (Pending Allocation)"}
                </h2>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#16a34a] border border-[#bbf7d0]">
                  {activeCounsellor ? "Assigned Mentor" : "Status: Active"}
                </span>
              </div>
              <p className="text-xs text-[#737373]">
                {activeCounsellor ? (activeCounsellor.title || "Certified Career Counsellor") : "Admin will allocate a certified counsellor upon onboarding"}
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-[#525252]">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {activeCounsellor?.email || "counselling@brain.edu"}</span>
                {activeCounsellor?.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {activeCounsellor.phone}</span>}
              </div>
            </div>
          </div>

          <Link href="/session">
            <Button size="sm" variant="primary" icon={<Video className="w-3.5 h-3.5" />}>
              Open Video Room
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <SectionPanel title="Specialization &amp; Track" subtitle="Focus areas for your guidance">
            <div className="space-y-2 text-xs text-[#525252]">
              <p className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#16a34a]" /> Science, Engineering &amp; Design stream benchmarking</p>
              <p className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#16a34a]" /> Behavioral aptitude and psychographic interest profiling</p>
              <p className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#16a34a]" /> Board exam stress reduction and time management</p>
            </div>
          </SectionPanel>

          <SectionPanel title="Next Consultation" subtitle="Upcoming scheduled session">
            <div className="p-3 rounded-[8px] bg-[#f6f3fb] border border-[#d8d5e6] text-xs space-y-1.5">
              <div className="flex justify-between font-medium text-[#171717]">
                <span>Today · 4:00 PM (45 mins)</span>
                <span className="text-[#3f2f7a]">In-Person</span>
              </div>
              <p className="text-[11px] text-[#737373]">Pune Campus · Room 2B, Consultation Wing</p>
            </div>
          </SectionPanel>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {role !== "Counsellor" && <SectionPanel title="Legacy Student Mapping" subtitle="Bring pre-portal counselling records into the current student history">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs">
          <div className="flex items-center gap-3"><History className="h-5 w-5 text-[#3f2f7a]" /><div><p className="font-semibold text-[#171717]">Map an existing counselling record</p><p className="text-[#737373]">Match by phone or legacy ID and issue a temporary credential for first-login reset.</p></div></div>
          <Button size="sm" variant="outline" icon={<KeyRound className="h-3.5 w-3.5" />}>Map &amp; Issue Login</Button>
        </div>
      </SectionPanel>}
      {/* Search & Program Filters */}
      <div className="p-4 rounded-[12px] bg-white border border-[#d8d5e6] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-[#737373] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            placeholder="Search by candidate, ID, or school..."
            className="w-full h-8 pl-8 pr-3 text-xs bg-white border border-[#d8d5e6] rounded-[6px] text-[#171717] focus:outline-none focus:border-[#3f2f7a]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {["All", "Ankur", "Palavi", "Lakshya", "Udaan", "Phoenix", "CMT"].map((prog) => (
            <button
              key={prog}
              onClick={() => { setProgramFilter(prog); setPage(1); }}
              className={`px-2.5 py-1 text-xs rounded-full border transition-colors cursor-pointer ${
                programFilter === prog ? "bg-[#2c2159] text-white border-black" : "bg-white text-[#525252] border-[#d8d5e6] hover:bg-[#f6f3fb]"
              }`}
            >
              {prog}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Table */}
      <SectionPanel
        title={`Student Directory (${filteredStudents.length})`}
        subtitle={role === "Counsellor" ? "Mapped students in your caseload" : "Manage enrolled candidates, fee records and dossiers"}
        action={role !== "Counsellor" ? (
          <Link href="/counselling/inquiry">
            <Button size="sm" variant="outline" icon={<Plus className="w-3.5 h-3.5" />}>
              Add Student
            </Button>
          </Link>
        ) : undefined}
      >
        {displayedStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className={`w-full text-left text-xs ${role === "Counsellor" ? "min-w-[650px]" : "min-w-[750px]"}`}>
              <thead>
                <tr className="text-[#737373] border-b border-[#d8d5e6]">
                  {(role === "Counsellor" ? ["Candidate", "School / Std", "Module", "Progress", "Next Session"] : ["Candidate", "School / Std", "Module", "Assigned Advisor", "Fee Status", "Follow-up", "Actions"]).map((h) => (
                    <th key={h} className="pb-2.5 font-semibold text-[11px] uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedStudents.map((s) => (
                  <tr key={s.id} className="border-b border-[#f6f3fb] hover:bg-[#f6f3fb]/60 transition-colors">
                    <td className="py-3">
                      <p className="font-medium text-[#171717]">{s.name}</p>
                      <p className="text-[10px] text-[#737373]">{s.regNo || s.id} {s.phone ? `· ${s.phone}` : ""}</p>
                    </td>
                    <td>
                      <p className="text-[#171717]">{s.school || "School Not Specified"}</p>
                      <p className="text-[10px] text-[#737373]">Std: {s.standard || "—"}</p>
                    </td>
                    <td>
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-[#f6f3fb] border border-[#d8d5e6] text-[#171717]">
                        {s.program || "General"}
                      </span>
                    </td>
                    {role !== "Counsellor" && <td className="text-[#525252]">{s.counsellor}</td>}
                    {role !== "Counsellor" && <td>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                          s.fee === "Paid" ? "bg-[#dcfce7] text-[#16a34a] border-[#bbf7d0]" : "bg-amber-50 text-[#ea580c] border-amber-200"
                        }`}
                      >
                        {s.fee} {s.feeAmount ? `(₹${s.feeAmount.toLocaleString()})` : ""}
                      </span>
                    </td>}
                    {role !== "Counsellor" && <td className="text-[#525252]">
                      <span className="block">{s.next}</span>
                      <span className="text-[10px] text-[#737373]">{s.followUpCadence} Cadence</span>
                    </td>}
                    {role === "Counsellor" && <td><div className="flex items-center gap-2"><div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#d8d5e6]"><div className="h-full bg-[#3f2f7a]" style={{ width: `${Math.min(100, Number(s.progress) || 0)}%` }} /></div><span className="text-[11px] text-[#737373]">{s.progress || 0}%</span></div></td>}
                    {role === "Counsellor" && <td className="text-[#525252]">{s.next || "Not scheduled"}</td>}
                    {role !== "Counsellor" && <td>
                      <button
                        onClick={() => setSelectedStudent(s)}
                        className="px-2.5 py-1 text-xs rounded-[6px] border border-[#d8d5e6] hover:bg-black hover:text-white transition-colors cursor-pointer"
                      >
                        View Dossier
                      </button>
                    </td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-[#737373]">
            <UsersRound className="w-8 h-8 text-[#9f98b9] mx-auto mb-2" />
            <p className="font-semibold text-[#171717]">
              {counsellorLoading ? "Loading mapped students…" : "No Mapped Students Found"}
            </p>
            <p className="mt-1">
              {isCounsellor
                ? "There are no students currently assigned to your counselling caseload. When students register and are allocated by Admin, they will appear here."
                : "No students matching your search criteria."}
            </p>
          </div>
        )}
        {role === "Counsellor" && <div className="mt-4 flex items-center justify-between border-t border-[#d8d5e6] pt-4 text-xs"><span className="text-[#737373]">Page {page} of {totalPages} · 10 records per page</span><div className="flex gap-2"><button type="button" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))} className="rounded-[6px] border border-[#d8d5e6] px-3 py-1.5 disabled:opacity-40">Previous</button><button type="button" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))} className="rounded-[6px] border border-[#d8d5e6] px-3 py-1.5 disabled:opacity-40">Next</button></div></div>}
      </SectionPanel>

      {/* Selected Student Modal Drawer */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[16px] border border-[#d8d5e6] bg-white p-6 shadow-xl">
            <div className="flex justify-between items-start border-b border-[#d8d5e6] pb-4 mb-4">
              <div>
                <span className="text-[10px] font-mono text-[#737373] uppercase">{selectedStudent.regNo || selectedStudent.id}</span>
                <h3 className="text-base font-semibold text-[#171717]">{selectedStudent.name}</h3>
                <p className="text-xs text-[#525252]">{selectedStudent.school}</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-[6px] hover:bg-[#f6f3fb] text-[#737373]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-[6px] bg-[#f6f3fb] border border-[#d8d5e6]">
                  <span className="text-[#737373] block text-[10px]">Enrolled Module</span>
                  <span className="font-semibold text-[#171717]">{selectedStudent.program || "Module not assigned"}</span>
                </div>
                <div className="p-2.5 rounded-[6px] bg-[#f6f3fb] border border-[#d8d5e6]">
                  <span className="text-[#737373] block text-[10px]">Counsellor</span>
                  <span className="font-semibold text-[#171717]">{selectedStudent.counsellor}</span>
                </div>
                <div className="p-2.5 rounded-[6px] bg-[#f6f3fb] border border-[#d8d5e6]">
                  <span className="text-[#737373] block text-[10px]">Fee Status</span>
                  <span className="font-semibold text-[#16a34a]">{selectedStudent.fee} (₹{selectedStudent.feeAmount})</span>
                </div>
                <div className="p-2.5 rounded-[6px] bg-[#f6f3fb] border border-[#d8d5e6]">
                  <span className="text-[#737373] block text-[10px]">Progress</span>
                  <span className="font-semibold text-[#171717]">{selectedStudent.progress}%</span>
                </div>
              </div>

              <div className="p-3 rounded-[6px] border border-[#d8d5e6] space-y-1">
                <p className="font-medium text-[#171717]">Contact Details</p>
                <p className="text-[#525252]">Email: {selectedStudent.email}</p>
                <p className="text-[#525252]">Phone: {selectedStudent.phone}</p>
              </div>

              <div className="rounded-[8px] border border-[#d8d5e6] p-3">
                <div className="mb-2 flex items-center gap-2"><History className="h-3.5 w-3.5 text-[#3f2f7a]" /><p className="font-semibold text-[#171717]">Previous Counselling History</p></div>
                <div className="space-y-2">
                  {sessionsList.filter((session) => session.studentName === selectedStudent.name).map((session) => <div key={session.id} className="rounded-[6px] bg-[#f6f3fb] p-2.5"><div className="flex items-center justify-between gap-2"><span className="font-medium">{session.date} · {session.time}</span><span className="rounded-full bg-white px-2 py-0.5 text-[10px] text-[#525252]">{session.status}</span></div><p className="mt-1 text-[10px] text-[#737373]">{session.mode} · {session.counsellor} · {session.location}</p></div>)}
                  {sessionsList.every((session) => session.studentName !== selectedStudent.name) && <p className="py-2 text-center text-[11px] text-[#737373]">No previous counselling sessions recorded.</p>}
                </div>
              </div>

              <div className="rounded-[8px] border border-[#d8d5e6] p-3">
                <div className="mb-2 flex items-center gap-2"><CreditCard className="h-3.5 w-3.5 text-[#3f2f7a]" /><p className="font-semibold text-[#171717]">Billing History</p></div>
                <div className="space-y-2">
                  {billingTransactions.filter((invoice) => invoice.studentName === selectedStudent.name).map((invoice) => <div key={invoice.id} className="flex items-center justify-between gap-3 rounded-[6px] bg-[#f6f3fb] p-2.5"><div><p className="font-mono text-[11px] font-medium">{invoice.id}</p><p className="text-[10px] text-[#737373]">{invoice.date} · {invoice.method}</p></div><div className="text-right"><p className="font-semibold">₹{(invoice.amount + invoice.gst).toLocaleString()}</p><p className={`text-[10px] ${invoice.status === "Paid" ? "text-[#16a34a]" : "text-[#ea580c]"}`}>{invoice.status}</p></div></div>)}
                  {billingTransactions.every((invoice) => invoice.studentName !== selectedStudent.name) && <p className="py-2 text-center text-[11px] text-[#737373]">No billing transactions recorded.</p>}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#d8d5e6] flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedStudent(null)}>
                Close
              </Button>
              <Link href="/conclusion">
                <Button size="sm" variant="primary">
                  Open Guidance Dossier
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. FOLLOW-UPS SECTION VIEW
// ==========================================

function FollowupsSectionView({ role }: { role: Role }) {
  const isCounsellor = role === "Counsellor";
  const [followups, setFollowups] = useState<typeof initialFollowups>(isCounsellor ? [] : initialFollowups);
  const [listView, setListView] = useState<"Today" | "Next Week" | "Next Month">("Today");
  const [reminderPopup, setReminderPopup] = useState<"Next Week" | "Next Month" | null>(null);
  const [newNote, setNewNote] = useState("");
  const [activeModalId, setActiveModalId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const byPeriod = followups.filter((item) => {
      if (listView === "Today") return item.status === "Due" || item.status === "Overdue" || item.dueDate === "Tomorrow";
      if (listView === "Next Week") return item.status === "Upcoming";
      return item.status !== "Completed";
    });
    return byPeriod;
  }, [followups, listView]);

  const todayCount = followups.filter((item) => item.status === "Due" || item.status === "Overdue" || item.dueDate === "Tomorrow").length;
  const weeklyCount = followups.filter((item) => item.status !== "Completed").length;

  useEffect(() => {
    const today = new Date();
    const daysUntilMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() - today.getDate();
    if (daysUntilMonthEnd <= 3) setReminderPopup("Next Month");
    else if (today.getDay() === 6) setReminderPopup("Next Week");
  }, []);

  const markComplete = (id: number) => {
    setFollowups(followups.map((f) => (f.id === id ? { ...f, status: "Completed" } : f)));
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard icon={ClipboardCheck} label="Today's Meetings" value={String(todayCount)} hint="Includes reminders for tomorrow's counselling sessions" highlight />
        <StatCard icon={Clock3} label="Weekly Meetings" value={String(weeklyCount)} hint="Pending actions for the current reminder cycle" />
      </div>

      <div className="flex flex-wrap gap-2">
        {(["Today", "Next Week", "Next Month"] as const).map((period) => <button key={period} type="button" onClick={() => setListView(period)} className={`rounded-full border px-3 py-1.5 text-xs ${listView === period ? "border-black bg-[#2c2159] text-white" : "border-[#d8d5e6] bg-white text-[#525252]"}`}>{period}&apos;s List</button>)}
      </div>

      <SectionPanel title={`${listView} Follow-up Action Items`} subtitle={listView === "Today" ? "Includes advance reminders for counselling sessions scheduled tomorrow" : "Automated follow-ups based on student intake preferences"}>
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-[8px] bg-white border border-[#d8d5e6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-[#171717]">{item.studentName}</span>
                  <span className="font-mono text-[10px] text-[#737373] bg-[#f6f3fb] px-2 py-0.5 rounded-full border border-[#d8d5e6]">
                    {item.program}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                      item.status === "Due"
                        ? "bg-amber-50 text-[#ea580c] border-amber-200"
                        : item.status === "Overdue"
                        ? "bg-red-50 text-[#ea580c] border-red-200"
                        : item.status === "Completed"
                        ? "bg-[#dcfce7] text-[#16a34a] border-[#bbf7d0]"
                        : "bg-[#f6f3fb] text-[#525252] border-[#d8d5e6]"
                    }`}
                  >
                    {item.status} ({item.dueDate})
                  </span>
                </div>
                <p className="text-xs text-[#525252]">{item.type} · Advisor: {item.counsellor}</p>
                <p className="text-xs text-[#737373] mt-1 bg-[#f6f3fb] p-2 rounded-[6px] border border-[#d8d5e6]">
                  Note: {item.note}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {item.status !== "Completed" && (
                  <Button size="sm" variant="outline" onClick={() => markComplete(item.id)} icon={<Check className="w-3.5 h-3.5 text-[#16a34a]" />}>
                    Mark Done
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => setActiveModalId(item.id)}>
                  Log Call
                </Button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="py-8 text-center text-xs text-[#737373]">
              {isCounsellor ? "No follow-up action items scheduled for your caseload." : "No follow-up actions in this list."}
            </p>
          )}
        </div>
      </SectionPanel>

      {reminderPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-[16px] border border-[#d8d5e6] bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-semibold uppercase tracking-wider text-[#3f2f7a]">Scheduled reminder</p><h3 className="mt-1 text-base font-semibold">{reminderPopup} follow-up list</h3><p className="mt-1 text-xs text-[#737373]">{reminderPopup === "Next Week" ? "Shown every Saturday so the coming week can be planned." : "Shown during the final three days of the month for next-month planning."}</p></div><button type="button" onClick={() => setReminderPopup(null)} className="rounded p-1 text-[#737373] hover:bg-[#f6f3fb]">✕</button></div>
            <div className="mt-4 space-y-2">{followups.filter((item) => item.status !== "Completed").map((item) => <div key={item.id} className="rounded-[8px] border border-[#d8d5e6] p-3 text-xs"><div className="flex justify-between gap-3"><span className="font-semibold">{item.studentName}</span><span className="text-[#737373]">{item.dueDate}</span></div><p className="mt-1 text-[#525252]">{item.type} · {item.counsellor}</p></div>)}</div>
            <div className="mt-5 flex justify-end"><Button size="sm" variant="primary" onClick={() => { setListView(reminderPopup); setReminderPopup(null); }}>Open Full List</Button></div>
          </div>
        </div>
      )}

      {/* Call Log Modal */}
      {activeModalId !== null && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[16px] border border-[#d8d5e6] max-w-md w-full p-6 shadow-xl">
            <h3 className="text-sm font-semibold text-[#171717] mb-1">Log Follow-up Call Notes</h3>
            <p className="text-xs text-[#737373] mb-4">Record outcomes from discussion with student/guardian.</p>

            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full rounded-[6px] border border-[#d8d5e6] p-2.5 text-xs text-[#171717] focus:outline-none focus:border-[#3f2f7a]"
              rows={3}
              placeholder="Enter session insights, parent feedback, or rescheduled time..."
            />

            <div className="mt-4 flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setActiveModalId(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  if (newNote.trim()) {
                    setFollowups(followups.map((f) => f.id === activeModalId ? { ...f, note: newNote } : f));
                  }
                  setActiveModalId(null);
                  setNewNote("");
                }}
              >
                Save Record
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 4. SESSIONS SECTION VIEW
// ==========================================

function BrainAdminSlotCalendar() {
  const modules = ["Ankur", "Palavi", "Lakshya", "Udaan", "Phoenix", "CMT"] as const;
  const availableDays = new Set([24, 25, 26, 28, 29, 30]);
  const slots = ["09:30 AM", "11:00 AM", "12:30 PM", "02:00 PM", "03:30 PM", "05:00 PM"];
  const [selectedDay, setSelectedDay] = useState<number | null>(24);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [studentName, setStudentName] = useState("");
  const [mode, setMode] = useState<"online" | "in_person">("online");
  const [module, setModule] = useState<(typeof modules)[number]>("Lakshya");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [counsellorId, setCounsellorId] = useState("");
  const [counsellors, setCounsellors] = useState<Array<{ id: string; fullName: string; title: string }>>([]);
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookings, setBookings] = useState<Record<string, string>>({
    "24-11:00 AM": "Siya Patil",
    "25-02:00 PM": "Vihaan Joshi",
  });
  const [confirmation, setConfirmation] = useState("");
  const leadingBlankDays = 2;
  const bookingKey = selectedDay && selectedTime ? `${selectedDay}-${selectedTime}` : "";

  useEffect(() => {
    let active = true;
    apiCall<Array<{ id: string; fullName: string; title: string }>>("/api/v1/counsellors")
      .then((data) => {
        if (!active) return;
        setCounsellors(data);
        setCounsellorId((current) => current || data[0]?.id || "");
      })
      .catch(() => { if (active) setBookingError("Counsellor list could not be loaded."); });
    return () => { active = false; };
  }, []);

  const bookSlot = async () => {
    if (!selectedDay || !selectedTime || !studentName.trim() || !email.trim() || !phone.trim() || !counsellorId || bookings[bookingKey]) return;
    setBooking(true);
    setBookingError("");
    try {
      const result = await apiCall<{ registrationFormNo: string }>("/api/v1/appointments/quick-book", {
        method: "POST",
        body: { studentName: studentName.trim(), email: email.trim(), phone: phone.trim(), mode, module, counsellorId, appointmentDate: `2026-09-${String(selectedDay).padStart(2, "0")}`, timeDisplay: selectedTime },
      });
      setBookings((current) => ({ ...current, [bookingKey]: studentName.trim() }));
      setConfirmation(`${studentName.trim()} booked for ${selectedDay} September 2026 at ${selectedTime}. Temporary registration ${result.registrationFormNo} created.`);
      setStudentName("");
      setEmail("");
      setPhone("");
      setSelectedTime(null);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : "The slot could not be booked.");
    } finally {
      setBooking(false);
    }
  };

  return (
    <div className="space-y-6">
      {confirmation && <div className="flex items-center gap-2 rounded-[8px] border border-[#bbf7d0] bg-[#dcfce7] p-3 text-xs text-[#16a34a]"><CheckCircle2 className="h-4 w-4" />{confirmation}</div>}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <SectionPanel title="Open Slot Calendar" subtitle="Select an available date to see its counselling times">
          <div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-semibold">September 2026</h3><span className="text-[10px] text-[#737373]">Pune Main Campus</span></div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold text-[#737373]">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(day => <div key={day} className="py-2">{day}</div>)}</div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: leadingBlankDays }).map((_, index) => <div key={`blank-${index}`} />)}
            {Array.from({ length: 30 }, (_, index) => index + 1).map(day => {
              const available = availableDays.has(day);
              return <button key={day} disabled={!available} onClick={() => { setSelectedDay(day); setSelectedTime(null); setConfirmation(""); }} className={`relative h-11 rounded-[6px] border text-xs ${selectedDay === day ? "border-black bg-[#2c2159] text-white" : available ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#171717] hover:border-[#16a34a]" : "cursor-not-allowed border-transparent text-[#c9c2e3]"}`}>
                {day}{available && <span className={`absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${selectedDay === day ? "bg-white" : "bg-[#16a34a]"}`} />}
              </button>;
            })}
          </div>
          <div className="mt-4 flex gap-4 text-[10px] text-[#737373]"><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-[#16a34a]" />Available</span><span className="flex items-center gap-1"><i className="h-2 w-2 rounded-full bg-[#c9c2e3]" />Unavailable</span></div>
        </SectionPanel>

        <SectionPanel title={selectedDay ? `${selectedDay} September · Available Times` : "Select a Date"} subtitle="Choose a time, then enter the student name">
          {selectedDay ? <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">{slots.map(time => {
              const bookedBy = bookings[`${selectedDay}-${time}`];
              return <button key={time} disabled={Boolean(bookedBy)} onClick={() => setSelectedTime(time)} className={`rounded-[8px] border p-2.5 text-left text-xs ${bookedBy ? "cursor-not-allowed border-[#d8d5e6] bg-[#f6f3fb] text-[#a3a3a3]" : selectedTime === time ? "border-black bg-[#2c2159] text-white" : "border-[#d8d5e6] hover:border-black"}`}><span className="block font-medium">{time}</span><span className="mt-0.5 block text-[9px]">{bookedBy ? `Booked · ${bookedBy}` : "Open slot"}</span></button>;
            })}</div>
            <div className="space-y-3 border-t border-[#d8d5e6] pt-4">
              <div><label className="mb-1 block text-[11px] font-medium text-[#525252]">Student name</label><input required value={studentName} onChange={(event) => setStudentName(event.target.value)} placeholder="Enter full name" className="h-9 w-full rounded-[6px] border border-[#d8d5e6] px-3 text-xs focus:border-[#3f2f7a] focus:outline-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="mb-1 block text-[11px] font-medium text-[#525252]">Mode</label><select value={mode} onChange={(event) => setMode(event.target.value as "online" | "in_person")} className="h-9 w-full rounded-[6px] border border-[#d8d5e6] bg-white px-3 text-xs focus:border-[#3f2f7a] focus:outline-none"><option value="online">Online</option><option value="in_person">Offline</option></select></div>
                <div><label className="mb-1 block text-[11px] font-medium text-[#525252]">Module</label><select value={module} onChange={(event) => setModule(event.target.value as (typeof modules)[number])} className="h-9 w-full rounded-[6px] border border-[#d8d5e6] bg-white px-3 text-xs focus:border-[#3f2f7a] focus:outline-none">{modules.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="mb-1 block text-[11px] font-medium text-[#525252]">Email</label><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="student@example.com" className="h-9 w-full rounded-[6px] border border-[#d8d5e6] px-3 text-xs focus:border-[#3f2f7a] focus:outline-none" /></div>
                <div><label className="mb-1 block text-[11px] font-medium text-[#525252]">Phone</label><input required type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Phone number" className="h-9 w-full rounded-[6px] border border-[#d8d5e6] px-3 text-xs focus:border-[#3f2f7a] focus:outline-none" /></div>
              </div>
              <div><label className="mb-1 block text-[11px] font-medium text-[#525252]">Counsellor</label><select required value={counsellorId} onChange={(event) => setCounsellorId(event.target.value)} className="h-9 w-full rounded-[6px] border border-[#d8d5e6] bg-white px-3 text-xs focus:border-[#3f2f7a] focus:outline-none"><option value="">Select counsellor</option>{counsellors.map((counsellor) => <option key={counsellor.id} value={counsellor.id}>{counsellor.fullName} · {counsellor.title}</option>)}</select></div>
              <p className="rounded-[6px] bg-[#f6f3fb] p-2 text-[10px] text-[#525252]">This creates a temporary student record. It becomes permanent automatically after the student registers and the fee is paid.</p>
              {bookingError && <p role="alert" className="text-xs text-red-600">{bookingError}</p>}
              <Button size="sm" variant="primary" fullWidth icon={<CalendarDays className="h-3.5 w-3.5" />} disabled={booking || !selectedTime || !studentName.trim() || !email.trim() || !phone.trim() || !counsellorId} onClick={() => void bookSlot()}>{booking ? "Booking…" : "Confirm Slot Booking"}</Button>
            </div>
          </div> : <p className="text-xs text-[#737373]">Select a green date from the calendar.</p>}
        </SectionPanel>
      </div>
    </div>
  );
}

function CounsellorSessionsView() {
  const [joined, setJoined] = useState("");
  const [sessions, setSessions] = useState<CounsellingSessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [updatingSessionId, setUpdatingSessionId] = useState("");

  useEffect(() => {
    let active = true;
    api.appointments.getSessions({ status: "upcoming" })
      .then((items) => { if (active) setSessions(items); })
      .catch((error) => {
        if (active) setLoadError(error instanceof Error ? error.message : "Sessions could not be loaded.");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const onlineCount = sessions.filter((session) => session.mode === "online").length;
  const offlineCount = sessions.filter((session) => session.mode === "in_person").length;

  const refreshSessions = async () => {
    setSessions(await api.appointments.getSessions({ status: "upcoming" }));
  };

  const startSession = async (session: CounsellingSessionItem) => {
    setUpdatingSessionId(session.appointmentId); setLoadError("");
    try {
      await api.appointments.startSession(session.appointmentId);
      setJoined(session.student.name);
      await refreshSessions();
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Session could not be started.");
    } finally { setUpdatingSessionId(""); }
  };

  const endSession = async (session: CounsellingSessionItem) => {
    setUpdatingSessionId(session.appointmentId); setLoadError("");
    try {
      await api.appointments.completeSession(session.appointmentId);
      setJoined("");
      await refreshSessions();
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Session could not be ended.");
    } finally { setUpdatingSessionId(""); }
  };

  return (
    <div className="space-y-6">
      {joined && (
        <div className="rounded-[8px] border border-[#bbf7d0] bg-[#dcfce7] p-3 text-xs text-[#16a34a]">
          Zoom meeting opened for {joined}.
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={CalendarDays} label="Scheduled Sessions" value={loading ? "…" : String(sessions.length)} hint={`${offlineCount} offline · ${onlineCount} online`} highlight />
        <StatCard icon={Video} label="Zoom Meetings" value={loading ? "…" : String(onlineCount)} hint="Online bookings" />
        <StatCard icon={MapPin} label="Offline Sessions" value={loading ? "…" : String(offlineCount)} hint="In-person bookings" />
      </div>
      <SectionPanel title="Counselling Schedule" subtitle="Start online Zoom meetings or prepare for offline counselling">
        {loading ? (
          <div className="py-8 text-center text-xs text-[#737373]">Loading scheduled sessions…</div>
        ) : loadError ? (
          <div className="py-8 text-center text-xs text-red-600">{loadError}</div>
        ) : sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div key={session.appointmentId} className="flex flex-col gap-3 rounded-[8px] border border-[#d8d5e6] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[#171717]">{session.student.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] ${session.mode === "online" ? "bg-[#f6f3fb] text-[#3f2f7a]" : "bg-[#f6f3fb] text-[#525252]"}`}>{session.mode === "online" ? "Online" : "Offline"}</span>
                  </div>
                  <p className="mt-1 text-[#525252]">{new Date(session.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {session.timeSlotDisplay}</p>
                  <p className="text-[10px] text-[#737373]">{session.programName || "Counselling"}{session.location ? ` · ${session.location}` : ""}</p>
                </div>
                <div className="flex items-center gap-2">
                  {session.mode === "in_person" && <Button size="sm" variant="outline" icon={<MapPin className="h-3.5 w-3.5" />}>View Room Details</Button>}
                  {session.status === "in_progress" ? (
                    <Button size="sm" variant="primary" disabled={updatingSessionId === session.appointmentId} onClick={() => void endSession(session)}>
                      {updatingSessionId === session.appointmentId ? "Ending…" : "End Session"}
                    </Button>
                  ) : (
                    <Button size="sm" variant="primary" icon={session.mode === "online" ? <Video className="h-3.5 w-3.5" /> : undefined} disabled={updatingSessionId === session.appointmentId} onClick={() => void startSession(session)}>
                      {updatingSessionId === session.appointmentId ? "Starting…" : session.mode === "online" ? "Start Online Session" : "Start Session"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-[#737373]">
            <CalendarDays className="w-8 h-8 text-[#9f98b9] mx-auto mb-2" />
            <p className="font-semibold text-[#171717]">No Sessions Scheduled</p>
            <p className="mt-1">You have no upcoming or today&apos;s counselling appointments assigned yet.</p>
          </div>
        )}
      </SectionPanel>
    </div>
  );
}

function CounsellorAIReviews() {
  const [reviews, setReviews] = useState<any[]>([]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={UsersRound} label="Mapped Students" value={String(reviews.length)} hint="With daily AI reviews" highlight />
        <StatCard icon={UserRound} label="Mapped Parents" value="0" hint="0 updates today" />
        <StatCard icon={AlertCircle} label="Needs Attention" value="0" hint="Low consistency or concern" />
      </div>
      <SectionPanel title="AI Reviews of Mapped Students & Parents" subtitle="Daily summaries generated from check-ins, actions and parent feedback">
        {reviews.length > 0 ? (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.student} className="grid gap-3 rounded-[8px] border border-[#d8d5e6] p-4 text-xs sm:grid-cols-[1.2fr_1fr_.6fr_1.5fr_.6fr] sm:items-center">
                <div>
                  <p className="font-semibold">{r.student}</p>
                  <p className="text-[10px] text-[#737373]">Student</p>
                </div>
                <div>
                  <p>{r.parent}</p>
                  <p className="text-[10px] text-[#737373]">Mapped parent</p>
                </div>
                <p className="font-semibold text-[#3f2f7a]">{r.score}</p>
                <p className="text-[#525252]">{r.review}</p>
                <span className={`w-fit rounded-full px-2 py-0.5 text-[10px] ${r.status === "Priority" ? "bg-red-50 text-red-600" : "bg-[#f6f3fb] text-[#525252]"}`}>{r.status}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-[#737373]">
            <Brain className="w-8 h-8 text-[#9f98b9] mx-auto mb-2" />
            <p className="font-semibold text-[#171717]">No AI Daily Reviews Available</p>
            <p className="mt-1">AI-generated summaries will appear here once assigned students and their parents submit daily wellness check-ins and action plans.</p>
          </div>
        )}
      </SectionPanel>
    </div>
  );
}

function CounsellorReviewHub({ initialTab = "ai" }: { initialTab?: "ai" | "conclusions" | "followups" }) {
  const [tab, setTab] = useState<"ai" | "conclusions" | "followups">(initialTab);
  const tabs = [
    { key: "ai" as const, label: "AI Review" },
    { key: "conclusions" as const, label: "Conclusions" },
    { key: "followups" as const, label: "Meetings" },
  ];
  return <div className="space-y-5">
    <div className="flex overflow-x-auto border-b border-[#d8d5e6]" role="tablist" aria-label="Counsellor review sections">
      {tabs.map((item) => <button key={item.key} type="button" role="tab" aria-selected={tab === item.key} onClick={() => setTab(item.key)} className={`whitespace-nowrap px-5 py-3 text-sm font-semibold ${tab === item.key ? "border-b-2 border-[#3f2f7a] text-[#3f2f7a]" : "text-[#737373] hover:text-[#171717]"}`}>{item.label}</button>)}
    </div>
    {tab === "ai" && <CounsellorAIReviews />}
    {tab === "conclusions" && <ConclusionsView role="Counsellor" />}
    {tab === "followups" && <FollowupsSectionView role="Counsellor" />}
  </div>;
}

function CounsellorTrackingView() {
  const [trackedStudents, setTrackedStudents] = useState<any[]>([]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard icon={UsersRound} label="Tracked Students" value={String(trackedStudents.length)} hint="Active caseload" highlight />
        <StatCard icon={TrendingUp} label="On Track" value="0" hint="0% of caseload" />
        <StatCard icon={AlertCircle} label="At Risk" value="0" hint="Needs intervention" />
        <StatCard icon={Clock3} label="Follow-ups Due" value="0" hint="Within 48 hours" />
      </div>
      <SectionPanel title="Counselling Student Tracking" subtitle="Progress, last contact, action completion and next follow-up">
        {trackedStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead>
                <tr className="border-b border-[#d8d5e6] text-[#737373]">
                  {["Student", "Module", "Progress", "Actions", "Last session", "Next follow-up", "Status"].map((h) => (
                    <th key={h} className="pb-2 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trackedStudents.map((s) => (
                  <tr key={s.id} className="border-b border-[#f6f3fb]">
                    <td className="py-3 pr-3 font-semibold">{s.name}</td>
                    <td className="py-3 pr-3">{s.program || "General"}</td>
                    <td className="py-3 pr-3">0%</td>
                    <td className="py-3 pr-3">0/0</td>
                    <td className="py-3 pr-3">—</td>
                    <td className="py-3 pr-3">—</td>
                    <td className="py-3 pr-3">Active</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-[#737373]">
            <TrendingUp className="w-8 h-8 text-[#9f98b9] mx-auto mb-2" />
            <p className="font-semibold text-[#171717]">No Students Being Tracked</p>
            <p className="mt-1">Tracking metrics, action completion, and follow-up cadence will populate once students are mapped to your caseload.</p>
          </div>
        )}
      </SectionPanel>
    </div>
  );
}

function SessionsSectionView({ role }: { role: Role }) {
  const [tab, setTab] = useState<"upcoming" | "completed">("upcoming");

  const filteredSessions = useMemo(() => {
    return tab === "upcoming"
      ? sessionsList.filter((s) => s.status !== "Completed")
      : sessionsList.filter((s) => s.status === "Completed");
  }, [tab]);

  if (role === "Brain Admin") return <BrainAdminSlotCalendar />;
  if (role === "Counsellor") return <CounsellorSessionsView />;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Video} label="Total Sessions" value="5" hint="Scheduled in calendar" />
        <StatCard icon={Calendar} label="In-Person (Pune)" value="3" hint="On-campus consultation" highlight />
        <StatCard icon={ExternalLink} label="Online Rooms" value="2" hint="Video conference links" />
      </div>

      <div className="p-4 rounded-[12px] bg-white border border-[#d8d5e6] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setTab("upcoming")}
            className={`px-3 py-1 text-xs rounded-full border transition-colors cursor-pointer ${
              tab === "upcoming" ? "bg-[#2c2159] text-white border-black" : "bg-white text-[#525252] border-[#d8d5e6] hover:bg-[#f6f3fb]"
            }`}
          >
            Upcoming Sessions ({sessionsList.filter((s) => s.status !== "Completed").length})
          </button>
          <button
            onClick={() => setTab("completed")}
            className={`px-3 py-1 text-xs rounded-full border transition-colors cursor-pointer ${
              tab === "completed" ? "bg-[#2c2159] text-white border-black" : "bg-white text-[#525252] border-[#d8d5e6] hover:bg-[#f6f3fb]"
            }`}
          >
            Completed Sessions ({sessionsList.filter((s) => s.status === "Completed").length})
          </button>
        </div>

        <Link href="/calendar">
          <Button size="sm" variant="outline" icon={<Plus className="w-3.5 h-3.5" />}>
            Book New Session
          </Button>
        </Link>
      </div>

      <SectionPanel title="Session Schedule" subtitle="1-on-1 counseling slot appointments">
        <div className="space-y-3">
          {filteredSessions.map((ses) => (
            <div
              key={ses.id}
              className="p-4 rounded-[8px] bg-white border border-[#d8d5e6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-[#171717]">{ses.studentName}</span>
                  <span className="font-mono text-[10px] text-[#737373] bg-[#f6f3fb] px-2 py-0.5 rounded-full border border-[#d8d5e6]">
                    {ses.program}
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#efeaf9] text-[#3f2f7a] border border-[#c9c2e3]">
                    {ses.mode}
                  </span>
                </div>
                <p className="text-xs text-[#525252] flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#737373]" /> {ses.date} · {ses.time}
                </p>
                <p className="text-xs text-[#737373] flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#737373]" /> {ses.location} (Counsellor: {ses.counsellor})
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/session">
                  <Button size="sm" variant="primary" icon={<Video className="w-3.5 h-3.5" />}>
                    Join Room
                  </Button>
                </Link>
                <Link href="/conclusion">
                  <Button size="sm" variant="outline">
                    Dossier
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </SectionPanel>
    </div>
  );
}

// ==========================================
// 5. REPORTS SECTION VIEW
// ==========================================

function ReportsSectionView() {
  const downloadCsv = () => {
    const rows = [
      ["Program", "Enrolled", "Revenue (INR)", "Avg Progress", "Completion Rate"],
      ["Ankur", "6", "8,994", "64%", "88%"],
      ["Palavi", "9", "17,991", "54%", "82%"],
      ["Lakshya", "14", "41,986", "72%", "94%"],
      ["Udaan", "4", "13,996", "40%", "78%"],
      ["Phoenix", "2", "11,998", "20%", "75%"],
      ["CMT", "7", "34,993", "81%", "96%"],
    ];
    const blob = new Blob([rows.map((row) => row.join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "brain-academic-program-analytics.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={UsersRound} label="Total Registrations" value="42" hint="Across all 6 programs" highlight />
        <StatCard icon={IndianRupee} label="Total Revenue" value="₹1.29L" hint="Collected via Razorpay" />
        <StatCard icon={TrendingUp} label="Avg Progress" value="68.4%" hint="+4.2% this quarter" />
        <StatCard icon={CheckCircle2} label="Completion Rate" value="91.2%" hint="Official sign-offs" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionPanel
          title="Program Revenue &amp; Distribution"
          subtitle="Breakdown across developmental stages"
          action={
            <Button size="sm" variant="outline" icon={<Download className="w-3.5 h-3.5" />} onClick={downloadCsv}>
              Export Analytics
            </Button>
          }
        >
          <div className="space-y-3">
            {[
              { name: "Lakshya (8th–10th)", count: 14, revenue: "₹41,986", pct: 33 },
              { name: "CMT (Career Transitions)", count: 7, revenue: "₹34,993", pct: 27 },
              { name: "Palavi (5th–7th)", count: 9, revenue: "₹17,991", pct: 14 },
              { name: "Udaan (11th–12th)", count: 4, revenue: "₹13,996", pct: 11 },
              { name: "Phoenix (Graduates)", count: 2, revenue: "₹11,998", pct: 9 },
              { name: "Ankur (KG–4th)", count: 6, revenue: "₹8,994", pct: 6 },
            ].map((p) => (
              <div key={p.name} className="p-2.5 rounded-[6px] border border-[#d8d5e6] bg-[#f6f3fb]">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-[#171717]">{p.name}</span>
                  <span className="font-medium text-[#171717]">{p.revenue} ({p.count} students)</span>
                </div>
                <div className="h-1.5 rounded-full bg-white border border-[#d8d5e6] overflow-hidden">
                  <div className="h-full bg-[#3f2f7a]" style={{ width: `${p.pct * 3}%` }} />
                </div>
              </div>
            ))}
          </div>
        </SectionPanel>

        <SectionPanel title="Pre-generated Export Reports" subtitle="Download official audit logs and summary sheets">
          <div className="space-y-3">
            {[
              { title: "Quarterly Comprehensive Intake Audit", size: "248 KB · PDF", desc: "Full breakdown of parent satisfaction, test metrics, and session frequencies." },
              { title: "Fee Ledger & Razorpay Reconciliation", size: "112 KB · CSV", desc: "Line-by-line financial audit with transaction IDs and GST breakdowns." },
              { title: "Counsellor Caseload & Session Log", size: "94 KB · PDF", desc: "Summary of hours logged, diagnostic notes signed, and milestone reviews." },
            ].map((r) => (
              <div key={r.title} className="p-3.5 rounded-[8px] bg-[#f6f3fb] border border-[#d8d5e6] flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-xs text-[#171717]">{r.title}</p>
                  <p className="text-[11px] text-[#737373]">{r.desc}</p>
                  <span className="text-[10px] text-[#3f2f7a] font-mono mt-1 block">{r.size}</span>
                </div>
                <Button size="sm" variant="outline" icon={<Download className="w-3.5 h-3.5" />} onClick={downloadCsv}>
                  Export
                </Button>
              </div>
            ))}
          </div>
        </SectionPanel>
      </div>
    </div>
  );
}

// ==========================================
// 6. INQUIRIES SECTION VIEW
// ==========================================

function InquiriesSectionView() {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [assignModalItem, setAssignModalItem] = useState<typeof initialInquiries[0] | null>(null);
  const [selectedCounsellor, setSelectedCounsellor] = useState("");
  const [counsellorOptions, setCounsellorOptions] = useState<any[]>([]);

  useEffect(() => {
    api.counsellors.list()
      .then((list) => {
        setCounsellorOptions(list || []);
        if (list && list.length > 0) setSelectedCounsellor(list[0].fullName);
      })
      .catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchSearch =
        inq.name.toLowerCase().includes(search.toLowerCase()) ||
        inq.parentName.toLowerCase().includes(search.toLowerCase()) ||
        inq.phone.includes(search) ||
        inq.id.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "All" || inq.status === filter;
      return matchSearch && matchFilter;
    });
  }, [inquiries, filter, search]);

  const handleAssign = () => {
    if (assignModalItem) {
      setInquiries((prev) =>
        prev.map((item) =>
          item.id === assignModalItem.id
            ? { ...item, counsellor: selectedCounsellor, status: "Diagnostic Scheduled" }
            : item
        )
      );
      setAssignModalItem(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Inbox} label="Total Inquiries" value={inquiries.length.toString()} hint="Received this month" highlight />
        <StatCard
          icon={AlertCircle}
          label="Unassigned / New"
          value={inquiries.filter((i) => i.counsellor === "Unassigned").length.toString()}
          hint="Requires quick assignment"
        />
        <StatCard icon={CheckCircle2} label="Converted" value="18" hint="78.2% conversion rate" />
        <StatCard icon={Clock} label="Avg SLA Response" value="2.4 hrs" hint="Target < 4.0 hrs" />
      </div>

      <div className="p-4 rounded-[12px] bg-white border border-[#d8d5e6] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-[#737373] absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by candidate, parent, phone or ID..."
            className="w-full h-8 pl-8 pr-3 text-xs bg-white border border-[#d8d5e6] rounded-[6px] text-[#171717] focus:outline-none focus:border-[#3f2f7a]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {["All", "New", "Contacted", "Diagnostic Scheduled", "Converted"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors whitespace-nowrap cursor-pointer ${
                filter === s
                  ? "bg-[#2c2159] text-white border-black font-medium"
                  : "bg-white text-[#525252] border-[#d8d5e6] hover:bg-[#f6f3fb]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <SectionPanel
        title={`Intake Queue (${filtered.length})`}
        subtitle="Unassigned inquiries and prospective candidate triage"
        action={
          <Link href="/counselling/inquiry">
            <Button size="sm" variant="outline" icon={<Plus className="w-3.5 h-3.5" />}>
              Manual Intake Form
            </Button>
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-xs">
            <thead>
              <tr className="text-[#737373] border-b border-[#d8d5e6]">
                {["Inquiry ID & Candidate", "Parent / Contact", "Grade & Track", "Source", "Assigned To", "Status", "Actions"].map((h) => (
                  <th key={h} className="pb-2.5 font-semibold text-[11px] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((inq) => (
                <tr key={inq.id} className="border-b border-[#f6f3fb] hover:bg-[#f6f3fb]/60 transition-colors">
                  <td className="py-3">
                    <p className="font-semibold text-[#171717]">{inq.name}</p>
                    <p className="text-[10px] text-[#737373]">{inq.id} · {inq.date}</p>
                  </td>
                  <td>
                    <p className="text-[#171717]">{inq.parentName}</p>
                    <p className="text-[10px] text-[#737373]">{inq.phone}</p>
                  </td>
                  <td>
                    <p className="text-[#171717]">{inq.grade}</p>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-[#f6f3fb] border border-[#d8d5e6] text-[#171717]">
                      {inq.targetTrack}
                    </span>
                  </td>
                  <td className="text-[#525252] text-[11px]">{inq.source}</td>
                  <td>
                    <span
                      className={`text-[11px] font-medium ${
                        inq.counsellor === "Unassigned" ? "text-[#ea580c]" : "text-[#171717]"
                      }`}
                    >
                      {inq.counsellor}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                        inq.status === "New"
                          ? "bg-[#efeaf9] text-[#3f2f7a] border-[#c9c2e3]"
                          : inq.status === "Converted"
                          ? "bg-[#dcfce7] text-[#16a34a] border-[#bbf7d0]"
                          : inq.status === "Diagnostic Scheduled"
                          ? "bg-[#fff1f0] text-[#e2231a] border-[#f4b4b0]"
                          : "bg-amber-50 text-[#ea580c] border-amber-200"
                      }`}
                    >
                      {inq.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedCounsellor(inq.counsellor === "Unassigned" ? (counsellorOptions[0]?.fullName || "") : inq.counsellor);
                          setAssignModalItem(inq);
                        }}
                      >
                        {inq.counsellor === "Unassigned" ? "Assign" : "Reassign"}
                      </Button>
                      <a
                        href={`tel:${inq.phone.replace(/[^0-9+]/g, "")}`}
                        className="p-1.5 rounded-[6px] border border-[#d8d5e6] hover:bg-[#f6f3fb] text-[#525252]"
                        title="Call Parent"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionPanel>

      {/* Assign Counsellor Modal */}
      {assignModalItem && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[16px] border border-[#d8d5e6] max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-start border-b border-[#d8d5e6] pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono text-[#737373] uppercase">{assignModalItem.id}</span>
                <h3 className="text-sm font-semibold text-[#171717]">Assign Lead to Mentor</h3>
                <p className="text-xs text-[#737373]">{assignModalItem.name} · {assignModalItem.targetTrack} Track</p>
              </div>
              <button
                onClick={() => setAssignModalItem(null)}
                className="p-1.5 rounded-[6px] hover:bg-[#f6f3fb] text-[#737373]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-[#737373] mb-1">
                  Select Certified Advisor
                </label>
                <select
                  value={selectedCounsellor}
                  onChange={(e) => setSelectedCounsellor(e.target.value)}
                  className="w-full h-9 rounded-[6px] border border-[#d8d5e6] px-2.5 text-xs text-[#171717] bg-white focus:outline-none focus:border-[#3f2f7a]"
                >
                  {counsellorOptions.length === 0 ? (
                    <option value="">No counsellors registered (Add via SuperAdmin)</option>
                  ) : (
                    counsellorOptions.map((c) => (
                      <option key={c.id} value={c.fullName}>
                        {c.fullName} ({c.title || "Counsellor"})
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="p-3 rounded-[6px] bg-[#f6f3fb] border border-[#d8d5e6] space-y-1">
                <p className="font-medium text-[#171717]">Lead Information</p>
                <p className="text-[#525252]">Parent: {assignModalItem.parentName} ({assignModalItem.phone})</p>
                <p className="text-[#525252]">Source: {assignModalItem.source}</p>
                <p className="text-[#525252]">Target: {assignModalItem.grade}</p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#d8d5e6] flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setAssignModalItem(null)}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" onClick={handleAssign}>
                Confirm Assignment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 7. ASSESSMENTS SECTION VIEW
// ==========================================

function AssessmentsSectionView({ role }: { role: Role }) {
  const isStudentOrParent = role === "Student" || role === "Parent";
  const [activeTab, setActiveTab] = useState<"batteries" | "submissions">("batteries");
  const [selectedBattery, setSelectedBattery] = useState<typeof initialAssessments[0] | null>(null);
  const [assignedToast, setAssignedToast] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BookOpen} label="Total Assessments" value="184" hint="Completed tests" highlight />
        <StatCard icon={Clock3} label="Pending Review" value="8" hint="Awaiting evaluation" />
        <StatCard icon={TrendingUp} label="Avg Aptitude Score" value="76.8%" hint="Across cohorts" />
        <StatCard icon={Award} label="Top Match Stream" value="STEM & Design" hint="62% affinity" />
      </div>

      {assignedToast && (
        <div className="p-3.5 rounded-[8px] bg-[#dcfce7] border border-[#bbf7d0] text-xs text-[#16a34a] flex items-center justify-between animate-fade-in">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4" /> Assessment battery assigned successfully. Notification sent to student portal.
          </span>
          <button onClick={() => setAssignedToast(false)} className="text-[#16a34a] hover:underline text-[11px]">
            Dismiss
          </button>
        </div>
      )}

      {/* Battery Overview Cards */}
      <SectionPanel
        title="Diagnostic & Psychometric Batteries"
        subtitle="Standardized psychological and career benchmarking batteries"
        action={
          !isStudentOrParent ? (
            <Button
              size="sm"
              variant="outline"
              icon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => {
                setAssignedToast(true);
                setTimeout(() => setAssignedToast(false), 4000);
              }}
            >
              Assign Battery to Student
            </Button>
          ) : undefined
        }
      >
        <div className="grid gap-4 md:grid-cols-2">
          {initialAssessments.map((bat) => (
            <div
              key={bat.id}
              className="p-4 rounded-[10px] bg-white border border-[#d8d5e6] hover:border-[#a3a3a3] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-full bg-[#2c2159] text-white">
                      {bat.code}
                    </span>
                    <span className="text-[11px] font-medium text-[#3f2f7a]">{bat.duration}</span>
                  </div>
                  <span className="text-[10px] text-[#737373]">{bat.questions} Items</span>
                </div>

                <h3 className="font-semibold text-sm text-[#171717]">{bat.title}</h3>
                <p className="text-xs text-[#525252] mt-1">{bat.focus}</p>
                <p className="text-[11px] text-[#16a34a] mt-2 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> {bat.validity}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#f6f3fb] flex justify-between items-center">
                <button
                  onClick={() => setSelectedBattery(bat)}
                  className="text-xs font-medium text-[#171717] hover:underline cursor-pointer flex items-center gap-1"
                >
                  View Matrix Details →
                </button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setAssignedToast(true);
                    setTimeout(() => setAssignedToast(false), 4000);
                  }}
                >
                  {isStudentOrParent ? "Start Test" : "Assign"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </SectionPanel>

      {/* Evaluated Student Submissions */}
      <SectionPanel
        title="Student Diagnostic Results & Score Matrix"
        subtitle="Recent psychometric test evaluations and stream affinities"
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead>
              <tr className="text-[#737373] border-b border-[#d8d5e6]">
                {["Candidate", "Battery", "Score / Percentile", "Dominant Area", "Date Evaluated", "Advisor", "Report"].map((h) => (
                  <th key={h} className="pb-2.5 font-semibold text-[11px] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {assessmentSubmissions.map((asg) => (
                <tr key={asg.id} className="border-b border-[#f6f3fb] hover:bg-[#f6f3fb]/60 transition-colors">
                  <td className="py-3">
                    <p className="font-semibold text-[#171717]">{asg.studentName}</p>
                    <p className="text-[10px] text-[#737373]">{asg.studentId}</p>
                  </td>
                  <td>
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-[#f6f3fb] border border-[#d8d5e6] text-[#171717]">
                      {asg.battery}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`text-[11px] font-semibold ${
                        asg.score.includes("Percentile") ? "text-[#16a34a]" : "text-[#ea580c]"
                      }`}
                    >
                      {asg.score}
                    </span>
                  </td>
                  <td className="text-[#525252]">{asg.dominantArea}</td>
                  <td className="text-[#737373] text-[11px]">{asg.date}</td>
                  <td className="text-[#525252]">{asg.counsellor}</td>
                  <td>
                    <Link href="/conclusion">
                      <Button size="sm" variant="outline" icon={<Download className="w-3 h-3" />}>
                        Dossier
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionPanel>

      {/* Battery Detail Modal */}
      {selectedBattery && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[16px] border border-[#d8d5e6] max-w-lg w-full p-6 shadow-xl">
            <div className="flex justify-between items-start border-b border-[#d8d5e6] pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono text-[#737373] uppercase">{selectedBattery.code}</span>
                <h3 className="text-base font-semibold text-[#171717]">{selectedBattery.title}</h3>
                <p className="text-xs text-[#737373]">{selectedBattery.duration} · {selectedBattery.questions} Questions</p>
              </div>
              <button
                onClick={() => setSelectedBattery(null)}
                className="p-1.5 rounded-[6px] hover:bg-[#f6f3fb] text-[#737373]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-[8px] bg-[#f6f3fb] border border-[#d8d5e6] space-y-1.5">
                <p className="font-semibold text-[#171717]">Psychometric Dimensions Measured</p>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#525252] mt-2">
                  <span className="p-2 rounded bg-white border border-[#d8d5e6]">Spatial Reasoning</span>
                  <span className="p-2 rounded bg-white border border-[#d8d5e6]">Numerical Fluency</span>
                  <span className="p-2 rounded bg-white border border-[#d8d5e6]">Verbal Deduction</span>
                  <span className="p-2 rounded bg-white border border-[#d8d5e6]">Cognitive Retention</span>
                </div>
              </div>

              <div className="p-3 rounded-[8px] border border-[#d8d5e6] space-y-1">
                <p className="font-medium text-[#171717]">Validity &amp; Standardization</p>
                <p className="text-[#525252]">{selectedBattery.validity}</p>
                <p className="text-[11px] text-[#737373]">Norms adapted for CBSE, ICSE, and Maharashtra State Board curriculums.</p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#d8d5e6] flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedBattery(null)}>
                Close
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  setSelectedBattery(null);
                  setAssignedToast(true);
                  setTimeout(() => setAssignedToast(false), 4000);
                }}
              >
                Assign Battery
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 8. BILLING & INVOICES SECTION VIEW
// ==========================================

function BillingSectionView({ role }: { role: Role }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<typeof billingTransactions[0] | null>(null);

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return billingTransactions;

    return billingTransactions.filter((invoice) =>
      [invoice.studentName, invoice.studentId, invoice.id].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      <SectionPanel
        title={`Billing Ledger & Invoices (${filtered.length})`}
        subtitle="Official fee receipts, payment gateways and tax breakdown"
        action={
          <Button
            size="sm"
            variant="outline"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={() => {
              const rows = [
                ["Invoice No", "Student Name", "Student ID", "Program", "Base Fee", "GST (18%)", "Total (INR)", "Razorpay ID", "Status"],
                ...billingTransactions.map((b) => [b.id, b.studentName, b.studentId, b.program, b.amount, b.gst, b.amount + b.gst, b.razorpayId, b.status]),
              ];
              const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "brain-billing-tax-ledger.csv";
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export Ledger
          </Button>
        }
      >
        <div className="relative mb-4 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#737373]" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by name, form no. or invoice no."
            aria-label="Search invoices by name, form number, or invoice number"
            className="w-full rounded-[8px] border border-[#d8d5e6] bg-white py-2 pl-9 pr-3 text-sm text-[#171717] outline-none transition-colors placeholder:text-[#a3a3a3] focus:border-[#2c2159] focus:ring-2 focus:ring-[#2c2159]/10"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-xs">
            <thead>
              <tr className="text-[#737373] border-b border-[#d8d5e6]">
                {["Invoice No", "Student", "Program", "Amount (INR)", "Gateway Reference", "Payment Method", "Status", "Receipt"].map((h) => (
                  <th key={h} className="pb-2.5 font-semibold text-[11px] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx) => (
                <tr key={tx.id} className="border-b border-[#f6f3fb] hover:bg-[#f6f3fb]/60 transition-colors">
                  <td className="py-3 font-mono font-medium text-[#171717]">{tx.id}</td>
                  <td>
                    <p className="font-semibold text-[#171717]">{tx.studentName}</p>
                    <p className="text-[10px] text-[#737373]">{tx.studentId}</p>
                  </td>
                  <td className="text-[#525252]">{tx.program}</td>
                  <td>
                    <p className="font-semibold text-[#171717]">₹{(tx.amount + tx.gst).toLocaleString()}</p>
                    <p className="text-[10px] text-[#737373]">Base: ₹{tx.amount} + GST ₹{tx.gst}</p>
                  </td>
                  <td className="font-mono text-[11px] text-[#737373]">{tx.razorpayId}</td>
                  <td className="text-[#525252] text-[11px]">{tx.method}</td>
                  <td>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                        tx.status === "Paid"
                          ? "bg-[#dcfce7] text-[#16a34a] border-[#bbf7d0]"
                          : "bg-amber-50 text-[#ea580c] border-amber-200"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedInvoice(tx)}
                      className="px-2.5 py-1 text-xs rounded-[6px] border border-[#d8d5e6] hover:bg-black hover:text-white transition-colors cursor-pointer"
                    >
                      View Receipt
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-sm text-[#737373]">
                    No invoices match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionPanel>

      {/* Printable Receipt Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[16px] border border-[#d8d5e6] max-w-lg w-full p-6 shadow-xl relative">
            <div className="flex justify-between items-start border-b border-[#d8d5e6] pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-[#2c2159]" />
                  <h3 className="text-base font-bold text-[#171717]">BRAIN CAREER COUNSELING</h3>
                </div>
                <p className="text-[11px] text-[#737373]">GSTIN: 27AABCB2219P1ZU · Pune, Maharashtra</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1.5 rounded-[6px] hover:bg-[#f6f3fb] text-[#737373]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between p-3 rounded-[8px] bg-[#f6f3fb] border border-[#d8d5e6]">
                <div>
                  <p className="text-[10px] text-[#737373] uppercase font-semibold">Billed To</p>
                  <p className="font-semibold text-[#171717]">{selectedInvoice.studentName}</p>
                  <p className="text-[#525252]">{selectedInvoice.studentId}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-[#737373] uppercase font-semibold">Receipt No</p>
                  <p className="font-mono font-semibold text-[#171717]">{selectedInvoice.id}</p>
                  <p className="text-[#737373]">{selectedInvoice.date}</p>
                </div>
              </div>

              <div className="border border-[#d8d5e6] rounded-[8px] overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f6f3fb] border-b border-[#d8d5e6]">
                    <tr>
                      <th className="p-2.5 font-semibold text-[#737373]">Service Description</th>
                      <th className="p-2.5 text-right font-semibold text-[#737373]">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#f6f3fb]">
                      <td className="p-2.5">
                        <p className="font-medium text-[#171717]">{selectedInvoice.program} Guidance Module</p>
                        <p className="text-[10px] text-[#737373]">Psychometric battery, 1-on-1 counseling &amp; parent review</p>
                      </td>
                      <td className="p-2.5 text-right font-medium text-[#171717]">₹{selectedInvoice.amount.toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-[#f6f3fb] text-[#525252]">
                      <td className="p-2.5">CGST (9%)</td>
                      <td className="p-2.5 text-right">₹{(selectedInvoice.gst / 2).toLocaleString()}</td>
                    </tr>
                    <tr className="border-b border-[#f6f3fb] text-[#525252]">
                      <td className="p-2.5">SGST (9%)</td>
                      <td className="p-2.5 text-right">₹{(selectedInvoice.gst / 2).toLocaleString()}</td>
                    </tr>
                    <tr className="bg-[#fcfcfc] font-bold text-[#171717]">
                      <td className="p-2.5">Total Paid</td>
                      <td className="p-2.5 text-right text-sm">₹{(selectedInvoice.amount + selectedInvoice.gst).toLocaleString()}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-2.5 rounded-[6px] bg-[#f6f3fb] border border-[#d8d5e6] text-[11px] text-[#525252] flex justify-between">
                <span>Gateway Ref: <strong className="font-mono text-[#171717]">{selectedInvoice.razorpayId}</strong></span>
                <span>Status: <strong className="text-[#16a34a]">{selectedInvoice.status}</strong></span>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#d8d5e6] flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setSelectedInvoice(null)}>
                Close
              </Button>
              <Button
                size="sm"
                variant="primary"
                icon={<Printer className="w-3.5 h-3.5" />}
                onClick={() => window.print()}
              >
                Print Receipt
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 9. SETTINGS & PROFILE SECTION VIEW
// ==========================================

function DailyPlanView({ todos, setTodos }: { todos: Todo[]; setTodos: (todos: Todo[]) => void }) {
  const [newTask, setNewTask] = useState("");
  const addTask = () => {
    if (!newTask.trim()) return;
    setTodos([...todos, { id: Date.now(), text: newTask.trim(), done: false, due: "Today" }]);
    setNewTask("");
  };
  return <div className="max-w-4xl space-y-6">
    <SectionPanel title="Today’s Action Plan" subtitle="Create actions from your counsellor’s advice and track them daily">
      <div className="flex gap-2 mb-4"><input value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTask()} placeholder="Add a new action for today…" className="h-9 flex-1 rounded-[6px] border border-[#d8d5e6] px-3 text-xs focus:outline-none focus:border-[#3f2f7a]"/><Button size="sm" variant="primary" icon={<Plus className="h-3.5 w-3.5" />} onClick={addTask}>Add Action</Button></div>
      <div className="space-y-2">{todos.map((todo) => <label key={todo.id} className="flex items-center gap-3 rounded-[8px] border border-[#d8d5e6] p-3 text-xs"><input type="checkbox" checked={todo.done} onChange={() => setTodos(todos.map((item) => item.id === todo.id ? {...item, done: !item.done} : item))} className="accent-black"/><span className={`flex-1 ${todo.done ? "line-through text-[#a3a3a3]" : "text-[#171717]"}`}>{todo.text}</span><span className={`rounded-full px-2 py-0.5 text-[10px] ${todo.done ? "bg-[#dcfce7] text-[#16a34a]" : "bg-amber-50 text-[#ea580c]"}`}>{todo.done ? "True · complete" : "False · pending"}</span></label>)}</div>
    </SectionPanel>
  </div>;
}

function ConclusionsView({ role }: { role: Role }) {
  const [saved, setSaved] = useState(false);
  const [students, setStudents] = useState<Array<{ id: string; name: string; inquiryId: string }>>([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [studyImprovement, setStudyImprovement] = useState("");
  const [regularImprovement, setRegularImprovement] = useState("");
  const [advice, setAdvice] = useState<null | { studyImprovement: string; regularImprovement: string; counsellorName: string; conclusionDate: string }>(null);
  const [loading, setLoading] = useState(role !== "Counsellor");
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (role === "Counsellor") {
      apiCall<Array<{ id: string; name: string; inquiryId: string }>>("/api/v1/student-portal/mapped")
        .then((data) => {
          const list = Array.isArray(data) ? data : [];
          setStudents(list);
          if (list.length > 0) setSelectedStudentId(list[0].id);
        })
        .catch(() => setStudents([]));
    } else if (role === "Student") {
      apiCall<null | { studyImprovement: string; regularImprovement: string; counsellorName: string; conclusionDate: string }>("/api/v1/student-portal/advice/latest")
        .then(setAdvice)
        .catch(() => setError("Counsellor advice could not be loaded."))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [role]);

  const publishAdvice = async () => {
    const student = students.find((item) => item.id === selectedStudentId);
    if (!student || !studyImprovement.trim() || !regularImprovement.trim()) {
      setError("Select a student and complete both advice fields.");
      return;
    }
    setPublishing(true);
    setError("");
    try {
      await api.conclusions.create({
        inquiryId: student.inquiryId,
        sessionSummary: studyImprovement.trim(),
        observations: regularImprovement.trim(),
        recommendations: regularImprovement.trim(),
        counsellorSignatureName: "Counsellor",
        actionItems: [],
      });
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Advice could not be published.");
    } finally {
      setPublishing(false);
    }
  };

  if (role !== "Counsellor") {
    return (
      <div className="max-w-4xl space-y-6">
        <SectionPanel title="Latest Counselling Conclusion" subtitle={advice ? `Shared by ${advice.counsellorName} · ${new Date(advice.conclusionDate).toLocaleDateString()}` : "Shared by your assigned counsellor"}>
          {loading ? <p className="text-xs text-[#737373]">Loading counsellor advice…</p> : error ? <p className="text-xs text-red-600">{error}</p> : advice ? <div className="grid gap-4 md:grid-cols-2 text-xs">
            <div className="rounded-[8px] border border-[#d8d5e6] p-4">
              <p className="font-semibold">Study behaviour improvement</p>
              <p className="mt-2 whitespace-pre-wrap text-[#525252]">{advice.studyImprovement}</p>
            </div>
            <div className="rounded-[8px] border border-[#d8d5e6] p-4">
              <p className="font-semibold">Regular behaviour improvement</p>
              <p className="mt-2 whitespace-pre-wrap text-[#525252]">{advice.regularImprovement}</p>
            </div>
          </div> : <p className="text-xs text-[#737373]">Your counsellor has not published advice yet.</p>}
        </SectionPanel>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <SectionPanel title="Record Session Conclusion" subtitle="Two feeds are published to the mapped student and parent portals">
        <div className="space-y-4 text-xs">
          {students.length > 0 ? (
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="h-9 w-full rounded-[6px] border border-[#d8d5e6] px-3 bg-white"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} · {s.id}
                </option>
              ))}
            </select>
          ) : (
            <div className="rounded-[8px] border border-[#d8d5e6] bg-[#f6f3fb] p-3 text-xs text-[#737373]">
              No students are currently mapped to your caseload. Conclusions can be published after students are assigned by Admin.
            </div>
          )}
          <div>
            <label className="mb-1 block font-medium">Study behaviour improvement</label>
            <textarea rows={4} value={studyImprovement} onChange={(e) => { setStudyImprovement(e.target.value); setSaved(false); }} className="w-full rounded-[6px] border border-[#d8d5e6] p-3" placeholder="Academic habits, study plan and learning recommendations…" />
          </div>
          <div>
            <label className="mb-1 block font-medium">Regular behaviour improvement</label>
            <textarea rows={4} value={regularImprovement} onChange={(e) => { setRegularImprovement(e.target.value); setSaved(false); }} className="w-full rounded-[6px] border border-[#d8d5e6] p-3" placeholder="Routine, confidence, wellbeing and everyday behaviour…" />
          </div>
          <Button
            size="sm"
            variant="primary"
            disabled={students.length === 0 || publishing}
            onClick={() => void publishAdvice()}
          >
            {publishing ? "Publishing…" : saved ? "Published to student portal ✓" : "Publish Conclusion"}
          </Button>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </SectionPanel>
    </div>
  );
}

function AccessControlView() {
  const [adminForm, setAdminForm] = useState({ name: "", email: "", password: "" });
  const [creatingAdmin, setCreatingAdmin] = useState(false);
  const [notice, setNotice] = useState("");
  const [errorNotice, setErrorNotice] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = () => {
    setLoading(true);
    apiCall<any[]>("/api/v1/admin/users")
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to load users", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleFreeze = async (userId: string, userName: string, isFrozen: boolean) => {
    try {
      await apiCall(`/api/v1/admin/users/${userId}/freeze`, { method: "PATCH" });
      setNotice(`User access ${isFrozen ? "restored" : "frozen"} for ${userName}.`);
      loadUsers();
    } catch (err: any) {
      setErrorNotice(err.message || "Failed to update user status");
    }
  };

  const createBrainAdmin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (creatingAdmin) return;
    setCreatingAdmin(true);
    setNotice("");
    setErrorNotice("");
    try {
      const created = await apiCall<{ email: string }>("/api/v1/admin/users", {
        method: "POST",
        body: JSON.stringify({ ...adminForm, role: "Brain Admin" }),
      });
      setNotice(`Brain Admin workspace access created for ${created.email}. They can sign in with the password you provided.`);
      setAdminForm({ name: "", email: "", password: "" });
      loadUsers();
    } catch (err: any) {
      setErrorNotice(err.message || "Failed to create Brain Admin credentials");
    } finally {
      setCreatingAdmin(false);
    }
  };

  const removeUser = async (userId: string, userName: string) => {
    if (!window.confirm(`Are you sure you want to remove user access for "${userName}"?`)) return;
    try {
      await apiCall(`/api/v1/admin/users/${userId}`, { method: "DELETE" });
      setNotice(`User access removed for ${userName}.`);
      loadUsers();
    } catch (err: any) {
      setErrorNotice(err.message || "Failed to remove user");
    }
  };

  return (
    <div className="space-y-6">

      {notice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-[8px] flex items-center justify-between">
          <span className="font-medium">{notice}</span>
          <button onClick={() => setNotice("")} className="font-bold text-emerald-900 hover:opacity-75">×</button>
        </div>
      )}

      {errorNotice && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-[8px] flex items-center justify-between">
          <span className="font-medium">{errorNotice}</span>
          <button onClick={() => setErrorNotice("")} className="font-bold text-red-900 hover:opacity-75">×</button>
        </div>
      )}

      <SectionPanel title="Create Brain Admin Workspace" subtitle="Create login credentials for an administrator in your organization.">
        <form onSubmit={createBrainAdmin} className="space-y-4 text-xs">
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="space-y-1 font-medium">
              <span>Full name</span>
              <input required value={adminForm.name} onChange={(event) => setAdminForm({ ...adminForm, name: event.target.value })} className="w-full rounded-[6px] border border-[#d8d5e6] p-3" autoComplete="name" />
            </label>
            <label className="space-y-1 font-medium">
              <span>Login email</span>
              <input required type="email" value={adminForm.email} onChange={(event) => setAdminForm({ ...adminForm, email: event.target.value })} className="w-full rounded-[6px] border border-[#d8d5e6] p-3" autoComplete="off" />
            </label>
            <label className="space-y-1 font-medium">
              <span>Password</span>
              <input required type="password" minLength={8} maxLength={72} value={adminForm.password} onChange={(event) => setAdminForm({ ...adminForm, password: event.target.value })} className="w-full rounded-[6px] border border-[#d8d5e6] p-3" autoComplete="new-password" />
            </label>
          </div>
          <Button type="submit" size="sm" variant="primary" disabled={creatingAdmin}>
            {creatingAdmin ? "Creating..." : "Create Brain Admin Credentials"}
          </Button>
        </form>
      </SectionPanel>

      <SectionPanel title="User Access">
        {loading ? (
          <div className="py-8 text-center text-xs text-[#737373]">Loading user credentials from database…</div>
        ) : users.length > 0 ? (
          <div className="space-y-2 text-xs">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex flex-col gap-3 rounded-[8px] border border-[#d8d5e6] p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{user.name}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] ${
                        user.frozen
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-[#dcfce7] text-[#16a34a] border border-[#bbf7d0]"
                      }`}
                    >
                      {user.frozen ? "Frozen" : "Active"}
                    </span>
                  </div>
                  <p className="text-[#737373] mt-0.5">
                    {user.role} · {user.email}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleFreeze(user.id, user.name, user.frozen)}
                  >
                    {user.frozen ? "Restore" : "Freeze"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeUser(user.id, user.name)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-[#737373]">
            No user access records found in database.
          </div>
        )}
      </SectionPanel>
    </div>
  );
}

function AuditLogView() {
  const [roleFilter, setRoleFilter] = useState("All");
  const [data, setData] = useState<{ stats: { all: number; counsellor: number; admin: number; studentParent: number }; events: any[] }>({
    stats: { all: 0, counsellor: 0, admin: 0, studentParent: 0 },
    events: [],
  });
  const [loading, setLoading] = useState(true);

  const loadLogs = () => {
    setLoading(true);
    apiCall<{ stats: any; events: any[] }>("/api/v1/admin/audit-logs")
      .then((res) => {
        if (res) setData(res);
      })
      .catch((err) => console.error("Failed to load audit logs", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const visibleEvents = roleFilter === "All"
    ? data.events
    : data.events.filter((event) => event.role === roleFilter);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard icon={Activity} label="All Actions" value={loading ? "…" : String(data.stats.all)} hint="Across every user role" />
        <StatCard icon={UserRound} label="Counsellor" value={loading ? "…" : String(data.stats.counsellor)} hint="Caseload & notes" />
        <StatCard icon={ShieldCheck} label="Admin" value={loading ? "…" : String(data.stats.admin)} hint="Access & configuration" />
        <StatCard icon={UsersRound} label="Student & Parent" value={loading ? "…" : String(data.stats.studentParent)} hint="Portal submissions" highlight />
      </div>
      <SectionPanel title="Audit Log">
        <div className="mb-4 flex flex-wrap gap-2">
          {["All", "Counsellor", "Admin", "Student", "Parent"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setRoleFilter(item)}
              className={`rounded-full border px-3 py-1.5 text-xs ${
                roleFilter === item
                  ? "border-[#3f2f7a] bg-[#3f2f7a] text-white"
                  : "border-[#d8d5e6] bg-white text-[#525252]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        {visibleEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-xs">
              <thead>
                <tr className="border-b border-[#d8d5e6] text-[#737373]">
                  {["Time", "Date", "Actor", "Role", "Action", "Reference"].map((heading) => (
                    <th key={heading} className="pb-2 font-semibold">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleEvents.map((event) => (
                  <tr key={event.id} className="border-b border-[#f6f3fb]">
                    <td className="py-3 pr-3 font-mono">{event.time}</td>
                    <td className="py-3 pr-3 text-[#737373]">{event.date}</td>
                    <td className="py-3 pr-3 font-semibold">{event.actor}</td>
                    <td className="py-3 pr-3"><span className="rounded-full bg-[#f6f3fb] px-2 py-0.5">{event.role}</span></td>
                    <td className="py-3 pr-3">{event.action}</td>
                    <td className="py-3 pr-3 font-mono text-[11px] text-[#737373]">{event.reference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center text-xs text-[#737373]">
            {loading ? "Loading audit logs…" : "No audit events recorded for this category."}
          </div>
        )}
      </SectionPanel>
    </div>
  );
}

function SettingsSectionView({ role }: { role: Role }) {
  const [savedToast, setSavedToast] = useState(false);
  const [instituteName, setInstituteName] = useState("Brain Career Counseling & Assessment Services");
  const [supportEmail, setSupportEmail] = useState("counsel@brain.edu");
  const [hotline, setHotline] = useState("+91 98230 00192");
  const [sessionDuration, setSessionDuration] = useState("45");
  const [waNotifications, setWaNotifications] = useState(true);
  const [smsReminders, setSmsReminders] = useState(true);
  const [parentDigest, setParentDigest] = useState(true);

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {savedToast && (
        <div className="p-3.5 rounded-[8px] bg-[#dcfce7] border border-[#bbf7d0] text-xs text-[#16a34a] flex items-center justify-between animate-fade-in">
          <span className="flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4" /> Workspace settings updated and synchronized with PostgreSQL database.
          </span>
          <button onClick={() => setSavedToast(false)} className="text-[#16a34a] hover:underline text-[11px]">
            Dismiss
          </button>
        </div>
      )}

      {/* Organization Info */}
      <SectionPanel title="Institute &amp; Branch Configuration" subtitle="Primary organization credentials and contact channels">
        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-medium text-[#737373] mb-1">Organization Title</label>
            <input
              type="text"
              value={instituteName}
              onChange={(e) => setInstituteName(e.target.value)}
              className="w-full h-9 rounded-[6px] border border-[#d8d5e6] px-3 text-xs text-[#171717] focus:outline-none focus:border-[#3f2f7a]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#737373] mb-1">Admissions Support Email</label>
            <input
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              className="w-full h-9 rounded-[6px] border border-[#d8d5e6] px-3 text-xs text-[#171717] focus:outline-none focus:border-[#3f2f7a]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#737373] mb-1">Parent Hotline</label>
            <input
              type="text"
              value={hotline}
              onChange={(e) => setHotline(e.target.value)}
              className="w-full h-9 rounded-[6px] border border-[#d8d5e6] px-3 text-xs text-[#171717] focus:outline-none focus:border-[#3f2f7a]"
            />
          </div>
        </div>
      </SectionPanel>

      {/* Counselling Rules */}
      <SectionPanel title="Session &amp; Calendar Protocol" subtitle="Default slot limits and buffer configurations">
        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-medium text-[#737373] mb-1">Default 1-on-1 Duration (mins)</label>
            <select
              value={sessionDuration}
              onChange={(e) => setSessionDuration(e.target.value)}
              className="w-full h-9 rounded-[6px] border border-[#d8d5e6] px-3 text-xs text-[#171717] bg-white focus:outline-none focus:border-[#3f2f7a]"
            >
              <option value="30">30 Minutes (Rapid Check-in)</option>
              <option value="45">45 Minutes (Standard Diagnostic)</option>
              <option value="60">60 Minutes (Comprehensive Dossier)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[#737373] mb-1">Operational Hours</label>
            <div className="h-9 rounded-[6px] border border-[#d8d5e6] bg-[#f6f3fb] px-3 flex items-center text-[#525252]">
              Monday – Saturday (9:00 AM – 7:00 PM IST)
            </div>
          </div>
        </div>
      </SectionPanel>

      {/* Automated Notifications */}
      <SectionPanel title="Automated Messaging &amp; Reminders" subtitle="Trigger automated alerts to students and guardians">
        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-[8px] border border-[#d8d5e6] hover:bg-[#f6f3fb] cursor-pointer">
            <div>
              <p className="font-semibold text-[#171717]">WhatsApp Intake Confirmation</p>
              <p className="text-[11px] text-[#737373]">Send instant program summary and counsellor calendar link upon submission.</p>
            </div>
            <input
              type="checkbox"
              checked={waNotifications}
              onChange={(e) => setWaNotifications(e.target.checked)}
              className="accent-black h-4 w-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-[8px] border border-[#d8d5e6] hover:bg-[#f6f3fb] cursor-pointer">
            <div>
              <p className="font-semibold text-[#171717]">SMS 24h Session Reminder</p>
              <p className="text-[11px] text-[#737373]">Automated SMS dispatched 24 hours prior to scheduled Pune or Online session.</p>
            </div>
            <input
              type="checkbox"
              checked={smsReminders}
              onChange={(e) => setSmsReminders(e.target.checked)}
              className="accent-black h-4 w-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-[8px] border border-[#d8d5e6] hover:bg-[#f6f3fb] cursor-pointer">
            <div>
              <p className="font-semibold text-[#171717]">Weekly Parent Progress Digest</p>
              <p className="text-[11px] text-[#737373]">Summarize candidate milestones and mentor diagnostic notes.</p>
            </div>
            <input
              type="checkbox"
              checked={parentDigest}
              onChange={(e) => setParentDigest(e.target.checked)}
              className="accent-black h-4 w-4"
            />
          </label>
        </div>
      </SectionPanel>

      {/* Security & Access */}
      <SectionPanel title="Security &amp; Audit Logs" subtitle="Multi-tenant access control and database connectivity">
        <div className="p-3.5 rounded-[8px] bg-[#f6f3fb] border border-[#d8d5e6] space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-[#525252]">PostgreSQL Server Connection:</span>
            <span className="font-mono text-[#16a34a] font-semibold">localhost:5432 / brain_inquiry_portal (Active)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#525252]">Active Role Authorization:</span>
            <span className="font-semibold text-[#171717]">{role}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#525252]">Session Inactivity Timeout:</span>
            <span className="font-semibold text-[#171717]">30 Minutes</span>
          </div>
        </div>
      </SectionPanel>

      <div className="flex justify-end gap-3 pt-2">
        <Button size="md" variant="primary" onClick={handleSave}>
          Save Workspace Settings
        </Button>
      </div>
    </div>
  );
}
