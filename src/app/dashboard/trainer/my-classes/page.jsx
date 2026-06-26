"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/lib/api";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const difficulties = ["Beginner", "Intermediate", "Advanced"];

function StatusBadge({ status }) {
  const map = {
    Approved: "bg-green-500/20 text-green-300",
    Pending: "bg-orange-500/20 text-orange-300",
    Rejected: "bg-red-500/20 text-red-300",
  };
  return (
    <span
      className={`inline-flex min-w-24 justify-center rounded-md px-3 py-2 text-xs font-black ${
        map[status] || map.Pending
      }`}
    >
      {status || "Pending"}
    </span>
  );
}

function IconBtn({ label, onClick, danger = false, disabled = false, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`grid h-9 w-9 place-items-center rounded-md border text-sm transition disabled:opacity-50 ${
        danger
          ? "border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500 hover:text-white"
          : "border-white/10 bg-white/4 text-white/60 hover:bg-white/8 hover:text-white"
      }`}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
        {children}
      </svg>
    </button>
  );
}

export default function Page() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const user = session?.user;

  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Edit modal
  const [editClass, setEditClass] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete confirm
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Students modal
  const [studentsClass, setStudentsClass] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (!user?.email) { router.push("/login"); return; }

    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(
          apiUrl(`/api/classes?trainerEmail=${encodeURIComponent(user.email)}`),
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to load classes.");
        const json = await res.json();
        setClasses(Array.isArray(json) ? json : (json.data || []));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [isPending, user?.email, router]);

  function openEdit(cls) {
    setEditClass(cls);
    setEditError("");
    const scheduleDays = cls.schedule
      ? cls.schedule.split(",").map((d) => d.trim())
      : [];
    setEditForm({
      name: cls.name || "",
      category: cls.category || "Yoga",
      difficulty: cls.difficulty || "Beginner",
      duration: cls.duration ? cls.duration.replace(" min", "").trim() : "",
      price: cls.price || "",
      description: cls.description || "",
      selectedDays: scheduleDays,
    });
  }

  function toggleEditDay(day) {
    setEditForm((prev) => {
      const days = prev.selectedDays.includes(day)
        ? prev.selectedDays.filter((d) => d !== day)
        : [...prev.selectedDays, day];
      return { ...prev, selectedDays: days };
    });
  }

  async function saveEdit(e) {
    e.preventDefault();
    if (!editForm.selectedDays.length) {
      setEditError("Select at least one day.");
      return;
    }
    setIsSaving(true);
    setEditError("");
    try {
      const res = await fetch(apiUrl(`/api/classes/${editClass._id}`), {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          category: editForm.category,
          difficulty: editForm.difficulty,
          duration: `${editForm.duration} min`,
          price: editForm.price,
          description: editForm.description,
          schedule: editForm.selectedDays.join(", "),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update class.");
      setClasses((prev) => prev.map((c) => (c._id === editClass._id ? data : c)));
      setEditClass(null);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteClass() {
    if (!confirmDeleteId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(apiUrl(`/api/classes/${confirmDeleteId}`), {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to delete class.");
      }
      setClasses((prev) => prev.filter((c) => c._id !== confirmDeleteId));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsDeleting(false);
      setConfirmDeleteId(null);
    }
  }

  async function openStudents(cls) {
    setStudentsClass(cls);
    setStudents([]);
    setStudentsLoading(true);
    try {
      const res = await fetch(
        apiUrl(`/api/bookings?classId=${cls._id}`),
        { credentials: "include" }
      );
      if (res.ok) {
        const data = await res.json();
        setStudents(Array.isArray(data) ? data : (data.data || []));
      }
    } catch {
      // students stay empty
    } finally {
      setStudentsLoading(false);
    }
  }

  const totalStudents = classes.reduce((s, c) => s + (c.bookingCount || 0), 0);

  return (
    <>
      <header className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black tracking-normal">My Classes</h1>
        <p className="mt-2 text-sm text-white/55">Manage your classes, bookings, and content.</p>
      </header>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {[
          { label: "Total Classes", value: isLoading ? "—" : classes.length },
          { label: "Total Students", value: isLoading ? "—" : totalStudents },
          { label: "Approved", value: isLoading ? "—" : classes.filter((c) => c.status === "Approved").length },
        ].map((card) => (
          <article key={card.label} className="rounded-md border border-white/10 bg-[#10161d] p-6 shadow-xl shadow-black/20">
            <p className="text-sm font-black text-white/55">{card.label}</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal text-white">{card.value}</h2>
          </article>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-md border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
          {error}
        </p>
      )}

      <article className="mt-6 overflow-hidden rounded-md border border-white/10 bg-[#0c1117] shadow-xl shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-white/[0.04] text-xs font-black uppercase tracking-normal text-white/55">
              <tr>
                <th className="px-5 py-4">Class</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Difficulty</th>
                <th className="px-5 py-4">Students</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading ? (
                <tr>
                  <td className="px-5 py-8 text-center text-white/55" colSpan={6}>Loading classes…</td>
                </tr>
              ) : classes.length === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-center text-white/55" colSpan={6}>No classes yet. Add your first class!</td>
                </tr>
              ) : (
                classes.map((cls) => (
                  <tr key={cls._id} className="text-white/70">
                    <td className="px-5 py-4">
                      <p className="font-black text-white">{cls.name}</p>
                      <p className="mt-1 text-xs text-white/40">{cls.schedule}</p>
                    </td>
                    <td className="px-5 py-4 font-semibold">{cls.category}</td>
                    <td className="px-5 py-4 font-semibold">{cls.difficulty}</td>
                    <td className="px-5 py-4 font-semibold">{cls.bookingCount || 0}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={cls.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <IconBtn label="View students" onClick={() => openStudents(cls)}>
                          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
                          <circle cx="12" cy="12" r="3" />
                        </IconBtn>
                        <IconBtn label="Edit class" onClick={() => openEdit(cls)}>
                          <path d="M12 20h9" />
                          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </IconBtn>
                        {confirmDeleteId === cls._id ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="rounded-md border border-white/10 px-3 py-1 text-xs font-black text-white/60 hover:bg-white/5"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              disabled={isDeleting}
                              onClick={deleteClass}
                              className="rounded-md bg-red-600 px-3 py-1 text-xs font-black text-white hover:bg-red-500 disabled:opacity-50"
                            >
                              {isDeleting ? "…" : "Confirm"}
                            </button>
                          </>
                        ) : (
                          <IconBtn label="Delete class" danger onClick={() => setConfirmDeleteId(cls._id)}>
                            <path d="M3 6h18" />
                            <path d="M8 6V4h8v2M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6M14 11v6" />
                          </IconBtn>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </article>

      {/* Edit Modal */}
      {editClass && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 py-8">
          <section className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-md border border-white/10 bg-[#0c151d] p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-black">Edit Class</h2>
              <button
                type="button"
                onClick={() => setEditClass(null)}
                className="rounded-md border border-white/10 px-3 py-2 text-sm font-black text-white/60 hover:bg-white/5 hover:text-white"
              >
                Close
              </button>
            </div>

            <form onSubmit={saveEdit} className="mt-5 space-y-4">
              <label className="block">
                <span className="text-sm font-black text-white/70">Class Name</span>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  className="mt-2 h-12 w-full rounded-md border border-white/10 bg-[#081016] px-4 text-white outline-none focus:border-orange-400"
                />
              </label>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-black text-white/70">Category</span>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))}
                    className="mt-2 h-12 w-full rounded-md border border-white/10 bg-[#081016] px-4 text-white outline-none focus:border-orange-400"
                  >
                    {["Yoga", "Strength", "HIIT", "Cardio", "Mobility"].map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-black text-white/70">Difficulty</span>
                  <select
                    value={editForm.difficulty}
                    onChange={(e) => setEditForm((p) => ({ ...p, difficulty: e.target.value }))}
                    className="mt-2 h-12 w-full rounded-md border border-white/10 bg-[#081016] px-4 text-white outline-none focus:border-orange-400"
                  >
                    {difficulties.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-black text-white/70">Duration (min)</span>
                  <input
                    type="number"
                    min="1"
                    value={editForm.duration}
                    onChange={(e) => setEditForm((p) => ({ ...p, duration: e.target.value }))}
                    className="mt-2 h-12 w-full rounded-md border border-white/10 bg-[#081016] px-4 text-white outline-none focus:border-orange-400"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-black text-white/70">Price ($)</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editForm.price}
                    onChange={(e) => setEditForm((p) => ({ ...p, price: e.target.value }))}
                    className="mt-2 h-12 w-full rounded-md border border-white/10 bg-[#081016] px-4 text-white outline-none focus:border-orange-400"
                  />
                </label>
              </div>

              <div>
                <p className="text-sm font-black text-white/70">Schedule Days</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {weekdays.map((day) => {
                    const sel = editForm.selectedDays?.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleEditDay(day)}
                        className={`rounded-md px-3 py-2 text-xs font-black transition ${
                          sel
                            ? "bg-orange-500 text-white"
                            : "border border-white/10 bg-[#081016] text-white/45 hover:text-white"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <label className="block">
                <span className="text-sm font-black text-white/70">Description</span>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                  className="mt-2 w-full rounded-md border border-white/10 bg-[#081016] px-4 py-3 text-white outline-none focus:border-orange-400 resize-none"
                />
              </label>

              {editError && (
                <p className="rounded-md border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {editError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className="h-12 w-full rounded-md bg-orange-500 text-sm font-black text-white transition hover:bg-orange-400 disabled:opacity-60"
              >
                {isSaving ? "Saving…" : "Save Changes"}
              </button>
            </form>
          </section>
        </div>
      )}

      {/* Students Modal */}
      {studentsClass && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 py-8">
          <section className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-md border border-white/10 bg-[#0c151d] p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl font-black">Students Enrolled</h2>
                <p className="mt-1 text-sm text-white/55">{studentsClass.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setStudentsClass(null)}
                className="rounded-md border border-white/10 px-3 py-2 text-sm font-black text-white/60 hover:bg-white/5 hover:text-white"
              >
                Close
              </button>
            </div>
            <div className="mt-4">
              {studentsLoading ? (
                <p className="text-center text-sm text-white/55 py-6">Loading…</p>
              ) : students.length === 0 ? (
                <p className="text-center text-sm text-white/55 py-6">No students enrolled yet.</p>
              ) : (
                <ul className="space-y-3">
                  {students.map((s) => (
                    <li key={s._id} className="flex items-center justify-between rounded-md border border-white/10 bg-white/[0.03] px-4 py-3">
                      <div>
                        <p className="font-black text-white">{s.userName || "—"}</p>
                        <p className="mt-1 text-xs text-white/45">{s.userEmail}</p>
                      </div>
                      <span className="text-xs font-black text-green-300">
                        ${s.amount ?? "—"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
}
