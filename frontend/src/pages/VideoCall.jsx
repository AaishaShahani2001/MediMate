import { useEffect, useMemo, useRef, useState } from "react";
import Peer from "simple-peer";
import { io } from "socket.io-client";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth, API_BASE } from "../context/AuthContext";

export default function VideoCall() {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const isDoctor = useMemo(() => user?.role === "doctor", [user]);

  const [stream, setStream] = useState(null);
  const [status, setStatus] = useState("Connecting…");
  const [roomCount, setRoomCount] = useState(1);
  const [callAccepted, setCallAccepted] = useState(false);


  const myVideo = useRef(null);
  const remoteVideo = useRef(null);
  const socketRef = useRef(null);
  const peerRef = useRef(null);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);


  /* ================= MAIN EFFECT ================= */
  useEffect(() => {
    if (!token || !appointmentId) {
      navigate("/login");
      return;
    }

    //  Connect socket with JWT
    const socket = io("http://localhost:3000", {
      auth: { token },
      transports: ["websocket"],
    });
    socketRef.current = socket;

    //  Get camera + mic
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((s) => {
        setStream(s);
        if (myVideo.current) myVideo.current.srcObject = s;

        // Join appointment room
        socket.emit("join-appointment", { appointmentId });
      })
      .catch(() => {
        setStatus("Camera or microphone permission denied");
      });

    // ===== SOCKET EVENTS =====
    socket.on("join-ok", () =>
      setStatus("Joined. Waiting for the other participant…")
    );

    socket.on("join-denied", (msg) =>
      setStatus(msg?.message || "Join denied")
    );

    socket.on("room-users", ({ count }) => {
      const c = count || 1;
      setRoomCount(c);

      if (c === 1) {
        setStatus("Waiting for the other person...");
      }

      if (c === 2) {
        setStatus("Connecting call...");
      }
    });


    socket.on("room-ready", () => {
      if (!peerRef.current && stream && isDoctor) {
        startPeer(true);
      }
    });

    socket.on("signal", (data) => {
      if (!peerRef.current && stream && !isDoctor) {
        startPeer(false);
      }
      peerRef.current?.signal(data);
    });

    socket.on("peer-left", () => {
      setStatus("Other participant left the call");
      cleanupPeer();
    });

    return () => {
      socket.emit("leave-appointment", { appointmentId });
      socket.disconnect();
      stopMedia();
      cleanupPeer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId, token, isDoctor]);

  /* ================= PEER ================= */

  function startPeer(initiator) {
    setStatus(initiator ? "Calling…" : "Answering…");

    const peer = new Peer({
      initiator,
      trickle: false,
      stream,
    });

    peer.on("signal", (data) => {
      socketRef.current?.emit("signal", { appointmentId, data });
    });

    peer.on("stream", (remoteStream) => {
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = remoteStream;
      }
      setCallAccepted(true);
      setStatus("In call");
    });

    peer.on("close", () => {
      setStatus("Call ended");
      setCallAccepted(false);
    });

    peer.on("error", () => {
      setStatus("Call error");
    });

    peerRef.current = peer;
  }

  function cleanupPeer() {
    if (peerRef.current) {
      try {
        peerRef.current.destroy();
      } catch { }
      peerRef.current = null;
    }
    setCallAccepted(false);
  }

  function stopMedia() {
    if (!stream) return;
    stream.getTracks().forEach((t) => t.stop());
  }

  async function endCall() {
    cleanupPeer();
    socketRef.current?.emit("leave-appointment", { appointmentId });

    // OPTIONAL: mark appointment completed
    // await fetch(`${API_BASE}/api/appointments/${appointmentId}/status`, {
    //   method: "PATCH",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${token}`,
    //   },
    //   body: JSON.stringify({ status: "Completed" }),
    // });

    navigate(-1);
  }

  /* ================= Mute / Unmute microphone ================= */
  function toggleMic() {
    if (!stream) return;

    stream.getAudioTracks().forEach((track) => {
      track.enabled = !micOn;
    });

    setMicOn((prev) => !prev);
  }

  /* ================= Turn camera on / off ================= */
  function toggleCamera() {
    if (!stream) return;

    stream.getVideoTracks().forEach((track) => {
      track.enabled = !camOn;
    });

    setCamOn((prev) => !prev);
  }


  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-4 rounded-2xl border bg-white p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-slate-900">
              Live Appointment Call
            </div>
            <div className="text-sm text-slate-600">
              Room: {appointmentId} • Users: {roomCount} • {status}
            </div>
          </div>

          <button
            onClick={endCall}
            className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            End Call
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-3 shadow-sm">
            <div className="mb-2 text-sm font-semibold text-slate-700">
              You
            </div>
            <video
              ref={myVideo}
              autoPlay
              playsInline
              muted
              className="w-full rounded-xl bg-black"
            />
          </div>

          <div className="rounded-2xl border bg-white p-3 shadow-sm">
            <div className="mb-2 text-sm font-semibold text-slate-700">
              {callAccepted ? "Other Participant" : "Waiting…"}
            </div>
            <video
              ref={remoteVideo}
              autoPlay
              playsInline
              className="w-full rounded-xl bg-black"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-4">
          {/* MIC */}
          <button
            onClick={toggleMic}
            className={`rounded-full px-4 py-2 text-sm font-semibold
      ${micOn
                ? "bg-slate-100 text-slate-800 hover:bg-slate-200"
                : "bg-rose-600 text-white hover:bg-rose-700"
              }`}
          >
            {micOn ? "🎤 Mic On" : "🔇 Mic Off"}
          </button>

          {/* CAMERA */}
          <button
            onClick={toggleCamera}
            className={`rounded-full px-4 py-2 text-sm font-semibold
      ${camOn
                ? "bg-slate-100 text-slate-800 hover:bg-slate-200"
                : "bg-rose-600 text-white hover:bg-rose-700"
              }`}
          >
            {camOn ? "📷 Camera On" : "🚫 Camera Off"}
          </button>
        </div>

      </div>
    </div>
  );
}
