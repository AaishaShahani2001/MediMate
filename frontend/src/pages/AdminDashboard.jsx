import { useState, useEffect } from "react";
import { API_BASE, useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import  socket  from "../socket";



export default function AdminDashboard() {
  const { token, logout } = useAuth();
  const [tab, setTab] = useState("dashboard");
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    doctors: 0,
    users: 0,
    appointments: 0,
  });


  // REAL doctor requests
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // View Details modal
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // Messages
  const [adminMessages, setAdminMessages] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [msgLoading, setMsgLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    socket.on("typing", () => setIsTyping(true));
    socket.on("stopTyping", () => setIsTyping(false));

    return () => {
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, []);

  function openDetails(row) {
    setSelectedDoc(row);
    setDetailOpen(true);
  }

  function closeDetails() {
    setDetailOpen(false);
    setSelectedDoc(null);
  }

  useEffect(() => {
    if (tab !== "messages") return;

    socket.on("new-message", (msg) => {
      setMessages((prev) => [msg, ...prev]);
    });

    socket.on("typing", ({ from }) => {
      console.log("Patient typing:", from);
    });

    socket.on("online-users", (users) => {
      console.log("Online users:", users);
    });

    return () => {
      socket.off("new-message");
      socket.off("typing");
      socket.off("online-users");
    };
  }, [tab]);

  useEffect(() => {
    if (tab !== "messages") return;

    fetch(`${API_BASE}/api/messages/admin/mark-read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
  }, [tab]);



  useEffect(() => {
    if (tab !== "dashboard") return;

    async function fetchStats() {
      try {
        const res = await fetch(`${API_BASE}/api/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setStats({
          doctors: data.totalDoctors,
          users: data.totalUsers,
          appointments: data.totalAppointments,
        });
      } catch (err) {
        console.error("Failed to load stats:", err.message);
      }
    }

    fetchStats();
  }, [tab, token]);


  /* ================= FETCH DOCTOR REQUESTS ================= */
  useEffect(() => {
    if (tab !== "requests") return;

    async function fetchRequests() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/doctor-applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        const mapped = data.map((d) => {
          const documents = [];

          // NIC
          if (d.nic) {
            documents.push({
              fileName: d.nic.fileName,
              filePath: d.nic.filePath,
              type: "NIC",
            });
          }

          // Certificates
          if (d.certifications?.length) {
            d.certifications.forEach((c) => {
              documents.push({
                fileName: c.fileName,
                filePath: c.filePath,
                type: "Certificate",
              });
            });
          }

          return {
            id: d._id,
            name: d.fullName,
            email: d.email,
            specialty: d.specialization,
            workplace: d.workplace,
            experience: d.experience,
            status: d.status,
            avatar: d.avatar || "",
            bio: d.about,
            documents,
          };
        });
        //console.log("Selected Doc:", selectedDoc);

        setRequests(mapped);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, [tab, token]);

  /* ================= APPROVE / REJECT ================= */
  async function actOnRequest(id, status) {
    try {
      const res = await fetch(`${API_BASE}/api/doctor-applications/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setRequests((list) =>
        list.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } catch (err) {
      alert(err.message);
    }
  }

  /* ================= MESSAGES ================= */

  useEffect(() => {
    if (tab !== "messages") return;

    async function fetchMessages() {
      setMsgLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/messages/admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setAdminMessages(data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setMsgLoading(false);
      }
    }

    fetchMessages();
  }, [tab, token]);


  /* ================= SEND REPLY ================= */
  async function sendReply(id) {
    const reply = replyText[id];
    if (!reply) return;

    await fetch(`${API_BASE}/api/messages/${id}/reply`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reply }),
    });

    setAdminMessages((list) =>
      list.map((m) =>
        m._id === id ? { ...m, reply, read: true } : m
      )
    );

    setReplyText((prev) => ({ ...prev, [id]: "" }));
    setUnreadCount((c) => Math.max(0, c - 1));
  }



  /* ================= FETCH UNREAD MSG COUNT ================= */

  useEffect(() => {
    if (tab !== "messages") return;

    fetch(`${API_BASE}/api/messages/admin/unread-count`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setUnreadCount(d.count));
  }, [tab, token]);

  /* ================= DELETE MESSAGES ================= */
  async function deleteMessage(id) {
    await fetch(`${API_BASE}/api/messages/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    setAdminMessages((list) => list.filter((m) => m._id !== id));
  }


  /* ================= LOGOUT ================= */
  function handleLogout() {
    logout();
    navigate("/login");
  }


  /* ================= UI  ================= */

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Sidebar */}
          <aside className="md:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-slate-900">Admin Panel</h2>
              <nav className="flex flex-col gap-1">
                <SideItem icon="📊" label="Dashboard" active={tab === "dashboard"} onClick={() => setTab("dashboard")} />
                <SideItem icon="🩺" label="Doctor Requests" active={tab === "requests"} onClick={() => setTab("requests")} />
                <SideItem
                  icon="✉️"
                  label={
                    <span className="flex items-center gap-2">
                      Messages
                      {unreadCount > 0 && (
                        <span className="rounded-full bg-rose-600 px-2 text-xs text-white">
                          {unreadCount}
                        </span>
                      )}
                    </span>
                  }
                  active={tab === "messages"}
                  onClick={() => setTab("messages")}
                />
                <SideItem icon="🔒" label="Change Password" active={tab === "password"} onClick={() => setTab("password")} />
              </nav>
              <button
                className="mt-6 w-full rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </aside>

          {/* Main */}
          <section className="md:col-span-9">

            {tab === "dashboard" && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">

                {/* Doctors */}
                <div className="rounded-2xl bg-white p-6 shadow-sm border">
                  <p className="text-sm text-slate-500">Total Doctors</p>
                  <h3 className="mt-2 text-3xl font-bold text-blue-600">
                    {stats.doctors}
                  </h3>
                </div>

                {/* Users */}
                <div className="rounded-2xl bg-white p-6 shadow-sm border">
                  <p className="text-sm text-slate-500">Total Users</p>
                  <h3 className="mt-2 text-3xl font-bold text-emerald-600">
                    {stats.users}
                  </h3>
                </div>

                {/* Appointments */}
                <div className="rounded-2xl bg-white p-6 shadow-sm border">
                  <p className="text-sm text-slate-500">Total Appointments</p>
                  <h3 className="mt-2 text-3xl font-bold text-rose-600">
                    {stats.appointments}
                  </h3>
                </div>

              </div>
            )}


            {/* Doctor Requests */}
            {tab === "requests" && (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="px-6 pt-6">
                  <h1 className="text-2xl font-semibold text-slate-900">Doctor Requests</h1>
                  <p className="text-sm text-slate-600">Approve or reject new doctor accounts</p>
                </div>

                {loading ? (
                  <p className="px-6 py-6 text-slate-500">Loading...</p>
                ) : (
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-blue-600 text-white">
                          <th className="px-6 py-3">Avatar</th>
                          <th className="px-6 py-3">Name</th>
                          <th className="px-6 py-3">Email</th>
                          <th className="px-6 py-3">Specialization</th>
                          <th className="px-6 py-3">Workplace</th>
                          <th className="px-6 py-3">Status</th>
                          <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {requests.map((r) => (
                          <tr key={r.id}>
                            <td className="px-6 py-3">
                              {r.avatar ? (
                                <img src={r.avatar} className="h-10 w-10 rounded-full" />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold">
                                  {r.name[0]}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-3 font-semibold">{r.name}</td>
                            <td className="px-6 py-3">{r.email}</td>
                            <td className="px-6 py-3">{r.specialty}</td>
                            <td className="px-6 py-3">{r.workplace}</td>
                            <td className="px-6 py-3">

                              {r.status === "Pending" ? (
                                <select
                                  value={r.status}
                                  onChange={(e) => actOnRequest(r.id, e.target.value)}
                                  className="rounded-md border px-3 py-1.5"
                                >
                                  <option>Pending</option>
                                  <option>Approved</option>
                                  <option>Rejected</option>
                                </select>
                              ) : (
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-semibold
        ${r.status === "Approved"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : "bg-rose-100 text-rose-700"}`}
                                >
                                  {r.status}
                                </span>
                              )}

                            </td>
                            <td className="px-6 py-3 text-right">
                              <button
                                className="text-blue-700 font-semibold hover:underline"
                                onClick={() => openDetails(r)}
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ================= MESSAGES ================= */}
            {tab === "messages" && (
              <div className="rounded-2xl border bg-white shadow-sm">
                <div className="px-6 pt-6">
                  <h1 className="text-2xl font-semibold text-slate-900">Messages</h1>
                  <p className="text-sm text-slate-600">
                    Patient/ Users messages
                  </p>
                </div>

                {isTyping && (
                  <div className="px-6 mt-2">
                    <p className="text-xs text-slate-500 italic">
                      Patient is typing...
                    </p>
                  </div>
                )}

                {msgLoading ? (
                  <p className="px-6 py-6 text-slate-500">Loading messages...</p>
                ) : messages.length === 0 ? (
                  <p className="px-6 py-6 text-slate-500">No messages yet.</p>
                ) : (
                  <div className="divide-y mt-4">
                    {messages.map((m) => (
                      <div key={m._id} className="px-6 py-5">
                        <div className="flex justify-between items-start">
                          <div>
                            {/* Sender name */}
                            <p className="font-semibold text-slate-900">
                              {m.sender?.name || m.name || "Unknown Sender"}
                            </p>

                            {/* Sender email */}
                            <p className="text-xs text-slate-500">
                              {m.sender?.email || m.email || "—"}
                            </p>
                          </div>

                          <span className="text-xs text-slate-400">
                            {new Date(m.createdAt).toLocaleString()}
                          </span>
                        </div>


                        <p className="mt-3 text-sm text-slate-700">
                          {m.message}
                        </p>

                        {/* Reply Section */}
                        {m.reply ? (
                          <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm">
                            <b>Admin reply:</b>
                            <p>{m.reply}</p>
                            <button
                              onClick={() => deleteMessage(m._id)}
                              className="mt-2 text-xs text-rose-600 hover:underline"
                            >
                              Clear conversation
                            </button>
                          </div>
                        ) : (
                          <div className="mt-4 space-y-2">
                            <textarea
                              placeholder="Type reply..."
                              value={replyText[m._id] || ""}
                              onChange={(e) =>
                                setReplyText({
                                  ...replyText,
                                  [m._id]: e.target.value,
                                })
                              }
                              className="w-full rounded-md border px-3 py-2 text-sm"
                            />

                            <button
                              onClick={() => sendReply(m._id)}
                              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                              Send Reply
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}


          </section>
        </div>
      </div>

      {/* ================= VIEW DETAILS MODAL ================= */}
      {detailOpen && selectedDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={(e) => e.target === e.currentTarget && closeDetails()}
        >
          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between bg-blue-600 px-6 py-4">
              <h3 className="text-lg font-semibold text-white">
                Doctor Application Details
              </h3>
              <button
                onClick={closeDetails}
                className="text-white/80 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">

              {/* Profile */}
              <div className="flex gap-4 items-start">
                {selectedDoc.avatar ? (
                  <img
                    src={selectedDoc.avatar}
                    alt={selectedDoc.name}
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-blue-200"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-lg">
                    {selectedDoc.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                )}

                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-slate-900">
                    {selectedDoc.name}
                  </h4>
                  <p className="text-sm text-slate-600">{selectedDoc.email}</p>

                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                    <p><b>Specialization:</b> {selectedDoc.specialty}</p>
                    <p><b>Experience:</b> {selectedDoc.experience}+ years</p>
                    <p className="text-sm text-slate-700">
                      <b>Hospital / Clinic:</b> {selectedDoc.workplace || "—"}
                    </p>

                    <p className="col-span-2">
                      <b>Status:</b>{" "}
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold
                    ${selectedDoc.status === "Approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : selectedDoc.status === "Rejected"
                              ? "bg-rose-100 text-rose-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {selectedDoc.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {selectedDoc.bio && (
                <div>
                  <h5 className="text-sm font-semibold text-slate-900 mb-1">
                    About Doctor
                  </h5>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {selectedDoc.bio}
                  </p>
                </div>
              )}

              {/* Documents */}
              <div>
                <h5 className="text-sm font-semibold text-slate-900 mb-2">
                  Submitted Documents
                </h5>

                {selectedDoc.documents?.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedDoc.documents.map((doc, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between rounded-lg border px-4 py-2 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          📄
                          <span className="font-medium text-slate-800">
                            {doc.fileName}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <a
                            href={`${API_BASE}/${doc.filePath}`}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-md border px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                          >
                            View
                          </a>
                          <a
                            href={`${API_BASE}/${doc.filePath}`}
                            download
                            className="rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                          >
                            Download
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">
                    No documents uploaded.
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 border-t px-6 py-4 bg-slate-50">
              <button
                onClick={closeDetails}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}


    </main>
  );
}

/* helpers */
function SideItem({ icon, label, active, onClick }) {
  const base = "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition";
  const a = active ? "bg-blue-600 text-white" : "text-slate-700 hover:bg-blue-50 hover:text-blue-700";
  return <button onClick={onClick} className={`${base} ${a}`}>{icon} {label}</button>;
}
