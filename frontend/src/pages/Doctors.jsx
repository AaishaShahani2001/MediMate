import { useMemo, useState } from "react";
import DoctorCard from "../components/DoctorCard";
import CategoryPills from "../components/CategoryPills";
import { CATEGORIES, DOCTORS } from "../data/doctors";
import BecomeDoctorModal from "../components/BecomeDoctorModal";

export default function Doctors() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [openApply, setOpenApply] = useState(false);

  const filtered = useMemo(() => {
    const byCat =
      cat === "All" ? DOCTORS : DOCTORS.filter((d) => d.category === cat);

    const byQ = q.trim()
      ? byCat.filter(
          (d) =>
            d.name.toLowerCase().includes(q.toLowerCase()) ||
            d.category.toLowerCase().includes(q.toLowerCase())
        )
      : byCat;

    return byQ;
  }, [q, cat]);

  return (
    <main className="min-h-screen bg-white">
      {/* ================= TOP SECTION ================= */}
      <section className="border-b bg-linear-to-br from-blue-50 via-white to-indigo-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
          {/* Header row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Find your doctor
              </h1>
              <p className="mt-1 text-sm sm:text-base text-slate-600">
                Filter by specialty or search by name.
              </p>
            </div>

            {/* Button */}
            <button
              onClick={() => setOpenApply(true)}
              className="w-full sm:w-auto rounded-md bg-blue-600 px-5 py-2.5
                text-sm font-semibold text-white shadow hover:bg-blue-700"
            >
              Become a Doctor
            </button>
          </div>

          {/* Search + Categories */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="w-full sm:max-w-md">
              <div className="relative">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search by doctor or category…"
                  className="w-full rounded-md border border-slate-200 bg-white
                    px-3 py-2 pl-10 text-sm shadow-sm
                    focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-4.35-4.35M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
            </div>

            {/* Categories */}
            <div className="overflow-x-auto sm:overflow-visible">
              <CategoryPills
                categories={CATEGORIES}
                active={cat}
                onChange={setCat}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= DOCTOR GRID ================= */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:py-10">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300
            p-8 text-center text-sm sm:text-base text-slate-600">
            No doctors found for your search.
          </div>
        ) : (
          <div
            className="grid grid-cols-1 gap-4
              sm:grid-cols-2
              lg:grid-cols-3"
          >
            {filtered.map((d) => (
              <DoctorCard key={d.id} doc={d} />
            ))}
          </div>
        )}
      </section>

      {/* ================= APPLY MODAL ================= */}
      {openApply && (
        <BecomeDoctorModal onClose={() => setOpenApply(false)} />
      )}
    </main>
  );
}
