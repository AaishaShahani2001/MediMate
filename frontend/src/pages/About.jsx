import { Link } from "react-router-dom";

export default function About() {
  return (
    <main className="bg-white">
      {/* ================= HERO / BANNER ================= */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_white,_transparent_70%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center text-white">
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            About HealthVA
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-blue-100 sm:text-lg">
            A modern virtual healthcare assistant platform built to connect
            patients, doctors, and technology in one secure ecosystem.
          </p>

          <Link
            to="/doctors"
            className="mt-8 inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow hover:bg-blue-50"
          >
            Explore Doctors
          </Link>
        </div>
      </section>

      {/* ================= MISSION & VISION ================= */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          
          {/* Mission */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 text-xl">
              🎯
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              Our Mission
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Our mission is to simplify access to healthcare by leveraging
              modern web technologies and AI-assisted tools that support
              patients and healthcare professionals in making informed
              decisions.
            </p>
          </div>

          {/* Vision */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 text-xl">
              🌍
            </div>
            <h2 className="text-xl font-semibold text-slate-900">
              Our Vision
            </h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              We envision a future where digital healthcare platforms bridge
              the gap between patients and doctors, enabling efficient,
              secure, and user-friendly healthcare experiences for everyone.
            </p>
          </div>

        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Why Choose HealthVA?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-600">
              HealthVA is designed with real-world healthcare needs and modern
              development practices in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            
            <WhyCard
              icon="🔒"
              title="Secure & Reliable"
              text="Built with authentication, role-based access, and secure data handling to protect user information."
            />

            <WhyCard
              icon="🧠"
              title="AI-Assisted Health Support"
              text="Includes an AI-powered health assistant that helps users assess symptoms and understand possible conditions."
            />

            <WhyCard
              icon="👩‍⚕️"
              title="Doctor-Centric Platform"
              text="Designed to support doctors with profile management, appointment handling, and patient interaction."
            />

            <WhyCard
              icon="📅"
              title="Smart Appointments"
              text="Streamlined appointment booking, management, and status tracking for patients and doctors."
            />

            <WhyCard
              icon="📱"
              title="Responsive Design"
              text="Fully responsive UI that works seamlessly across desktops, tablets, and mobile devices."
            />

            <WhyCard
              icon="🎓"
              title="Academic & Industry Ready"
              text="Developed as a semester project following industry-grade architecture and best practices."
            />

          </div>
        </div>
      </section>
    </main>
  );
}

/* ================= HELPER ================= */

function WhyCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition">
      <div className="mb-4 text-2xl">{icon}</div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">
        {text}
      </p>
    </div>
  );
}
