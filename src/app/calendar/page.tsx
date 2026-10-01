"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Sprout,
  Leaf,
  Target,
  Plane,
  Flame,
  Heart,
  type LucideIcon,
  Check,
} from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isBefore,
  startOfDay,
  addMonths,
  subMonths,
  format,
} from "date-fns";
import StepIndicator from "@/components/StepIndicator";
import Button from "@/components/Button";
import { PageHeader } from "@/components/FormFields";
import { useInquiry } from "@/lib/inquiry-context";
import { useAuth } from "@/lib/auth-context";
import { TIME_SLOTS, Appointment } from "@/lib/types";
import { CounsellorItem } from "@/lib/api-types";
import api from "@/lib/api";

const iconMap: Record<string, LucideIcon> = {
  Sprout,
  Leaf,
  Target,
  Plane,
  Flame,
  Heart,
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const router = useRouter();
  const { user, accessToken, loading: authLoading } = useAuth();
  const { state, setAppointment } = useInquiry();
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [counsellors, setCounsellors] = useState<CounsellorItem[]>([]);
  const [selectedCounsellorId, setSelectedCounsellorId] = useState<string>("");
  const [selectedCounsellor, setSelectedCounsellor] = useState<string>("");
  const [loadingCounsellors, setLoadingCounsellors] = useState<boolean>(true);
  const [booked, setBooked] = useState<Appointment | null>(state.appointment);

  useEffect(() => {
    let mounted = true;
    api.counsellors.list()
      .then((items) => {
        if (!mounted) return;
        const list = items || [];
        setCounsellors(list);
        if (list.length > 0) {
          setSelectedCounsellorId(list[0].id);
          setSelectedCounsellor(list[0].fullName);
        }
      })
      .catch((err) => {
        console.error("Failed to load counsellors", err);
      })
      .finally(() => {
        if (mounted) setLoadingCounsellors(false);
      });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!authLoading && !accessToken) {
      router.replace("/auth/login?next=%2Fcalendar");
    } else if (!state.selectedProgram) {
      router.replace("/counselling/student");
    }
  }, [accessToken, authLoading, state.selectedProgram, router]);

  const today = startOfDay(new Date());

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const startPadding = monthStart.getDay();
    const padded: (Date | null)[] = [];
    for (let i = 0; i < startPadding; i++) padded.push(null);
    padded.push(...days);
    while (padded.length % 7 !== 0) padded.push(null);
    return padded;
  }, [currentMonth]);

  if (authLoading || !accessToken || !state.selectedProgram) return null;
  const program = state.selectedProgram;
  const ProgramIcon = iconMap[program.icon] ?? Target;

  function isDisabled(d: Date) {
    if (isBefore(d, today)) return true;
    // After 5:00 PM, slot booking for today is closed
    if (isSameDay(d, today) && new Date().getHours() >= 17) {
      return true;
    }
    return false;
  }

  function isSlotAvailable(slot: string, date: Date | null): boolean {
    if (!date) return true;
    if (!isSameDay(date, today)) return true;

    const now = new Date();
    // After 5 PM, all same-day slots are closed
    if (now.getHours() >= 17) return false;

    // Check if slot start time has already passed today
    const [time, period] = slot.split(" ");
    const [hStr, mStr] = time.split(":");
    let slotHour = parseInt(hStr, 10);
    const slotMin = parseInt(mStr, 10);
    if (period === "PM" && slotHour < 12) slotHour += 12;
    if (period === "AM" && slotHour === 12) slotHour = 0;

    const slotDate = new Date(date);
    slotDate.setHours(slotHour, slotMin, 0, 0);

    return slotDate.getTime() > now.getTime();
  }

  function handleDateSelect(d: Date) {
    setSelectedDate(d);
    if (selectedTime && !isSlotAvailable(selectedTime, d)) {
      setSelectedTime(null);
    }
  }

  const isSelectedDateToday = selectedDate ? isSameDay(selectedDate, today) : false;
  const isPast5pm = new Date().getHours() >= 17;
  const isTodayBookingClosed = isSelectedDateToday && isPast5pm;

  function confirmBooking() {
    if (!selectedDate || !selectedTime) return;
    if (isSameDay(selectedDate, today) && new Date().getHours() >= 17) {
      alert("Slot bookings for today are closed after 5:00 PM. Please select a future date.");
      return;
    }
    const counsellorObj = counsellors.find((c) => c.id === selectedCounsellorId) || counsellors[0];
    const appt: Appointment = {
      date: format(selectedDate, "yyyy-MM-dd"),
      time: selectedTime,
      mode: "in-person",
      counsellorId: counsellorObj?.id,
      counsellorName: counsellorObj?.fullName || selectedCounsellor,
      location: "BRAIN Counselling Center · Pune Campus",
    };
    setAppointment(appt);
    setBooked(appt);

    // If an inquiry already exists in state, immediately assign the counsellor to it
    if (state.inquiryId && counsellorObj?.id) {
      api.inquiries.assignCounsellor(state.inquiryId, counsellorObj.id).catch((e) => {
        console.warn("Immediate counsellor assignment warning:", e);
      });
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#e9eaf1] text-[#171717]">
      <div className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 pt-6 pb-12 flex flex-col lg:flex-row items-start gap-6">
        <StepIndicator currentStep="calendar" />

        <main className="flex-1 min-w-0">
          <PageHeader
            title="Schedule Session"
            mrTitle="समुपदेशन वेळ निवडा"
            icon={<CalendarDays className="w-5 h-5" />}
          />

          {booked ? (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4 print:hidden">
                <div className="p-6 rounded-[12px] bg-white border border-[#d8d5e6]">
                  <div className="flex items-start gap-3.5 mb-5">
                    <div className="w-10 h-10 rounded-full bg-[#dcfce7] border border-[#bbf7d0] flex items-center justify-center text-[#16a34a] flex-shrink-0">
                      <Check className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-[#171717]">Appointment Reserved</h2>
                      <p className="text-xs text-[#525252] mt-0.5">
                        Your session with {booked.counsellorName} is confirmed for {booked.date} at {booked.time}.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    <Button
                      variant="primary"
                      size="md"
                      icon={<ArrowRight className="w-4 h-4" />}
                      iconPosition="right"
                      onClick={() => router.push("/counselling/payment")}
                    >
                      Continue to Payment
                    </Button>
                  </div>
                </div>
              </div>

              {/* Confirmation Slip Card */}
              <div className="rounded-[12px] bg-white border border-[#d8d5e6] p-5 text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-[#d8d5e6] pb-3">
                  <div>
                    <p className="font-semibold text-[#171717]">{program.name}</p>
                    <p className="text-[10px] text-[#737373]">Official Appointment Slip</p>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#16a34a] border border-[#bbf7d0]">
                    Confirmed
                  </span>
                </div>

                <div className="space-y-2 text-[#525252]">
                  <div className="flex justify-between">
                    <span className="text-[#737373]">Candidate:</span>
                    <span className="font-medium text-[#171717]">{state.personalDetails?.fullName || `${user?.firstName || "Student"} ${user?.lastName || ""}`.trim()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#737373]">Date &amp; Time:</span>
                    <span className="font-medium text-[#171717]">{booked.date} · {booked.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#737373]">Counsellor:</span>
                    <span className="font-medium text-[#171717]">{booked.counsellorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#737373]">Location:</span>
                    <span className="font-medium text-[#171717]">{booked.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-6">
              {/* Calendar Grid */}
              <div className="lg:col-span-7 p-5 rounded-[12px] bg-white border border-[#d8d5e6]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[#171717]">
                    {format(currentMonth, "MMMM yyyy")}
                  </h3>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                      className="p-1.5 rounded-[6px] border border-[#d8d5e6] hover:bg-[#f6f3fb]"
                    >
                      <ChevronLeft className="w-4 h-4 text-[#525252]" />
                    </button>
                    <button
                      onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                      className="p-1.5 rounded-[6px] border border-[#d8d5e6] hover:bg-[#f6f3fb]"
                    >
                      <ChevronRight className="w-4 h-4 text-[#525252]" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-[#737373] font-medium">
                  {WEEKDAYS.map((w) => (
                    <div key={w} className="py-1">
                      {w}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((d, i) => {
                    if (!d) return <div key={i} className="h-9" />;
                    const disabled = isDisabled(d);
                    const isSelected = selectedDate && isSameDay(d, selectedDate);

                    return (
                      <button
                        key={i}
                        disabled={disabled}
                        onClick={() => handleDateSelect(d)}
                        className={`h-9 rounded-[6px] text-xs font-medium transition-all ${
                          disabled
                            ? "text-[#a3a3a3] cursor-not-allowed"
                            : isSelected
                            ? "bg-[#2c2159] text-white"
                            : "hover:bg-[#f6f3fb] text-[#171717] border border-transparent hover:border-[#d8d5e6]"
                        }`}
                      >
                        {format(d, "d")}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 pt-3 border-t border-[#f0eff5] flex items-center justify-between text-[11px] text-[#737373]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#ea580c] flex-shrink-0" />
                    Same-day slot bookings close daily at 5:00 PM
                  </span>
                  {isPast5pm && (
                    <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-medium">
                      Today closed
                    </span>
                  )}
                </div>
              </div>

              {/* Time Slots & Mentors */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-[12px] bg-white border border-[#d8d5e6]">
                  <h3 className="text-xs uppercase font-semibold tracking-wider text-[#737373] mb-3">
                    Select Counsellor
                  </h3>
                  {loadingCounsellors ? (
                    <div className="py-2 text-xs text-[#737373]">Loading counsellors...</div>
                  ) : counsellors.length === 0 ? (
                    <div className="p-3 mb-4 rounded-[6px] bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                      No counsellors currently registered. A superadmin will assign a counsellor shortly.
                    </div>
                  ) : (
                    <select
                      value={selectedCounsellorId}
                      onChange={(e) => {
                        const id = e.target.value;
                        setSelectedCounsellorId(id);
                        const found = counsellors.find((c) => c.id === id);
                        if (found) setSelectedCounsellor(found.fullName);
                      }}
                      className="w-full h-9 px-3 rounded-[6px] border border-[#d8d5e6] text-xs font-medium text-[#171717] bg-white focus:outline-none focus:border-[#3f2f7a] mb-4"
                    >
                      {counsellors.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.fullName} {c.title ? `(${c.title})` : ""}
                        </option>
                      ))}
                    </select>
                  )}

                  <h3 className="text-xs uppercase font-semibold tracking-wider text-[#737373] mb-3">
                    Available Slots
                  </h3>
                  {isTodayBookingClosed ? (
                    <div className="p-4 mb-5 rounded-[8px] bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                      <div className="flex items-center gap-2 font-semibold text-amber-800 mb-1">
                        <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        Slot Booking Closed For Today
                      </div>
                      <p className="text-[11px] text-amber-700 leading-relaxed">
                        Online slot bookings for the current day close daily at 5:00 PM. Please select an upcoming date on the calendar to schedule your session.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 mb-5">
                      {TIME_SLOTS.map((slot) => {
                        const isAvailable = isSlotAvailable(slot, selectedDate);
                        const isSelected = selectedTime === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={!isAvailable}
                            onClick={() => {
                              if (isAvailable) setSelectedTime(slot);
                            }}
                            className={`py-2 px-3 rounded-[6px] text-xs font-medium border text-center transition-all ${
                              !isAvailable
                                ? "bg-[#f5f5f5] text-[#a3a3a3] border-[#e5e5e5] cursor-not-allowed opacity-60"
                                : isSelected
                                ? "bg-[#2c2159] text-white border-[#2c2159]"
                                : "bg-white text-[#171717] border-[#d8d5e6] hover:border-[#a3a3a3]"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <Button
                    size="md"
                    variant="primary"
                    fullWidth
                    disabled={!selectedDate || !selectedTime || isTodayBookingClosed}
                    onClick={confirmBooking}
                  >
                    Confirm Booking
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
