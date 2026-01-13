import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, API_BASE } from "../context/AuthContext";
import AppointmentDetailsModal from "../components/AppointmentDetailsModal"

export default function DoctorDashboard() {
  const [tab, setTab] = useState("profile"); // profile | appointments | password
  const [edit, setEdit] = useState(false);
  const [filter, setFilter] = useState("all"); // all | today | upcoming
  const [viewAppt, setViewAppt] = useState(null);

  const { token, logout } = useAuth();
  const navigate = useNavigate();

  /* ================= REAL DOCTOR PROFILE (DoctorApplication) ================= */
  const [docLoading, setDocLoading] = useState(true);
  const [doc, setDoc] = useState(null);
  const [docForm, setDocForm] = useState(null);

  /* ================= REAL APPOINTMENTS ================= */
  const [apptLoading, setApptLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);

  /* ================= TOAST ================= */
  const [toast, setToast] = useState(null);

  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  // Filter appointments based on the selected filter
  const filteredAppointments = useMemo(() => {
    if (filter === "all") return appointments;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return appointments.filter((a) => {
      const d = new Date(a.date);
      d.setHours(0, 0, 0, 0);

      if (filter === "today") return d.getTime() === today.getTime();
      if (filter === "upcoming") return d > today;
      return true;
    });
  }, [appointments, filter]);


  /* ================= LOAD DOCTOR PROFILE ================= */
  useEffect(() => {
    async function loadDoctorProfile() {
      setDocLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/doctor-applications/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to load doctor profile");

        // data is a DoctorApplication
        setDoc(data);
        setDocForm({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          specialization: data.specialization || "",
          degree: data.degree || "",
          experience: data.experience || "",
          consultationFee: data.consultationFee || "",
          about: data.about || "",
          gender: data.gender || "", // optional 
          avatar: data.avatar || "", // optional 
        });
      } catch (e) {
        showToast(e.message || "Session expired. Please login again.", "error");
        logout();
        navigate("/login");
      } finally {
        setDocLoading(false);
      }
    }

    loadDoctorProfile();
  }, [token, logout, navigate]);

  /* ================= LOAD APPOINTMENTS WHEN TAB OPENED ================= */
  useEffect(() => {
    if (tab !== "appointments") return;

    async function loadAppointments() {
      setApptLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/appointments/doctor/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to load appointments");
        setAppointments(data);
      } catch (e) {
        showToast(e.message || "Failed to load appointments", "error");
      } finally {
        setApptLoading(false);
      }
    }

    loadAppointments();
  }, [tab, token]);

  /* ================= LOGOUT ================= */
  function handleLogout() {
    logout();
    navigate("/login");
  }

  /* ================= SAVE PROFILE  ================= */
  async function saveProfile() {
    try {
      const res = await fetch(
        `${API_BASE}/api/doctor-applications/me`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: docForm.fullName,
            phone: docForm.phone,
            specialization: docForm.specialization,
            degree: docForm.degree,
            experience: docForm.experience,
            consultationFee: docForm.consultationFee,
            about: docForm.about,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to update profile");

      setDoc(data.doctor ?? data); // supports both response styles
      setEdit(false);
      showToast("Profile updated successfully", "success");
    } catch (e) {
      showToast(e.message || "Failed to update profile", "error");
    }
  }


  /* ================= UPDATE APPOINTMENT STATUS ================= */
  async function setStatus(apptId, nextStatus) {
    try {
      const res = await fetch(`${API_BASE}/api/appointments/${apptId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to update status");

      setAppointments((list) =>
        list.map((a) => (a._id === apptId ? { ...a, status: nextStatus } : a))
      );

      showToast(`Appointment marked as ${nextStatus}`);
    } catch (e) {
      showToast(e.message || "Failed to update appointment", "error");
    }
  }

  const initials = useMemo(() => {
    const name = doc?.fullName || "Doctor";
    return name
      .split(" ")
      .map((n) => n?.[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }, [doc]);

  return (
    <main className="min-h-screen bg-slate-50">
      <Toast toast={toast} />

      <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Sidebar */}
          <aside className="md:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Dashboard</h2>
              <nav className="flex flex-col gap-1">
                <SideItem icon="👤" label="My Profile" active={tab === "profile"} onClick={() => setTab("profile")} />
                <SideItem icon="📅" label="All Appointments" active={tab === "appointments"} onClick={() => setTab("appointments")} />
                <SideItem icon="🔒" label="Reset Password" active={tab === "password"} onClick={() => setTab("password")} />
              </nav>

              <button
                className="mt-6 w-full rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </aside>

          {/* Main content */}
          <section className="md:col-span-9">
            {/* Profile */}
            {tab === "profile" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                {docLoading ? (
                  <div className="text-slate-600">Loading profile...</div>
                ) : !doc || !docForm ? (
                  <div className="text-slate-600">
                    Doctor profile not found. (Make sure your role is doctor and you have an Approved DoctorApplication.)
                  </div>
                ) : (
                  <>
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <h1 className="text-2xl font-semibold text-slate-900">Welcome, Dr. {doc.fullName}</h1>
                        <p className="text-sm text-slate-600">Manage your profile & appointments</p>
                      </div>

                      {docForm.avatar ? (
                        <img
                          src={docForm.avatar}
                          alt="doctor"
                          className="h-20 w-20 rounded-full object-cover ring-2 ring-blue-200"
                        />
                      ) : (
                        <div className="grid h-20 w-20 place-items-center rounded-full bg-blue-100 text-xl font-bold text-blue-700 ring-2 ring-blue-200">
                          {initials}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Field label="Full Name" value={docForm.fullName} readOnly={!edit} onChange={(v) => setDocForm({ ...docForm, fullName: v })} />
                      <Field label="Email" value={docForm.email} readOnly={true} />
                      <Field label="Phone" value={docForm.phone} readOnly={!edit} onChange={(v) => setDocForm({ ...docForm, phone: v })} />
                      <Field label="Specialization" value={docForm.specialization} readOnly={!edit} onChange={(v) => setDocForm({ ...docForm, specialization: v })} />
                      <Field label="Degree" value={docForm.degree} readOnly={!edit} onChange={(v) => setDocForm({ ...docForm, degree: v })} />
                      <Field label="Experience" value={docForm.experience} readOnly={!edit} onChange={(v) => setDocForm({ ...docForm, experience: v })} />
                      <Field
                        label="Consultation Fee"
                        value={docForm.consultationFee}
                        readOnly={!edit}
                        onChange={(v) => setDocForm({ ...docForm, consultationFee: v })}
                      />


                      <TextArea
                        className="md:col-span-2"
                        label="About"
                        value={docForm.about}
                        readOnly={!edit}
                        onChange={(v) => setDocForm({ ...docForm, about: v })}
                      />

                      {/* Unavailable Slots */}
                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                          Unavailable Time Slots
                        </label>

                        {doc?.unavailableSlots?.length === 0 ? (
                          <p className="text-sm text-slate-500">No unavailable slots</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {doc.unavailableSlots.map((slot, i) => (
                              <span
                                key={i}
                                className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 border border-rose-200"
                              >
                                {new Date(slot.date).toLocaleDateString()} • {slot.time}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>


                    </div>

                    <div className="mt-6 flex gap-3">
                      {!edit ? (
                        <button
                          onClick={() => setEdit(true)}
                          className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Edit Profile
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={saveProfile}
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                          >
                            Save Changes
                          </button>
                          <button
                            onClick={() => {
                              setEdit(false);
                              setDocForm({
                                fullName: doc.fullName || "",
                                email: doc.email || "",
                                phone: doc.phone || "",
                                specialization: doc.specialization || "",
                                degree: doc.degree || "",
                                experience: doc.experience || "",
                                consultationFee: doc.consultationFee || "",
                                about: doc.about || "",
                                gender: doc.gender || "",
                                avatar: doc.avatar || "",
                              });
                            }}
                            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

           
              {/* ================= APPOINTMENTS ================= */}
              {tab === "appointments" && (
                <div className="space-y-4">
                  {/* FILTER BUTTONS */}
                  <div className="flex gap-2">
                    {["all", "today", "upcoming"].map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFilter(f)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold ${filter === f
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                      >
                        {f === "all"
                          ? "All"
                          : f.charAt(0).toUpperCase() + f.slice(1)}
                      </button>
                    ))}
                  </div>

                  {/* HEADER */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                    <h1 className="text-xl font-semibold text-slate-900">
                      All Appointments
                    </h1>
                    <p className="text-sm text-slate-600">
                      Your upcoming and past appointments
                    </p>
                  </div>

                  {/* CONTENT */}
                  {apptLoading ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm text-slate-600">
                      Loading appointments...
                    </div>
                  ) : filteredAppointments.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
                      No appointments found.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      {filteredAppointments.map((a) => (
                        <AppointmentCard
                          key={a._id}
                          data={a}
                          onStatus={(s) => setStatus(a._id, s)}
                          onView={() => setViewAppt(a)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
           


            {/* Reset Password (UI-only kept) */}
            {tab === "password" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                <h1 className="text-xl font-semibold text-slate-900">Reset Password</h1>
                <p className="text-sm text-slate-600">UI-only</p>
                <form className="mt-5 max-w-md space-y-4">
                  <Input label="Current password" type="password" placeholder="••••••••" />
                  <Input label="New password" type="password" placeholder="At least 6 characters" />
                  <Input label="Confirm new password" type="password" placeholder="Repeat new password" />
                  <button
                    type="button"
                    onClick={() => showToast("Password update (UI-only)", "success")}
                    className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            )}
          </section>
        </div>
      </div>
      {/* ================= APPOINTMENT DETAILS MODAL ================= */}
      {viewAppt && (
        <AppointmentDetailsModal
          appointment={viewAppt}
          token={token}
          onClose={() => setViewAppt(null)}
        />
      )}
    </main>
  );
}

/* ------- small UI helpers ------- */

function SideItem({ icon, label, active, onClick }) {
  const base = "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition";
  const a = active ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-50 hover:text-blue-700";
  return (
    <button type="button" onClick={onClick} className={`${base} ${a}`}>
      <span className="text-base">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

function Field({ label, value, onChange, readOnly = true }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input
        value={value ?? ""}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200
          ${readOnly ? "bg-slate-50 border-slate-200" : "bg-white border-slate-300"}`}
      />
    </div>
  );
}

function TextArea({ label, value, onChange, readOnly = true, className = "" }) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <textarea
        rows={4}
        value={value ?? ""}
        readOnly={readOnly}
        onChange={(e) => onChange?.(e.target.value)}
        className={`w-full resize-y rounded-md border px-3 py-2 text-sm shadow-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200
          ${readOnly ? "bg-slate-50 border-slate-200" : "bg-white border-slate-300"}`}
      />
    </div>
  );
}

function Input({ label, type = "text", placeholder = "" }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm shadow-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Cancelled: "bg-rose-100 text-rose-700 border-rose-200",
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Booked: "bg-blue-100 text-blue-700 border-blue-200",
    Completed: "bg-slate-100 text-slate-700 border-slate-200",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${map[status] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
      {status}
    </span>
  );
}

function CalendarIcon() {
  return (
    <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M4 11h16M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
    </svg>
  );
}

function AppointmentCard({ data, onStatus, onView }) {
  // Appointment schema:
  // patientId (populated User), doctorApplicationId (DoctorApplication), date, time, status
  const patient = data.patientId; // expects populate("patientId","name email phone")
  const dateStr = data.date ? new Date(data.date).toLocaleDateString() : "—";

  const disabledJoin = data.status === "Cancelled";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            {patient?.name || "Patient"}
          </h3>
          <div className="mt-1 text-sm text-slate-600">
            {patient?.email || ""}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-700">
            <span className="inline-flex items-center gap-2"><CalendarIcon /> {dateStr}</span>
            <span className="inline-flex items-center gap-2"><ClockIcon /> {data.time}</span>
            <StatusBadge status={data.status} />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={disabledJoin}
              className={`rounded-full px-4 py-2 text-sm font-semibold shadow-sm
                ${disabledJoin ? "cursor-not-allowed bg-emerald-200 text-emerald-800" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"}`}
            >
              Join the call
            </button>

            <select
              value={data.status}
              onChange={(e) => onStatus?.(e.target.value)}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <button
              type="button"
              onClick={onView}
              className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              View Details
            </button>
          </div>
        </div>

        <div className="h-10 w-10 rounded-lg bg-blue-100" title="patient avatar" />
      </div>
    </div>
  );
}

/* ================= TOAST ================= */

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-lg
        ${toast.type === "error" ? "bg-rose-600" : "bg-emerald-600"}`}
    >
      {toast.message}
    </div>
  );
}




