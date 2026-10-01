"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { SignInPanel } from "@/components/SignInPanel";
import JoinPanel from "@/components/JoinPanel";

export type AuthMode = "signIn" | "join";

export default function AuthModal({ mode, nextPath = "/portal", onClose, onModeChange }: {
  mode: AuthMode;
  nextPath?: string;
  onClose: () => void;
  onModeChange: (mode: AuthMode) => void;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-7"
      role="dialog"
      aria-modal="true"
      aria-labelledby={mode === "join" ? "join-title" : "sign-in-title"}
    >
      <button
        type="button"
        aria-label={mode === "join" ? "Close join form" : "Close sign in"}
        onClick={onClose}
        className="fixed inset-0 cursor-default bg-[#17112f]/75 backdrop-blur-[3px]"
      />
      <div className="relative z-10 flex w-full justify-center">
        {mode === "join" ? (
          <JoinPanel modal onClose={onClose} onSignIn={() => onModeChange("signIn")} />
        ) : (
          <SignInPanel modal nextPath={nextPath} onClose={onClose} onJoin={() => onModeChange("join")} />
        )}
      </div>
    </div>,
    document.body,
  );
}
