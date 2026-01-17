import { Link } from "react-router-dom";

function Avatar({ name, src }) {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="h-16 w-16 rounded-xl object-cover ring-2 ring-blue-200 shadow-sm"
      />
    );
  }

  return (
    <div className="grid h-16 w-16 place-items-center rounded-xl 
      bg-linear-to-br from-blue-200 to-indigo-200 
      font-bold text-slate-800 shadow-sm">
      {initials}
    </div>
  );
}

export default function DoctorCard({ doc }) {
  return (
    <div
      className="group rounded-2xl border border-slate-200 bg-white p-5 
      shadow-sm transition-all duration-300
      hover:-translate-y-1 hover:shadow-lg hover:border-blue-200"
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <Avatar name={doc.name} src={doc.avatar} />

        {/* Content */}
        <div className="flex-1">
          {/* Specialization */}
          <div className="text-xs font-semibold uppercase tracking-wide text-blue-700">
            {doc.category}
          </div>

          {/* Name */}
          <h3 className="mt-0.5 text-lg font-semibold text-slate-900">
            Dr. {doc.name}
          </h3>

          {/* Workplace */}
          {doc.workplace && (
            <p className="text-sm text-slate-600">
              {doc.workplace}
            </p>
          )}

          {/* Experience */}
          <p className="mt-1 text-sm text-slate-600">
            {doc.years}+ years experience
          </p>

          {/* About */}
          <p className="mt-3 line-clamp-2 text-sm text-slate-600">
            {doc.about}
          </p>

          {/* Actions */}
          <div className="mt-4 flex items-center gap-3">
            <Link
              to={`/doctor/${doc.id}`}
              className="inline-flex items-center justify-center
                rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold
                text-white shadow hover:bg-blue-700 transition"
            >
              Book Now
            </Link>

            <Link
              to={`/doctor/${doc.id}`}
              className="text-sm font-medium text-slate-600 
                hover:text-blue-700 transition"
            >
              View Profile →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
