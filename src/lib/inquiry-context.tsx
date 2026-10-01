"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import type {
  InquiryState,
  PersonalDetails,
  EducationalDetails,
  Preferences,
  CounsellingProgram,
  Appointment,
  CounsellingConclusion,
} from "./types";

const INITIAL_STATE: InquiryState = {
  personalDetails: null,
  educationalDetails: null,
  preferences: null,
  selectedProgram: null,
  paymentStatus: "pending",
  appointment: null,
  conclusion: null,
  inquiryId: "",
  submittedAt: null,
};

interface InquiryContextType {
  state: InquiryState;
  setPersonalDetails: (data: PersonalDetails) => void;
  setEducationalDetails: (data: EducationalDetails) => void;
  setPreferences: (data: Preferences) => void;
  setSelectedProgram: (program: CounsellingProgram) => void;
  setPaymentStatus: (
    status: "pending" | "paid" | "failed",
    paymentId?: string
  ) => void;
  setAppointment: (appointment: Appointment) => void;
  setConclusion: (conclusion: CounsellingConclusion) => void;
  resetInquiry: () => void;
  generateInquiryId: () => string;
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

const STORAGE_KEY = "brain_inquiry_state";

function generateId(): string {
  const prefix = "BRAIN";
  const date = new Date();
  const dateStr = `${date.getFullYear()}${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${dateStr}-${random}`;
}

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<InquiryState>(INITIAL_STATE);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(parsed);
      } catch {
        setState((prev) => ({
          ...prev,
          inquiryId: prev.inquiryId || generateId(),
        }));
      }
    } else {
      setState((prev) => ({
        ...prev,
        inquiryId: prev.inquiryId || generateId(),
      }));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isInitialized]);

  const setPersonalDetails = useCallback((data: PersonalDetails) => {
    setState((prev) => ({ ...prev, personalDetails: data }));
  }, []);

  const setEducationalDetails = useCallback((data: EducationalDetails) => {
    setState((prev) => ({ ...prev, educationalDetails: data }));
  }, []);

  const setPreferences = useCallback((data: Preferences) => {
    setState((prev) => ({ ...prev, preferences: data }));
  }, []);

  const setSelectedProgram = useCallback((program: CounsellingProgram) => {
    setState((prev) => ({
      ...prev,
      selectedProgram: program,
      appointment: null,
      paymentStatus: "pending",
      paymentId: undefined,
      submittedAt: null,
    }));
  }, []);

  const setPaymentStatus = useCallback(
    (status: "pending" | "paid" | "failed", paymentId?: string) => {
      setState((prev) => ({
        ...prev,
        paymentStatus: status,
        paymentId,
        submittedAt: status === "paid" ? new Date().toISOString() : prev.submittedAt,
      }));
    },
    []
  );

  const setAppointment = useCallback((appointment: Appointment) => {
    setState((prev) => ({ ...prev, appointment }));
  }, []);

  const setConclusion = useCallback((conclusion: CounsellingConclusion) => {
    setState((prev) => ({ ...prev, conclusion }));
  }, []);

  const resetInquiry = useCallback(() => {
    const newId = generateId();
    setState({ ...INITIAL_STATE, inquiryId: newId });
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const generateInquiryId = useCallback(() => {
    const newId = generateId();
    setState((prev) => ({ ...prev, inquiryId: newId }));
    return newId;
  }, []);

  return (
    <InquiryContext.Provider
      value={{
        state,
        setPersonalDetails,
        setEducationalDetails,
        setPreferences,
        setSelectedProgram,
        setPaymentStatus,
        setAppointment,
        setConclusion,
        resetInquiry,
        generateInquiryId,
      }}
    >
      {children}
    </InquiryContext.Provider>
  );
}

export function useInquiry() {
  const context = useContext(InquiryContext);
  if (context === undefined) {
    throw new Error("useInquiry must be used within an InquiryProvider");
  }
  return context;
}
