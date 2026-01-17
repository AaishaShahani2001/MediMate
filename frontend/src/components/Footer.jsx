export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-linear-to-b from-white to-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10">
        
        {/* Top section */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 text-white font-bold shadow">
                H
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  HealthVA
                </h3>
                <p className="text-xs text-slate-500">
                  Virtual Healthcare Assistant
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-600 leading-relaxed">
              HealthVA is a student-built healthcare platform designed to
              demonstrate modern web technologies, role-based access, and
              AI-assisted health support.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-800">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a href="/" className="hover:text-blue-700 transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-blue-700 transition">
                  About
                </a>
              </li>
              <li>
                <a href="/doctors" className="hover:text-blue-700 transition">
                  Doctors
                </a>
              </li>
              <li>
                <a href="/signup" className="hover:text-blue-700 transition">
                  Sign Up
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / Info */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-slate-800">
              Information
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a href="#" className="hover:text-blue-700 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-700 transition">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-blue-700 transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-slate-200" />

        {/* Bottom bar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-slate-700">HealthVA</span>.
            Academic semester project. All rights reserved.
          </p>

          <p className="text-xs text-slate-500">
            ⚠️ AI features provide general health information only and are not a
            substitute for professional medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
