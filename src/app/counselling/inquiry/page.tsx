"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Printer, ArrowRight, ArrowLeft, Brain } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useInquiry } from "@/lib/inquiry-context";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import type { PerformanceRow } from "@/lib/types";

export function OfficialInquiryForm({ embedded = false }: { embedded?: boolean }) {
  const router = useRouter();
  const { user, fetchMe } = useAuth();
  const { state, setPersonalDetails, setEducationalDetails, setPreferences } =
    useInquiry();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Form State initialized from InquiryContext
  const [formDate, setFormDate] = useState<string>(
    state.personalDetails?.formDate ||
      new Date().toISOString().split("T")[0]
  );
  const [regNo, setRegNo] = useState<string>(
    state.personalDetails?.regNo || user?.registrationNumber || "585"
  );
  const [fullName, setFullName] = useState<string>(
    state.personalDetails?.fullName || ""
  );
  const [address, setAddress] = useState<string>(
    state.personalDetails?.address || ""
  );
  const [addressLine2, setAddressLine2] = useState<string>("");
  const [phone, setPhone] = useState<string>(
    state.personalDetails?.phone || ""
  );
  const [email, setEmail] = useState<string>(
    state.personalDetails?.email || ""
  );
  const [standard, setStandard] = useState<string>(
    state.educationalDetails?.currentClass || ""
  );
  const [school, setSchool] = useState<string>(
    state.educationalDetails?.school || ""
  );
  const [photoUrl, setPhotoUrl] = useState<string>(
    state.personalDetails?.photoUrl || ""
  );

  // Auto-sync photo and details from authenticated student profile
  useEffect(() => {
    const studentPhoto =
      state.personalDetails?.photoUrl ||
      user?.photoUrl ||
      user?.avatarUrl ||
      (typeof window !== "undefined" ? localStorage.getItem("brain_student_photo") : null);

    if (studentPhoto && !photoUrl) {
      setPhotoUrl(studentPhoto);
    }

    if (user) {
      const studentName = [user.firstName, user.lastName].filter(Boolean).join(" ");
      if (!fullName && studentName) setFullName(studentName);
      if (!phone && user.phone) setPhone(user.phone);
      if (!email && user.email) setEmail(user.email);
      if (!address && user.address) setAddress(user.address);
      if (!school && user.schoolCollegeName) setSchool(user.schoolCollegeName);
    }
  }, [user, state.personalDetails]); // eslint-disable-line react-hooks/exhaustive-deps

  // Table State (Default 3 rows)
  const [perfRows, setPerfRows] = useState<PerformanceRow[]>(
    state.educationalDetails?.performanceTable || [
      { subject: "", standard: "", t1: "", t2: "", t3: "", t4: "", t5: "", marksAvg: "" },
      { subject: "", standard: "", t1: "", t2: "", t3: "", t4: "", t5: "", marksAvg: "" },
      { subject: "", standard: "", t1: "", t2: "", t3: "", t4: "", t5: "", marksAvg: "" },
    ]
  );

  // Field Items 7-11
  const [subjectsOfLiking, setSubjectsOfLiking] = useState<string>(
    state.preferences?.subjectOfInterest || ""
  );
  const [subjectsEasy, setSubjectsEasy] = useState<string>(
    state.preferences?.subjectsEasy || ""
  );
  const [subjectsDifficult, setSubjectsDifficult] = useState<string>(
    state.preferences?.subjectsDifficult || state.preferences?.challenges || ""
  );
  const [teacherOfLiking, setTeacherOfLiking] = useState<string>(
    state.preferences?.teacherOfLiking || ""
  );
  const [whatYouWantToBe, setWhatYouWantToBe] = useState<string>(
    state.preferences?.whatYouWantToBe || state.preferences?.careerGoals || ""
  );
  const [branch, setBranch] = useState<string>(
    state.preferences?.branch || ""
  );

  // Field Items 12-20
  const [idealPersonality, setIdealPersonality] = useState<string>(
    state.preferences?.idealPersonality || ""
  );
  const [sports, setSports] = useState<string>(
    state.preferences?.sports || ""
  );
  const [tvChannel, setTvChannel] = useState<string>(
    state.preferences?.tvChannel || ""
  );
  const [closeRelative, setCloseRelative] = useState<string>(
    state.preferences?.closeRelative || ""
  );
  const [awardsCertificates, setAwardsCertificates] = useState<string>(
    state.preferences?.awardsCertificates || ""
  );
  const [computerCompetency, setComputerCompetency] = useState<string>(
    state.preferences?.computerCompetency || ""
  );
  const [closeFriends, setCloseFriends] = useState<string>(
    state.preferences?.closeFriends || ""
  );
  const [otherCloseRelatives, setOtherCloseRelatives] = useState<string>(
    state.preferences?.otherCloseRelatives || ""
  );
  const [whichMobile, setWhichMobile] = useState<string>(
    state.preferences?.whichMobile || ""
  );

  // Counsellor Observations
  const [counsellorObservations, setCounsellorObservations] = useState<string>(
    state.preferences?.counsellorObservations || ""
  );

  const [formPage, setFormPage] = useState<1 | 2>(1);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleNextPage = () => {
    if (!fullName.trim()) {
      setValidationError("Full Name (पूर्ण नाव) is required.");
      window.scrollTo({ top: 200, behavior: "smooth" });
      return;
    }

    if (!phone.trim()) {
      setValidationError("Mobile No. is required.");
      window.scrollTo({ top: 200, behavior: "smooth" });
      return;
    }

    setValidationError(null);
    setFormPage(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevPage = () => {
    setFormPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle Photo Upload with Auto-Sync to Student Profile
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        setPhotoUrl(result);
        if (typeof window !== "undefined") {
          localStorage.setItem("brain_student_photo", result);
        }
        setPersonalDetails({
          ...(state.personalDetails || {
            fullName: fullName || "Student",
            email: email || "student@example.com",
            phone: phone || "9876543210",
            dateOfBirth: formDate || new Date().toISOString().split("T")[0],
            gender: "Not specified",
            address: address || "",
            city: "Solapur",
            state: "Maharashtra",
            pincode: "413001",
          }),
          formDate,
          regNo,
          fullName,
          address,
          phone,
          email,
          photoUrl: result,
        });

        // Automatically sync to student profile in DB
        if (user) {
          try {
            await api.studentPortal.updateMyProfile({ photoUrl: result });
            fetchMe?.();
          } catch {
            // non-blocking
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Performance Row update helper
  const updateRow = (index: number, key: keyof PerformanceRow, value: string) => {
    const updated = [...perfRows];
    updated[index] = { ...updated[index], [key]: value };
    setPerfRows(updated);
  };

  const addPerfRow = () => {
    setPerfRows([
      ...perfRows,
      { subject: "", standard: "", t1: "", t2: "", t3: "", t4: "", t5: "", marksAvg: "" },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      setValidationError("Full Name (पूर्ण नाव) is required.");
      window.scrollTo({ top: 300, behavior: "smooth" });
      return;
    }

    if (!phone.trim()) {
      setValidationError("Mobile No. is required.");
      window.scrollTo({ top: 300, behavior: "smooth" });
      return;
    }

    setValidationError(null);

    // Save to InquiryContext
    setPersonalDetails({
      fullName,
      email: email || "student@example.com",
      phone,
      dateOfBirth: formDate,
      gender: "Not specified",
      address: addressLine2 ? `${address}, ${addressLine2}` : address,
      city: "Solapur / Pune",
      state: "Maharashtra",
      pincode: "411001",
      photoUrl,
      regNo,
      formDate,
    });

    setEducationalDetails({
      currentClass: standard,
      school,
      board: "State / CBSE",
      percentage: perfRows[0]?.marksAvg || "N/A",
      performanceTable: perfRows,
    });

    setPreferences({
      subjectOfInterest: subjectsOfLiking || "General Guidance",
      careerGoals: whatYouWantToBe || "Career Guidance",
      challenges: subjectsDifficult || "Academic improvement",
      preferredLanguage: "English / Marathi",
      followUpFrequency: "weekly",
      subjectsEasy,
      subjectsDifficult,
      teacherOfLiking,
      whatYouWantToBe,
      branch,
      idealPersonality,
      sports,
      tvChannel,
      closeRelative,
      awardsCertificates,
      computerCompetency,
      closeFriends,
      otherCloseRelatives,
      whichMobile,
      counsellorObservations,
    });

    router.push(embedded ? "/portal" : "/counselling/student");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`${embedded ? "" : "min-h-screen"} flex flex-col bg-[#e9eaf1] text-[#171717]`}>
      <div className={`flex-1 w-full max-w-5xl mx-auto px-2 sm:px-4 ${embedded ? "py-2" : "lg:px-6 pt-6 lg:pt-8 pb-8"} flex flex-col items-start gap-6`}>
        <div className="flex-1 min-w-0">
          {validationError && (
            <div className="max-w-6xl mx-auto px-4 w-full mb-4 print:hidden">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center justify-between">
                <span>{validationError}</span>
                <button
                  onClick={() => setValidationError(null)}
                  className="text-red-500 font-bold ml-4 hover:text-red-800"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Main Content Area containing the authentic form cards */}
          <main className="pb-16">


        <form onSubmit={handleSubmit} className="page-wrap parent-style-form font-poppins">
          {/* Inline Styles derived from form.html */}
          <style jsx global>{`
            :root {
              --purple: #3f2f7a;
              --purple-dark: #2c2159;
              --purple-line: #5b4aa0;
              --red: #e2231a;
              --navy: #2b2e83;
              --gray: #6b6b6b;
              --lightgray: #8a8a8a;
              --table-head-bg: #efeaf9;
              --gold: #f4c76a;
              --paper: #ffffff;
              --page-bg: #e9eaf1;
              --line: #9a9a9a;
            }

            .font-poppins {
              font-family: var(--font-poppins), 'Poppins', sans-serif;
            }

            .devanagari {
              font-family: var(--font-devanagari), 'Noto Sans Devanagari', 'Poppins', sans-serif;
            }

            .page-wrap {
              max-width: 1600px;
              margin: 0;
              display: flex;
              flex-wrap: wrap;
              justify-content: flex-start;
              gap: 20px;
            }

            .disha-card {
              position: relative;
              width: 760px;
              max-width: 100%;
              background: var(--paper);
              border: 1px solid #d8d5e6;
              border-radius: 20px;
              box-shadow: 0 6px 22px rgba(63, 47, 122, 0.14);
              padding: 22px 26px 46px 26px;
              overflow: hidden;
            }

            .disha-wave {
              position: absolute;
              left: 0;
              right: 0;
              bottom: 0;
              width: 100%;
              height: 38px;
              display: block;
            }

            /* HEADER */
            .disha-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              gap: 14px;
              padding-bottom: 12px;
            }

            .disha-brand {
              display: flex;
              align-items: center;
              gap: 12px;
            }

            .disha-brand-text .tagline {
              font-size: 13px;
              font-weight: 700;
              color: var(--purple);
              font-family: serif, 'Times New Roman', Georgia;
              margin-bottom: 1px;
            }

            .disha-brand-row {
              display: flex;
              align-items: center;
              gap: 8px;
            }

            .disha-brand-name {
              font-size: 38px;
              font-weight: 900;
              color: #d91b1b;
              font-family: serif, 'Times New Roman', Georgia;
              letter-spacing: 0.5px;
              line-height: 1;
            }

            .disha-globe-img {
              height: 44px;
              width: auto;
              object-fit: contain;
              margin-left: 2px;
            }

            .disha-brand-sub {
              font-size: 14.5px;
              font-weight: 700;
              color: #1a1a1a;
              font-family: serif, 'Times New Roman', Georgia;
              line-height: 1.2;
              margin-top: 3px;
            }

            .disha-contact {
              text-align: right;
              min-width: 250px;
            }
            .disha-contact .name {
              font-size: 16px;
              font-weight: 800;
              color: var(--purple);
              font-family: serif, 'Times New Roman', Georgia;
              line-height: 1.2;
            }
            .disha-contact .role2 {
              font-size: 12px;
              font-weight: 700;
              color: #111;
              margin-top: 1px;
            }
            .disha-contact .role {
              font-size: 12px;
              font-weight: 700;
              color: #111;
              margin-bottom: 4px;
            }
            .disha-contact .contact-list {
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              gap: 3px;
            }
            .disha-contact .line {
              font-size: 11.5px;
              font-weight: 600;
              color: #111;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              gap: 6px;
            }
            .disha-contact .badge {
              width: 17px;
              height: 17px;
              border-radius: 50%;
              background-color: var(--purple);
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
            }

            /* SUB BAR & OFFICE LINE TRIPLE RULE DESIGN */
            .disha-subbar-container {
              border-top: 2px solid var(--purple);
              border-bottom: 2px solid var(--purple);
              margin-top: 4px;
            }
            .disha-subbar-row {
              font-size: 12px;
              font-weight: 700;
              color: var(--purple);
              text-align: center;
              padding: 5px 8px;
              border-bottom: 1.5px solid var(--purple);
              letter-spacing: 0.1px;
            }
            .disha-officeline-row {
              font-size: 11px;
              font-weight: 700;
              color: var(--purple);
              text-align: center;
              padding: 4px 8px;
            }

            /* TITLE ROW */
            .disha-titlebar {
              display: flex;
              align-items: flex-start;
              justify-content: space-between;
              margin-top: 16px;
              gap: 10px;
            }
            .disha-reg {
              font-size: 12px;
              font-weight: 700;
              color: #1c1c1c;
              white-space: nowrap;
              padding-top: 8px;
            }
            .disha-reg span {
              color: var(--red);
              font-size: 19px;
              font-weight: 800;
              margin-left: 4px;
            }
            .disha-titleblock {
              text-align: center;
              flex: 1;
            }
            .disha-titleblock h1 {
              font-size: 29px;
              font-weight: 800;
              color: var(--navy);
              margin: 0;
              letter-spacing: 0.3px;
            }
            .disha-pill {
              display: inline-block;
              margin-top: 6px;
              padding: 4px 22px;
              border: 2px solid var(--purple);
              border-radius: 20px;
              font-size: 13px;
              font-weight: 700;
              color: var(--purple);
            }
            .disha-datefield {
              font-size: 12px;
              font-weight: 700;
              white-space: nowrap;
              padding-top: 8px;
              display: flex;
              align-items: center;
            }

            /* BODY LAYOUT */
            .disha-body-row {
              display: flex;
              gap: 18px;
              margin-top: 16px;
            }
            .disha-fields-col {
              flex: 1;
              min-width: 0;
            }
            .disha-photo-box {
              width: 112px;
              flex-shrink: 0;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              border: 1.5px dashed var(--purple-line);
              border-radius: 6px;
              padding: 8px 6px;
              height: 140px;
              gap: 6px;
              cursor: pointer;
              background: #faf8ff;
              transition: all 0.2s ease;
              position: relative;
              overflow: hidden;
            }
            .disha-photo-box:hover {
              background: #f1edff;
              border-color: var(--purple);
            }
            .disha-photo-box span {
              font-size: 10px;
              font-weight: 700;
              letter-spacing: 1.5px;
              color: #9a92c0;
            }

            .disha-field {
              margin-bottom: 13px;
            }
            .disha-field .row {
              display: flex;
              align-items: baseline;
              gap: 6px;
            }
            .disha-field label {
              font-size: 13.5px;
              font-weight: 600;
              color: #161616;
              white-space: nowrap;
            }
            .disha-input {
              flex: 1;
              border: none;
              border-bottom: 1px solid var(--line);
              background: transparent;
              font-size: 13.5px;
              font-family: inherit;
              padding: 2px 4px;
              min-width: 20px;
              color: #111;
              transition: border-color 0.2s;
            }
            .disha-input:focus {
              outline: none;
              border-bottom: 2px solid var(--purple);
              background: rgba(63, 47, 122, 0.03);
            }
            .disha-field .mr {
              font-size: 10.5px;
              color: var(--gray);
              margin-top: 1px;
            }
            .disha-split {
              display: flex;
              gap: 22px;
            }
            .disha-split .disha-field {
              flex: 1;
            }

            /* SECTION LABEL */
            .disha-section-label {
              font-size: 14px;
              font-weight: 700;
              color: var(--purple);
              margin: 14px 0 8px 0;
            }

            /* TABLE */
            table.disha-perf {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 16px;
            }
            table.disha-perf th,
            table.disha-perf td {
              border: 1px solid #c9c2e3;
              font-size: 11px;
              text-align: center;
              padding: 4px 2px;
            }
            table.disha-perf th {
              background: var(--table-head-bg);
              color: var(--purple);
              font-weight: 700;
            }
            table.disha-perf th .mr {
              display: block;
              font-size: 9px;
              font-weight: 500;
              color: var(--gray);
              margin-top: 1px;
            }
            table.disha-perf td input {
              width: 100%;
              border: none;
              text-align: center;
              background: transparent;
              font-size: 12px;
              padding: 2px 0;
            }
            table.disha-perf td input:focus {
              outline: none;
              background: rgba(63, 47, 122, 0.05);
            }

            /* ICON ITEMS */
            .disha-icon-item {
              display: flex;
              align-items: flex-start;
              gap: 10px;
              margin-bottom: 13px;
            }
            .disha-num {
              font-size: 13.5px;
              font-weight: 700;
              color: #161616;
              padding-top: 5px;
            }
            .disha-icon-circle {
              width: 32px;
              height: 32px;
              border-radius: 50%;
              border: 2px solid var(--purple);
              display: flex;
              align-items: center;
              justify-content: center;
              flex-shrink: 0;
              background: #fbfaff;
            }
            .disha-icon-item .disha-field {
              flex: 1;
              margin-bottom: 0;
            }

            .disha-num-field {
              display: flex;
              align-items: flex-start;
              gap: 8px;
              margin-bottom: 13px;
            }
            .disha-num-field .disha-field {
              flex: 1;
              margin-bottom: 0;
            }
            .disha-num-field .disha-num {
              padding-top: 4px;
            }

            /* OBSERVATIONS */
            .disha-obs-title {
              display: flex;
              align-items: baseline;
              gap: 8px;
              margin-top: 6px;
            }
            .disha-star {
              color: var(--purple);
              font-size: 15px;
            }

            /* SIGNATURES / MINI TABLES */
            .disha-bottom-row {
              display: flex;
              gap: 16px;
              margin-top: 22px;
              align-items: flex-start;
            }
            .disha-sign-col {
              flex: 0 0 158px;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              height: 190px;
            }
            .disha-sign-col .sig {
              font-size: 12.5px;
              font-weight: 700;
              color: #161616;
            }
            .disha-sign-col .sig-line {
              border-bottom: 1.5px solid var(--purple);
              width: 130px;
              height: 34px;
              margin-top: 4px;
            }
            .disha-mini-table-wrap {
              flex: 1;
              min-width: 0;
            }
            .disha-mini-table-wrap h4 {
              font-size: 12.5px;
              font-weight: 700;
              color: var(--red);
              margin: 0 0 6px 0;
            }
            table.disha-mini {
              width: 100%;
              border-collapse: collapse;
            }
            table.disha-mini th,
            table.disha-mini td {
              border: 1px solid #c9c2e3;
              font-size: 10.5px;
              padding: 4px;
              text-align: center;
            }
            table.disha-mini th {
              background: var(--table-head-bg);
              color: var(--purple);
              font-weight: 700;
            }
            table.disha-mini td {
              height: 20px;
            }

            /* Student portal presentation mirrors the parent inquiry form. */
            .parent-style-form.page-wrap {
              width: 100%;
              max-width: 1024px;
              margin: 0 auto;
              display: block;
            }
            .parent-style-form .disha-card {
              width: 100%;
              border: 1px solid #c9c2e3;
              border-radius: 16px;
              padding: 28px 32px 34px;
              box-shadow: 0 1px 3px rgba(44, 33, 89, 0.08);
            }
            .parent-style-form .disha-wave {
              display: none;
            }
            .parent-style-form .disha-subbar-container {
              margin: 18px -32px 24px;
              border: 0;
              border-top: 1px solid #d8d5e6;
              border-bottom: 1px solid #d8d5e6;
              background: linear-gradient(90deg, #f0e9f8, #ffffff, #fff4e1);
              padding: 5px 24px;
            }
            .parent-style-form .disha-subbar-row,
            .parent-style-form .disha-officeline-row {
              border: 0;
            }
            .parent-style-form .disha-section-label {
              margin: 26px 0 14px;
              padding-top: 20px;
              border-top: 1px solid #eeeaf5;
              font-size: 17px;
            }
            .parent-style-form .disha-field {
              margin-bottom: 18px;
            }
            .parent-style-form .disha-field .row {
              align-items: stretch;
              flex-direction: column;
              gap: 7px;
            }
            .parent-style-form .disha-field label {
              font-size: 14px;
              white-space: normal;
            }
            .parent-style-form .disha-field .mr {
              order: -1;
              font-size: 11px;
            }
            .parent-style-form .disha-input,
            .parent-style-form textarea {
              width: 100%;
              min-height: 42px;
              border: 1px solid #c9c2e3;
              border-radius: 8px;
              background: #fff;
              padding: 9px 11px;
              font-size: 14px;
            }
            .parent-style-form .disha-input:focus,
            .parent-style-form textarea:focus {
              border: 1px solid #3f2f7a;
              outline: 2px solid #efeaf9;
              background: #fff;
            }
            .parent-style-form .disha-num-field,
            .parent-style-form .disha-icon-item {
              gap: 14px;
              margin: 0;
              padding: 18px 0;
              border-bottom: 1px solid #eeeaf5;
            }
            .parent-style-form .disha-num-field .disha-num,
            .parent-style-form .disha-icon-item .disha-num {
              display: flex;
              width: 32px;
              height: 32px;
              align-items: center;
              justify-content: center;
              flex: 0 0 32px;
              border-radius: 999px;
              background: #efeaf9;
              color: #3f2f7a;
              padding: 0;
              font-size: 12px;
            }
            .parent-style-form .disha-icon-circle {
              display: none;
            }
            .parent-style-form table.disha-perf,
            .parent-style-form table.disha-mini {
              overflow: hidden;
              border-radius: 10px;
            }
            .parent-style-form table.disha-perf th,
            .parent-style-form table.disha-perf td,
            .parent-style-form table.disha-mini th,
            .parent-style-form table.disha-mini td {
              padding: 8px 5px;
            }

            @media (max-width: 820px) {
              .disha-card {
                padding: 18px 16px 40px 16px;
              }
              .disha-brand-name {
                font-size: 26px;
              }
              .disha-titleblock h1 {
                font-size: 22px;
              }
              .disha-split {
                flex-direction: column;
                gap: 10px;
              }
              .disha-bottom-row {
                flex-direction: column;
              }
              .disha-sign-col {
                height: auto;
                gap: 16px;
              }
              .parent-style-form .disha-card {
                padding: 20px 16px 26px;
              }
              .parent-style-form .disha-subbar-container {
                margin-left: -16px;
                margin-right: -16px;
              }
            }

            @media print {
              body {
                background: #fff !important;
                padding: 0 !important;
              }
              .page-wrap {
                gap: 0;
              }
              .disha-card {
                box-shadow: none !important;
                border: 1px solid #333 !important;
                page-break-after: always;
                border-radius: 0 !important;
                margin-bottom: 0;
              }
            }
          `}</style>

          {/* ============ CARD 1 (FRONT PAGE) ============ */}
          <div className={`disha-card ${formPage === 1 ? "block" : "hidden print:block"}`}>
            {/* OFFICIAL BRAIN HEADER */}
            <div className="-mx-8 -mt-7 mb-7 border-b border-[#d8d5e6] bg-gradient-to-r from-[#f0e9f8] via-white to-[#fff4e1] p-6 sm:p-8 max-[820px]:-mx-4 max-[820px]:-mt-5">
              <div className="flex flex-wrap items-center gap-4">
                <Image src="/brain-logo.svg" width={48} height={58} alt="BRAIN logo" className="h-14 w-12 object-contain" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#3f2f7a]">BRAIN Educational Counselling &amp; Consultancy Center</p>
                  <h1 className="mt-1 text-2xl font-bold text-[#171717] sm:text-3xl">Disha Career Guidance</h1>
                  <p className="mt-1 text-sm font-medium text-[#525252]">Counselling Form for Students · विद्यार्थ्यांसाठी समुपदेशन फॉर्म</p>
                </div>
              </div>
              <p className="mt-5 max-w-2xl text-sm text-[#525252]">Please share your academic background, interests, strengths and aspirations. These details help your counsellor provide guidance suited to you.</p>
            </div>

            <div className="mb-7 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="block text-sm font-medium text-[#171717]">Registration number</span>
                <span className="block text-xs text-[#737373]">नोंदणी क्रमांक</span>
                <input type="text" value={regNo} onChange={(e) => setRegNo(e.target.value)} className="mt-2 w-full rounded-lg border border-[#c9c2e3] bg-white px-3 py-2.5 text-sm font-semibold text-[#171717] outline-none focus:border-[#3f2f7a] focus:ring-2 focus:ring-[#efeaf9]" />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-[#171717]">Date</span>
                <span className="block text-xs text-[#737373]">दिनांक</span>
                <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="mt-2 w-full rounded-lg border border-[#c9c2e3] bg-white px-3 py-2.5 text-sm text-[#171717] outline-none focus:border-[#3f2f7a] focus:ring-2 focus:ring-[#efeaf9]" />
              </label>
            </div>

            {/* BODY ROW: FIELDS + PHOTO BOX */}
            <div className="disha-body-row">
              <div className="disha-fields-col">
                <div className="disha-field">
                  <div className="row">
                    <label>Full Name (Surname First) :</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Kulkarni Rohan Rajesh"
                      className="disha-input font-medium"
                      required
                    />
                  </div>
                  <div className="mr devanagari">(पूर्ण नाव)</div>
                </div>

                <div className="disha-field">
                  <div className="row">
                    <label>Full Address :</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Address Line 1"
                      className="disha-input"
                    />
                  </div>
                  <div className="mr devanagari">(पूर्ण पत्ता)</div>
                  <div className="row" style={{ marginTop: "6px" }}>
                    <input
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="City, State, Pincode"
                      className="disha-input"
                    />
                  </div>
                </div>

                <div className="disha-split">
                  <div className="disha-field">
                    <div className="row">
                      <label>Mobile No. :</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="disha-input"
                        required
                      />
                    </div>
                  </div>
                  <div className="disha-field">
                    <div className="row">
                      <label>Email :</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="disha-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="disha-field">
                  <div className="row">
                    <label>
                      Standard <span className="devanagari" style={{ fontWeight: 400 }}>(इयत्ता)</span> :
                    </label>
                    <input
                      type="text"
                      value={standard}
                      onChange={(e) => setStandard(e.target.value)}
                      placeholder="e.g. 10th / FYBSc"
                      className="disha-input"
                    />
                  </div>
                </div>

                <div className="disha-field">
                  <div className="row">
                    <label>Name of School :</label>
                    <input
                      type="text"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      placeholder="School / College Name"
                      className="disha-input"
                    />
                  </div>
                  <div className="mr devanagari">(शाळेचे नाव)</div>
                </div>
              </div>

              {/* PHOTO UPLOAD BOX */}
              <div
                className="disha-photo-box group"
                onClick={() => fileInputRef.current?.click()}
                title="Click to upload student photo"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Student Photo"
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <>
                    <svg
                      width="44"
                      height="44"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="group-hover:scale-110 transition-transform"
                    >
                      <circle cx="12" cy="8" r="4" fill="#c9c3e6" />
                      <path
                        d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7"
                        fill="#c9c3e6"
                      />
                    </svg>
                    <span>PHOTO</span>
                    <span className="text-[9px] text-purple-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Upload
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* EDUCATIONAL PERFORMANCE TABLE */}
            <div className="disha-section-label flex items-center justify-between">
              <div>
                Educational Performance : <span className="devanagari">शैक्षणिक पातळी</span>
              </div>
              <button
                type="button"
                onClick={addPerfRow}
                className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-800 font-semibold px-2 py-0.5 rounded print:hidden cursor-pointer"
              >
                + Add Subject Row
              </button>
            </div>

            <table className="disha-perf">
              <thead>
                <tr>
                  <th style={{ width: "22%" }}>
                    Subject<span className="mr devanagari">(विषय)</span>
                  </th>
                  <th style={{ width: "12%" }}>
                    Standard<span className="mr devanagari">(इयत्ता)</span>
                  </th>
                  <th>I</th>
                  <th>II</th>
                  <th>III</th>
                  <th>IV</th>
                  <th>V</th>
                  <th style={{ width: "16%" }}>
                    Marks/ Avg<span className="mr devanagari">(गुण/ सरासरी गुण)</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {perfRows.map((row, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        type="text"
                        value={row.subject}
                        onChange={(e) => updateRow(idx, "subject", e.target.value)}
                        placeholder="e.g. Maths / Science"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.standard}
                        onChange={(e) => updateRow(idx, "standard", e.target.value)}
                        placeholder="10th"
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.t1 || ""}
                        onChange={(e) => updateRow(idx, "t1", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.t2 || ""}
                        onChange={(e) => updateRow(idx, "t2", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.t3 || ""}
                        onChange={(e) => updateRow(idx, "t3", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.t4 || ""}
                        onChange={(e) => updateRow(idx, "t4", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.t5 || ""}
                        onChange={(e) => updateRow(idx, "t5", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={row.marksAvg}
                        onChange={(e) => updateRow(idx, "marksAvg", e.target.value)}
                        placeholder="85%"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ICON ITEMS 7 - 10 */}
            <div className="disha-icon-item">
              <div className="disha-num">7.</div>
              <div className="disha-icon-circle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#3f2f7a">
                  <path d="M12 21s-7.5-4.7-10-9.2C.4 8.3 2 4.8 5.3 4.2c2-.4 3.9.5 5 2.1C11.5 4.7 13.4 3.8 15.4 4.2c3.3.6 4.9 4.1 3.2 7.6C19.5 16.3 12 21 12 21z" />
                </svg>
              </div>
              <div className="disha-field">
                <div className="row">
                  <label>Subjects of Liking :</label>
                  <input
                    type="text"
                    value={subjectsOfLiking}
                    onChange={(e) => setSubjectsOfLiking(e.target.value)}
                    placeholder="e.g. Science, Physics, Art"
                    className="disha-input"
                  />
                </div>
                <div className="mr devanagari">(आवडते विषय)</div>
              </div>
            </div>

            <div className="disha-icon-item">
              <div className="disha-num">8.</div>
              <div className="disha-icon-circle">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3f2f7a"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                >
                  <path d="M7 11v9H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3zm0 0l4.5-8a2 2 0 0 1 3.5 1.3V9h4.2a2 2 0 0 1 2 2.4l-1.4 7A2 2 0 0 1 18 20H9a2 2 0 0 1-2-2v-7z" />
                </svg>
              </div>
              <div className="disha-field">
                <div className="row">
                  <label>Subjects (Easy) :</label>
                  <input
                    type="text"
                    value={subjectsEasy}
                    onChange={(e) => setSubjectsEasy(e.target.value)}
                    placeholder="e.g. English, History"
                    className="disha-input"
                  />
                </div>
                <div className="mr devanagari">(सोपे विषय)</div>
              </div>
            </div>

            <div className="disha-icon-item">
              <div className="disha-num">9.</div>
              <div className="disha-icon-circle">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3f2f7a"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="5" y1="20" x2="5" y2="13" />
                  <line x1="12" y1="20" x2="12" y2="8" />
                  <line x1="19" y1="20" x2="19" y2="4" />
                </svg>
              </div>
              <div className="disha-field">
                <div className="row">
                  <label>Subjects (difficult) :</label>
                  <input
                    type="text"
                    value={subjectsDifficult}
                    onChange={(e) => setSubjectsDifficult(e.target.value)}
                    placeholder="e.g. Mathematics, Chemistry"
                    className="disha-input"
                  />
                </div>
                <div className="mr devanagari">(अवघड विषय)</div>
              </div>
            </div>

            <div className="disha-icon-item">
              <div className="disha-num">10.</div>
              <div className="disha-icon-circle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#3f2f7a">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
                </svg>
              </div>
              <div className="disha-field">
                <div className="row">
                  <label>Teacher of Liking :</label>
                  <input
                    type="text"
                    value={teacherOfLiking}
                    onChange={(e) => setTeacherOfLiking(e.target.value)}
                    placeholder="Name of favorite teacher"
                    className="disha-input"
                  />
                </div>
                <div className="mr devanagari">(आवडते शिक्षक)</div>
              </div>
            </div>

            {/* ITEM 11 */}
            <div className="disha-num-field">
              <div className="disha-num">11.</div>
              <div className="disha-field" style={{ flex: 1.4 }}>
                <div className="row">
                  <label>What you want to be :</label>
                  <input
                    type="text"
                    value={whatYouWantToBe}
                    onChange={(e) => setWhatYouWantToBe(e.target.value)}
                    placeholder="e.g. Software Engineer / Doctor"
                    className="disha-input font-medium"
                  />
                </div>
                <div className="mr devanagari">(आपणास काय व्हायचे आहे)</div>
              </div>
              <div className="disha-field">
                <div className="row">
                  <label>Branch :</label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="e.g. Computer / AI / Medical"
                    className="disha-input"
                  />
                </div>
                <div className="mr devanagari">(शाखा)</div>
              </div>
            </div>

            {/* WAVE BOTTOM SVG */}
            <svg className="disha-wave" viewBox="0 0 760 60" preserveAspectRatio="none">
              <defs>
                <linearGradient id="wg1" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#4a3c8f" />
                  <stop offset="1" stopColor="#2c2159" />
                </linearGradient>
              </defs>
              <path
                d="M0,26 C190,58 570,2 760,28 L760,60 L0,60 Z"
                fill="url(#wg1)"
              />
            </svg>
          </div>

          {/* Action Buttons for Page 1 */}
          {formPage === 1 && (
            <div className="w-full flex items-center justify-end gap-4 mt-6 print:hidden">
              <button
                type="button"
                onClick={handleNextPage}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-[#3f2f7a] to-[#2c2159] text-white font-bold text-base hover:opacity-95 transition-all shadow-lg active:scale-95 cursor-pointer ml-auto"
              >
                <span>Next Page (Page 2)</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* ============ CARD 2 (BACK PAGE) ============ */}
          <div className={`disha-card ${formPage === 2 ? "block" : "hidden print:block"}`}>
            {/* ITEMS 12 - 20 */}
            <div className="disha-num-field">
              <div className="disha-num">12.</div>
              <div className="disha-field">
                <div className="row">
                  <label>Ideal Personality :</label>
                  <input
                    type="text"
                    value={idealPersonality}
                    onChange={(e) => setIdealPersonality(e.target.value)}
                    placeholder="e.g. Dr. APJ Abdul Kalam"
                    className="disha-input"
                  />
                </div>
                <div className="mr devanagari">(आदर्श व्यक्ती)</div>
              </div>
            </div>

            <div className="disha-num-field">
              <div className="disha-num">13.</div>
              <div className="disha-field">
                <div className="row">
                  <label>Sports : yes / No.</label>
                  <input
                    type="text"
                    value={sports}
                    onChange={(e) => setSports(e.target.value)}
                    placeholder="e.g. Cricket, Badminton, Chess"
                    className="disha-input"
                  />
                </div>
                <div className="mr devanagari">(खेळ)</div>
              </div>
            </div>

            <div className="disha-num-field">
              <div className="disha-num">14.</div>
              <div className="disha-field">
                <div className="row">
                  <label>TV Channel of Liking :</label>
                  <input
                    type="text"
                    value={tvChannel}
                    onChange={(e) => setTvChannel(e.target.value)}
                    placeholder="e.g. Discovery, National Geographic"
                    className="disha-input"
                  />
                </div>
                <div className="mr devanagari">(पसंतीचे टी.व्ही. चॅनेल)</div>
              </div>
            </div>

            <div className="disha-num-field">
              <div className="disha-num">15.</div>
              <div className="disha-field">
                <div className="row">
                  <label>Particular Close Relative :</label>
                  <input
                    type="text"
                    value={closeRelative}
                    onChange={(e) => setCloseRelative(e.target.value)}
                    placeholder="Relation / Name"
                    className="disha-input"
                  />
                </div>
                <div className="mr devanagari">(नात्यातील जवळचा नातेवाईक)</div>
              </div>
            </div>

            <div className="disha-num-field">
              <div className="disha-num">16.</div>
              <div className="disha-field">
                <div className="row">
                  <label>Awards / Certificates :</label>
                  <input
                    type="text"
                    value={awardsCertificates}
                    onChange={(e) => setAwardsCertificates(e.target.value)}
                    placeholder="Science Exhibition 1st Prize, Drawing Certificate"
                    className="disha-input"
                  />
                </div>
                <div className="mr devanagari">(सन्मान / प्रमाणपत्र)</div>
              </div>
            </div>

            <div className="disha-num-field">
              <div className="disha-num">17.</div>
              <div className="disha-field">
                <div className="row">
                  <label>Computer Competency :</label>
                  <input
                    type="text"
                    value={computerCompetency}
                    onChange={(e) => setComputerCompetency(e.target.value)}
                    placeholder="MS-CIT, Python Basics, Web Design"
                    className="disha-input"
                  />
                </div>
                <div className="mr devanagari">(संगणक ज्ञान)</div>
              </div>
            </div>

            <div className="disha-num-field">
              <div className="disha-num">18.</div>
              <div className="disha-field">
                <div className="row">
                  <label>Close Friends :</label>
                  <input
                    type="text"
                    value={closeFriends}
                    onChange={(e) => setCloseFriends(e.target.value)}
                    placeholder="Names of close friends"
                    className="disha-input"
                  />
                </div>
                <div className="mr devanagari">(जवळच्या मित्र / मैत्रिणी)</div>
              </div>
            </div>

            <div className="disha-num-field">
              <div className="disha-num">19.</div>
              <div className="disha-field">
                <div className="row">
                  <label>Other Close Relatives :</label>
                  <input
                    type="text"
                    value={otherCloseRelatives}
                    onChange={(e) => setOtherCloseRelatives(e.target.value)}
                    placeholder="Other relatives"
                    className="disha-input"
                  />
                </div>
                <div className="mr devanagari">(इतर जवळचे नातेवाईक)</div>
              </div>
            </div>

            <div className="disha-num-field">
              <div className="disha-num">20.</div>
              <div className="disha-field">
                <div className="row">
                  <label>Which Mob. you use most :</label>
                  <input
                    type="text"
                    value={whichMobile}
                    onChange={(e) => setWhichMobile(e.target.value)}
                    placeholder="e.g. Parent's Smartphone / Personal Mobile"
                    className="disha-input"
                  />
                </div>
                <div className="mr devanagari">(सर्वात जास्त कोणता मोबाईल वापरता)</div>
              </div>
            </div>

            {/* COUNSELLOR OBSERVATIONS */}
            <div className="disha-obs-title">
              <span className="disha-star">&#9733;</span>
              <div className="disha-field" style={{ flex: 1 }}>
                <div className="row">
                  <label>Counsellor's Observations :</label>
                </div>
                <div className="mr devanagari">(समुपदेशकाचे निरीक्षण)</div>
              </div>
            </div>

            <div className="mt-2">
              <textarea
                rows={3}
                value={counsellorObservations}
                onChange={(e) => setCounsellorObservations(e.target.value)}
                placeholder="Notes and observations from the psychological counsellor..."
                className="w-full border-b border-slate-400 bg-transparent text-sm p-2 focus:outline-none focus:border-purple-800 font-sans leading-relaxed resize-y"
              />
            </div>

            {/* BOTTOM SIGNATURES & TABLES */}
            <div className="disha-bottom-row">
              <div className="disha-sign-col">
                <div>
                  <div className="sig">Parent's Signature</div>
                  <div className="sig-line"></div>
                </div>
                <div>
                  <div className="sig">Student's Signature</div>
                  <div className="sig-line"></div>
                </div>
              </div>

              <div className="disha-mini-table-wrap">
                <h4>Follow up :-</h4>
                <table className="disha-mini">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="disha-mini-table-wrap">
                <h4>Fees Paid :-</h4>
                <table className="disha-mini">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Receipt No.</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* BOTTOM WAVE */}
            <svg className="disha-wave" viewBox="0 0 760 60" preserveAspectRatio="none">
              <defs>
                <linearGradient id="wg2" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#4a3c8f" />
                  <stop offset="1" stopColor="#2c2159" />
                </linearGradient>
              </defs>
              <path
                d="M0,26 C190,58 570,2 760,28 L760,60 L0,60 Z"
                fill="url(#wg2)"
              />
            </svg>
          </div>

          {/* Action Buttons for Page 2 */}
          {formPage === 2 && (
            <div className="w-full flex items-center justify-between gap-4 mt-6 print:hidden">
              <button
                type="button"
                onClick={handlePrevPage}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] border border-[#d8d5e6] bg-white text-[#3f2f7a] font-medium text-xs hover:bg-[#f6f3fb] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-[#737373]" />
                <span>Back to Page 1</span>
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[8px] border border-[#d8d5e6] bg-white text-[#3f2f7a] font-medium text-xs hover:bg-[#f6f3fb] transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-[#737373]" />
                  <span>Print Form</span>
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[8px] bg-[#3f2f7a] text-white font-medium text-xs hover:bg-[#2c2159] transition-all shadow-[rgba(63,47,122,0.18)_0px_1px_3px_0px] cursor-pointer"
                >
                  <span>{embedded ? "Submit Inquiry Form" : "Submit & Select Program"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </form>
      </main>
    </div>
  </div>
</div>
  );
}

export default function InquiryPage() {
  return <OfficialInquiryForm />;
}
