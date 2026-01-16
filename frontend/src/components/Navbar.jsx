import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const linkBase =
    "relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200";
  const activeClass = ({ isActive }) =>
    isActive
      ? `${linkBase} text-blue-700 bg-blue-50`
      : `${linkBase} text-slate-700 hover:text-blue-700 hover:bg-blue-50`;

  /* ROLE-BASED REDIRECT */
  function goToProfile() {
    if (!user) return;

    if (user.role === "doctor") navigate("/doctor");
    else if (user.role === "admin") navigate("/admin");
    else navigate("/patient");

    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/80 backdrop-blur-lg shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
        
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 text-white font-bold shadow-md group-hover:scale-105 transition">
            H
          </div>
          <div className="leading-tight">
            <span className="block text-lg font-semibold text-slate-900">
              HealthVA
            </span>
            <span className="block text-xs text-slate-500">
              Virtual Care Platform
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={activeClass}>Home</NavLink>
          <NavLink to="/doctors" className={activeClass}>Doctors</NavLink>
        </div>

        {/* Desktop auth / profile */}
        <div className="hidden items-center gap-3 md:flex">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-blue-700"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:shadow-md hover:opacity-95"
              >
                Sign up
              </Link>
            </>
          ) : (
            <button
              onClick={goToProfile}
              title="My Dashboard"
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm hover:bg-slate-100"
            >
              <div className="grid h-8 w-8 place-items-center rounded-full bg-blue-100 text-blue-700 font-semibold">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <span className="hidden sm:block text-sm font-medium text-slate-700">
                Dashboard
              </span>
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((s) => !s)}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4">
            <NavLink to="/" className={activeClass} onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/doctors" className={activeClass} onClick={() => setOpen(false)}>Doctors</NavLink>

            {!user ? (
              <div className="mt-3 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <button
                onClick={goToProfile}
                className="mt-3 flex items-center gap-3 rounded-lg border px-4 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
              >
                👤 My Dashboard
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
