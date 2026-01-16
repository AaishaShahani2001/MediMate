import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, API_BASE } from "../context/AuthContext";
import AIHealthAssistant from "../components/AIHealthAssistant";


export default function PatientDashboard() {
  const [tab, setTab] = useState("profile");

  const { token, logout } = useAuth();
  const navigate = useNavigate();

  /* ================= PROFILE STATE ================= */
  const [patient, setPatient] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    blood: "O+",
    gender: "Female",
    avatar: "",
  });

  const [form, setForm] = useState(patient);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const avatarInputRef = useRef(null);
  const [removeAvatar, setRemoveAvatar] = useState(false);

  /* ================= APPOINTMENTS STATE ================= */
  const [appointments, setAppointments] = useState([]);
  const [apptLoading, setApptLoading] = useState(false);

  /* ================= MODALS + TOAST ================= */
  const [editAppt, setEditAppt] = useState(null);
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [toast, setToast] = useState(null);

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch(`${API_BASE}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to load profile");

        const data = await res.json();

        const mapped = {
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          dob: data.dob ? data.dob.slice(0, 10) : "",
          blood: data.blood || "O+",
          gender: data.gender || "Female",
          avatar: data.avatar || "",
        };

        setPatient(mapped);
        setForm(mapped);
      } catch (err) {
        logout();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [token, logout, navigate]);

  /* ================= FETCH APPOINTMENTS ================= */
  useEffect(() => {
    if (tab !== "appointments" && tab !== "upload") return;

    async function loadAppointments() {
      setApptLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/appointments/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to load appointments");

        const data = await res.json();

        /* Toast when an appointment is confirmed */
        data.forEach((a) => {
          const previous = appointments.find((p) => p._id === a._id);
          if (previous && previous.status !== "Confirmed" && a.status === "Confirmed") {
            showToast("Appointment confirmed by doctor");
          }
        });

        setAppointments(data);

      } catch (err) {
        showToast("Failed to load appointments", "error");
      } finally {
        setApptLoading(false);
      }
    }

    loadAppointments();
  }, [tab, token]);

  /* ================= TOAST ================= */
  function showToast(message, type = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  /* ================= VALIDATION ================= */
  function validateProfile() {
    const e = {};
    if (!form.name) e.name = "Full name is required";
    if (!form.phone) e.phone = "Phone is required";
    if (!form.dob) e.dob = "Date of birth is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* ================= SAVE PROFILE ================= */
  async function onSaveProfile(e) {
    e.preventDefault();
    if (!validateProfile()) return;

    try {
      const res = await fetch(`${API_BASE}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          gender: form.gender,
          blood: form.blood,
          dob: form.dob,
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      const data = await res.json();

      const updated = {
        ...form,
        dob: data.user.dob ? data.user.dob.slice(0, 10) : "",
      };

      setPatient(updated);
      setForm(updated);
      setTab("profile");
    } catch (err) {
      alert("Failed to save profile");
    }
  }

  function onCancelEdit() {
    setForm(patient);
    setErrors({});
    setTab("profile");
  }

  /* ================= APPOINTMENT ACTIONS ================= */

  async function confirmCancel() {
    try {
      const res = await fetch(
        `${API_BASE}/api/appointments/${confirmCancelId}/cancel`,
        { method: "PATCH", headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error();

      setAppointments((prev) =>
        prev.map((a) =>
          a._id === confirmCancelId ? { ...a, status: "Cancelled" } : a
        )
      );
      showToast("Appointment cancelled");
    } catch {
      showToast("Cancel failed", "error");
    } finally {
      setConfirmCancelId(null);
    }
  }

  async function saveEdit() {
    try {
      const res = await fetch(
        `${API_BASE}/api/appointments/${editAppt._id}/edit`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            date: editAppt.date,
            time: editAppt.time,
          }),
        }
      );
      if (!res.ok) throw new Error();

      setAppointments((prev) =>
        prev.map((a) => (a._id === editAppt._id ? editAppt : a))
      );
      showToast("Appointment updated");
      setEditAppt(null);
    } catch {
      showToast("Update failed", "error");
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-slate-600">
        Loading dashboard...
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">

          {/* SIDEBAR */}
          <aside className="md:col-span-3">
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Dashboard</h2>

              <nav className="flex flex-col gap-1">
                <SideItem icon="👤" label="My Profile" active={tab === "profile"} onClick={() => setTab("profile")} />
                <SideItem icon="📅" label="My Appointments" active={tab === "appointments"} onClick={() => setTab("appointments")} />
                <SideItem icon="📤" label="Upload Report" active={tab === "upload"} onClick={() => setTab("upload")} />
                <SideItem icon="🤖" label="AI Health Assistant" active={tab === "ai"} onClick={() => setTab("ai")} />

              </nav>

              <button
                onClick={handleLogout}
                className="mt-6 w-full rounded-lg bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Logout
              </button>
            </div>
          </aside>

          {/* CONTENT */}
          <section className="md:col-span-9">

            {/* PROFILE */}
            {tab === "profile" && (
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  {patient.avatar ? (
                    <img
                      src={patient.avatar}
                      alt="Profile"
                      className="h-20 w-20 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">
                      {patient.name?.[0]}
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-slate-900">{patient.name}</p>
                  </div>
                </div>

                <h1 className="text-xl font-semibold mb-4">My Profile</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Info label="Full Name" value={patient.name} />
                  <Info label="Email" value={patient.email} />
                  <Info label="Phone" value={patient.phone} />
                  <Info label="Date of Birth" value={patient.dob} />
                  <Info label="Blood Group" value={patient.blood} />
                  <Info label="Gender" value={patient.gender} />
                </div>

                <button
                  onClick={() => setTab("edit")}
                  className="mt-6 rounded-md border px-4 py-2 text-sm font-semibold"
                >
                  Edit Profile
                </button>
              </div>
            )}

            {/* EDIT */}
            {tab === "edit" && (
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <div className="sm:col-span-2 flex items-center gap-4">
                  {form.avatar && typeof form.avatar === "string" ? (
                    <img
                      src={form.avatar}
                      className="h-16 w-16 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                      {form.name?.[0]}
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        setForm({ ...form, avatar: e.target.files[0] });
                        setRemoveAvatar(false);
                      }}
                      className="text-sm"
                    />

                    {patient.avatar && (
                      <button
                        type="button"
                        onClick={() => {
                          setForm({ ...form, avatar: "" });
                          setRemoveAvatar(true);
                        }}
                        className="text-xs font-semibold text-rose-600 hover:underline"
                      >
                        Remove avatar
                      </button>
                    )}
                  </div>
                </div>


                <h1 className="text-xl font-semibold mb-4">Edit Profile</h1>

                <form onSubmit={onSaveProfile} className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} error={errors.name} />
                  <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} error={errors.phone} />
                  <Field label="Date of birth" type="date" value={form.dob} onChange={(v) => setForm({ ...form, dob: v })} error={errors.dob} />

                  <Select label="Blood group" value={form.blood} options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]} onChange={(v) => setForm({ ...form, blood: v })} />
                  <Select label="Gender" value={form.gender} options={["Female", "Male", "Other", "Prefer not to say"]} onChange={(v) => setForm({ ...form, gender: v })} />

                  <div className="sm:col-span-2 flex gap-3 mt-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold">Save</button>
                    <button type="button" onClick={onCancelEdit} className="border px-4 py-2 rounded-md">Cancel</button>
                  </div>
                </form>
              </div>
            )}

            {/* APPOINTMENTS */}
            {tab === "appointments" && (
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h1 className="text-xl font-semibold mb-4">My Appointments</h1>

                {apptLoading ? (
                  <p className="text-slate-500">Loading appointments...</p>
                ) : appointments.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-6 text-center text-slate-500">
                    You have no appointments yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((a) => (
                      <AppointmentCard
                        key={a._id}
                        appt={a}
                        onCancel={() => setConfirmCancelId(a._id)}
                        onEdit={() => setEditAppt({ ...a })}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "upload" && (
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
                <h1 className="text-xl font-semibold mb-4">Upload Medical Report</h1>

                <UploadReport
                  token={token}
                  appointments={appointments}
                  onUploaded={() => showToast("Report uploaded successfully")}
                />
              </div>
            )}

            {tab === "ai" && (
              <AIHealthAssistant token={token} />
            )}



          </section>
        </div>

        {/* MODALS */}
        {editAppt && (
          <EditAppointmentModal
            appt={editAppt}
            setAppt={setEditAppt}
            onClose={() => setEditAppt(null)}
            onSave={saveEdit}
          />
        )}

        {confirmCancelId && (
          <ConfirmModal
            title="Cancel Appointment?"
            onCancel={() => setConfirmCancelId(null)}
            onConfirm={confirmCancel}
          />
        )}
      </div>
    </main>
  );
}

/* ================= HELPERS ================= */

function SideItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${active ? "bg-blue-600 text-white" : "hover:bg-blue-50"}`}>
      <span>{icon}</span>{label}
    </button>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded border bg-slate-50 px-4 py-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", error }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full border rounded-md px-3 py-2" />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full border rounded-md px-3 py-2">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function AppointmentCard({ appt, onEdit, onCancel }) {
  const d = appt.doctorApplicationId;

  const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Cancelled: "bg-rose-100 text-rose-700 border-rose-200",
    Completed: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <div className="border rounded-xl p-4 flex justify-between items-center gap-4">
      {/* LEFT */}
      <div>
        <div className="font-semibold text-slate-900">
          Dr. {d?.fullName || "Doctor"}
        </div>
        <div className="text-sm text-slate-600">
          {d?.specialization}
        </div>

        <div className="mt-1 text-sm text-slate-700">
          📅 {new Date(appt.date).toLocaleDateString()} · ⏰ {appt.time}
        </div>

        {/* STATUS BADGE */}
        <span
          className={`mt-2 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[appt.status] ||
            "bg-slate-100 text-slate-700 border-slate-200"
            }`}
        >
          {appt.status}
        </span>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-col gap-2">
        {/* EDIT – only if NOT confirmed */}
        {appt.status !== "Confirmed" && appt.status !== "Cancelled" && (
          <button
            onClick={onEdit}
            className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
          >
            ✏️ Edit
          </button>
        )}

        {/* CANCEL – allowed even if confirmed */}
        {appt.status !== "Cancelled" && (
          <button
            onClick={onCancel}
            className="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
          >
            ❌ Cancel
          </button>
        )}
      </div>
    </div>
  );
}

/* ================= MODALS ================= */

function EditAppointmentModal({ appt, setAppt, onClose, onSave }) {
  return (
    <Modal title="Edit Appointment" onClose={onClose}>
      <label className="text-sm">Date</label>
      <input
        type="date"
        value={appt.date.slice(0, 10)}
        onChange={(e) => setAppt({ ...appt, date: e.target.value })}
        className="w-full border rounded p-2 mb-3"
      />
      <label className="text-sm">Time</label>
      <input
        type="time"
        value={appt.time}
        onChange={(e) => setAppt({ ...appt, time: e.target.value })}
        className="w-full border rounded p-2"
      />
      <div className="mt-4 flex justify-end gap-2">
        <button onClick={onClose} className="border px-4 py-2 rounded">Cancel</button>
        <button onClick={onSave} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
      </div>
    </Modal>
  );
}

function ConfirmModal({ title, onCancel, onConfirm }) {
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-sm mb-4">This action cannot be undone.</p>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="border px-4 py-2 rounded">No, Keep</button>
        <button onClick={onConfirm} className="bg-rose-600 text-white px-4 py-2 rounded">Yes, Cancel</button>
      </div>
    </Modal>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 className="font-semibold mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`fixed bottom-6 right-6 px-4 py-2 rounded text-white ${toast.type === "error" ? "bg-rose-600" : "bg-emerald-600"
      }`}>
      {toast.message}
    </div>
  );
}

function UploadReport({ token, onUploaded, appointments = [] }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [appointmentId, setAppointmentId] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpload(e) {
    e.preventDefault();
    if (!title || !file) return alert("Title & file required");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    if (appointmentId) {
      formData.append("appointmentId", appointmentId);
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/reports`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error();

      setTitle("");
      setFile(null);
      setAppointmentId("");
      onUploaded();
    } catch {
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleUpload} className="space-y-4 max-w-md">
      <Field label="Report Title" value={title} onChange={setTitle} />

      {/* SELECT APPOINTMENT */}
      <div>
        <label className="text-sm font-medium">
          Link to Appointment (optional)
        </label>
        <select
          value={appointmentId}
          onChange={(e) => setAppointmentId(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        >
          <option value="">General Report (No appointment)</option>
          {appointments.map((a) => (
            <option key={a._id} value={a._id}>
              {new Date(a.date).toLocaleDateString()} – {a.time} – Dr. {a.doctorApplicationId?.fullName} – {a.doctorApplicationId?.specialization}
            </option>
          ))}

        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Select File</label>
        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full border rounded-md px-3 py-2"
        />
      </div>

      <button
        disabled={loading}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {loading ? "Uploading..." : "Upload Report"}
      </button>
    </form>
  );
}

