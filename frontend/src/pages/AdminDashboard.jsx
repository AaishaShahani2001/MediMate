import { useState } from "react";

export default function AdminDashboard() {
  const [tab, setTab] = useState("dashboard"); // dashboard | requests | messages | password

  // --- Demo stats ---
  const stats = { patients: 3, doctors: 3, admins: 1 };

  // --- Doctor requests with avatars, bios, docs (demo) ---
  const [requests, setRequests] = useState([
    {
      id: "dr1",
      name: "Sagar",
      email: "sagar@gmail.com",
      specialty: "Psychiatrist",
      experience: 9,
      status: "Approved",
      avatar: "https://i.pravatar.cc/100?img=12",
      bio: "Psychiatrist with focus on mood & anxiety disorders. Evidence-based therapy and medication management.",
      documents: [
        { id: "f1", name: "MBBS_Degree.pdf", type: "PDF", size: "312 KB" },
        { id: "f2", name: "SLMC_License.jpg", type: "Image", size: "524 KB" },
      ],
    },
    {
      id: "dr2",
      name: "Ananya Sharma",
      email: "ananya.sharma01@gmail.com",
      specialty: "Cardiologist",
      experience: 7,
      status: "Approved",
      avatar: "https://i.pravatar.cc/100?img=47",
      bio: "Cardiologist focusing on preventive cardiology and lifestyle counseling.",
      documents: [
        { id: "f3", name: "MD_Cardiology.pdf", type: "PDF", size: "441 KB" },
        { id: "f4", name: "Experience_Certificate.pdf", type: "PDF", size: "288 KB" },
      ],
    },
    {
      id: "dr3",
      name: "Prabhjot Singh",
      email: "ghaiprabhghai@gmail.com",
      specialty: "Cardiologist",
      experience: 6,
      status: "Pending",
      avatar: "https://i.pravatar.cc/100?img=23",
      bio: "Interventional cardiology trainee. Keen on patient education.",
      documents: [{ id: "f5", name: "MBBS_Transcript.pdf", type: "PDF", size: "379 KB" }],
    },
  ]);

  // --- Messages (demo) ---
  const messages = [
    { id: "m1", from: "patient01@example.com", subject: "Unable to join video call", time: "10:12 AM" },
    { id: "m2", from: "dr.maya@example.com", subject: "Request to edit profile details", time: "Yesterday" },
    { id: "m3", from: "patient02@example.com", subject: "Password reset confirmation", time: "2 days ago" },
  ];

  // --- Modal state for "View Details" ---
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  function openDetails(row) { setSelectedDoc(row); setDetailOpen(true); }
  function closeDetails() { setDetailOpen(false); setSelectedDoc(null); }

  // quick actions from table
  function actOnRequest(id, action) {
    setRequests((list) => list.map((r) => (r.id === id ? { ...r, status: action } : r)));
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Sidebar */}
          <aside className="md:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Admin Panel</h2>
              <nav className="flex flex-col gap-1">
                <SideItem icon="📊" label="Dashboard" active={tab==="dashboard"} onClick={()=>setTab("dashboard")} />
                <SideItem icon="🩺" label="Doctor Requests" active={tab==="requests"} onClick={()=>setTab("requests")} />
                <SideItem icon="✉️" label="Messages" active={tab==="messages"} onClick={()=>setTab("messages")} />
                <SideItem icon="🔒" label="Change Password" active={tab==="password"} onClick={()=>setTab("password")} />
              </nav>
              <button className="mt-6 w-full rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700" type="button">
                Logout
              </button>
            </div>
          </aside>

          {/* Main */}
          <section className="md:col-span-9">
            {/* Dashboard Overview */}
            {tab === "dashboard" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h1 className="text-2xl font-semibold text-slate-900">Dashboard Overview</h1>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <StatCard iconBg="bg-sky-200" title="Total Patients" value={stats.patients} color="from-sky-100 to-sky-50" />
                  <StatCard iconBg="bg-emerald-200" title="Total Doctors" value={stats.doctors} color="from-emerald-100 to-emerald-50" />
                  <StatCard iconBg="bg-violet-200" title="Total Admins" value={stats.admins} color="from-violet-100 to-violet-50" />
                </div>
              </div>
            )}

            {/* Doctor Requests — screenshot-style table + modal */}
            {tab === "requests" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-0 shadow-sm">
                <div className="px-6 pt-6">
                  <h1 className="text-2xl font-semibold text-slate-900">Doctor Requests</h1>
                  <p className="text-sm text-slate-600">Approve or reject new doctor accounts (UI-only)</p>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-blue-600 text-left text-white">
                        <th className="px-6 py-3 font-semibold tracking-wide">Avatar</th>
                        <th className="px-6 py-3 font-semibold tracking-wide">Name</th>
                        <th className="px-6 py-3 font-semibold tracking-wide">Email</th>
                        <th className="px-6 py-3 font-semibold tracking-wide">Specialization</th>
                        <th className="px-6 py-3 font-semibold tracking-wide">Status</th>
                        <th className="px-6 py-3 font-semibold tracking-wide text-right">Actions</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      {requests.map((r) => (
                        <tr key={r.id} className="hover:bg-slate-50">
                          {/* Avatar */}
                          <td className="px-6 py-3">
                            {r.avatar ? (
                              <img src={r.avatar} alt={r.name} className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200" />
                            ) : (
                              <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                                {r.name.split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase()}
                              </div>
                            )}
                          </td>

                          {/* Name */}
                          <td className="px-6 py-3">
                            <div className="font-semibold text-slate-900">{r.name}</div>
                          </td>

                          {/* Email */}
                          <td className="px-6 py-3">
                            <div className="text-slate-700">{r.email}</div>
                          </td>

                          {/* Specialization */}
                          <td className="px-6 py-3">
                            <div className="text-slate-700">{r.specialty}</div>
                          </td>

                          {/* Status dropdown */}
                          <td className="px-6 py-3">
                            <div className="relative inline-block">
                              <select
                                value={r.status}
                                onChange={(e) => actOnRequest(r.id, e.target.value)}
                                className="peer w-40 appearance-none rounded-md border border-slate-300 bg-white px-3 py-2 pr-8 text-sm font-medium text-slate-800 shadow-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                              <svg className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="px-6 py-3 text-right">
                            <button
                              type="button"
                              className="font-semibold text-blue-700 hover:underline"
                              onClick={() => openDetails(r)}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}

                      {requests.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                            No pending requests
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* footer demo actions */}
                <div className="flex items-center justify-end gap-2 px-6 py-4">
                  <button
                    onClick={() => setRequests((list) => list.map((r) => ({ ...r, status: r.status === "Rejected" ? "Rejected" : "Approved" })))}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Approve All (demo)
                  </button>
                  <button
                    onClick={() => setRequests((list) => list.map((r) => ({ ...r, status: "Rejected" })))}
                    className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Reject All (demo)
                  </button>
                </div>

                {/* --- Details Modal --- */}
                {detailOpen && selectedDoc && (
                  <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
                    onClick={(e) => { if (e.target === e.currentTarget) closeDetails(); }}
                    onKeyDown={(e) => { if (e.key === "Escape") closeDetails(); }}
                    tabIndex={-1}
                  >
                    <div className="w-full max-w-2xl rounded-2xl bg-white shadow-lg">
                      {/* Header */}
                      <div className="flex items-center justify-between border-b px-5 py-4">
                        <h3 className="text-lg font-semibold text-slate-900">Doctor Details</h3>
                        <button className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100" onClick={closeDetails} aria-label="Close">✕</button>
                      </div>

                      {/* Body */}
                      <div className="px-5 py-5">
                        <div className="flex items-start gap-4">
                          {selectedDoc.avatar ? (
                            <img src={selectedDoc.avatar} alt={selectedDoc.name} className="h-16 w-16 rounded-full object-cover ring-1 ring-slate-200" />
                          ) : (
                            <div className="grid h-16 w-16 place-items-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600 ring-1 ring-slate-200">
                              {selectedDoc.name.split(" ").map(n=>n[0]).slice(0,2).join("").toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="text-base font-semibold text-slate-900">{selectedDoc.name}</div>
                            <div className="text-sm text-slate-700">{selectedDoc.email}</div>
                            <div className="mt-1 text-sm text-slate-700">
                              <span className="font-medium">Specialization:</span> {selectedDoc.specialty} ·{" "}
                              <span className="font-medium">Experience:</span> {selectedDoc.experience}+ yrs
                            </div>
                            <p className="mt-3 text-sm text-slate-700">{selectedDoc.bio}</p>
                          </div>
                          <span className={`inline-flex h-7 items-center rounded-full border px-2.5 text-xs font-semibold
                            ${selectedDoc.status==="Approved" ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                            : selectedDoc.status==="Rejected" ? "border-rose-200 bg-rose-100 text-rose-700"
                            : "border-yellow-200 bg-yellow-100 text-yellow-700"}`}>
                            {selectedDoc.status}
                          </span>
                        </div>

                        {/* Documents */}
                        <div className="mt-6">
                          <h4 className="text-sm font-semibold text-slate-900">Submitted Documents</h4>
                          <div className="mt-2 overflow-hidden rounded-xl border border-slate-200">
                            <table className="min-w-full text-sm">
                              <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                  <th className="px-3 py-2 text-left">File</th>
                                  <th className="px-3 py-2 text-left">Type</th>
                                  <th className="px-3 py-2 text-left">Size</th>
                                  <th className="px-3 py-2 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedDoc.documents?.map((f) => (
                                  <tr key={f.id} className="border-t">
                                    <td className="px-3 py-2 font-medium text-slate-800">{f.name}</td>
                                    <td className="px-3 py-2">{f.type}</td>
                                    <td className="px-3 py-2">{f.size}</td>
                                    <td className="px-3 py-2 text-right">
                                      <div className="flex justify-end gap-2">
                                        <button
                                          className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                                          onClick={() => alert(`Preview ${f.name} (demo)`)}
                                        >
                                          View
                                        </button>
                                        <button
                                          className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                                          onClick={() => alert(`Download ${f.name} (demo)`)}
                                        >
                                          Download
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                                {!selectedDoc.documents?.length && (
                                  <tr><td className="px-3 py-6 text-center text-slate-500" colSpan={4}>No documents uploaded</td></tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>

                      {/* Footer actions */}
                      <div className="flex items-center justify-between gap-3 border-t px-5 py-4">
                        <div className="text-xs text-slate-500">UI-only preview</div>
                        <div className="flex gap-2">
                          <button
                            className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                            onClick={() => { setRequests(list => list.map(x => x.id===selectedDoc.id ? {...x, status:"Approved"} : x)); closeDetails(); }}
                          >
                            Approve
                          </button>
                          <button
                            className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                            onClick={() => { setRequests(list => list.map(x => x.id===selectedDoc.id ? {...x, status:"Rejected"} : x)); closeDetails(); }}
                          >
                            Reject
                          </button>
                          <button
                            className="rounded-md border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            onClick={closeDetails}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Messages */}
            {tab === "messages" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-4">
                  <h1 className="text-xl font-semibold text-slate-900">Messages</h1>
                  <p className="text-sm text-slate-600">Inbox (demo content)</p>
                </div>
                <ul className="divide-y">
                  {messages.map((m) => (
                    <li key={m.id} className="flex items-center justify-between gap-4 py-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">{m.subject}</div>
                        <div className="truncate text-xs text-slate-600">{m.from}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500">{m.time}</span>
                        <button className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                          View
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Change Password */}
            {tab === "password" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-xl font-semibold text-slate-900">Change Password</h1>
                <p className="text-sm text-slate-600">Update your admin password (UI-only)</p>
                <form className="mt-5 max-w-md space-y-4">
                  <Field label="Current password" type="password" placeholder="••••••••" />
                  <Field label="New password" type="password" placeholder="At least 6 characters" />
                  <Field label="Confirm new password" type="password" placeholder="Repeat new password" />
                  <button className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 sm:w-auto">
                    Update Password
                  </button>
                </form>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

/* ---------- helpers ---------- */

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

function StatCard({ title, value, color = "from-slate-100 to-white", iconBg = "bg-slate-200" }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full ${iconBg}`}>
        <div className="h-3 w-3 rounded-full bg-blue-600" />
      </div>
      <div className="text-sm text-slate-600">{title}</div>
      <div className="mt-1 text-3xl font-semibold text-slate-900">{value}</div>
      <div className={`mt-4 h-10 w-full rounded-xl bg-linear-to-r ${color}`} />
    </div>
  );
}

function Field({ label, type="text", placeholder="" }) {
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
