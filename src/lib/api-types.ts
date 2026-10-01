export type UUID = string;
export type ISO8601 = string;

export type ApiErrorCode =
  | 'AUTH_UNAUTHENTICATED'
  | 'AUTH_FORBIDDEN'
  | 'AUTH_ROLE_INSUFFICIENT'
  | 'INPUT_VALIDATION_FAILED'
  | 'REFERRAL_CODE_INVALID'
  | 'REFERRAL_CODE_EXPIRED'
  | 'REFERRAL_CODE_USED_UP'
  | 'REFERRAL_CODE_NOT_ELIGIBLE_PROGRAM'
  | 'INQUIRY_NOT_FOUND'
  | 'INQUIRY_TRANSITION_INVALID'
  | 'INQUIRY_GUARD_VIOLATION'
  | 'PAYMENT_AMOUNT_MISMATCH'
  | 'PAYMENT_SIGNATURE_INVALID'
  | 'SLOT_DOUBLE_BOOKED'
  | 'NOT_FOUND'
  | 'INTERNAL_SERVER_ERROR';

export class ClientApiError extends Error {
  code: ApiErrorCode;
  statusCode: number;
  field?: string;
  suggestion?: string;
  constructor(
    code: ApiErrorCode,
    message: string,
    statusCode: number,
    extras?: { field?: string; suggestion?: string }
  ) {
    super(message);
    this.name = 'ClientApiError';
    this.code = code;
    this.statusCode = statusCode;
    this.field = extras?.field;
    this.suggestion = extras?.suggestion;
  }
  static fromStatus(status: number, body: any) {
    const err = body?.error ?? {};
    const code: ApiErrorCode = (err.code as ApiErrorCode) ||
      (status === 401 ? 'AUTH_UNAUTHENTICATED'
        : status === 403 ? 'AUTH_FORBIDDEN'
          : status === 404 ? 'NOT_FOUND'
            : status >= 500 ? 'INTERNAL_SERVER_ERROR' : 'INPUT_VALIDATION_FAILED');
    return new ClientApiError(code, err.message || body?.message || `Request failed (${status})`, status, {
      field: err.field,
      suggestion: err.suggestion,
    });
  }
}

export interface ApiSuccessResponse<T> { ok: true; data: T; meta?: any; timestamp: ISO8601; }
export interface ApiErrorResponse { ok: false; error: { code: ApiErrorCode; message: string; field?: string; suggestion?: string; }; timestamp: ISO8601; }
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PublicProgram {
  id: UUID;
  code: 'ankur' | 'palavi' | 'lakshya' | 'udaan' | 'phoenix' | 'cmt' | string;
  name: string;
  tagline: string;
  gradeRange: string;
  description: string;
  features: string[];
  price: number;
  currency: string;
  gradientCssClasses?: string;
  iconName?: string;
  isActive: boolean;
  serviceFeeRatePercent?: number;
  gstRatePercent?: number;
}

export interface HeroStats { studentsCounselled: number; successRatePct: number; yearsOfExcellence: number; citiesServed: number; expertCounsellors: number; averageRating: number; }

export type ReferralType = 'teacher' | 'counsellor' | 'sales_person' | 'channel_partner' | 'student_ambassador' | 'alumni' | 'corporate_partner' | 'marketing_campaign' | 'other';
export interface ReferralValidateReq { codeText: string; programCode?: string; subtotal?: number; }
export interface ReferralValidateRes {
  isValid: boolean; codeId?: UUID; displayCode?: string; displayName?: string; referrerName?: string;
  referralType?: ReferralType; discountType?: 'percentage' | 'fixed_amount'; discountValue?: number;
  maxCap?: number | null; discountPreviewAmount?: number; validityRemainingDays?: number | null;
  usagesRemaining?: number | null; isNewStudentsOnly?: boolean;
  errorCode?: ApiErrorCode; errorMessage?: string;
}

export interface ConnectedParentInfo {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  relationship?: string;
  occupation?: string;
}

export interface StudentProfileData {
  id: string;
  studentId: string;
  registrationNumber: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  addressLine1?: string;
  schoolCollegeName: string;
  photoUrl: string | null;
  parentConnected: boolean;
  parent: ConnectedParentInfo | null;
}

export interface UserIdentity {
  id: UUID; organizationId: UUID; branchId?: UUID | null;
  firstName: string; lastName: string; email: string; phone: string;
  avatarUrl?: string | null;
  photoUrl?: string | null;
  registrationNumber?: string | null;
  schoolCollegeName?: string | null;
  address?: string | null;
  parentConnected?: boolean;
  connectedParent?: ConnectedParentInfo | null;
  roles: string[]; primaryRole: string; permissions: string[];
  studentId?: UUID | null; parentId?: UUID | null; counsellorId?: UUID | null;
}

export interface LoginReq { email: string; password: string; }
export interface LoginRes { accessToken: string; refreshToken?: string; expiresAt: ISO8601; user: UserIdentity; }
export interface SignupReq {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  schoolCollegeName: string;
  password?: string;
  role?: "student";
}
export interface ParentSignupReq {
  fullName: string;
  phone: string;
  email: string;
  address?: string;
  studentId: string;
  password?: string;
  role?: "parent";
}
export type AnySignupReq = SignupReq | ParentSignupReq;
export interface SignupRes extends LoginRes { inquiryId?: UUID; studentId: UUID; parentId?: UUID; }

export interface InquiryCreateReq { studentId?: UUID; referralCodeText?: string; }
export interface InquiryCreateRes {
  inquiryId: UUID; inquiryNumber: string; registrationFormNo: string;
  currentStep: number; stepsCompletedMask: number; createdAt: ISO8601;
  referralApplied?: { referralCodeId: UUID; codeText: string; referrerName: string | null; } | null;
}

export interface PersonalDetailsReq {
  fullName: string; email?: string | null; phone: string; alternatePhone?: string | null;
  dateOfBirth?: string | null; gender?: string | null;
  addressLine1?: string | null; addressLine2?: string | null; city?: string | null; state?: string | null; pincode?: string | null;
  parentName?: string | null; parentPhone?: string | null; parentOccupation?: string | null;
  photoStorageKey?: string | null; regNo?: string | null; formDate?: string | null;
}

export interface PerformanceRowReq { id?: UUID; subject: string; standard: string; t1Marks?: number | null; t2Marks?: number | null; t3Marks?: number | null; t4Marks?: number | null; t5Marks?: number | null; marksAvg?: number | null; }
export interface EducationalDetailsReq {
  currentClass?: string | null; schoolCollege?: string | null; educationBoardId?: UUID | null;
  stream?: string | null; percentageOrCgpa?: string | null; graduationYear?: string | null;
  performanceRows: PerformanceRowReq[];
}

export interface PreferencesReq {
  subjectsOfInterest?: string[] | null; careerGoalsAmbition?: string | null; challengesFaced?: string | null;
  preferredLanguage?: string | null; followUpFrequencyCode?: '3days' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | null;
  subjectsEasy?: string[] | null; subjectsDifficult?: string[] | null; teacherOfLiking?: string | null;
  whatYouWantToBe?: string | null; branchPreferenceCode?: string | null; idealPersonality?: string | null;
  sports?: string | null; tvChannelHobby?: string | null; closeRelativeInfluencer?: string | null;
  awardsCertificates?: string | null; computerCompetency?: string | null; closeFriends?: string | null;
  otherCloseRelatives?: string | null; mobileUsageHabit?: string | null; counsellorObservations?: string | null;
}

export interface SelectProgramReq { programId: UUID; referralCodeText?: string; }
export interface SelectProgramRes { ok: true; program: PublicProgram; referralValidated?: ReferralValidateRes | null; }

export interface InquiryFull {
  id: UUID; inquiryNumber: string; registrationFormNo: string;
  organizationId: UUID; branchId: UUID | null;
  studentId: UUID;
  status: string; currentStep: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  feeStatus: 'unpaid' | 'partial' | 'paid' | 'refunded';
  overallProgressPercent: number;
  programId: UUID | null;
  referralCodeId: UUID | null;
  referralCodeTextEntered: string | null;
  formDate: string;
  submittedAt?: ISO8601 | null;
  createdAt: ISO8601;
  updatedAt: ISO8601;
}

export interface PaymentCreateOrderReq {
  inquiryId?: string;
  programCode: 'ankur' | 'palavi' | 'lakshya' | 'disha' | 'udaan' | 'phoenix' | 'cmt';
  installmentNumber?: number;
  counsellorId?: string;
  counsellorName?: string;
  appointmentDate?: string;
  slotTime?: string;
}

export interface PaymentCreateOrderRes {
  paymentId: UUID; inquiryId: UUID; razorpayOrderId: string;
  razorpayKeyId: string; amount: number; currency: string;
  receipt: string; status: string;
  programFeeAmount: number; serviceFeeAmount: number; gstAmount: number;
  discountAmountApplied: number; roundOffAdjustmentAmount: number; grandTotal: number;
  subtotalBeforeDiscount: number;
  prefill: { name: string; email: string; contact: string };
}

export interface PaymentVerifyReq {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
  inquiryId: UUID;
  paymentMethodSnapshot?: 'razorpay_upi' | 'razorpay_card' | 'razorpay_netbanking' | 'razorpay_wallet';
}

export interface PaymentVerifyRes {
  paymentId: UUID;
  status: 'paid';
  receiptNumber: string;
  paidAt: ISO8601;
  totalAmount: number;
}

export interface InquiryListRes {
  items: InquiryFull[]; total: number; page: number; perPage: number; totalPages: number;
}

export interface LeaderboardEntry {
  referralCodeId: UUID; code: string; displayName: string; referralType: ReferralType;
  referrerFullName: string | null;
  uniqueInquiriesCount: number; paidConversionsCount: number;
  totalRevenueAttributed: number; totalDiscountGiven: number;
}

export interface MoodCheckinReq { moodValue: number; note?: string | null; }

// ===================== DOSSIER & INQUIRY =====================
export interface StudentDossier {
  id: UUID;
  fullName: string;
  email: string | null;
  phone: string;
  dateOfBirth: string | null;
  gender: string | null;
  addressLine1: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  parentName: string | null;
  parentPhone: string | null;
  parentOccupation: string | null;
  schoolCollege: string | null;
  stream: string | null;
  currentClass: string | null;
  percentageOrCgpa: string | null;
  graduationYear: string | null;
}

export interface DossierData {
  inquiry: InquiryFull;
  student: StudentDossier;
  performanceRows: PerformanceRowReq[];
  preferences: PreferencesReq | null;
  appointment: any | null;
  conclusion: any | null;
  payments: any[];
}

// ===================== CONCLUSIONS =====================
export interface ActionItemData {
  id?: UUID;
  taskTitle: string;
  category?: 'academic' | 'career' | 'habit' | 'other' | string;
  targetDate?: string | null;
  isDone?: boolean;
}

export interface CreateConclusionReq {
  inquiryId: UUID;
  counsellorId?: UUID;
  conclusionDate?: string;
  sessionSummary: string;
  observations: string;
  recommendations: string;
  nextFollowUpScheduled?: string | null;
  followUpFrequencyCode?: '3days' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | string | null;
  counsellorSignatureName: string;
  actionItems?: ActionItemData[];
}

export interface ConclusionData {
  id: UUID;
  inquiryId: UUID;
  counsellorId: UUID;
  conclusionDate: string;
  sessionSummary: string;
  observations: string;
  recommendations: string;
  nextFollowUpScheduled: string | null;
  followUpFrequencyCode: string | null;
  counsellorSignatureName: string;
  isDraftVersion: boolean;
  finalizedAt: ISO8601 | null;
  actionItems: ActionItemData[];
  createdAt: ISO8601;
  updatedAt: ISO8601;
}

// ===================== SESSIONS & APPOINTMENTS =====================
export interface CounsellingSessionItem {
  id: UUID;
  sessionId?: UUID;
  appointmentId: UUID;
  inquiryId: UUID;
  inquiryNumber: string;
  inquiryStatus: string;
  student: {
    name: string;
    email: string | null;
    phone: string;
    registrationNumber: string | null;
  };
  programName: string | null;
  programCode: string | null;
  counsellor: {
    id: UUID;
    name: string;
    title: string;
  };
  branchName: string | null;
  date: string;
  timeSlotDisplay: string;
  mode: 'in_person' | 'online';
  location: string | null;
  meetingLinkUrl: string | null;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  appointmentStatus: string;
  sessionStartedAt: ISO8601 | null;
  sessionEndedAt: ISO8601 | null;
  durationSeconds: number | null;
  studentAttended: boolean | null;
  counsellorNotes: string | null;
}

// ===================== FOLLOW-UPS =====================
export interface FollowUpItem {
  id: UUID;
  inquiryId: UUID;
  inquiryNumber: string;
  inquiryStatus: string;
  studentName: string;
  studentEmail: string | null;
  studentPhone: string;
  programName: string | null;
  followupDate: string;
  remark: string | null;
  statusCode: string;
  conductedBy: string;
  nextFollowupDate: string | null;
  isOverdue: boolean;
  createdAt: ISO8601;
}

export interface FollowUpStats {
  totalDueToday: number;
  tomorrowCounsellingReminders: number;
  weeklyFollowUps: number;
  overdue: number;
  completedThisWeek: number;
  pendingFollowUps: number;
}

export interface FollowUpListRes {
  followups: FollowUpItem[];
  stats: FollowUpStats;
}

export interface CreateFollowUpReq {
  inquiryId: UUID;
  followupDate: string;
  remark?: string;
  statusCode?: string;
  nextFollowupDate?: string;
}

export interface LogCallReq {
  callOutcome: string;
  notes: string;
  nextFollowUpDate?: string;
  durationSeconds?: number;
  statusCode?: string;
}

// ===================== ASSESSMENTS =====================
export interface AssessmentBattery {
  id: string;
  code: string;
  name: string;
  category: string;
  durationMinutes: number;
  totalQuestions: number;
  description: string;
  sections: string[];
  isPopular: boolean;
}

export interface AssessmentSectionScore {
  sectionName: string;
  rawScore: number;
  maxScore: number;
  percentage: number;
  interpretation: string;
}

export interface AssessmentSubmission {
  id: string;
  inquiryId: UUID;
  inquiryNumber: string;
  studentId: UUID;
  studentName: string;
  studentEmail?: string;
  batteryId: string;
  batteryCode: string;
  batteryName: string;
  category: string;
  status: 'assigned' | 'in_progress' | 'completed';
  assignedAt: ISO8601;
  completedAt?: ISO8601 | null;
  dueDate: string;
  accessUrl: string;
  scorePercent?: number | null;
  percentile?: number | null;
  topStrengths?: string[];
  growthAreas?: string[];
  sectionBreakdown?: AssessmentSectionScore[] | null;
  counsellorRecommendation?: string;
}

// ===================== PAYMENTS LEDGER =====================
export interface PaymentLedgerItem {
  id: UUID;
  receiptNumber: string;
  inquiryId: UUID;
  inquiryNumber: string;
  studentName: string;
  studentEmail: string | null;
  studentPhone: string;
  programName: string | null;
  programCode: string | null;
  branchName: string | null;
  method: string;
  status: string;
  direction: string;
  currency: string;
  programFeeAmount: number;
  serviceFeeAmount: number;
  gstAmount: number;
  subtotalBeforeDiscount: number;
  discountAmountApplied: number;
  totalAfterDiscount: number;
  totalAmount: number;
  referralCode: string | null;
  razorpayPaymentId: string | null;
  instrumentReferenceNo: string | null;
  instrumentBankName: string | null;
  paidAt: ISO8601 | null;
  createdAt: ISO8601;
}

export interface PaymentLedgerSummary {
  totalRevenue: number;
  totalDiscountGiven: number;
  totalGstCollected: number;
  paidCount: number;
  pendingCount: number;
  failedCount: number;
}

export interface PaymentLedgerRes {
  ledger: PaymentLedgerItem[];
  summary: PaymentLedgerSummary;
}

// ===================== SETTINGS & ORG =====================
export interface BranchConfig {
  id: UUID;
  code: string;
  name: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
  isActive: boolean;
}

export interface OrganizationSettings {
  id: UUID;
  name: string;
  code: string;
  logoUrl?: string | null;
  primaryEmail: string;
  primaryPhone: string;
  websiteUrl: string;
  currencyCode: string;
  timezone: string;
  address: {
    line1: string;
    city: string;
    state: string;
    pincode: string;
  };
  branches: BranchConfig[];
  systemFeatures: {
    enableSmsNotifications: boolean;
    enableEmailVouchers: boolean;
    enableGstInvoicing: boolean;
    defaultGstRate: number;
    enableRazorpayGateway: boolean;
    strictPaymentGuardForBooking: boolean;
  };
}

export interface CounsellorItem {
  id: UUID;
  userId?: UUID | null;
  fullName: string;
  title: string;
  specializations: string[];
  branchCode?: string | null;
  email?: string;
  phone?: string;
  qualifications?: string;
  bio?: string;
  avatarUrl?: string | null;
  ratingAvg?: number | null;
  ratingCount?: number | null;
  createdAt?: string;
}

export interface CreateCounsellorReq {
  fullName: string;
  email: string;
  phone?: string;
  password?: string;
  title?: string;
  qualifications?: string;
  specializations?: string[];
  bio?: string;
}
