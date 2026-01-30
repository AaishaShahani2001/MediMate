import { useEffect, useState, useMemo } from "react";
import Modal from "./Modal.jsx";
import { API_BASE } from "../context/AuthContext";

export default function AppointmentDetailsModal({ appointment, token, onClose }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  const patient = appointment.patientId;

  /* ================= AGE CALCULATION ================= */
  const age = useMemo(() => {
    if (!patient?.dob) return "—";
    const dob = new Date(patient.dob);
    const diff = Date.now() - dob.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }, [patient]);

  /* ================= LOAD REPORTS ================= */
  useEffect(() => {
    async function loadReports() {
      try {
        const res = await fetch(
          `${API_BASE}/api/reports/appointment/${appointment._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error();
        const data = await res.json();
        setReports(data);
      } catch {
        setReports([]);
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, [appointment, token]);

  /* ================= LOAD PATIENT MEDICAL HISTORY ================= */
  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch(
          `${API_BASE}/api/appointments/patient/${patient._id}/history`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error();
        const data = await res.json();
        setHistory(data);
      } catch {
        setHistory([]);
      }
    }
    loadHistory();
  })



  return (
    <Modal title="Appointment Details" onClose={onClose}>
  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

    {/* ================= LEFT COLUMN ================= */}
    <div className="space-y-5">

      {/* PATIENT INFO */}
      <section className="rounded-xl border bg-slate-50 p-4">
        <h4 className="mb-3 text-sm font-semibold text-slate-700">
          👤 Patient Information
        </h4>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm">
          <Info label="Name" value={patient?.name} />
          <Info label="Gender" value={patient?.gender} />
          <Info label="Phone" value={patient?.phone || "—"} />
          <Info label="Blood Group" value={patient?.blood || "—"} />
          <Info label="Age" value={age} />
        </div>
      </section>

      {/* APPOINTMENT */}
      <section className="rounded-xl border bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold text-slate-700">
          📅 Appointment
        </h4>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span>
            {new Date(appointment.date).toLocaleDateString()} · ⏰ {appointment.time}
          </span>

          <span className={`rounded-full px-3 py-1 text-xs font-semibold
            ${appointment.status === "Confirmed"
              ? "bg-emerald-100 text-emerald-700"
              : appointment.status === "Completed"
              ? "bg-slate-100 text-slate-700"
              : appointment.status === "Cancelled"
              ? "bg-rose-100 text-rose-700"
              : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {appointment.status}
          </span>
        </div>
      </section>

      {/* REPORTS */}
      <section className="rounded-xl border bg-white p-4">
        <h4 className="mb-3 text-sm font-semibold text-slate-700">
          📄 Uploaded Reports
        </h4>

        {loading ? (
          <p className="text-sm text-slate-500">Loading reports...</p>
        ) : reports.length === 0 ? (
          <p className="text-sm text-slate-500">
            No reports uploaded for this appointment.
          </p>
        ) : (
          <ul className="space-y-2">
            {reports.map((r) => (
              <li
                key={r._id}
                className="flex items-center justify-between rounded-lg border px-3 py-2"
              >
                <span className="text-sm font-medium">{r.title}</span>
                <a
                  href={`${API_BASE}/${r.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  View
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>

    {/* ================= RIGHT COLUMN ================= */}
    <section className="rounded-xl border bg-white p-4">
      <h4 className="mb-4 text-sm font-semibold text-slate-700">
        🩺 Medical History Timeline
      </h4>

      {history.length === 0 ? (
        <p className="text-sm text-slate-500">
          No previous appointments with this doctor.
        </p>
      ) : (
        <ol className="relative border-l border-slate-200 pl-4 space-y-4">
          {history.slice(0, 5).map((h) => (
            <li key={h._id} className="relative">
              <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-blue-600" />

              <div className="rounded-lg border bg-slate-50 p-3 text-sm">
                <div className="font-semibold text-slate-900">
                  {new Date(h.date).toLocaleDateString()} · {h.time}
                </div>

                <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold
                  ${h.status === "Confirmed"
                    ? "bg-emerald-100 text-emerald-700"
                    : h.status === "Completed"
                    ? "bg-slate-100 text-slate-700"
                    : h.status === "Cancelled"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {h.status}
                </span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>

  </div>
</Modal>

  );
}

/* ================= SMALL UI ================= */

function Info({ label, value }) {
  return (
    <div className="rounded-md border bg-white px-3 py-2">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-medium text-slate-800">
        {value ?? "—"}
      </div>
    </div>
  );
}
