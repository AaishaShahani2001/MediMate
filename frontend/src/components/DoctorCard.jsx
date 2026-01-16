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
        className="h-16 w-16 rounded-xl object-cover ring-2 ring-blue-200"
      />
    );
  }

  return (
    <div className="grid h-16 w-16 place-items-center rounded-xl bg-linear-to-br from-blue-200 to-indigo-200 font-bold text-slate-800">
      {initials}
    </div>
  );
}


export default function DoctorCard({ doc }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-4">
        <Avatar name={doc.name} src={doc.avatar} />
        <div className="flex-1">
          <div className="text-sm font-medium text-blue-700">{doc.category}</div>
          <h3 className="text-lg font-semibold text-slate-900">{`Dr. ${doc.name}`}</h3>
          <p className="text-sm text-slate-600">{doc.years}+ years experience</p>
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">{doc.about}</p>

          <div className="mt-4 flex items-center gap-3">
            <Link
              to={`/doctor/${doc.id}`}
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Book Now
            </Link>
            <Link
              to={`/doctor/${doc.id}`}
              className="text-sm font-medium text-slate-700 hover:text-blue-700"
            >
              View Profile →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
