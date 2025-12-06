import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { DOCTORS } from "../data/doctors";

function makeNext7Days() {
  const days = [];
  const opts = { weekday: "short", day: "numeric", month: "short" };
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      key: d.toDateString(),
      label: d.toLocaleDateString(undefined, opts),
      date: d,
    });
  }
  return days;
}

function makeSlots() {
  // 08:30 to 17:30 inclusive, 1-hour steps
  const base = new Date();
  base.setHours(8, 30, 0, 0); // 08:30
  const slots = [];
  for (let i = 0; i <= 9; i++) {
    const t = new Date(base);
    t.setHours(base.getHours() + i);
    const hh = String(t.getHours()).padStart(2, "0");
    const mm = String(t.getMinutes()).padStart(2, "0");
    slots.push(`${hh}:${mm}`);
  }
  return slots; // ["08:30", "09:30", ..., "17:30"]
}

export default function DoctorDetails() {
  const { id } = useParams();
  const doctor = DOCTORS.find((d) => d.id === id);

  const days = useMemo(() => makeNext7Days(), []);
  const slots = useMemo(() => makeSlots(), []);

  const [selectedDay, setSelectedDay] = useState(days[0]?.key);
  const [selectedSlot, setSelectedSlot] = useState("");

  if (!doctor) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <p className="text-slate-700">Doctor not found.</p>
        <Link className="text-blue-700 underline" to="/doctors">Back to doctors</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b bg-linear-to-br from-blue-50 via-white to-indigo-50">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <Link to="/doctors" className="text-sm font-medium text-blue-700">← Back to Doctors</Link>
          <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-center">
            <div className="grid h-24 w-24 place-items-center rounded-2xl bg-linear-to-tr from-blue-200 to-indigo-200 text-3xl font-bold text-slate-800">
              {doctor.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-medium text-blue-700">{doctor.category}</div>
              <h1 className="text-2xl font-semibold text-slate-900">{doctor.name}</h1>
              <p className="text-slate-600">{doctor.years}+ years experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* About + Booking */}
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* About */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">About</h2>
              <p className="mt-2 text-slate-700">{doctor.about}</p>

              <div className="mt-5 h-44 w-full rounded-xl bg-linear-to-tr from-blue-100 to-indigo-100" />
            </div>
          </div>

          {/* Booking Card */}
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">Book an appointment</h3>

              {/* Dates: next 7 days */}
              <div className="mt-4">
                <div className="mb-2 text-sm text-slate-600">Select a date</div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {days.map((d) => (
                    <button
                      key={d.key}
                      onClick={() => setSelectedDay(d.key)}
                      className={`rounded-lg border px-2 py-2 text-sm ${
                        selectedDay === d.key
                          ? "border-blue-200 bg-blue-600 font-medium text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time slots */}
              <div className="mt-5">
                <div className="mb-2 text-sm text-slate-600">Select a time (08:30–17:30)</div>
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSlot(s)}
                      className={`rounded-lg border px-2 py-2 text-sm ${
                        selectedSlot === s
                          ? "border-blue-200 bg-blue-600 font-medium text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary + actions */}
              <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
                <div className="font-medium text-slate-900">Summary</div>
                <div className="mt-1 text-slate-700">
                  <div>Doctor: {doctor.name}</div>
                  <div>Category: {doctor.category}</div>
                  <div>
                    Date:{" "}
                    {selectedDay
                      ? new Date(selectedDay).toLocaleDateString(undefined, {
                          weekday: "long",
                          day: "numeric",
                          month: "short",
                        })
                      : "—"}
                  </div>
                  <div>Time: {selectedSlot || "—"}</div>
                </div>
              </div>

              <button
                disabled={!selectedDay || !selectedSlot}
                className="mt-4 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                Book Appointment
              </button>

              <p className="mt-2 text-center text-xs text-slate-500">
                * UI only for semester demo. No backend call here.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
