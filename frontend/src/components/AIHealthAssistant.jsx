import { useState } from "react";
import { API_BASE } from "../context/AuthContext";

export default function AIHealthAssistant({ token }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Hello! I can help assess symptoms and suggest possible causes. I do not replace a doctor.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!input.trim()) return;

    setMessages((m) => [...m, { role: "patient", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/ai/diagnosis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ symptoms: input }),
      });

      const data = await res.json();

      setMessages((m) => [
        ...m,
        { role: "assistant", text: data.reply },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "Sorry, I couldn’t analyze your symptoms right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold mb-2">
        AI Health Assessment
      </h1>

      <p className="text-xs text-slate-500 mb-4">
        ⚠️ This tool provides general health assessment only and is not a medical diagnosis.
      </p>

      <div className="h-80 overflow-y-auto space-y-3 border rounded-lg p-3 text-sm">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`rounded-lg px-3 py-2 ${
              m.role === "patient"
                ? "bg-blue-600 text-white self-end"
                : "bg-slate-100 text-slate-800"
            }`}
          >
            {m.text}
          </div>
        ))}
        {loading && (
          <p className="text-xs text-slate-400">Analyzing symptoms…</p>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe symptoms (e.g., headache, fever, fatigue)"
          className="flex-1 rounded-md border px-3 py-2 text-sm"
        />
        <button
          onClick={send}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Ask
        </button>
      </div>
    </div>
  );
}
