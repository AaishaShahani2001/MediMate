export default function CategoryPills({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("All")}
        className={`rounded-full border px-3 py-1.5 text-sm ${
          active === "All"
            ? "border-blue-200 bg-blue-600 text-white"
            : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700"
        }`}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`rounded-full border px-3 py-1.5 text-sm ${
            active === c
              ? "border-blue-200 bg-blue-600 text-white"
              : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:text-blue-700"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
