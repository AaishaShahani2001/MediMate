export default function Contact() {
  return (
    <main className="bg-white">
      {/* ================= HERO BANNER ================= */}
      <section className="relative bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_white,_transparent_70%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center text-white">
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            Contact HealthVA
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Reach out to us for platform support, technical assistance,
            or general inquiries related to HealthVA.
          </p>
        </div>
      </section>

      {/* ================= CONTACT INFO ================= */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

          <InfoCard
            icon="📍"
            title="Location"
            text="Sri Lanka (Academic Project)"
          />

          <InfoCard
            icon="📧"
            title="Email"
            text="support@healthva.com"
          />

          <InfoCard
            icon="📞"
            title="Phone"
            text="+94 7X XXX XXXX"
          />

          <InfoCard
            icon="⏰"
            title="Availability"
            text="Monday – Friday, 9.00 AM – 5.00 PM"
          />

        </div>

        {/* ================= RELATED INFO ================= */}
        <div className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            Important Notice
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-3xl mx-auto">
            HealthVA is an academic healthcare platform developed as part of a
            university project. All AI-assisted features provide general
            information only and must not be considered as professional medical
            advice. Always consult a qualified healthcare professional for
            medical concerns.
          </p>
        </div>
      </section>
    </main>
  );
}

/* ================= HELPER ================= */

function InfoCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-center transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-3 text-2xl">{icon}</div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-600">{text}</p>
    </div>
  );
}
