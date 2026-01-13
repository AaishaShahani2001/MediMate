export default function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      {/* Overlay */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Modal box */}
      <div className="relative w-full max-w-4xl rounded-2xl bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-2xl font-bold text-slate-400 hover:text-slate-600"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
