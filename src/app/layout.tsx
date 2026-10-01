import type { Metadata } from "next";
import { Inter, Geist_Mono, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { InquiryProvider } from "@/lib/inquiry-context";
import { AuthProvider } from "@/lib/auth-context";
import { AuthGate } from "@/lib/require-auth";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist-mono",
  display: "swap",
});

const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  weight: ["400", "500", "600"],
  variable: "--font-devanagari",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BRAIN — Student Counselling & Inquiry Platform",
  description:
    "Next-generation student counselling, aptitude analysis, and guided career roadmaps.",
  icons: {
    icon: { url: "/brain-logo.svg", type: "image/svg+xml" },
    apple: "/images/Logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} ${devanagari.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#e9eaf1] text-[#171717] selection:bg-[#efeaf9] selection:text-[#3f2f7a]">
        <AuthProvider>
          <InquiryProvider>
            <AuthGate>{children}</AuthGate>
          </InquiryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
