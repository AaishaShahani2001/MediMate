import { Link } from "react-router-dom";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-indigo-50">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-10 md:grid-cols-2">
        {/* Left: Form */}
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-6 inline-flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white font-bold">HVA</div>
            <span className="text-lg font-semibold text-slate-900">HealthVA</span>
          </Link>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-slate-600">{subtitle}</p>}
            <div className="mt-6">{children}</div>
          </div>
          <p className="mt-4 text-center text-xs text-slate-500">
            * UI only for semester demo (no API calls yet)
          </p>
        </div>

        {/* Right: Decorative panel */}
        <div className="relative hidden h-[520px] rounded-3xl bg-linear-to-tr from-blue-200 to-indigo-200 md:block">
          <div className="absolute -left-6 -top-6 h-28 w-28 rounded-full bg-white/70 blur" />
          <div className="absolute -bottom-8 right-6 h-36 w-36 rounded-full bg-white/60 blur" />
          <div className="absolute left-10 top-10 h-24 w-24 rounded-2xl bg-white/80 backdrop-blur" />
          <div className="absolute bottom-8 left-1/2 h-20 w-40 -translate-x-1/2 rounded-2xl bg-white/70 backdrop-blur" />
        </div>
      </div>
    </main>
  );
}
