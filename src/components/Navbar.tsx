"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  MessageCircle,
  UserSquare,
  School,
} from "lucide-react";
import Button from "@/components/Button";
import AuthModal, { type AuthMode } from "@/components/AuthModal";

export interface MenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  submenu?: MenuItem[];
  subtabs?: MenuItem[];
}

export const navItems: MenuItem[] = [
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Counselling",
    href: "/counselling",
    submenu: [
      {
        label: "Counselling Overview",
        href: "/counselling",
        icon: <MessageCircle className="w-4 h-4 text-[#3f2f7a]" />,
      },
      {
        label: "Student Counselling",
        href: "/counselling/student",
        icon: <UserSquare className="w-4 h-4 text-[#16a34a]" />,
      },
      {
        label: "School Counselling",
        href: "/counselling/school",
        icon: <School className="w-4 h-4 text-[#ea580c]" />,
      },
    ],
  },
  {
    label: "Consultancy",
    href: "/consultancy",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export default function Navbar({
  matchHeroBackground = false,
}: {
  matchHeroBackground?: boolean;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);
  const [openMobileSubtab, setOpenMobileSubtab] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileSubmenu = (label: string) => {
    setOpenMobileSubmenu((prev) => (prev === label ? null : label));
  };

  const toggleMobileSubtab = (label: string) => {
    setOpenMobileSubtab((prev) => (prev === label ? null : label));
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-150 ${
        scrolled
          ? `${matchHeroBackground ? "bg-[#e9eaf1]" : "bg-white"}`
          : `${matchHeroBackground ? "bg-[#e9eaf1]" : "bg-white"}`
      }`}
    >
      {/* Main Nav Container */}
      <div className="mx-auto flex h-24 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:h-28">
        {/* Brand Logo */}
        <Link href="/" aria-label="Home" className="flex items-center shrink-0">
          <Image
            src="/images/Logo.png"
            alt="Brains logo"
            width={258}
            height={56}
            className="h-auto w-[224px] object-contain mix-blend-multiply sm:w-[258px]"
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="ml-auto hidden items-center gap-1 text-sm font-medium text-[#171717] xl:flex">
          {navItems.map((item) => (
            <div key={item.label} className="relative group/menu py-2">
              <Link
                href={item.href}
                className="flex items-center gap-1 px-3 py-2 rounded-full hover:text-[#3f2f7a] hover:bg-[#f6f3fb] transition-colors"
              >
                <span>{item.label}</span>
                {item.submenu && (
                  <ChevronDown className="w-3 h-3 text-[#737373] transition-transform duration-150 group-hover/menu:rotate-180" />
                )}
              </Link>

              {/* Level 2 Submenu Dropdown */}
              {item.submenu && (
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all duration-150 transform translate-y-1 group-hover/menu:translate-y-0 z-50">
                  <div className="bg-white rounded-[12px] shadow-[rgba(0,0,0,0.08)_0px_4px_12px] border border-[#d8d5e6] p-1.5 min-w-[240px]">
                    {item.submenu.map((subItem) => (
                      <div key={subItem.label} className="relative group/subtab">
                        <Link
                          href={subItem.href}
                          className="flex items-center justify-between px-3 py-2 rounded-[8px] text-[#171717] hover:bg-[#f6f3fb] transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {subItem.icon}
                            <span className="text-xs font-medium">
                              {subItem.label}
                            </span>
                          </div>
                          {subItem.subtabs && (
                            <ChevronRight className="w-3 h-3 text-[#737373]" />
                          )}
                        </Link>

                        {/* Level 3 Nested Subtabs Flyout */}
                        {subItem.subtabs && (
                          <div className="absolute top-0 left-full ml-1 opacity-0 invisible group-hover/subtab:opacity-100 group-hover/subtab:visible transition-all duration-150 z-50">
                            <div className="bg-white rounded-[12px] shadow-[rgba(0,0,0,0.08)_0px_4px_12px] border border-[#d8d5e6] p-1.5 min-w-[200px]">
                              {subItem.subtabs.map((tab) => (
                                <Link
                                  key={tab.label}
                                  href={tab.href}
                                  className="flex items-center gap-2 px-3 py-2 rounded-[8px] text-xs font-medium text-[#171717] hover:bg-[#f6f3fb] transition-colors"
                                >
                                  {tab.icon}
                                  <span>{tab.label}</span>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <span aria-hidden="true" className="hidden h-7 w-px shrink-0 bg-[#c9c2e3] xl:block" />

        {/* CTA Button Cluster */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-4">
          <button type="button" onClick={() => { setIsMobileMenuOpen(false); setAuthMode("signIn"); }} className="whitespace-nowrap text-sm font-semibold text-[#171717] transition-colors hover:text-[#3f2f7a]">
            Sign in
          </button>
          <button type="button" onClick={() => { setIsMobileMenuOpen(false); setAuthMode("join"); }} className="inline-flex h-10 items-center justify-center rounded-[10px] bg-[#3f2f7a] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#2c2159] sm:h-12 sm:px-6">
            Register Now
          </button>
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-1.5 text-[#525252] hover:bg-[#f6f3fb] rounded-[8px] transition-colors ml-1"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Accordion Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white px-4 py-3 space-y-1 max-h-[80vh] overflow-y-auto shadow-sm">
          {navItems.map((item) => (
            <div key={item.label} className="pb-1">
              <div className="flex items-center justify-between">
                <Link
                  href={item.href}
                  onClick={() => !item.submenu && setIsMobileMenuOpen(false)}
                  className="text-xs font-semibold text-[#171717] py-2 hover:text-[#3f2f7a]"
                >
                  {item.label}
                </Link>
                {item.submenu && (
                  <button
                    onClick={() => toggleMobileSubmenu(item.label)}
                    className="p-1.5 text-[#737373] hover:text-[#171717]"
                  >
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        openMobileSubmenu === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>

              {/* Mobile Submenu Level 2 */}
              {item.submenu && openMobileSubmenu === item.label && (
                <div className="pl-3 pb-1 space-y-1 bg-[#f6f3fb] rounded-[8px] p-2 my-1">
                  {item.submenu.map((subItem) => (
                    <div key={subItem.label}>
                      <div className="flex items-center justify-between">
                        <Link
                          href={subItem.href}
                          onClick={() => !subItem.subtabs && setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2 text-xs font-medium text-[#525252] py-1.5 hover:text-[#171717]"
                        >
                          {subItem.icon}
                          <span>{subItem.label}</span>
                        </Link>
                        {subItem.subtabs && (
                          <button
                            onClick={() => toggleMobileSubtab(subItem.label)}
                            className="p-1 text-[#737373]"
                          >
                            <ChevronDown
                              className={`w-3 h-3 transition-transform ${
                                openMobileSubtab === subItem.label ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Mobile Subtabs Level 3 */}
                      {subItem.subtabs && openMobileSubtab === subItem.label && (
                        <div className="pl-5 py-1 space-y-1">
                          {subItem.subtabs.map((tab) => (
                            <Link
                              key={tab.label}
                              href={tab.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-2 text-xs text-[#737373] py-1 hover:text-[#171717]"
                            >
                              {tab.icon}
                              <span>{tab.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Quick CTAs in Mobile Menu */}
          <div className="pt-3 flex flex-col gap-2">
            <Link href="/portal" onClick={() => setIsMobileMenuOpen(false)}>
              <Button fullWidth variant="secondary">
                Staff / Admin Workspace
              </Button>
            </Link>
          </div>
        </div>
      )}
      {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onModeChange={setAuthMode} />}
    </header>
  );
}
