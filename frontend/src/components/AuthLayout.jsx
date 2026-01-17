import { Link } from "react-router-dom";

export default function AuthLayout({
  title,
  subtitle,
  size = "compact", // compact | wide
  children,
}) {
  return (
    <main className="min-h-screen bg-linear-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center px-4 py-10">
      
      {/* Responsive container */}
      <div
        className={`w-full ${
          size === "wide"
            ? "max-w-6xl"
            : "max-w-md"
        }`}
      >
        {/* AUTH CARD */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:p-10 shadow-xl">
          
          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-2 text-sm text-slate-600">
              {subtitle}
            </p>
          )}

          {/* Content */}
          <div className="mt-6 sm:mt-8">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
