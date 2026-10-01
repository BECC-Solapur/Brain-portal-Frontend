"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { SignInPanel } from "@/components/SignInPanel";

function SignInPageContent() {
  const searchParams = useSearchParams();
  const requestedPath = searchParams.get("next");
  const nextPath = requestedPath?.startsWith("/") && !requestedPath.startsWith("//")
    ? requestedPath
    : "/portal";

  return <SignInPanel nextPath={nextPath} />;
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#e9eaf1] px-4 py-10 sm:px-6">
      <Suspense fallback={<Loader2 className="h-7 w-7 animate-spin text-[#3f2f7a]" />}>
        <SignInPageContent />
      </Suspense>
    </main>
  );
}
