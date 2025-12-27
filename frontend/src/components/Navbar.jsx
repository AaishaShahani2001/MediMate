import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const linkBase =
    "px-3 py-2 text-sm font-medium rounded-md hover:bg-blue-50 hover:text-blue-700 transition";
  const activeClass = ({ isActive }) =>
    isActive
      ? `${linkBase} text-blue-700 bg-blue-50`
      : `${linkBase} text-slate-700`;

  /* 🔑 ROLE-BASED REDIRECT */
  function goToProfile() {
    if (!user) return;

    if (user.role === "doctor") {
      navigate("/doctor");
    } else if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/patient"); // default
    }

    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 border-b bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4">
        
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white font-bold">
            HVA
          </div>
          <span className="text-lg font-semibold text-slate-900">
            HealthVA
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={activeClass}>Home</NavLink>
          <NavLink to="/doctors" className={activeClass}>Doctors</NavLink>
        </div>

        {/* Desktop auth / profile */}
        <div className="hidden items-center gap-2 md:flex">
          {!user ? (
            <>
              <Link
                to="/login"
                className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-700"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Sign up
              </Link>
            </>
          ) : (
            <button
              onClick={goToProfile}
              title="My Dashboard"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white hover:bg-slate-100"
            >
              {/* profile icon */}
              <svg
                className="h-5 w-5 text-slate-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.121 17.804A9 9 0 1118.88 17.8M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-700 hover:bg-slate-100 md:hidden"
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
        <div className="md:hidden border-t bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            <NavLink to="/" className={activeClass} onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/doctors" className={activeClass} onClick={() => setOpen(false)}>Doctors</NavLink>

            {!user ? (
              <div className="mt-2 flex items-center gap-2">
                <Link to="/login" onClick={() => setOpen(false)} className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-700">
                  Login
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                  Sign up
                </Link>
              </div>
            ) : (
              <button
                onClick={goToProfile}
                className="mt-2 flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700"
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
