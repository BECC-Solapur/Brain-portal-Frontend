"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Loader2, LockKeyhole, Mail, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import AuthPromoPanel from "@/components/AuthPromoPanel";

type SignInPanelProps = {
  modal?: boolean;
  nextPath?: string;
  onClose?: () => void;
  onJoin?: () => void;
};

export function SignInPanel({ modal = false, nextPath = "/portal", onClose, onJoin }: SignInPanelProps) {
  const router = useRouter();
  const { login, loading } = useAuth();
  const emailInput = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    emailInput.current?.focus();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    try {
      await login({ email: email.trim(), password });
      onClose?.();
      router.push(nextPath);
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : "Could not sign in. Please try again.");
    }
  };

  return (
    <div className="relative grid w-full max-w-[1060px] overflow-hidden rounded-[20px] bg-white shadow-[0_24px_80px_rgba(23,17,47,0.28)] lg:grid-cols-2">
      <AuthPromoPanel />

      <div className="relative flex min-h-[560px] flex-col bg-white px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
        {modal && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sign in"
            className="absolute right-5 top-5 rounded-full p-2 text-[#737373] transition-colors hover:bg-[#f6f3fb] hover:text-[#3f2f7a]"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        <div className="mt-5 lg:mt-8">
          <h1 id="sign-in-title" className="text-3xl font-semibold text-[#171717] sm:text-4xl">Sign in to your account</h1>
          <p className="mt-3 text-sm text-[#525252] sm:text-base">
            Don&apos;t have an account?{" "}
            {modal && onJoin ? (
              <button type="button" onClick={onJoin} className="font-semibold text-[#3f2f7a] underline underline-offset-4 hover:text-[#2c2159]">Join here</button>
            ) : (
              <Link href="/auth/signup" className="font-semibold text-[#3f2f7a] underline underline-offset-4 hover:text-[#2c2159]">Join here</Link>
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          {error && (
            <div role="alert" className="flex items-start gap-2 rounded-[10px] border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor={modal ? "modal-signin-email" : "signin-email"} className="mb-2 block text-sm font-semibold text-[#171717]">Email address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#737373]" />
              <input
                ref={emailInput}
                id={modal ? "modal-signin-email" : "signin-email"}
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="h-12 w-full rounded-[10px] border border-[#d8d5e6] bg-white pl-12 pr-4 text-base text-[#171717] outline-none transition-colors focus:border-[#3f2f7a] focus:ring-2 focus:ring-[#efeaf9]"
              />
            </div>
          </div>

          <div>
            <label htmlFor={modal ? "modal-signin-password" : "signin-password"} className="mb-2 block text-sm font-semibold text-[#171717]">Password</label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#737373]" />
              <input
                id={modal ? "modal-signin-password" : "signin-password"}
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                className="h-12 w-full rounded-[10px] border border-[#d8d5e6] bg-white pl-12 pr-4 text-base text-[#171717] outline-none transition-colors focus:border-[#3f2f7a] focus:ring-2 focus:ring-[#efeaf9]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#3f2f7a] px-5 text-base font-semibold text-white transition-colors hover:bg-[#2c2159] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Signing in...</> : <>Continue with email <ArrowRight className="h-5 w-5" /></>}
          </button>
        </form>

      </div>
    </div>
  );
}
