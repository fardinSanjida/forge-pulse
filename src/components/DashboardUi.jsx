"use client";

import Image from "next/image";

const fallbackProfileImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' rx='48' fill='%23fff3d1'/%3E%3Ccircle cx='48' cy='37' r='18' fill='%23ff7a00'/%3E%3Cpath d='M20 84c5-19 18-29 28-29s23 10 28 29' fill='%238a5a2b'/%3E%3C/svg%3E";

export function DashboardCard({ label, value, hint }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
      <p className="text-sm font-semibold text-white/50">{label}</p>
      <p className="mt-3 text-3xl font-black text-orange-400">{value}</p>
      {hint && <p className="mt-2 text-xs text-white/45">{hint}</p>}
    </div>
  );
}

export function RoleBadge({ role }) {
  return (
    <span className="inline-flex rounded-full bg-orange-500 px-3 py-1 text-xs font-black uppercase text-white">
      {role}
    </span>
  );
}

export function ProfilePanel({ user, role, application }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <span className="relative h-20 w-20 overflow-hidden rounded-full bg-orange-100">
          <Image
            src={user?.image || fallbackProfileImage}
            alt={`${user?.name || "User"} profile`}
            fill
            sizes="80px"
            className="object-cover"
            unoptimized
          />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase text-white/45">
            Profile Details
          </p>
          <h2 className="mt-1 truncate text-2xl font-black">
            {user?.name || "Forge Pulse Member"}
          </h2>
          <p className="mt-1 truncate text-sm text-white/60">
            {user?.email || "member@example.com"}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <RoleBadge role={role} />
            {application && (
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-white/70">
                Trainer Application: {application.status}
              </span>
            )}
          </div>
        </div>
      </div>

      {application?.status === "Rejected" && application.feedback && (
        <p className="mt-5 rounded-md border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          Admin feedback: {application.feedback}
        </p>
      )}
    </section>
  );
}

export function DashboardTable({ columns, rows, emptyMessage = "No records found." }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-white/10">
      <table className="min-w-full divide-y divide-white/10 text-left text-sm">
        <thead className="bg-white/[0.04] text-xs uppercase text-white/45">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-bold">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {rows.length === 0 ? (
            <tr>
              <td className="px-4 py-5 text-white/50" colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="align-top">
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-4 text-white/75">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-white/70">{label}</span>
      {children}
    </label>
  );
}

export function TextInput(props) {
  return (
    <input
      {...props}
      className="mt-2 w-full rounded-md border border-white/15 bg-white/95 px-4 py-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30"
    />
  );
}

export function SelectInput(props) {
  return (
    <select
      {...props}
      className="mt-2 w-full rounded-md border border-white/15 bg-white/95 px-4 py-3 text-sm text-neutral-950 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30"
    />
  );
}

export function TextArea(props) {
  return (
    <textarea
      {...props}
      className="mt-2 min-h-32 w-full rounded-md border border-white/15 bg-white/95 px-4 py-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/30"
    />
  );
}

export function PrimaryButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`rounded-full border border-white/15 px-4 py-2 text-sm font-bold text-white/80 transition hover:border-orange-400 hover:text-orange-300 ${className}`}
    >
      {children}
    </button>
  );
}

export function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-white/10 bg-[#111318] p-6 text-white shadow-2xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-black">{title}</h2>
          <SecondaryButton type="button" onClick={onClose}>
            Close
          </SecondaryButton>
        </div>
        {children}
      </div>
    </div>
  );
}
