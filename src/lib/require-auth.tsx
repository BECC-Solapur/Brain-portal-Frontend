"use client";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

const PUBLIC_PREFIXES = [
  "/auth",
  "/about",
  "/counselling",
  "/consultancy",
  "/contact",
  "/programs",
  "/news",
  "/testimonials",
  "/calendar",
  "/session",
  "/conclusion",
  "/portal",
  "/health",
];

function isPublic(pathname: string): boolean {
  if (!pathname || pathname === "/") return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function AuthGate({ children }: { children: ReactNode }) {
  const { accessToken, user, loading, fetchMe } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (isPublic(pathname || "")) return;
      if (!accessToken) {
        router.replace(`/auth/login?next=${encodeURIComponent(pathname || "/portal")}`);
        return;
      }
      if (!user && !loading) {
        await fetchMe();
        if (cancelled) return;
      }
    })();
    return () => { cancelled = true; };
  }, [accessToken, user, loading, pathname, router, fetchMe]);

  if (isPublic(pathname || "")) return <>{children}</>;
  if (!accessToken) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6fa]">
      <Loader2 className="h-10 w-10 animate-spin text-[#3f2f7a]" />
    </div>
  );
  if (loading || (!user && accessToken)) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6fa]">
      <Loader2 className="h-10 w-10 animate-spin text-[#3f2f7a]" />
    </div>
  );
  return <>{children}</>;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  return <AuthGate>{children}</AuthGate>;
}

export default RequireAuth;
