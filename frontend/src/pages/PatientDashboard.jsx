import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, API_BASE } from "../context/AuthContext";

export default function PatientDashboard() {
  const [tab, setTab] = useState("profile");

  const { token, logout } = useAuth();
  const navigate = useNavigate();

  /* ---------------- PROFILE STATE ---------------- */
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

  /* ---------------- FETCH PROFILE ---------------- */
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch(`${API_BASE}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
          avatar: "",
        };

        setPatient(mapped);
        setForm(mapped);
      } catch (err) {
        console.error(err);
        logout();
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [token, logout, navigate]);

  /* ---------------- VALIDATION ---------------- */
  function validateProfile() {
    const e = {};
    if (!form.name) e.name = "Full name is required";
    if (!form.phone) e.phone = "Phone is required";
    if (!form.dob) e.dob = "Date of birth is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* ---------------- AVATAR (UI ONLY) ---------------- */
  function handleAvatarChange(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) =>
      setForm((f) => ({ ...f, avatar: e.target.result }));
    reader.readAsDataURL(file);
  }

  /* ---------------- SAVE PROFILE ---------------- */
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

  function handleLogout() {
    logout();
    navigate("/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-slate-600">
        Loading profile...
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">

          {/* Sidebar */}
          <aside className="md:col-span-3">
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold">Dashboard</h2>
              <nav className="flex flex-col gap-1">
                <SideItem active={tab === "profile"} onClick={() => setTab("profile")} icon="👤" label="My Profile" />
                <SideItem active={tab === "appointments"} onClick={() => setTab("appointments")} icon="📅" label="My Appointments" />
                <SideItem active={tab === "upload"} onClick={() => setTab("upload")} icon="📤" label="Upload Report" />
              </nav>
              <button
                onClick={handleLogout}
                className="mt-6 w-full rounded-lg bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Logout
              </button>
            </div>
          </aside>

          {/* Content */}
          <section className="md:col-span-9">

            {/* PROFILE */}
            {tab === "profile" && (
              <div className="rounded-2xl border bg-white p-6 shadow-sm">
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
                <h1 className="text-xl font-semibold mb-4">Edit Profile</h1>

                <form onSubmit={onSaveProfile} className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} error={errors.name} />
                  <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} error={errors.phone} />
                  <Field label="Date of birth" type="date" value={form.dob} onChange={(v) => setForm({ ...form, dob: v })} error={errors.dob} />

                  <div>
                    <label className="text-sm font-medium">Blood group</label>
                    <select value={form.blood} onChange={(e) => setForm({ ...form, blood: e.target.value })} className="w-full border rounded-md px-3 py-2">
                      {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(b => <option key={b}>{b}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Gender</label>
                    <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full border rounded-md px-3 py-2">
                      {["Female","Male","Other","Prefer not to say"].map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>

                  <div className="sm:col-span-2 flex gap-3 mt-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-semibold">Save</button>
                    <button type="button" onClick={onCancelEdit} className="border px-4 py-2 rounded-md">Cancel</button>
                  </div>
                </form>
              </div>
            )}

          </section>
        </div>
      </div>
    </main>
  );
}

/* -------- Helpers -------- */

function SideItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${active ? "bg-blue-600 text-white" : "hover:bg-blue-50"}`}>
      <span>{icon}</span>
      {label}
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
