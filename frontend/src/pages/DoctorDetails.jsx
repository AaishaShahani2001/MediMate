import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_BASE } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";


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
  const [msg, setMsg] = useState("");

  const { token, user } = useAuth();

  const days = useMemo(makeNext7Days, []);
  const slots = useMemo(makeSlots, []);

  const [selectedDay, setSelectedDay] = useState(days[0]?.key);
  const [selectedSlot, setSelectedSlot] = useState("");

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

  /* ================= BOOK APPOINTMENT ================= */
  async function bookAppointment() {
    if (!token) {
      setMsg("Please login to book an appointment.");
      return;
    }

    if (!selectedDay || !selectedSlot) {
      setMsg("Please select date and time.");
      return;
    }

    setBooking(true);
    setMsg("");

    try {
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
      if (!res.ok) throw new Error(data.message);

      setMsg("✅ Appointment booked successfully!");
      setSelectedSlot("");
    } catch (err) {
      setMsg(err.message || "Booking failed");
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
    <main className="min-h-screen bg-white">
      {/* ================= HEADER ================= */}
      <section className="border-b bg-linear-to-br from-blue-50 via-white to-indigo-50">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <Link to="/doctors" className="text-sm font-medium text-blue-700">
            ← Back to Doctors
          </Link>

          <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-center">
            {doctor.avatar ? (
              <img
                src={doctor.avatar}
                alt={doctor.fullName}
                className="h-24 w-24 rounded-2xl object-cover ring-2 ring-blue-200"
              />
            ) : (
              <div className="grid h-24 w-24 place-items-center rounded-2xl bg-linear-to-tr from-blue-200 to-indigo-200 text-3xl font-bold text-slate-800 ring-2 ring-blue-200">
                {initials}
              </div>
            )}


            <div>
              <div className="text-sm font-medium text-blue-700">
                {doctor.specialization}
              </div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Dr.{doctor.fullName}
              </h1>
              <p className="mt-1 text-sm text-slate-800">
                🏥 {doctor.workplace}
              </p>
              <p className="text-slate-700">
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
                About Doctor
              </h2>
              <p className="mt-3 text-slate-700 leading-relaxed">
                {doctor.about || "No description provided."}
              </p>

              <div className="mt-6 rounded-xl bg-linear-to-tr from-blue-100 to-indigo-100 p-4 text-sm text-slate-700">
                <div>
                  <b>Degree:</b> {doctor.degree || "—"}
                </div>
                <div>
                  <b>Consultation Fee:</b>{" "}
                  {doctor.consultationFee || "—"}
                </div>
              </div>
            </div>
          </div>

          {/* BOOKING */}
          <aside>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">
                Book an appointment
              </h3>

              {/* Dates */}
              <div className="mt-4">
                <div className="mb-2 text-sm text-slate-600">
                  Select a date
                </div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {days.map((d) => (
                    <button
                      key={d.key}
                      onClick={() => setSelectedDay(d.key)}
                      className={`rounded-lg border px-2 py-2 text-sm ${selectedDay === d.key
                        ? "bg-blue-600 text-white"
                        : "bg-white text-slate-700 hover:text-blue-700"
                        }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slots */}
              <div className="mt-5">
                <div className="mb-2 text-sm text-slate-600">
                  Select a time
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSlot(s)}
                      className={`rounded-lg border px-2 py-2 text-sm ${selectedSlot === s
                        ? "bg-blue-600 text-white"
                        : "bg-white text-slate-700 hover:text-blue-700"
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action */}
              <button
                onClick={bookAppointment}
                disabled={!selectedDay || !selectedSlot || booking}
                className="mt-6 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300"
              >
                {booking ? "Booking…" : "Book Appointment"}
              </button>

              {msg && (
                <p className="mt-3 text-center text-sm text-blue-700">
                  {msg}
                </p>
              )}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
