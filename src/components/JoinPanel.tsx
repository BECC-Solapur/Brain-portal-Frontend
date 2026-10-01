"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Loader2,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import AuthPromoPanel from "@/components/AuthPromoPanel";
import { useAuth } from "@/lib/auth-context";

type RoleType = "student" | "parent";

type JoinForm = {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  schoolCollegeName: string;
  studentId: string;
  password: string;
};

type FieldConfig = {
  key: keyof JoinForm;
  label: string;
  placeholder: string;
  type: string;
  autoComplete: string;
  icon: LucideIcon;
  required?: boolean;
  hint?: string;
  roles: RoleType[];
};

const allFields: FieldConfig[] = [
  {
    key: "fullName",
    label: "Full name",
    placeholder: "Your full name",
    type: "text",
    autoComplete: "name",
    icon: UserRound,
    required: true,
    roles: ["student", "parent"],
  },
  {
    key: "phone",
    label: "Phone number",
    placeholder: "9876543210",
    type: "tel",
    autoComplete: "tel",
    icon: Phone,
    required: true,
    roles: ["student", "parent"],
  },
  {
    key: "email",
    label: "Email address",
    placeholder: "you@example.com",
    type: "email",
    autoComplete: "email",
    icon: Mail,
    required: true,
    roles: ["student", "parent"],
  },
  {
    key: "address",
    label: "Address",
    placeholder: "Your residential address",
    type: "text",
    autoComplete: "street-address",
    icon: MapPin,
    required: true,
    roles: ["student", "parent"],
  },
  {
    key: "schoolCollegeName",
    label: "School / College Name",
    placeholder: "Your school or college",
    type: "text",
    autoComplete: "organization",
    icon: GraduationCap,
    required: true,
    roles: ["student"],
  },
  {
    key: "studentId",
    label: "Student ID",
    placeholder: "e.g. STU-12345678 or child's Student ID",
    type: "text",
    autoComplete: "off",
    icon: GraduationCap,
    required: true,
    hint: "Enter your child's Student ID or registration number to link records",
    roles: ["parent"],
  },
  {
    key: "password",
    label: "Password",
    placeholder: "At least 6 characters",
    type: "password",
    autoComplete: "new-password",
    icon: LockKeyhole,
    required: true,
    roles: ["student", "parent"],
  },
];

type JoinPanelProps = {
  modal?: boolean;
  onClose?: () => void;
  onSignIn?: () => void;
};

export default function JoinPanel({ modal = false, onClose, onSignIn }: JoinPanelProps) {
  const router = useRouter();
  const { signup, loading } = useAuth();
  const firstInput = useRef<HTMLInputElement>(null);
  const [role, setRole] = useState<RoleType>("student");
  const [form, setForm] = useState<JoinForm>({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    schoolCollegeName: "",
    studentId: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(!modal);

  useEffect(() => {
    if (showEmailForm) firstInput.current?.focus();
  }, [showEmailForm, role]);

  const activeFields = allFields.filter((f) => f.roles.includes(role));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (role === "student") {
      if (
        !form.fullName.trim() ||
        !form.phone.trim() ||
        !form.email.trim() ||
        !form.address.trim() ||
        !form.schoolCollegeName.trim() ||
        !form.password
      ) {
        setError("Complete all required fields to create your student account.");
        return;
      }

      try {
        await signup({
          role: "student",
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          address: form.address.trim(),
          schoolCollegeName: form.schoolCollegeName.trim(),
          password: form.password,
        });
        onClose?.();
        router.push("/counselling/student");
      } catch (reason: unknown) {
        setError(reason instanceof Error ? reason.message : "Could not create your account. Please try again.");
      }
    } else {
      if (
        !form.fullName.trim() ||
        !form.phone.trim() ||
        !form.email.trim() ||
        !form.address.trim() ||
        !form.studentId.trim() ||
        !form.password
      ) {
        setError("Complete all required fields including Student ID to create your parent account.");
        return;
      }

      try {
        await signup({
          role: "parent",
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          address: form.address.trim(),
          studentId: form.studentId.trim(),
          password: form.password,
        });
        onClose?.();
        router.push("/portal");
      } catch (reason: unknown) {
        setError(reason instanceof Error ? reason.message : "Could not create your parent account. Please try again.");
      }
    }
  };

  const handleSelectRoleAndProceed = (selectedRole: RoleType) => {
    setRole(selectedRole);
    setError(null);
    setShowEmailForm(true);
  };

  return (
    <div className="relative grid w-full max-w-[1120px] overflow-hidden rounded-[20px] bg-white shadow-[0_24px_80px_rgba(23,17,47,0.28)] lg:grid-cols-2">
      <AuthPromoPanel />

      <div className="relative flex max-h-[92vh] min-h-[650px] flex-col overflow-y-auto bg-white px-6 py-8 sm:px-10 lg:px-12 lg:py-10">
        {modal && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close join form"
            className="absolute right-5 top-5 z-20 rounded-full p-2 text-[#737373] transition-colors hover:bg-[#f6f3fb] hover:text-[#3f2f7a]"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <div className="mt-3 lg:mt-4">
          <h1 id="join-title" className="text-3xl font-semibold text-[#171717] sm:text-4xl">
            Create a new account
          </h1>
          <p className="mt-2 text-sm text-[#525252] sm:text-base">
            Already have an account?{" "}
            {modal && onSignIn ? (
              <button
                type="button"
                onClick={onSignIn}
                className="font-semibold text-[#3f2f7a] underline underline-offset-4 hover:text-[#2c2159]"
              >
                Sign in
              </button>
            ) : (
              <Link href="/auth/login" className="font-semibold text-[#3f2f7a] underline underline-offset-4 hover:text-[#2c2159]">
                Sign in
              </Link>
            )}
          </p>
        </div>

        {!showEmailForm ? (
          <div className="mt-8 flex flex-1 flex-col">
            <p className="text-sm font-medium text-[#525252] sm:text-base">
              Choose your account type to get started with BRAIN:
            </p>

            <div className="mt-5 space-y-3.5">
              {/* Option 1: Student */}
              <button
                type="button"
                id="signup-option-student"
                onClick={() => handleSelectRoleAndProceed("student")}
                className="group flex w-full items-center justify-between rounded-2xl border-2 border-[#e6e2f2] bg-white p-4 text-left transition-all hover:border-[#3f2f7a] hover:bg-[#fbf9fe] hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f2eefb] text-[#3f2f7a] transition-colors group-hover:bg-[#3f2f7a] group-hover:text-white">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold text-[#171717]">Student</span>
                      <span className="rounded-full bg-[#f0ecfa] px-2 py-0.5 text-xs font-semibold text-[#3f2f7a]">
                        Self Counselling
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#737373] sm:text-sm">
                      Create a student account to begin counselling, aptitude test, and track progress.
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-[#9ca3af] transition-transform group-hover:translate-x-1 group-hover:text-[#3f2f7a]" />
              </button>

              {/* Option 2: Parent */}
              <button
                type="button"
                id="signup-option-parent"
                onClick={() => handleSelectRoleAndProceed("parent")}
                className="group flex w-full items-center justify-between rounded-2xl border-2 border-[#e6e2f2] bg-white p-4 text-left transition-all hover:border-[#3f2f7a] hover:bg-[#fbf9fe] hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ecfdf5] text-[#059669] transition-colors group-hover:bg-[#059669] group-hover:text-white">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-semibold text-[#171717]">Parent</span>
                      <span className="rounded-full bg-[#e6f4ea] px-2 py-0.5 text-xs font-semibold text-[#0d652d]">
                        Student ID Required
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#737373] sm:text-sm">
                      Register as parent/guardian with your child&apos;s Student ID to track their reports & updates.
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-[#9ca3af] transition-transform group-hover:translate-x-1 group-hover:text-[#059669]" />
              </button>
            </div>

          </div>
        ) : (
          <div className="mt-5 flex flex-1 flex-col">
            {/* Header controls inside form: Back and Switcher */}
            <div className="flex flex-col gap-3">
              {modal && (
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="inline-flex items-center gap-1.5 self-start text-xs font-semibold text-[#3f2f7a] hover:underline"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to account options
                </button>
              )}

              {/* Segmented Role Switcher */}
              <div className="grid grid-cols-2 rounded-xl bg-[#f4f2f9] p-1">
                <button
                  type="button"
                  id="tab-role-student"
                  onClick={() => {
                    setRole("student");
                    setError(null);
                  }}
                  className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs sm:text-sm font-semibold transition-all ${
                    role === "student"
                      ? "bg-white text-[#3f2f7a] shadow-sm"
                      : "text-[#737373] hover:text-[#171717]"
                  }`}
                >
                  <GraduationCap className="h-4 w-4" /> Student
                </button>
                <button
                  type="button"
                  id="tab-role-parent"
                  onClick={() => {
                    setRole("parent");
                    setError(null);
                  }}
                  className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs sm:text-sm font-semibold transition-all ${
                    role === "parent"
                      ? "bg-white text-[#3f2f7a] shadow-sm"
                      : "text-[#737373] hover:text-[#171717]"
                  }`}
                >
                  <Users className="h-4 w-4" /> Parent
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-[#737373]">
                {role === "student" ? (
                  <span>Creating a student counselling account</span>
                ) : (
                  <span className="text-[#3f2f7a] font-medium">
                    Creating a parent account (linked via Student ID)
                  </span>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              {error && (
                <div role="alert" className="flex items-start gap-2 rounded-[10px] border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {activeFields.map((field, index) => {
                const Icon = field.icon;
                const fieldId = `${modal ? "modal-" : ""}join-${role}-${field.key}`;
                const label =
                  field.key === "fullName"
                    ? role === "parent"
                      ? "Parent / Guardian full name"
                      : "Student full name"
                    : field.label;

                return (
                  <div key={field.key}>
                    <div className="mb-1 flex items-center justify-between">
                      <label htmlFor={fieldId} className="block text-xs sm:text-sm font-semibold text-[#171717]">
                        {label}
                        {field.required && <span className="ml-1 text-[#e2231a]">*</span>}
                      </label>
                      {field.hint && (
                        <span className="text-[11px] text-[#3f2f7a] font-normal">{field.hint}</span>
                      )}
                    </div>
                    <div className="relative">
                      <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#737373]" />
                      <input
                        ref={index === 0 ? firstInput : undefined}
                        id={fieldId}
                        type={field.type}
                        autoComplete={field.autoComplete}
                        value={form[field.key]}
                        onChange={(event) =>
                          setForm((previous) => ({
                            ...previous,
                            [field.key]: event.target.value,
                          }))
                        }
                        placeholder={field.placeholder}
                        required={field.required}
                        minLength={field.key === "password" ? 6 : undefined}
                        className={`h-10 w-full rounded-[10px] border bg-white pl-10 pr-3.5 text-sm text-[#171717] outline-none transition-colors focus:ring-2 ${
                          field.key === "studentId"
                            ? "border-[#a78bfa] focus:border-[#3f2f7a] focus:ring-[#efeaf9] bg-[#fbf9fe]"
                            : "border-[#d8d5e6] focus:border-[#3f2f7a] focus:ring-[#efeaf9]"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}

              <button
                type="submit"
                id="submit-join-btn"
                disabled={loading}
                className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-[10px] bg-[#3f2f7a] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#2c2159] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Creating account...
                  </>
                ) : (
                  <>
                    Join as {role === "parent" ? "Parent" : "Student"}{" "}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        <p className="mt-auto pt-6 text-xs leading-relaxed text-[#737373]">
          {role === "student"
            ? "By joining, you agree to create a BRAIN student account. You can complete counselling booking after joining."
            : "By joining, you agree to create a BRAIN parent account linked to your child's student profile."}
        </p>
      </div>
    </div>
  );
}
