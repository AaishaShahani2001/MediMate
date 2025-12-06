export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} <span className="font-semibold text-slate-800">HealthVA</span> — Semester project UI
          </p>
          <ul className="flex items-center gap-4 text-sm text-slate-600">
            <li><a className="hover:text-blue-700" href="#">Privacy</a></li>
            <li><a className="hover:text-blue-700" href="#">Terms</a></li>
            <li><a className="hover:text-blue-700" href="#">Contact</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
