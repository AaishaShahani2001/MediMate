import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

/* ---------- helpers ---------- */
function makeNext7Days() {
  const days = [];
  const opts = { weekday: "short", day: "numeric", month: "short" };
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      key: d.toISOString(),
      label: d.toLocaleDateString(undefined, opts),
    });
  }
  return days;
}

function dayKey(date) {
  return new Date(date).toISOString().slice(0, 10); // YYYY-MM-DD
}

function isPastSlot(dayISO, slot) {
  const now = new Date();
  const slotDate = new Date(dayISO);
  const [h, m] = slot.split(":");
  slotDate.setHours(h, m, 0, 0);
  return slotDate < now;
}

function isBooked(dayISO, slot, bookedSlotMap) {
  const key = dayKey(dayISO);
  return bookedSlotMap[key]?.has(slot) ?? false;
}

function makeSlots() {
  const base = new Date();
  base.setHours(8, 30, 0, 0);
  const slots = [];
  for (let i = 0; i <= 9; i++) {
    const t = new Date(base);
    t.setHours(base.getHours() + i);
    slots.push(
      `${String(t.getHours()).padStart(2, "0")}:${String(
        t.getMinutes()
      ).padStart(2, "0")}`
    );
  }
  return slots;
}

/* ---------- component ---------- */
export default function DoctorDetails() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);


  const { token } = useAuth();

  const days = useMemo(makeNext7Days, []);
  const slots = useMemo(makeSlots, []);

  const [selectedDay, setSelectedDay] = useState(days[0]?.key);
  const [selectedSlot, setSelectedSlot] = useState("");

   /* ---------- BOOKED SLOT MAP --------- */
  const bookedSlotMap = useMemo(() => {
    const map = {};
    bookedSlots.forEach((b) => {
      const key = dayKey(b.date);
      if (!map[key]) map[key] = new Set();
      map[key].add(b.time);
    });
    return map;
  }, [bookedSlots]);

  /* ================= FETCH DOCTOR ================= */
  useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await fetch(
          `${API_BASE}/api/doctor-applications/public/${id}`
        );
        if (!res.ok) throw new Error("Doctor not found");
        const data = await res.json();
        setDoctor(data);
      } catch {
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDoctor();
  }, [id]);

  /* ============ FETCH BOOKED SLOTS FOR DOCTOR =========== */
  useEffect(() => {
    async function fetchBookedSlots() {
      try {
        const res = await fetch(
          `${API_BASE}/api/appointments/doctor/${id}`,
          {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        );
        if (!res.ok) return;
        const data = await res.json();
        setBookedSlots(data);
      } catch {
        setBookedSlots([]);
      }
    }

    if (id) fetchBookedSlots();
  }, [id]);

  /* Reset slot when day changes */
  useEffect(() => {
    setSelectedSlot("");
  }, [selectedDay]);

  // DEBUG
  useEffect(() => {
  console.log("BOOKED SLOTS FROM API:", bookedSlots);
}, [bookedSlots]);


  /* ================= BOOK APPOINTMENT ================= */
  async function bookAppointment() {
    if (!token) {
      toast.error("Please login to book an appointment");
      return;
    }

    if (!selectedDay || !selectedSlot) {
      toast.error("Please select date and time");
      return;
    }

    if (isPastSlot(selectedDay, selectedSlot)) {
      toast.error("You cannot book a past time slot");
      return;
    }

    if (isBooked(selectedDay, selectedSlot, bookedSlotMap)) {
      toast.error("This slot is already booked");
      return;
    }

    try {
      toast.loading("Booking appointment...", { id: "booking" });
      setBooking(true);

      const res = await fetch(`${API_BASE}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: doctor._id,
          date: selectedDay,
          time: selectedSlot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Booking failed");
      }

      toast.success("Appointment booked successfully", { id: "booking" });

      // update UI
      setBookedSlots((prev) => [
        ...prev,
        { date: selectedDay, time: selectedSlot },
      ]);
      setSelectedSlot("");
    } catch (err) {
      toast.error(err.message, { id: "booking" });
    } finally {
      setBooking(false);
    }
  }


  /* ================= STATES ================= */
  if (loading) {
    return <p className="p-10 text-slate-600">Loading doctor profile…</p>;
  }

  if (!doctor) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <p className="text-slate-700">Doctor not found.</p>
        <Link to="/doctors" className="text-blue-700 underline">
          Back to doctors
        </Link>
      </div>
    );
  }

  const initials = doctor.fullName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ================= HEADER ================= */}
      <section className="border-b bg-linear-to-br from-blue-50 via-white to-indigo-50">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <Link
            to="/doctors"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline"
          >
            ← Back to Doctors
          </Link>

          <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center">
            {/* Avatar */}
            {doctor.avatar ? (
              <img
                src={doctor.avatar}
                alt={doctor.fullName}
                className="h-28 w-28 rounded-2xl object-cover ring-4 ring-blue-100"
              />
            ) : (
              <div className="grid h-28 w-28 place-items-center rounded-2xl bg-linear-to-tr from-blue-300 to-indigo-300 text-4xl font-bold text-slate-900 ring-4 ring-blue-100">
                {initials}
              </div>
            )}

            {/* Info */}
            <div>
              <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                {doctor.specialization}
              </span>

              <h1 className="mt-2 text-3xl font-bold text-slate-900">
                Dr. {doctor.fullName}
              </h1>

              <p className="mt-1 text-sm text-slate-700">
                🏥 {doctor.workplace}
              </p>

              <p className="text-sm text-slate-600">
                {doctor.experience}+ years experience
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* ABOUT */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                About the Doctor
              </h2>

              <p className="mt-4 text-sm leading-relaxed text-slate-700">
                {doctor.about || "No description provided."}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-blue-50 p-4 text-sm">
                  <b>Degree</b>
                  <p className="text-slate-700">
                    {doctor.degree || "—"}
                  </p>
                </div>

                <div className="rounded-xl bg-indigo-50 p-4 text-sm">
                  <b>Consultation Fee</b>
                  <p className="text-slate-700">
                    {doctor.consultationFee || "—"}
                  </p>
                </div>
              </div>
            </div>
            {/* Slot Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-blue-600" />
                Selected
              </span>

              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-red-400" />
                Booked
              </span>

              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-slate-300" />
                Past
              </span>

              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded border border-slate-300 bg-white" />
                Available
              </span>
            </div>

          </div>



          {/* BOOKING */}
          <aside>
            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Book Appointment
              </h3>

              {/* Dates */}
              <div className="mt-5">
                <p className="mb-2 text-sm text-slate-600">
                  Select a date
                </p>

                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {days.map((d) => (
                    <button
                      key={d.key}
                      onClick={() => setSelectedDay(d.key)}
                      className={`rounded-lg border px-2 py-2 text-sm transition
                      ${selectedDay === d.key
                          ? "bg-blue-600 text-white shadow"
                          : "bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700"
                        }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slots */}
              <div className="mt-5">
                <p className="mb-2 text-sm text-slate-600">
                  Select a time
                </p>

                <div className="grid grid-cols-3 gap-2">
                  {slots.map((s) => {
                    const booked = isBooked(selectedDay, s, bookedSlotMap);
                    const past = isPastSlot(selectedDay, s);
                    const selected = selectedSlot === s;

                    return (
                      <button
                        key={s}
                        disabled={booked || past}
                        onClick={() => {
                          if (booked) {
                            toast.error("This slot is already booked");
                            return;
                          }
                          if (past) {
                            toast.error("This time has already passed");
                            return;
                          }
                          setSelectedSlot(s);
                        }}
                        className={`
          rounded-lg border px-2 py-2 text-sm transition
          ${booked
                            ? "bg-red-100 border-red-300 text-red-600 cursor-not-allowed"
                            : past
                              ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                              : selected
                                ? "bg-blue-600 border-blue-600 text-white shadow"
                                : "bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-700"
                          }
        `}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>



              </div>

              {/* Action */}
              <button
                onClick={bookAppointment}
                disabled={!selectedDay || !selectedSlot || booking}
                className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"
              >
                {booking ? "Booking..." : "Confirm Appointment"}
              </button>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );

}


