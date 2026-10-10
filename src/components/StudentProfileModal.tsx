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
  const { user, fetchMe } = useAuth();
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
    ((user as any)?.username as string) ||
    (effectiveRole === "SuperAdmin" ? "Arpita Kulkarni"
      : effectiveRole === "Brain Admin" ? "admin"
      : effectiveRole === "Counsellor" ? "Dr. Ananya Sharma"
      : effectiveRole === "Parent" ? "Kiran Kulkarni"
      : "Nothing233");

  const currentEmail = user?.email || (
    effectiveRole === "SuperAdmin" ? "arpskulkarni99@gmail.com"
      : effectiveRole === "Brain Admin" ? "admin@123.com"
      : effectiveRole === "Counsellor" ? "counselling@brain.edu"
      : effectiveRole === "Parent" ? "becc.leat122@gmail.com"
      : "nothingg668955@gmail.com"
  );

  const currentPhone =
    phone ||
    user?.phone ||
    (effectiveRole === "Parent" ? "8998884877"
      : effectiveRole === "Counsellor" ? "+91 98230 11990"
      : "+91 98230 11990");

  const studentIdDisplay =
    profile?.registrationNumber ||
    profile?.studentId ||
    user?.registrationNumber ||
    (user?.studentId as string) ||
    "STU-12096653";

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

  // Dedicated SuperAdmin Profile Card Layout
  if (effectiveRole === "SuperAdmin") {
    return (
      <div
        className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="superadmin-profile-title"
      >
        {/* Hidden File Input for Image Upload */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageFileChange}
          className="hidden"
        />

        {/* Website Backdrop */}
        <div
          className="fixed inset-0 bg-[#17112f]/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* SuperAdmin Card in Website Color Scheme */}
        <div className="relative z-10 w-full max-w-[580px] rounded-[22px] bg-white border border-[#d8d5e6] p-7 sm:p-8 shadow-[0_25px_70px_rgba(44,33,89,0.18)] animate-fade-in text-[#171717] font-sans">
          {/* Status Alerts */}
          {successMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800 animate-fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-800 animate-fade-in">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Header Row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar Frame */}
              <div
                onClick={() => fileInputRef.current?.click()}
                title="Click to upload profile picture"
                className="group relative h-16 w-16 sm:h-[68px] sm:w-[68px] shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-[#d8d5e6] bg-[#f6f3fb] shadow-sm transition-all hover:ring-2 hover:ring-[#3f2f7a]/40"
              >
                <img
                  src={currentPhoto}
                  alt={currentFullName}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#3f2f7a]/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <Upload className="h-4 w-4 text-white" />
                </div>
                {uploadingPhoto && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  </div>
                )}
              </div>

              {/* Identity Info */}
              <div>
                <h2
                  id="superadmin-profile-title"
                  className="text-lg sm:text-[19px] font-bold tracking-tight text-[#171717] leading-snug"
                >
                  {currentFullName}
                </h2>
                <p className="mt-0.5 text-xs sm:text-[13px] text-[#737373]">
                  {currentEmail}
                </p>
                <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#efeaf9] border border-[#d8d5e6] px-2.5 py-0.5 text-xs sm:text-[13px] font-semibold text-[#3f2f7a]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#3f2f7a]" />
                  <span>Super Administrator</span>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="rounded-full border border-[#d8d5e6] hover:border-[#3f2f7a] bg-white hover:bg-[#f6f3fb] px-4 py-1 text-xs sm:text-[13px] font-semibold text-[#171717] hover:text-[#3f2f7a] transition-all cursor-pointer shadow-sm"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>

          {/* Edit Mode */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="mt-6 space-y-4 pt-4 border-t border-[#efeaf9]">
              <div className="rounded-2xl border-2 border-dashed border-[#cbbfe6] bg-[#faf8fd] p-3.5 text-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-[#3f2f7a] hover:underline cursor-pointer"
                >
                  Upload new picture from device
                </button>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[11px] text-[#737373] hover:text-[#3f2f7a] underline cursor-pointer"
                  >
                    {showUrlInput ? "Hide image URL field" : "Or paste image URL"}
                  </button>
                </div>
                {showUrlInput && (
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="mt-2 h-9 w-full rounded-xl border border-[#d8d5e6] bg-white px-3 text-xs text-[#171717] outline-none focus:border-[#3f2f7a] focus:ring-2 focus:ring-[#efeaf9]"
                  />
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
                  placeholder="Arpita Kulkarni"
                  className="h-9 w-full rounded-xl border border-[#d8d5e6] bg-white px-3 text-xs sm:text-sm text-[#171717] outline-none focus:border-[#3f2f7a] focus:ring-2 focus:ring-[#efeaf9]"
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
                  className="h-9 w-full rounded-xl border border-[#d8d5e6] bg-white px-3 text-xs sm:text-sm text-[#171717] outline-none focus:border-[#3f2f7a] focus:ring-2 focus:ring-[#efeaf9]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-[#3f2f7a] hover:bg-[#2c2159] text-xs sm:text-sm font-semibold text-white transition-colors cursor-pointer disabled:opacity-60 shadow-sm"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" /> Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="h-9 rounded-full border border-[#d8d5e6] hover:border-[#3f2f7a] bg-white hover:bg-[#f6f3fb] px-5 text-xs sm:text-sm font-semibold text-[#171717] transition-colors cursor-pointer shadow-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* View Mode */
            <>
              {/* Clean Faint Divider Line */}
              <div className="my-6 border-b border-[#efeaf9]" />

              {/* Organization access */}
              <div>
                <h3 className="text-sm sm:text-[15px] font-bold text-[#171717]">
                  Organization access
                </h3>
                <div className="mt-4 space-y-3.5 text-xs sm:text-sm">
                  <div className="flex items-baseline">
                    <span className="w-32 sm:w-36 shrink-0 text-[#737373]">Organization</span>
                    <span className="font-bold text-[#171717]">BRAIN Educational Center</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-32 sm:w-36 shrink-0 text-[#737373]">Location</span>
                    <span className="font-medium text-[#171717]">Pune Main Campus</span>
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div className="mt-7">
                <h3 className="text-sm sm:text-[15px] font-bold text-[#171717] mb-2.5">
                  Permissions
                </h3>
                <p className="text-xs sm:text-sm text-[#525252] leading-relaxed">
                  User management · Roles · Audit logs · System settings
                </p>
              </div>

              {/* Footer */}
              <div className="mt-8 sm:mt-10 flex items-center justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 px-6 py-2 text-sm font-semibold text-[#111827] transition-all cursor-pointer shadow-sm"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Dedicated Student Profile Card Layout (Matching provided design)
  if (effectiveRole === "Student") {
    const currentPhone = phone || user?.phone || profile?.phone || "7585898223";
    const currentSchool = schoolCollegeName || profile?.schoolCollegeName || user?.schoolCollegeName || "wcas";
    const currentAddress = address || profile?.address || user?.address || "solapur";
    const parentName = profile?.parent?.fullName || (user as any)?.parentName || "Kiran Kulkarni";
    const parentPhone = profile?.parent?.phone || (user as any)?.parentPhone || "8998884877";
    const parentEmail = profile?.parent?.email || (user as any)?.parentEmail || "becc.leat122@gmail.com";
    const isParentConnected = profile?.parentConnected ?? (Boolean(profile?.parent) || true);

    return (
      <div
        className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-profile-title"
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
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Student Profile Card Container */}
        <div className="relative z-10 w-full max-w-[620px] rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-100 font-sans animate-fade-in text-[#111827]">
          {/* Close 'X' Button in Top Right */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-lg cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Status Alerts */}
          {successMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800 animate-fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-800 animate-fade-in">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Header Row */}
          <div className="flex items-center gap-4 pr-8">
            {/* Circular Avatar */}
            <div
              onClick={() => fileInputRef.current?.click()}
              title="Click to upload profile picture"
              className="group relative h-16 w-16 sm:h-[72px] sm:w-[72px] shrink-0 cursor-pointer overflow-hidden rounded-full border border-gray-200 bg-gray-100 shadow-sm transition-all hover:ring-2 hover:ring-purple-400"
            >
              <img
                src={currentPhoto}
                alt={currentFullName}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Upload className="h-4 w-4 text-white" />
              </div>
              {uploadingPhoto && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                </div>
              )}
            </div>

            {/* Identity Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center flex-wrap gap-2">
                <h2
                  id="student-profile-title"
                  className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827] leading-tight"
                >
                  {currentFullName}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#f3e8ff] px-2.5 py-0.5 text-xs font-semibold text-[#7e22ce]">
                  <GraduationCap className="h-3.5 w-3.5 text-[#7e22ce]" />
                  <span>Student</span>
                </span>
              </div>

              <div className="mt-1.5 flex items-center flex-wrap gap-x-2 gap-y-1 text-xs sm:text-[13px] text-[#6b7280]">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-[#6b7280] shrink-0" />
                  <span>{currentEmail}</span>
                </span>
                <span className="text-gray-300">|</span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#6b7280] shrink-0" />
                  <span>{currentPhone}</span>
                </span>
              </div>
            </div>

            {/* Edit details button on top right */}
            <div className="ml-auto self-center pl-2">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#7c3aed] hover:text-[#6d28d9] transition-colors cursor-pointer"
              >
                <Edit3 className="h-4 w-4" />
                <span>{isEditing ? "Cancel" : "Edit details"}</span>
              </button>
            </div>
          </div>

          {/* Edit Mode Form */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="mt-6 space-y-4 pt-4 border-t border-gray-100">
              <div className="rounded-2xl border-2 border-dashed border-[#cbbfe6] bg-[#faf8fd] p-3.5 text-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-[#3f2f7a] hover:underline cursor-pointer"
                >
                  Upload new picture from device
                </button>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[11px] text-[#737373] hover:text-[#3f2f7a] underline cursor-pointer"
                  >
                    {showUrlInput ? "Hide image URL field" : "Or paste image URL"}
                  </button>
                </div>
                {showUrlInput && (
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="mt-2 h-9 w-full rounded-xl border border-[#d8d5e6] bg-white px-3 text-xs text-[#171717] outline-none focus:border-[#3f2f7a] focus:ring-2 focus:ring-[#efeaf9]"
                  />
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
                  placeholder="Nothing233"
                  className="h-9 w-full rounded-xl border border-[#d8d5e6] bg-white px-3 text-xs sm:text-sm text-[#171717] outline-none focus:border-[#3f2f7a] focus:ring-2 focus:ring-[#efeaf9]"
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
                  placeholder="7585898223"
                  className="h-9 w-full rounded-xl border border-[#d8d5e6] bg-white px-3 text-xs sm:text-sm text-[#171717] outline-none focus:border-[#3f2f7a] focus:ring-2 focus:ring-[#efeaf9]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#171717]">
                  School / College Name
                </label>
                <input
                  type="text"
                  value={schoolCollegeName}
                  onChange={(e) => setSchoolCollegeName(e.target.value)}
                  placeholder="wcas"
                  className="h-9 w-full rounded-xl border border-[#d8d5e6] bg-white px-3 text-xs sm:text-sm text-[#171717] outline-none focus:border-[#3f2f7a] focus:ring-2 focus:ring-[#efeaf9]"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#171717]">
                  Residential Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="solapur"
                  className="h-9 w-full rounded-xl border border-[#d8d5e6] bg-white px-3 text-xs sm:text-sm text-[#171717] outline-none focus:border-[#3f2f7a] focus:ring-2 focus:ring-[#efeaf9]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-xs sm:text-sm font-semibold text-white transition-colors cursor-pointer disabled:opacity-60 shadow-sm"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" /> Save Profile Details
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="h-9 rounded-xl border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 px-5 text-xs sm:text-sm font-semibold text-[#111827] transition-colors cursor-pointer shadow-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* View Mode */
            <>
              {/* Divider Line */}
              <div className="my-6 border-b border-gray-100" />

              {/* Student ID Row */}
              <div className="flex items-center">
                <span className="text-xs sm:text-sm text-[#6b7280] w-36 sm:w-44 shrink-0">
                  Student ID
                </span>
                <span className="text-base sm:text-lg font-bold text-[#111827]">
                  {studentIdDisplay}
                </span>
                <span className="ml-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Verified</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(studentIdDisplay)}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-[#4b5563] hover:bg-gray-50 transition-colors cursor-pointer shadow-sm"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-[#6b7280]" />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>
              </div>

              {/* School / College Row */}
              <div className="my-3.5 border-b border-gray-100" />
              <div className="flex items-baseline">
                <span className="text-xs sm:text-sm text-[#6b7280] w-36 sm:w-44 shrink-0">
                  School / College
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#111827]">
                  {currentSchool}
                </span>
              </div>

              {/* Residential Address Row */}
              <div className="my-3.5 border-b border-gray-100" />
              <div className="flex items-baseline">
                <span className="text-xs sm:text-sm text-[#6b7280] w-36 sm:w-44 shrink-0">
                  Residential Address
                </span>
                <span className="text-xs sm:text-sm font-semibold text-[#111827]">
                  {currentAddress}
                </span>
              </div>

              {/* Parent Account Section */}
              <div className="mt-7">
                <div className="flex items-center justify-between mb-3.5">
                  <h3 className="text-base font-bold text-[#111827]">Parent account</h3>
                  {isParentConnected ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" /> Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600">
                      <span className="h-2 w-2 rounded-full bg-amber-500" /> Not connected
                    </span>
                  )}
                </div>

                {/* Parent Name */}
                <div className="flex items-baseline">
                  <span className="text-xs sm:text-sm text-[#6b7280] w-36 sm:w-44 shrink-0">
                    Parent Name
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-[#111827]">
                    {parentName}
                  </span>
                </div>

                {/* Phone */}
                <div className="my-3.5 border-b border-gray-100" />
                <div className="flex items-baseline">
                  <span className="text-xs sm:text-sm text-[#6b7280] w-36 sm:w-44 shrink-0">
                    Phone
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-[#111827]">
                    {parentPhone}
                  </span>
                </div>

                {/* Email */}
                <div className="my-3.5 border-b border-gray-100" />
                <div className="flex items-baseline">
                  <span className="text-xs sm:text-sm text-[#6b7280] w-36 sm:w-44 shrink-0">
                    Email
                  </span>
                  <span className="text-xs sm:text-sm font-medium text-[#111827]">
                    {parentEmail}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 sm:mt-10 flex items-center justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 px-6 py-2 text-sm font-semibold text-[#111827] transition-all cursor-pointer shadow-sm"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Dedicated Brain Admin Profile Card Layout (Matching provided design)
  if (effectiveRole === "Brain Admin") {
    return (
      <div
        className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-profile-title"
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
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Brain Admin Profile Card Container */}
        <div className="relative z-10 w-full max-w-[620px] rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-100 font-sans animate-fade-in text-[#111827]">
          {/* Close 'X' Button in Top Right */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-lg cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Status Alerts */}
          {successMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800 animate-fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-800 animate-fade-in">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Header Row */}
          <div className="flex items-center gap-4 pr-8">
            {/* Circular Avatar with Active Status Dot */}
            <div className="relative shrink-0">
              <div
                onClick={() => fileInputRef.current?.click()}
                title="Click to upload profile picture"
                className="group relative h-16 w-16 sm:h-[72px] sm:w-[72px] cursor-pointer overflow-hidden rounded-full border border-gray-200 bg-gray-100 shadow-sm transition-all hover:ring-2 hover:ring-purple-400"
              >
                <img
                  src={currentPhoto}
                  alt={currentFullName}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Upload className="h-4 w-4 text-white" />
                </div>
                {uploadingPhoto && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  </div>
                )}
              </div>
              <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
            </div>

            {/* Identity Info */}
            <div className="min-w-0 flex-1">
              <h2
                id="admin-profile-title"
                className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827] leading-tight"
              >
                {currentFullName}
              </h2>
              <p className="mt-0.5 text-xs sm:text-[13px] text-[#6b7280]">
                {currentEmail}
              </p>
              <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#f3e8ff] px-2.5 py-0.5 text-[11px] font-semibold text-[#7e22ce] uppercase tracking-wider">
                <Building2 className="h-3 w-3 text-[#7e22ce]" />
                <span>BRAIN ADMIN PROFILE</span>
              </div>
            </div>

            {/* Edit details button on top right */}
            <div className="ml-auto self-center pl-2">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 hover:border-purple-300 bg-white hover:bg-purple-50 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#7e22ce] transition-colors cursor-pointer shadow-sm"
              >
                <Edit3 className="h-4 w-4" />
                <span>{isEditing ? "Cancel" : "Edit Details"}</span>
              </button>
            </div>
          </div>

          {/* Edit Mode Form */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="mt-6 space-y-4 pt-4 border-t border-gray-100">
              <div className="rounded-2xl border-2 border-dashed border-[#cbbfe6] bg-[#faf8fd] p-3.5 text-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-[#3f2f7a] hover:underline cursor-pointer"
                >
                  Upload new picture from device
                </button>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[11px] text-[#737373] hover:text-[#3f2f7a] underline cursor-pointer"
                  >
                    {showUrlInput ? "Hide image URL field" : "Or paste image URL"}
                  </button>
                </div>
                {showUrlInput && (
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="mt-2 h-9 w-full rounded-xl border border-[#d8d5e6] bg-white px-3 text-xs text-[#171717] outline-none focus:border-[#3f2f7a] focus:ring-2 focus:ring-[#efeaf9]"
                  />
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
                  placeholder="admin"
                  className="h-9 w-full rounded-xl border border-[#d8d5e6] bg-white px-3 text-xs sm:text-sm text-[#171717] outline-none focus:border-[#3f2f7a] focus:ring-2 focus:ring-[#efeaf9]"
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
                  className="h-9 w-full rounded-xl border border-[#d8d5e6] bg-white px-3 text-xs sm:text-sm text-[#171717] outline-none focus:border-[#3f2f7a] focus:ring-2 focus:ring-[#efeaf9]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-xs sm:text-sm font-semibold text-white transition-colors cursor-pointer disabled:opacity-60 shadow-sm"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" /> Save Profile Details
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="h-9 rounded-xl border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 px-5 text-xs sm:text-sm font-semibold text-[#111827] transition-colors cursor-pointer shadow-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* View Mode */
            <>
              {/* Divider Line */}
              <div className="my-6 border-b border-gray-100" />

              {/* Assigned Department Row */}
              <div className="flex items-baseline">
                <span className="text-xs sm:text-sm text-[#6b7280] w-36 sm:w-44 shrink-0">
                  Assigned Department
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#111827]">
                  Admissions & Operations
                </span>
              </div>

              {/* Operational Campus Row */}
              <div className="my-3.5 border-b border-gray-100" />
              <div className="flex items-baseline">
                <span className="text-xs sm:text-sm text-[#6b7280] w-36 sm:w-44 shrink-0">
                  Operational Campus
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#111827]">
                  Pune Campus · Center 1
                </span>
              </div>

              {/* Description Paragraph */}
              <div className="my-3.5 border-b border-gray-100" />
              <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
                Coordinates walk-in inquiries, appointment scheduling, and fee reconciliation for all academic cohorts.
              </p>

              {/* Operational Features */}
              <div className="my-4 border-b border-gray-100" />
              <div className="space-y-2">
                {/* Daily Schedule Control */}
                <div className="flex items-center gap-3.5 py-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3e8ff] text-[#7e22ce] shrink-0">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#111827]">Daily Schedule Control</p>
                    <p className="text-[11px] sm:text-xs text-[#6b7280]">In-Person & Online Room Linkages</p>
                  </div>
                </div>

                {/* GST Ledgers & Receipts */}
                <div className="flex items-center gap-3.5 py-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3e8ff] text-[#7e22ce] shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#111827]">GST Ledgers & Receipts</p>
                    <p className="text-[11px] sm:text-xs text-[#6b7280]">Razorpay Gateway & Cash Desks</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 sm:mt-10 flex items-center justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 px-6 py-2 text-sm font-semibold text-[#111827] transition-all cursor-pointer shadow-sm"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Dedicated Parent Profile Card Layout (Matching provided design)
  if (effectiveRole === "Parent") {
    const currentPhone = phone || user?.phone || "8998884877";

    return (
      <div
        className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="parent-profile-title"
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
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Parent Profile Card Container */}
        <div className="relative z-10 w-full max-w-[620px] rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-100 font-sans animate-fade-in text-[#111827]">
          {/* Close 'X' Button in Top Right */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-lg cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Status Alerts */}
          {successMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800 animate-fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-800 animate-fade-in">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Header Row */}
          <div className="flex items-center gap-4 pr-8">
            {/* Circular Avatar */}
            <div
              onClick={() => fileInputRef.current?.click()}
              title="Click to upload profile picture"
              className="group relative h-16 w-16 sm:h-[72px] sm:w-[72px] shrink-0 cursor-pointer overflow-hidden rounded-full border border-gray-200 bg-gray-100 shadow-sm transition-all hover:ring-2 hover:ring-purple-400"
            >
              <img
                src={currentPhoto}
                alt={currentFullName}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Upload className="h-4 w-4 text-white" />
              </div>
              {uploadingPhoto && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                </div>
              )}
            </div>

            {/* Identity Info */}
            <div className="min-w-0 flex-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f3e8ff] px-2.5 py-0.5 text-[11px] font-semibold text-[#7e22ce] uppercase tracking-wider mb-1">
                <Users className="h-3 w-3 text-[#7e22ce]" />
                <span>PARENT PROFILE</span>
              </div>
              <h2
                id="parent-profile-title"
                className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827] leading-tight"
              >
                {currentFullName}
              </h2>
              <div className="mt-1 flex items-center flex-wrap gap-x-2 gap-y-1 text-xs sm:text-[13px] text-[#6b7280]">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-[#6b7280] shrink-0" />
                  <span>{currentEmail}</span>
                </span>
                <span className="text-gray-300">|</span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#6b7280] shrink-0" />
                  <span>{currentPhone}</span>
                </span>
              </div>
            </div>

            {/* Edit details button on top right */}
            <div className="ml-auto self-center pl-2">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 hover:border-purple-300 bg-white hover:bg-purple-50 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#7e22ce] transition-colors cursor-pointer shadow-sm"
              >
                <Edit3 className="h-4 w-4" />
                <span>{isEditing ? "Cancel" : "Edit Details"}</span>
              </button>
            </div>
          </div>

          {/* Edit Mode Form */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="mt-6 space-y-4 pt-4 border-t border-gray-100">
              <div className="rounded-2xl border-2 border-dashed border-[#cbbfe6] bg-[#faf8fd] p-3.5 text-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-[#3f2f7a] hover:underline cursor-pointer"
                >
                  Upload new picture from device
                </button>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[11px] text-[#737373] hover:text-[#3f2f7a] underline cursor-pointer"
                  >
                    {showUrlInput ? "Hide image URL field" : "Or paste image URL"}
                  </button>
                </div>
                {showUrlInput && (
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="mt-2 h-9 w-full rounded-xl border border-[#d8d5e6] bg-white px-3 text-xs text-[#171717] outline-none focus:border-[#3f2f7a] focus:ring-2 focus:ring-[#efeaf9]"
                  />
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
                  placeholder="Kiran Kulkarni"
                  className="h-9 w-full rounded-xl border border-[#d8d5e6] bg-white px-3 text-xs sm:text-sm text-[#171717] outline-none focus:border-[#3f2f7a] focus:ring-2 focus:ring-[#efeaf9]"
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
                  placeholder="8998884877"
                  className="h-9 w-full rounded-xl border border-[#d8d5e6] bg-white px-3 text-xs sm:text-sm text-[#171717] outline-none focus:border-[#3f2f7a] focus:ring-2 focus:ring-[#efeaf9]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-xs sm:text-sm font-semibold text-white transition-colors cursor-pointer disabled:opacity-60 shadow-sm"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" /> Save Profile Details
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="h-9 rounded-xl border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 px-5 text-xs sm:text-sm font-semibold text-[#111827] transition-colors cursor-pointer shadow-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* View Mode */
            <>
              {/* Divider Line */}
              <div className="my-6 border-b border-gray-100" />

              {/* Linked Student Account Header Row */}
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#111827] uppercase tracking-wider">
                  <Users className="h-4 w-4 text-[#7e22ce]" />
                  <span>LINKED STUDENT ACCOUNT</span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Active
                </span>
              </div>

              {/* Account Status Row */}
              <div className="my-3.5 border-b border-gray-100" />
              <div className="flex items-baseline">
                <span className="text-xs sm:text-sm text-[#6b7280] w-36 sm:w-44 shrink-0">
                  Account Status
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#111827]">
                  Active Guardian Portal
                </span>
              </div>

              {/* Associated Campus Row */}
              <div className="my-3.5 border-b border-gray-100" />
              <div className="flex items-baseline">
                <span className="text-xs sm:text-sm text-[#6b7280] w-36 sm:w-44 shrink-0">
                  Associated Campus
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#111827]">
                  Pune Main Campus
                </span>
              </div>

              {/* Operational Features */}
              <div className="my-4 border-b border-gray-100" />
              <div className="space-y-2">
                {/* Daily Updates */}
                <div className="flex items-center gap-3.5 py-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3e8ff] text-[#7e22ce] shrink-0">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#111827]">Daily Updates</p>
                    <p className="text-[11px] sm:text-xs text-[#6b7280]">Ward action plans · Daily check-ins &amp; routine tracking</p>
                  </div>
                </div>

                {/* Counsellor Feedback */}
                <div className="flex items-center gap-3.5 py-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3e8ff] text-[#7e22ce] shrink-0">
                    <HeartHandshake className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#111827]">Counsellor Feedback</p>
                    <p className="text-[11px] sm:text-xs text-[#6b7280]">Direct mentor channel · Voice &amp; text observation submissions</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 sm:mt-10 flex items-center justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 px-6 py-2 text-sm font-semibold text-[#111827] transition-all cursor-pointer shadow-sm"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Dedicated Counsellor Profile Card Layout (Matching provided design)
  if (effectiveRole === "Counsellor") {
    return (
      <div
        className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="counsellor-profile-title"
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
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />

        {/* Counsellor Profile Card Container */}
        <div className="relative z-10 w-full max-w-[620px] rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-gray-100 font-sans animate-fade-in text-[#111827]">
          {/* Close 'X' Button in Top Right */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-5 top-5 p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-lg cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Status Alerts */}
          {successMessage && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800 animate-fade-in">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-800 animate-fade-in">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Header Row */}
          <div className="flex items-start gap-4 sm:gap-5 pr-8">
            {/* Circular Avatar */}
            <div
              onClick={() => fileInputRef.current?.click()}
              title="Click to change photo"
              className="group relative h-16 w-16 sm:h-[72px] sm:w-[72px] shrink-0 cursor-pointer overflow-hidden rounded-full border border-gray-200 bg-gray-100 shadow-sm transition-all hover:ring-2 hover:ring-purple-400"
            >
              <img
                src={currentPhoto}
                alt={currentFullName}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera className="h-4 w-4 text-white" />
              </div>
              {uploadingPhoto && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <Loader2 className="h-5 w-5 animate-spin text-white" />
                </div>
              )}
            </div>

            {/* Identity Info */}
            <div className="min-w-0 flex-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f3e8ff] px-2.5 py-0.5 text-[11px] font-semibold text-[#7e22ce] uppercase tracking-wider mb-1">
                <GraduationCap className="h-3 w-3 text-[#7e22ce]" />
                <span>COUNSELLOR PROFILE</span>
              </div>
              <h2
                id="counsellor-profile-title"
                className="text-xl sm:text-2xl font-bold tracking-tight text-[#111827] leading-tight"
              >
                {currentFullName}
              </h2>
              <div className="mt-1 flex items-center flex-wrap gap-x-2 gap-y-1 text-xs sm:text-[13px] text-[#6b7280]">
                <span className="inline-flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-[#6b7280] shrink-0" />
                  <span>{currentEmail}</span>
                </span>
                <span className="text-gray-300">|</span>
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-[#6b7280] shrink-0" />
                  <span>{currentPhone}</span>
                </span>
              </div>
            </div>

            {/* Edit details button on top right */}
            <div className="ml-auto self-center pl-2">
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 hover:border-purple-300 bg-white hover:bg-purple-50 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#7e22ce] transition-colors cursor-pointer shadow-sm"
              >
                <Edit3 className="h-4 w-4" />
                <span>{isEditing ? "Cancel" : "Edit Details"}</span>
              </button>
            </div>
          </div>

          {/* Edit Mode Form */}
          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="mt-6 space-y-4 pt-4 border-t border-gray-100">
              <div className="rounded-2xl border-2 border-dashed border-[#cbbfe6] bg-[#faf8fd] p-3.5 text-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-semibold text-[#3f2f7a] hover:underline cursor-pointer"
                >
                  Upload new picture from device
                </button>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[11px] text-[#737373] hover:text-[#3f2f7a] underline cursor-pointer"
                  >
                    {showUrlInput ? "Hide image URL field" : "Or paste image URL"}
                  </button>
                </div>
                {showUrlInput && (
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="mt-2 h-9 w-full rounded-xl border border-[#d8d5e6] bg-white px-3 text-xs text-[#171717] outline-none focus:border-[#3f2f7a] focus:ring-2 focus:ring-[#efeaf9]"
                  />
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
                  placeholder="Dr. Ananya Sharma"
                  className="h-9 w-full rounded-xl border border-[#d8d5e6] bg-white px-3 text-xs sm:text-sm text-[#171717] outline-none focus:border-[#3f2f7a] focus:ring-2 focus:ring-[#efeaf9]"
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
                  className="h-9 w-full rounded-xl border border-[#d8d5e6] bg-white px-3 text-xs sm:text-sm text-[#171717] outline-none focus:border-[#3f2f7a] focus:ring-2 focus:ring-[#efeaf9]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-xs sm:text-sm font-semibold text-white transition-colors cursor-pointer disabled:opacity-60 shadow-sm"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-3.5 w-3.5" /> Save Profile Details
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="h-9 rounded-xl border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 px-5 text-xs sm:text-sm font-semibold text-[#111827] transition-colors cursor-pointer shadow-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            /* View Mode */
            <>
              {/* Divider Line */}
              <div className="my-6 border-b border-gray-100" />

              {/* Clinical & Mentorship Portfolio Header Row */}
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#111827] uppercase tracking-wider">
                  <GraduationCap className="h-4 w-4 text-[#7e22ce]" />
                  <span>CLINICAL &amp; MENTORSHIP PORTFOLIO</span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Certified Advisor
                </span>
              </div>

              {/* Advisory Designation Row */}
              <div className="my-3.5 border-b border-gray-100" />
              <div className="flex items-baseline">
                <span className="text-xs sm:text-sm text-[#6b7280] w-36 sm:w-44 shrink-0">
                  Advisory Designation
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#111827]">
                  Certified Career Counsellor
                </span>
              </div>

              {/* Counseling Room Row */}
              <div className="my-3.5 border-b border-gray-100" />
              <div className="flex items-baseline">
                <span className="text-xs sm:text-sm text-[#6b7280] w-36 sm:w-44 shrink-0">
                  Counseling Room
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#111827]">
                  Pune Campus · Room 2B
                </span>
              </div>

              {/* Specializations Row */}
              <div className="my-3.5 border-b border-gray-100" />
              <div className="flex items-start">
                <span className="text-xs sm:text-sm text-[#6b7280] w-36 sm:w-44 shrink-0 pt-0.5">
                  Specialization Domains
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {["Career Guidance", "Aptitude Assessment", "DAB-26 Psychometrics", "Cognitive Coaching"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#f3e8ff] px-2.5 py-0.5 text-[11px] font-semibold text-[#7e22ce] border border-[#e9d5ff]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Operational Features */}
              <div className="my-4 border-b border-gray-100" />
              <div className="space-y-2">
                {/* Student Cohorts */}
                <div className="flex items-center gap-3.5 py-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3e8ff] text-[#7e22ce] shrink-0">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#111827]">Student Cohorts</p>
                    <p className="text-[11px] sm:text-xs text-[#6b7280]">
                      Mapped Student Dossiers · Daily check-ins &amp; action plan tracking
                    </p>
                  </div>
                </div>

                {/* Session Conclusions */}
                <div className="flex items-center gap-3.5 py-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3e8ff] text-[#7e22ce] shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-[#111827]">Session Conclusions</p>
                    <p className="text-[11px] sm:text-xs text-[#6b7280]">
                      Published Recommendations · Synchronized to Student &amp; Parent portals
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 sm:mt-10 flex items-center justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 px-6 py-2 text-sm font-semibold text-[#111827] transition-all cursor-pointer shadow-sm"
                >
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
}
