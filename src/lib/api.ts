import type {
  PublicProgram, HeroStats,
  LoginReq, LoginRes, SignupReq, ParentSignupReq, SignupRes, UserIdentity, StudentProfileData,
  InquiryCreateReq, InquiryCreateRes, InquiryFull, InquiryListRes,
  PersonalDetailsReq, EducationalDetailsReq, PreferencesReq,
  SelectProgramReq, SelectProgramRes,
  PaymentCreateOrderReq, PaymentCreateOrderRes, PaymentVerifyReq, PaymentVerifyRes,
  ReferralValidateReq, ReferralValidateRes,
  LeaderboardEntry,
  MoodCheckinReq,
  DossierData,
  ConclusionData, CreateConclusionReq,
  CounsellingSessionItem,
  FollowUpListRes, FollowUpItem, CreateFollowUpReq, LogCallReq,
  AssessmentBattery, AssessmentSubmission,
  PaymentLedgerRes,
  OrganizationSettings,
  CounsellorItem, CreateCounsellorReq,
} from './api-types';
import { ClientApiError } from './api-types';

type HeadersInit = Record<string, string>;

const PUBLIC_API_BASE = (() => {
  const raw = process.env.NEXT_PUBLIC_API_URL || '';
  const v = raw.trim().replace(/\/$/, '');
  return v || '';
})();

let _token: string | null = null;
const tokenListeners = new Set<(t: string | null) => void>();

export function setAccessToken(t: string | null) {
  _token = t || null;
  try {
    if (typeof window !== 'undefined') {
      if (t) localStorage.setItem('brain_access_token', t);
      else localStorage.removeItem('brain_access_token');
    }
  } catch { /* ignore SSR/storage failures */ }
  tokenListeners.forEach((fn) => fn(_token));
}

export function getAccessToken(): string | null {
  if (_token) return _token;
  if (typeof window !== 'undefined') {
    try {
      const t = localStorage.getItem('brain_access_token');
      if (t) { _token = t; return t; }
    } catch { /* empty */ }
  }
  return null;
}

export function subscribeToken(fn: (t: string | null) => void) {
  tokenListeners.add(fn);
  fn(getAccessToken());
  return () => tokenListeners.delete(fn);
}

export function clearAccessToken() { setAccessToken(null); }

export interface FetchOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  body?: any;
  query?: Record<string, any>;
  headers?: HeadersInit;
  skipAuth?: boolean;
  rawRes?: boolean;
}

export function joinUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/api/v1/${path}`;
  if (PUBLIC_API_BASE) return PUBLIC_API_BASE + cleanPath;
  return cleanPath;
}

function withQuery(url: string, query?: Record<string, any>) {
  if (!query || Object.keys(query).length === 0) return url;
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue;
    usp.append(k, Array.isArray(v) ? v.join(',') : String(v));
  }
  const q = usp.toString();
  return url.includes('?') ? `${url}&${q}` : `${url}?${q}`;
}

export async function apiCall<T = unknown>(path: string, opts: FetchOptions = {}): Promise<T> {
  const { method = 'GET', body, query, headers, skipAuth } = opts;
  const url = withQuery(joinUrl(path), query);
  const initHeaders: HeadersInit = {
    Accept: 'application/json',
    ...(headers as any || {}),
  };
  let hasJson = false;
  if (body !== undefined) {
    if (body instanceof FormData) {
      // let fetch set Content-Type
    } else {
      initHeaders['Content-Type'] = 'application/json';
      hasJson = true;
    }
  }
  if (!skipAuth) {
    const t = getAccessToken();
    if (t) initHeaders['Authorization'] = `Bearer ${t}`;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: initHeaders,
      credentials: 'same-origin',
      body: body === undefined ? undefined : hasJson ? JSON.stringify(body) : (body as any),
    });
  } catch (e: any) {
    throw new ClientApiError('INTERNAL_SERVER_ERROR', e?.message || 'Network error', 0);
  }

  const text = await res.text();
  let json: any = null;
  try { json = text ? JSON.parse(text) : null; } catch { /* ignore */ }

  if (!res.ok) {
    if (res.status === 401) {
      clearAccessToken();
    }
    throw ClientApiError.fromStatus(res.status, json || {});
  }

  if (json && typeof json === 'object' && 'ok' in json) {
    if (json.ok === true) return json.data as T;
    throw ClientApiError.fromStatus(res.status || 400, json);
  }
  return json as unknown as T;
}

export const api = {
  // ===================== PUBLIC =====================
  public: {
    programs: () => apiCall<PublicProgram[]>('/api/v1/public/programs', { skipAuth: true }),
    stats: () => apiCall<HeroStats>('/api/v1/public/stats', { skipAuth: true }),
    validateReferral: (payload: ReferralValidateReq) =>
      apiCall<ReferralValidateRes>('/api/v1/public/referrals/validate', {
        method: 'POST', body: payload, skipAuth: true,
      }),
  },

  // ===================== AUTH =====================
  auth: {
    signup: (p: SignupReq) => apiCall<SignupRes>('/api/v1/auth/signup/student', { method: 'POST', body: p, skipAuth: true }),
    signupStudent: (p: SignupReq) => apiCall<SignupRes>('/api/v1/auth/signup/student', { method: 'POST', body: p, skipAuth: true }),
    signupParent: (p: ParentSignupReq) => apiCall<SignupRes>('/api/v1/auth/signup/parent', { method: 'POST', body: p, skipAuth: true }),
    login: (p: LoginReq) => apiCall<LoginRes>('/api/v1/auth/login/password', { method: 'POST', body: p, skipAuth: true }),
    me: () => apiCall<UserIdentity>('/api/v1/auth/me'),
    logout: () => apiCall<{ ok: true }>('/api/v1/auth/logout', { method: 'POST' }),
  },

  // ===================== INQUIRIES =====================
  inquiries: {
    create: (p: InquiryCreateReq = {}) => apiCall<InquiryCreateRes>('/api/v1/inquiries', { method: 'POST', body: p }),
    list: (query?: { page?: number; perPage?: number; search?: string; status?: string; branchId?: string }) => 
      apiCall<InquiryListRes>('/api/v1/inquiries', { query }),
    get: (id: string) => apiCall<InquiryFull>(`/api/v1/inquiries/${id}`),
    getFullDossier: (id: string) => apiCall<DossierData>(`/api/v1/inquiries/${id}/full-dossier`),
    patch: (id: string, body: Partial<any>) => apiCall<InquiryFull>(`/api/v1/inquiries/${id}`, { method: 'PATCH', body }),
    savePersonal: (id: string, body: PersonalDetailsReq) =>
      apiCall<any>(`/api/v1/inquiries/${id}/personal-details`, { method: 'POST', body }),
    saveEducational: (id: string, body: EducationalDetailsReq) =>
      apiCall<any>(`/api/v1/inquiries/${id}/educational-details`, { method: 'POST', body }),
    savePreferences: (id: string, body: PreferencesReq) =>
      apiCall<any>(`/api/v1/inquiries/${id}/preferences`, { method: 'POST', body }),
    submitStep1: (id: string) =>
      apiCall<{ stepAdvancedTo: number }>(`/api/v1/inquiries/${id}/submit-registration-form`, { method: 'POST' }),
    selectProgram: (id: string, body: SelectProgramReq) =>
      apiCall<SelectProgramRes>(`/api/v1/inquiries/${id}/select-program`, { method: 'POST', body }),
    assignCounsellor: (id: string, counsellorId: string) =>
      apiCall<{ ok: true }>(`/api/v1/inquiries/${id}/assign-counsellor`, { method: 'POST', body: { counsellorId } }),
  },

  // ===================== CONCLUSIONS =====================
  conclusions: {
    create: (body: CreateConclusionReq) =>
      apiCall<{ conclusion: ConclusionData; message: string }>('/api/v1/conclusions', { method: 'POST', body }),
    getByInquiry: (inquiryId: string) =>
      apiCall<ConclusionData | null>(`/api/v1/conclusions/${inquiryId}`),
    finalize: (id: string) =>
      apiCall<{ conclusion: ConclusionData; message: string }>(`/api/v1/conclusions/${id}/finalize`, { method: 'PATCH' }),
  },

  // ===================== APPOINTMENTS & SESSIONS =====================
  appointments: {
    getSessions: (query?: { status?: string; counsellorId?: string; branchId?: string; date?: string; inquiryId?: string }) =>
      apiCall<CounsellingSessionItem[]>('/api/v1/appointments/sessions', { query }),
    startSession: (id: string, body?: { notes?: string; cameraEnabled?: boolean; micEnabled?: boolean; screenShareEnabled?: boolean }) =>
      apiCall<{ session: any; message: string }>(`/api/v1/appointments/${id}/start-session`, { method: 'POST', body: body || {} }),
    completeSession: (id: string, body?: { counsellorNotes?: string; studentAttended?: boolean; durationSeconds?: number }) =>
      apiCall<{ session: any; message: string }>(`/api/v1/appointments/${id}/complete-session`, { method: 'POST', body: body || {} }),
    getInquiryHistory: (inquiryId: string) =>
      apiCall<any[]>(`/api/v1/appointments/inquiry/${inquiryId}/history`),
    book: (body: any) =>
      apiCall<any>('/api/v1/appointments', { method: 'POST', body }),
    reschedule: (id: string, body: any) =>
      apiCall<any>(`/api/v1/appointments/${id}/reschedule`, { method: 'PATCH', body }),
    cancel: (id: string, body: any) =>
      apiCall<any>(`/api/v1/appointments/${id}/cancel`, { method: 'PATCH', body }),
  },

  // ===================== FOLLOW-UPS =====================
  followups: {
    list: (query?: { status?: string; inquiryId?: string; priority?: string; dateRange?: string; search?: string }) =>
      apiCall<FollowUpListRes>('/api/v1/followups', { query }),
    create: (body: CreateFollowUpReq) =>
      apiCall<FollowUpItem>('/api/v1/followups', { method: 'POST', body }),
    logCall: (id: string, body: LogCallReq) =>
      apiCall<FollowUpItem>(`/api/v1/followups/${id}/log-call`, { method: 'POST', body }),
    complete: (id: string) =>
      apiCall<FollowUpItem>(`/api/v1/followups/${id}/complete`, { method: 'PATCH' }),
  },

  // ===================== ASSESSMENTS =====================
  assessments: {
    batteries: () =>
      apiCall<AssessmentBattery[]>('/api/v1/assessments/batteries', { skipAuth: true }),
    assign: (body: { inquiryId: string; batteryId: string; dueDate?: string; notifyStudent?: boolean }) =>
      apiCall<{ assignment: AssessmentSubmission; message: string }>('/api/v1/assessments/assign', { method: 'POST', body }),
    submissions: (query?: { inquiryId?: string; status?: string; batteryId?: string }) =>
      apiCall<AssessmentSubmission[]>('/api/v1/assessments/submissions', { query }),
    getSubmission: (id: string) =>
      apiCall<AssessmentSubmission>(`/api/v1/assessments/submissions/${id}`),
  },

  // ===================== PAYMENTS =====================
  payments: {
    createOrder: (p: PaymentCreateOrderReq) =>
      apiCall<PaymentCreateOrderRes>('/api/v1/payments/razorpay/create-order', { method: 'POST', body: p }),
    verify: (p: PaymentVerifyReq) =>
      apiCall<PaymentVerifyRes>('/api/v1/payments/razorpay/verify', { method: 'POST', body: p }),
    recordOffline: (body: any) =>
      apiCall<any>('/api/v1/payments/offline/record', { method: 'POST', body }),
    getInquiryPayments: (inquiryId: string) =>
      apiCall<any[]>(`/api/v1/payments/inquiry/${inquiryId}`),
    ledger: (query?: { status?: string; method?: string; branchId?: string; search?: string; dateFrom?: string; dateTo?: string }) =>
      apiCall<PaymentLedgerRes>('/api/v1/payments/ledger', { query }),
  },

  // ===================== SETTINGS & ORG =====================
  settings: {
    getOrg: () =>
      apiCall<OrganizationSettings>('/api/v1/settings/organization'),
    updateOrg: (body: Partial<OrganizationSettings>) =>
      apiCall<any>('/api/v1/settings/organization', { method: 'PATCH', body }),
  },

  // ===================== STUDENTS =====================
  students: {
    dashboard: (id: string) => apiCall<any>(`/api/v1/students/${id}/dashboard`),
    saveMoodCheckin: (id: string, body: MoodCheckinReq) =>
      apiCall<{ ok: true; checkinId?: string }>(`/api/v1/students/${id}/mood-checkins`, { method: 'POST', body }),
  },

  // ===================== STUDENT PORTAL =====================
  studentPortal: {
    getMyProfile: () => apiCall<StudentProfileData>('/api/v1/student-portal/my-profile'),
    updateMyProfile: (p: { photoUrl?: string; address?: string; schoolCollegeName?: string; phone?: string }) =>
      apiCall<{ ok: true; message: string }>('/api/v1/student-portal/my-profile', { method: 'PUT', body: p }),
  },

  // ===================== REFERRALS =====================
  referrals: {
    leaderboard: () => apiCall<LeaderboardEntry[]>('/api/v1/referrals/leaderboard'),
  },

  // ===================== COUNSELLORS =====================
  counsellors: {
    list: () => apiCall<CounsellorItem[]>('/api/v1/counsellors', { skipAuth: true }),
    create: (body: CreateCounsellorReq) =>
      apiCall<CounsellorItem>('/api/v1/counsellors', { method: 'POST', body }),
    delete: (id: string) =>
      apiCall<{ message: string; id: string }>(`/api/v1/counsellors/${id}`, { method: 'DELETE' }),
  },
};

export default api;
