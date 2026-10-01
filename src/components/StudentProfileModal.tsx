"use client";

import { useEffect, useRef, useState } from "react";
import {
  X,
  GraduationCap,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Edit3,
  Camera,
  LogOut,
  Save,
  Loader2,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Lock,
  Award,
  KeyRound,
  FileText,
  Calendar,
  Activity,
  UserCheck,
  HeartHandshake,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useInquiry } from "@/lib/inquiry-context";
import api from "@/lib/api";
import type { StudentProfileData } from "@/lib/api-types";

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: string;
}

const DEFAULT_AVATARS: Record<string, string> = {
  SuperAdmin: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80",
  "Brain Admin": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240&auto=format&fit=crop&q=80",
  Counsellor: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=240&auto=format&fit=crop&q=80",
  Parent: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80",
  Student: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=240&auto=format&fit=crop&q=80",
};

function compressImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const maxDim = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
        resolve(dataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function StudentProfileModal({
  isOpen,
  onClose,
  role: roleProp,
}: StudentProfileModalProps) {
  const { user, logout, fetchMe } = useAuth();
  const { state: inquiryState, setPersonalDetails } = useInquiry();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Edit form state
  const [fullName, setFullName] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [address, setAddress] = useState("");
  const [schoolCollegeName, setSchoolCollegeName] = useState("");
  const [phone, setPhone] = useState("");

  // Determine effective role
  const effectiveRole: "SuperAdmin" | "Brain Admin" | "Counsellor" | "Student" | "Parent" = (() => {
    if (roleProp) {
      if (roleProp.toLowerCase().includes("superadmin")) return "SuperAdmin";
      if (roleProp.toLowerCase().includes("brain admin") || roleProp.toLowerCase() === "brain_admin") return "Brain Admin";
      if (roleProp.toLowerCase().includes("counsellor")) return "Counsellor";
      if (roleProp.toLowerCase().includes("parent")) return "Parent";
      if (roleProp.toLowerCase().includes("student")) return "Student";
    }
    const pRole = (user?.primaryRole || "").toLowerCase();
    const rolesArr = (user?.roles || []).map((r) => r.toLowerCase());
    if (pRole === "superadmin" || rolesArr.includes("superadmin")) return "SuperAdmin";
    if (pRole === "brain_admin" || rolesArr.includes("brain_admin")) return "Brain Admin";
    if (pRole === "counsellor" || rolesArr.includes("counsellor")) return "Counsellor";
    if (pRole === "parent" || rolesArr.includes("parent")) return "Parent";
    if (pRole === "student" || rolesArr.includes("student")) return "Student";
    return "Student";
  })();

  const defaultPhoto = DEFAULT_AVATARS[effectiveRole] || DEFAULT_AVATARS.Student;

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    // Initial base fields from user
    const userFullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
      (effectiveRole === "SuperAdmin" ? "Arpita Kulkarni"
        : effectiveRole === "Brain Admin" ? "Operations Administrator"
        : effectiveRole === "Counsellor" ? "Certified Counsellor"
        : effectiveRole === "Parent" ? "Parent User"
        : "Student");

    setFullName(userFullName);
    setPhone(user?.phone || "");

    const initialPhoto =
      user?.avatarUrl ||
      user?.photoUrl ||
      (effectiveRole === "Student" ? inquiryState.personalDetails?.photoUrl : null) ||
      defaultPhoto;
    setPhotoUrl(initialPhoto);

    // Only students have dedicated student-portal records with school and parent pairing
    if (effectiveRole === "Student") {
      api.studentPortal
        .getMyProfile()
        .then((data) => {
          if (!isMounted) return;
          setProfile(data);
          const pPhoto =
            data.photoUrl ||
            inquiryState.personalDetails?.photoUrl ||
            user?.avatarUrl ||
            user?.photoUrl ||
            defaultPhoto;
          setPhotoUrl(pPhoto);
          setFullName(data.fullName || userFullName);
          setAddress(data.address || user?.address || "");
          setSchoolCollegeName(data.schoolCollegeName || user?.schoolCollegeName || "");
          setPhone(data.phone || user?.phone || "");
        })
        .catch(() => {
          if (!isMounted) return;
          const fallbackData: StudentProfileData = {
            id: (user?.studentId as string) || (user?.id as string) || "",
            studentId: user?.registrationNumber || (user?.studentId as string) || "STU-72322074",
            registrationNumber: user?.registrationNumber || (user?.studentId as string) || "STU-72322074",
            fullName: userFullName,
            email: user?.email || "",
            phone: user?.phone || "",
            address: user?.address || "",
            schoolCollegeName: user?.schoolCollegeName || "",
            photoUrl: initialPhoto,
            parentConnected: Boolean(user?.parentConnected),
            parent: user?.connectedParent || null,
          };
          setProfile(fallbackData);
          setAddress(fallbackData.address);
          setSchoolCollegeName(fallbackData.schoolCollegeName);
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    } else {
      // Non-student accounts (SuperAdmin, Brain Admin, Counsellor, Parent)
      api.studentPortal
        .getMyProfile()
        .then((data) => {
          if (!isMounted) return;
          if (data.photoUrl) setPhotoUrl(data.photoUrl);
          if (data.phone) setPhone(data.phone);
          if (data.fullName) setFullName(data.fullName);
        })
        .catch(() => {
          // ignore non-student fallback
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen, user, effectiveRole, inquiryState.personalDetails, defaultPhoto]);

  if (!isOpen) return null;

  const currentFullName =
    fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    (effectiveRole === "SuperAdmin" ? "Arpita Kulkarni"
      : effectiveRole === "Brain Admin" ? "Operations Administrator"
      : effectiveRole === "Counsellor" ? "Certified Counsellor"
      : effectiveRole === "Parent" ? "Parent User"
      : "Student");

  const currentEmail = user?.email || (
    effectiveRole === "SuperAdmin" ? "arpskulkarni99@gmail.com"
      : effectiveRole === "Brain Admin" ? "admin@brain.edu"
      : effectiveRole === "Counsellor" ? "counselling@brain.edu"
      : effectiveRole === "Parent" ? "parent@example.com"
      : "student@example.com"
  );

  const studentIdDisplay =
    profile?.registrationNumber ||
    profile?.studentId ||
    user?.registrationNumber ||
    (user?.studentId as string) ||
    "STU-72322074";

  const currentPhoto = photoUrl || defaultPhoto;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Sync picture across system
  const syncPictureAcrossSystem = async (newPhoto: string) => {
    setPhotoUrl(newPhoto);

    if (effectiveRole === "Student") {
      setPersonalDetails({
        ...(inquiryState.personalDetails || {
          fullName: currentFullName,
          email: currentEmail,
          phone: phone || user?.phone || "",
          dateOfBirth: "",
          gender: "",
          address: address || "",
          city: "",
          state: "",
          pincode: "",
        }),
        photoUrl: newPhoto,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("brain_student_photo", newPhoto);
      }
    }

    try {
      await api.studentPortal.updateMyProfile({ photoUrl: newPhoto });
      await fetchMe();
      if (profile) {
        setProfile({ ...profile, photoUrl: newPhoto });
      }
    } catch {
      // non-blocking
    }
  };

  // File Upload Handler
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, JPEG, WEBP).");
      return;
    }

    setUploadingPhoto(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const compressedDataUrl = await compressImageFile(file);
      await syncPictureAcrossSystem(compressedDataUrl);
      setSuccessMessage("Profile photo updated successfully!");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to upload image. Please try again.");
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await api.studentPortal.updateMyProfile({
        photoUrl: photoUrl.trim() || undefined,
        address: effectiveRole === "Student" ? address.trim() || undefined : undefined,
        schoolCollegeName: effectiveRole === "Student" ? schoolCollegeName.trim() || undefined : undefined,
        phone: phone.trim() || undefined,
      });

      if (photoUrl.trim()) {
        await syncPictureAcrossSystem(photoUrl.trim());
      }

      await fetchMe();
      if (profile) {
        setProfile({
          ...profile,
          fullName: fullName.trim() || profile.fullName,
          photoUrl: photoUrl.trim() || profile.photoUrl,
          address: address.trim() || profile.address,
          schoolCollegeName: schoolCollegeName.trim() || profile.schoolCollegeName,
          phone: phone.trim() || profile.phone,
        });
      }
      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Role Theme Details
  const roleTheme = {
    SuperAdmin: {
      gradient: "from-[#170f38] via-[#281a57] to-[#3d2485]",
      badgeBg: "bg-amber-400/20 text-amber-200 border border-amber-400/30",
      badgeIcon: ShieldCheck,
      badgeLabel: "SUPERADMIN PROFILE",
      statusLabel: "Root Authority",
      roleCode: "MASTER_TENANT_ADMIN",
    },
    "Brain Admin": {
      gradient: "from-[#1b133d] via-[#2c1d5e] to-[#452b90]",
      badgeBg: "bg-emerald-500/20 text-emerald-200 border border-emerald-400/30",
      badgeIcon: Building2,
      badgeLabel: "BRAIN ADMIN PROFILE",
      statusLabel: "Operations Active",
      roleCode: "CENTER_OPERATIONS",
    },
    Counsellor: {
      gradient: "from-[#162035] via-[#21304f] to-[#324976]",
      badgeBg: "bg-sky-400/20 text-sky-200 border border-sky-400/30",
      badgeIcon: GraduationCap,
      badgeLabel: "COUNSELLOR PROFILE",
      statusLabel: "Certified Mentor",
      roleCode: "CERTIFIED_ADVISOR",
    },
    Parent: {
      gradient: "from-[#261842] via-[#38225d] to-[#512f86]",
      badgeBg: "bg-pink-400/20 text-pink-200 border border-pink-400/30",
      badgeIcon: Users,
      badgeLabel: "PARENT PROFILE",
      statusLabel: "Family Account",
      roleCode: "PARENT_GUARDIAN",
    },
    Student: {
      gradient: "from-[#271d52] via-[#37286d] to-[#4a368d]",
      badgeBg: "bg-purple-400/20 text-purple-200 border border-purple-400/30",
      badgeIcon: GraduationCap,
      badgeLabel: "STUDENT PROFILE",
      statusLabel: "Active Learner",
      roleCode: "STUDENT_PORTAL",
    },
  }[effectiveRole];

  const BadgeIcon = roleTheme.badgeIcon;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
    >
      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageFileChange}
        className="hidden"
      />

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#17112f]/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Container */}
      <div className="relative z-10 flex w-full max-w-xl flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_25px_70px_rgba(23,17,47,0.35)] animate-fade-in max-h-[92vh]">
        {/* Top Header Card */}
        <div className={`relative bg-gradient-to-br ${roleTheme.gradient} p-6 text-white sm:p-7`}>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
            {/* Avatar Photo Frame with Click-to-Upload */}
            <div className="relative shrink-0 self-start sm:self-center">
              <div
                onClick={() => fileInputRef.current?.click()}
                title="Click to upload a new picture"
                className="group relative h-20 w-20 cursor-pointer overflow-hidden rounded-2xl border-2 border-white/40 bg-white/10 shadow-lg sm:h-22 sm:w-22 transition-all hover:ring-2 hover:ring-white"
              >
                <img
                  src={currentPhoto}
                  alt={currentFullName}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Upload className="h-5 w-5 text-white" />
                  <span className="text-[10px] font-semibold text-white">Upload</span>
                </div>
                {uploadingPhoto && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <Loader2 className="h-6 w-6 animate-spin text-white" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Upload profile picture"
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#3f2f7a] shadow-md transition-transform hover:scale-110 active:scale-95 cursor-pointer"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Profile Info Summary */}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${roleTheme.badgeBg}`}>
                  <BadgeIcon className="h-3 w-3" /> {roleTheme.badgeLabel}
                </span>
                <span className="rounded-full bg-emerald-500/25 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-400/30">
                  {roleTheme.statusLabel}
                </span>
              </div>

              <h2
                id="profile-modal-title"
                className="mt-1.5 text-xl font-bold tracking-tight text-white sm:text-2xl truncate"
              >
                {currentFullName}
              </h2>

              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-purple-200/90">
                <span className="inline-flex items-center gap-1">
                  <Mail className="h-3 w-3 shrink-0 opacity-80" />
                  <span className="truncate max-w-[200px] sm:max-w-none">
                    {currentEmail}
                  </span>
                </span>
                {phone && (
                  <span className="inline-flex items-center gap-1">
                    <Phone className="h-3 w-3 shrink-0 opacity-80" />
                    <span>{phone}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <div className="self-end sm:self-center">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/25 active:scale-95"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit Details
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 hover:bg-white/20"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Quick upload button directly in header */}
          <div className="mt-3.5 flex items-center justify-between border-t border-white/10 pt-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" /> Upload picture
            </button>
            <span className="flex items-center gap-1 text-[11px] text-purple-200">
              <Sparkles className="h-3 w-3 text-purple-300" />
              {effectiveRole === "Student" ? "Synced with Inquiry Form" : "Active Portal Credentials"}
            </span>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-7 space-y-4">
          {/* Alerts */}
          {successMessage && (
            <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-xs font-medium text-green-800 animate-fade-in">
              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700 animate-fade-in">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ===================== EDIT FORM MODE ===================== */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4 pt-1">
              {/* Photo Upload Zone */}
              <div className="rounded-2xl border-2 border-dashed border-[#cbbfe6] bg-[#faf8fd] p-4 text-center transition-colors hover:border-[#3f2f7a]">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ede7f9] text-[#3f2f7a]">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-semibold text-[#3f2f7a] hover:underline"
                    >
                      Click to upload picture
                    </button>
                    <span className="text-xs text-[#737373]"> from your device</span>
                    <p className="mt-0.5 text-[11px] text-[#737373]">
                      Supports PNG, JPG, JPEG, WEBP (auto-scaled)
                    </p>
                  </div>
                </div>

                {/* Optional URL Toggle */}
                <div className="mt-3 border-t border-[#ede7f9] pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[11px] font-medium text-[#737373] hover:text-[#3f2f7a] underline"
                  >
                    {showUrlInput ? "Hide image URL field" : "Or enter direct image URL"}
                  </button>
                </div>

                {showUrlInput && (
                  <div className="mt-2 text-left">
                    <label className="mb-1 block text-[11px] font-semibold text-[#171717]">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="h-9 w-full rounded-lg border border-[#d8d5e6] px-3 text-xs text-[#171717] outline-none focus:border-[#3f2f7a]"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#171717]">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="h-10 w-full rounded-xl border border-[#d8d5e6] px-3.5 text-sm text-[#171717] outline-none focus:border-[#3f2f7a] focus:ring-2 focus:ring-[#efeaf9]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#171717]">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98230 11990"
                  className="h-10 w-full rounded-xl border border-[#d8d5e6] px-3.5 text-sm text-[#171717] outline-none focus:border-[#3f2f7a] focus:ring-2 focus:ring-[#efeaf9]"
                />
              </div>

              {/* Student-specific edit fields */}
              {effectiveRole === "Student" && (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#171717]">
                      School / College Name
                    </label>
                    <input
                      type="text"
                      value={schoolCollegeName}
                      onChange={(e) => setSchoolCollegeName(e.target.value)}
                      placeholder="Your school or college"
                      className="h-10 w-full rounded-xl border border-[#d8d5e6] px-3.5 text-sm text-[#171717] outline-none focus:border-[#3f2f7a] focus:ring-2 focus:ring-[#efeaf9]"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#171717]">
                      Residential Address
                    </label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Your residential address"
                      className="w-full rounded-xl border border-[#d8d5e6] p-3 text-sm text-[#171717] outline-none focus:border-[#3f2f7a] focus:ring-2 focus:ring-[#efeaf9]"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#3f2f7a] text-sm font-semibold text-white transition-colors hover:bg-[#2c2159] disabled:opacity-60 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Save Profile Details
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* ===================== VIEW MODE (ROLE-SPECIFIC) ===================== */
            <div className="space-y-3.5">
              {/* ---------------- 1. SUPERADMIN VIEW ---------------- */}
              {effectiveRole === "SuperAdmin" && (
                <>
                  {/* Master Authority Card */}
                  <div className="rounded-2xl border border-[#c9c2e3] bg-gradient-to-br from-[#f8f5fc] to-[#f0ebfa] p-4.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#3f2f7a] uppercase tracking-wider">
                        <ShieldCheck className="h-4 w-4 text-[#3f2f7a]" /> Master Authority &amp; System Scope
                      </div>
                      <span className="rounded-full bg-[#3f2f7a] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                        Enterprise Root
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl bg-white p-3 border border-[#e4dff2]">
                        <span className="text-[11px] text-[#737373] block">Administrative Level</span>
                        <span className="font-semibold text-sm text-[#171717]">Super Administrator</span>
                      </div>
                      <div className="rounded-xl bg-white p-3 border border-[#e4dff2]">
                        <span className="text-[11px] text-[#737373] block">Master Organization</span>
                        <span className="font-semibold text-sm text-[#171717]">BRAIN Educational Center</span>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-[#525252] leading-relaxed">
                      Root access enabled across multi-tenant centers. Full governance over student registration pipelines,
                      certified counsellor rosters, diagnostic appointments, and security audit logs.
                    </p>
                  </div>

                  {/* Governance Privileges Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-[#e6e2f2] bg-white p-4 shadow-sm space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#737373]">
                        <Building2 className="h-3.5 w-3.5 text-[#3f2f7a]" /> Headquarters &amp; Branches
                      </div>
                      <p className="text-sm font-semibold text-[#171717]">Pune Main Campus</p>
                      <p className="text-[11px] text-[#737373]">Primary Organization ID: #00000001</p>
                    </div>

                    <div className="rounded-2xl border border-[#e6e2f2] bg-white p-4 shadow-sm space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#737373]">
                        <KeyRound className="h-3.5 w-3.5 text-[#3f2f7a]" /> Access Privileges
                      </div>
                      <p className="text-sm font-semibold text-[#171717]">Unrestricted Root</p>
                      <p className="text-[11px] text-[#737373]">User Access · Roles · Audit Trail</p>
                    </div>
                  </div>

                  {/* Active Capabilities Checklist */}
                  <div className="rounded-2xl border border-[#e4dff2] bg-white p-4 text-xs space-y-2.5 shadow-sm">
                    <p className="font-semibold text-[#171717] flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-[#3f2f7a]" /> Active SuperAdmin Capabilities
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#525252]">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>Counsellor Onboarding &amp; Deletion</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>Cross-Branch User Provisioning</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>Full Activity &amp; Audit Trail Telemetry</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>System Settings &amp; Fee Configurations</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ---------------- 2. BRAIN ADMIN VIEW ---------------- */}
              {effectiveRole === "Brain Admin" && (
                <>
                  <div className="rounded-2xl border border-[#d8d5e6] bg-gradient-to-br from-[#faf8fd] to-[#f4effc] p-4.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#3f2f7a] uppercase tracking-wider">
                        <Building2 className="h-4 w-4 text-[#3f2f7a]" /> Campus Operations Administration
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                        Active Ops
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl bg-white p-3 border border-[#e4dff2]">
                        <span className="text-[11px] text-[#737373] block">Assigned Department</span>
                        <span className="font-semibold text-sm text-[#171717]">Admissions &amp; Operations</span>
                      </div>
                      <div className="rounded-xl bg-white p-3 border border-[#e4dff2]">
                        <span className="text-[11px] text-[#737373] block">Operational Campus</span>
                        <span className="font-semibold text-sm text-[#171717]">Pune Campus · Center 1</span>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-[#525252] leading-relaxed">
                      Coordinates walk-in inquiries, appointment scheduling, and fee reconciliation for all academic cohorts.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-[#e6e2f2] bg-white p-4 shadow-sm space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#737373]">
                        <Calendar className="h-3.5 w-3.5 text-[#3f2f7a]" /> Appointment Slots
                      </div>
                      <p className="text-sm font-semibold text-[#171717]">Daily Schedule Control</p>
                      <p className="text-[11px] text-[#737373]">In-Person &amp; Online Room Linkages</p>
                    </div>

                    <div className="rounded-2xl border border-[#e6e2f2] bg-white p-4 shadow-sm space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#737373]">
                        <FileText className="h-3.5 w-3.5 text-[#3f2f7a]" /> Fee Verification
                      </div>
                      <p className="text-sm font-semibold text-[#171717]">GST Ledgers &amp; Receipts</p>
                      <p className="text-[11px] text-[#737373]">Razorpay Gateway &amp; Cash Desks</p>
                    </div>
                  </div>
                </>
              )}

              {/* ---------------- 3. COUNSELLOR VIEW ---------------- */}
              {effectiveRole === "Counsellor" && (
                <>
                  <div className="rounded-2xl border border-[#d8d5e6] bg-gradient-to-br from-[#f8faff] to-[#eef4fe] p-4.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#1e3a8a] uppercase tracking-wider">
                        <GraduationCap className="h-4 w-4 text-[#1e3a8a]" /> Clinical &amp; Mentorship Portfolio
                      </div>
                      <span className="rounded-full bg-sky-100 px-2.5 py-0.5 text-[10px] font-bold text-sky-800">
                        Certified Advisor
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="rounded-xl bg-white p-3 border border-sky-100">
                        <span className="text-[11px] text-[#737373] block">Advisory Designation</span>
                        <span className="font-semibold text-sm text-[#171717]">Certified Career Counsellor</span>
                      </div>
                      <div className="rounded-xl bg-white p-3 border border-sky-100">
                        <span className="text-[11px] text-[#737373] block">Counseling Room</span>
                        <span className="font-semibold text-sm text-[#171717]">Pune Campus · Room 2B</span>
                      </div>
                    </div>

                    <div className="mt-3 rounded-xl bg-white p-3 border border-sky-100 text-xs">
                      <span className="text-[11px] text-[#737373] block mb-1">Specialization Domains</span>
                      <div className="flex flex-wrap gap-1.5">
                        {["Career Guidance", "Aptitude Assessment", "DAB-26 Psychometrics", "Cognitive Coaching"].map((tag) => (
                          <span key={tag} className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-800 border border-sky-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-[#e6e2f2] bg-white p-4 shadow-sm space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#737373]">
                        <Activity className="h-3.5 w-3.5 text-[#1e3a8a]" /> Student Cohorts
                      </div>
                      <p className="text-sm font-semibold text-[#171717]">Mapped Student Dossiers</p>
                      <p className="text-[11px] text-[#737373]">Daily check-ins &amp; action plan tracking</p>
                    </div>

                    <div className="rounded-2xl border border-[#e6e2f2] bg-white p-4 shadow-sm space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#737373]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#1e3a8a]" /> Session Conclusions
                      </div>
                      <p className="text-sm font-semibold text-[#171717]">Published Recommendations</p>
                      <p className="text-[11px] text-[#737373]">Synchronized to Student &amp; Parent portals</p>
                    </div>
                  </div>
                </>
              )}

              {/* ---------------- 4. PARENT VIEW ---------------- */}
              {effectiveRole === "Parent" && (
                <>
                  <div className="rounded-2xl border border-[#e6dced] bg-gradient-to-br from-[#fbf8fe] to-[#f4edfb] p-4.5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#4a2874] uppercase tracking-wider">
                        <Users className="h-4 w-4 text-[#4a2874]" /> Linked Student Account
                      </div>
                      <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-800">
                        Parent Account
                      </span>
                    </div>

                    <div className="mt-3 rounded-xl bg-white p-3.5 border border-[#e8dfef] text-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[#737373]">Account Status:</span>
                        <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Active Guardian Portal
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[#737373]">Associated Campus:</span>
                        <span className="font-semibold text-[#171717]">Pune Main Campus</span>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-[#525252] leading-relaxed">
                      You are connected to the official BRAIN parent portal. You can view daily updates, review psychologist conclusions,
                      and send continuous feedback to your child&apos;s assigned counsellor.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-[#e6e2f2] bg-white p-4 shadow-sm space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#737373]">
                        <Activity className="h-3.5 w-3.5 text-[#3f2f7a]" /> Daily Updates
                      </div>
                      <p className="text-sm font-semibold text-[#171717]">Ward Action Plans</p>
                      <p className="text-[11px] text-[#737373]">Daily check-ins &amp; routine tracking</p>
                    </div>

                    <div className="rounded-2xl border border-[#e6e2f2] bg-white p-4 shadow-sm space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#737373]">
                        <HeartHandshake className="h-3.5 w-3.5 text-[#3f2f7a]" /> Counsellor Feedback
                      </div>
                      <p className="text-sm font-semibold text-[#171717]">Direct Mentor Channel</p>
                      <p className="text-[11px] text-[#737373]">Voice &amp; text observation submissions</p>
                    </div>
                  </div>
                </>
              )}

              {/* ---------------- 5. STUDENT VIEW ---------------- */}
              {effectiveRole === "Student" && (
                <>
                  {/* Field 1: Student ID Card */}
                  <div className="rounded-2xl border border-[#e4dfef] bg-gradient-to-br from-[#faf8fd] to-[#f4effc] p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#3f2f7a]">
                        <GraduationCap className="h-4 w-4" /> Student ID / Registration No.
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(studentIdDisplay)}
                        className="flex items-center gap-1 rounded-lg border border-[#d8d5e6] bg-white px-2.5 py-1 text-xs font-semibold text-[#3f2f7a] shadow-sm transition-colors hover:bg-[#f6f3fb] cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-green-600" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" /> Copy ID
                          </>
                        )}
                      </button>
                    </div>

                    <div className="mt-2.5 flex items-baseline gap-2">
                      <span className="font-mono text-2xl font-bold tracking-tight text-[#171717]">
                        {studentIdDisplay}
                      </span>
                      <span className="rounded-full bg-[#ece5fa] px-2 py-0.5 text-[11px] font-semibold text-[#3f2f7a]">
                        Verified
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs text-[#737373]">
                      Share this ID with your parent to link their parent portal account.
                    </p>
                  </div>

                  {/* Field 2 & 3: School / College Name & Address */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex flex-col justify-between rounded-2xl border border-[#e6e2f2] bg-white p-4 shadow-sm">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#737373]">
                          <Building2 className="h-3.5 w-3.5 text-[#3f2f7a]" /> School / College Name
                        </div>
                        <p className="mt-2 text-sm font-semibold text-[#171717] leading-snug">
                          {profile?.schoolCollegeName || user?.schoolCollegeName || (
                            <span className="italic font-normal text-gray-400">Not specified</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between rounded-2xl border border-[#e6e2f2] bg-white p-4 shadow-sm">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#737373]">
                          <MapPin className="h-3.5 w-3.5 text-[#3f2f7a]" /> Residential Address
                        </div>
                        <p className="mt-2 text-sm font-semibold text-[#171717] leading-snug break-words">
                          {profile?.address || user?.address || (
                            <span className="italic font-normal text-gray-400">Not specified</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Field 4: Parent Profile Connected or Not */}
                  <div
                    className={`rounded-2xl border p-4.5 transition-all shadow-sm ${
                      profile?.parentConnected || user?.parentConnected
                        ? "border-green-200 bg-green-50/70"
                        : "border-amber-200 bg-amber-50/70"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                        <Users
                          className={`h-4 w-4 ${
                            profile?.parentConnected || user?.parentConnected
                              ? "text-green-700"
                              : "text-amber-700"
                          }`}
                        />
                        <span
                          className={
                            profile?.parentConnected || user?.parentConnected
                              ? "text-green-900"
                              : "text-amber-900"
                          }
                        >
                          Parent Profile
                        </span>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          profile?.parentConnected || user?.parentConnected
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {profile?.parentConnected || user?.parentConnected ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-700" /> Connected
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3.5 w-3.5 text-amber-700" /> Not Connected
                          </>
                        )}
                      </span>
                    </div>

                    {profile?.parentConnected && profile.parent ? (
                      <div className="mt-3 rounded-xl bg-white/90 p-3.5 text-xs space-y-1.5 border border-green-100 shadow-sm">
                        <div className="flex justify-between">
                          <span className="text-[#737373]">Parent Name:</span>
                          <span className="font-semibold text-[#171717]">
                            {profile.parent.fullName}
                          </span>
                        </div>
                        {profile.parent.phone && (
                          <div className="flex justify-between">
                            <span className="text-[#737373]">Phone:</span>
                            <span className="font-semibold text-[#171717]">
                              {profile.parent.phone}
                            </span>
                          </div>
                        )}
                        {profile.parent.email && (
                          <div className="flex justify-between">
                            <span className="text-[#737373]">Email:</span>
                            <span className="font-semibold text-[#171717]">
                              {profile.parent.email}
                            </span>
                          </div>
                        )}
                        {profile.parent.relationship && (
                          <div className="flex justify-between">
                            <span className="text-[#737373]">Relationship:</span>
                            <span className="font-semibold capitalize text-[#171717]">
                              {profile.parent.relationship}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-2.5 text-xs text-amber-950 leading-relaxed">
                        <p className="text-amber-900">
                          Your parent or guardian has not connected their account yet.
                        </p>
                        <p className="mt-1 text-amber-950">
                          They can select <strong className="font-semibold text-[#3f2f7a]">Parent</strong> on
                          the Sign Up page and enter your Student ID (
                          <strong className="whitespace-nowrap font-mono text-sm font-bold text-[#3f2f7a]">
                            {studentIdDisplay}
                          </strong>
                          ) to link accounts.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-[#faf9fc] px-6 py-4 sm:px-7">
          <button
            type="button"
            onClick={() => {
              logout();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 transition-colors hover:text-red-700 cursor-pointer"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#d8d5e6] bg-white px-5 py-2 text-xs font-semibold text-[#171717] shadow-sm transition-colors hover:bg-[#f6f3fb] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
