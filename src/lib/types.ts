export type FollowUpFrequency = "3days" | "weekly" | "monthly";

export type CounsellingType =
  | "ankur"
  | "palavi"
  | "lakshya"
  | "disha"
  | "udaan"
  | "phoenix"
  | "cmt";

export interface PerformanceRow {
  subject: string;
  standard: string;
  t1?: string;
  t2?: string;
  t3?: string;
  t4?: string;
  t5?: string;
  marksAvg: string;
}

export interface PersonalDetails {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  parentName?: string;
  parentPhone?: string;
  photoUrl?: string;
  regNo?: string;
  formDate?: string;
}

export interface EducationalDetails {
  currentClass: string;
  school: string;
  board: string;
  percentage: string;
  stream?: string;
  graduationYear?: string;
  performanceTable?: PerformanceRow[];
}

export interface Preferences {
  subjectOfInterest: string;
  careerGoals: string;
  challenges: string;
  preferredLanguage: string;
  followUpFrequency: FollowUpFrequency;
  subjectsEasy?: string;
  subjectsDifficult?: string;
  teacherOfLiking?: string;
  whatYouWantToBe?: string;
  branch?: string;
  idealPersonality?: string;
  sports?: string;
  tvChannel?: string;
  closeRelative?: string;
  awardsCertificates?: string;
  computerCompetency?: string;
  closeFriends?: string;
  otherCloseRelatives?: string;
  whichMobile?: string;
  counsellorObservations?: string;
}


export interface CounsellingProgram {
  id: CounsellingType;
  name: string;
  tagline: string;
  gradeRange: string;
  description: string;
  features: string[];
  price: number;
  gradient: string;
  icon: string;
}

export interface Appointment {
  date: string;
  time: string;
  mode: "in-person" | "offline";
  counsellorId?: string;
  counsellorName: string;
  meetingLink?: string;
  location?: string;
}

export interface CounsellingConclusion {
  date: string;
  summary: string;
  observations: string;
  recommendations: string;
  actionItems: string[];
  nextFollowUp?: string;
  counsellorSignature: string;
  counsellorName: string;
}

export interface InquiryState {
  personalDetails: PersonalDetails | null;
  educationalDetails: EducationalDetails | null;
  preferences: Preferences | null;
  selectedProgram: CounsellingProgram | null;
  paymentStatus: "pending" | "paid" | "failed";
  paymentId?: string;
  appointment: Appointment | null;
  conclusion: CounsellingConclusion | null;
  inquiryId: string;
  submittedAt: string | null;
}

export const COUNSELLING_PROGRAMS: CounsellingProgram[] = [
  {
    id: "ankur",
    name: "Ankur",
    tagline: "Foundation Years",
    gradeRange: "KG to 4th",
    description:
      "Early childhood development program focusing on foundational learning skills, curiosity building, and holistic growth.",
    features: [
      "Learning style assessment",
      "Foundational skill building",
      "Parent counselling included",
      "Activity-based learning guidance",
    ],
    price: 1499,
    gradient: "from-pink-500 via-rose-500 to-orange-400",
    icon: "Sprout",
  },
  {
    id: "palavi",
    name: "Palavi",
    tagline: "Growing Minds",
    gradeRange: "5th to 7th",
    description:
      "Transition period guidance helping students build study habits, explore interests, and prepare for higher classes.",
    features: [
      "Study habit development",
      "Interest & aptitude discovery",
      "Time management coaching",
      "Parent-teacher alignment",
    ],
    price: 1999,
    gradient: "from-purple-500 via-violet-500 to-indigo-500",
    icon: "Leaf",
  },
  {
    id: "lakshya",
    name: "Lakshya",
    tagline: "Target Excellence",
    gradeRange: "8th to 10th",
    description:
      "Board exam preparation and career foundation program for students stepping into crucial academic years.",
    features: [
      "Board exam strategy",
      "Stream selection guidance",
      "Career roadmapping",
      "Stress & exam management",
    ],
    price: 2499,
    gradient: "from-blue-500 via-cyan-500 to-teal-400",
    icon: "Target",
  },
  {
    id: "disha",
    name: "Disha",
    tagline: "Choose Your Direction",
    gradeRange: "11th to 12th",
    description:
      "College, degree branch, entrance exam, admission, and scholarship guidance for senior-secondary students.",
    features: [
      "Branch & institute selection",
      "Entrance exam strategy",
      "Admission counselling",
      "Scholarship guidance",
    ],
    price: 2999,
    gradient: "from-orange-500 via-amber-500 to-yellow-400",
    icon: "Target",
  },
  {
    id: "udaan",
    name: "Udaan",
    tagline: "Soar Higher",
    gradeRange: "Graduates",
    description:
      "Post-graduation career counselling covering higher studies options, competitive exams, and job placements.",
    features: [
      "Higher education guidance",
      "Entrance exam preparation roadmap",
      "Resume & interview coaching",
      "Industry insights & networking",
    ],
    price: 2999,
    gradient: "from-amber-500 via-orange-500 to-red-500",
    icon: "Plane",
  },
  {
    id: "phoenix",
    name: "Phoenix",
    tagline: "Rise & Transform",
    gradeRange: "Professionals",
    description:
      "Career transition and growth program for working professionals seeking change, upskilling, or advancement.",
    features: [
      "Career pivot strategy",
      "Skill gap analysis",
      "Leadership coaching",
      "Work-life balance guidance",
    ],
    price: 3999,
    gradient: "from-slate-600 via-slate-700 to-slate-900",
    icon: "Flame",
  },
];

export const FOLLOW_UP_OPTIONS: {
  value: FollowUpFrequency;
  label: string;
  description: string;
}[] = [
  {
    value: "3days",
    label: "Every 3 Days",
    description: "Intensive follow-up for focused improvement",
  },
  {
    value: "weekly",
    label: "Weekly",
    description: "Balanced check-ins for steady progress",
  },
  {
    value: "monthly",
    label: "Monthly",
    description: "Regular reviews for long-term growth",
  },
];

export const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
];

export const COUNSELLORS: string[] = [];
