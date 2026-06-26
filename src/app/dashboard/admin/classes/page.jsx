"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";

function StatusBadge({ status }) {
  const classes = {
    Pending: "bg-orange-500/20 text-orange-300",
    Approved: "bg-green-500/20 text-green-300",
    Rejected: "bg-red-500/20 text-red-300",
  };

  return (
    <span
      className={`inline-flex min-w-24 justify-center rounded-md px-3 py-2 text-xs font-black ${
        classes[status] || classes.Pending
      }`}
    >
      {status}
    </span>
  );
}

export default function AdminClassesPage() {
  const [classes, setClasses] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [actionId, setActionId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadClasses() {
      setIsLoading(true);
      setError("");

      try {
        const query =
          statusFilter === "All" ? "" : `?status=${encodeURIComponent(statusFilter)}`;
        const response = await fetch(apiUrl(`/api/classes${query}`), {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load classes.");
        }

        const result = await response.json();
        setClasses(result.data || []);
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadClasses();

    return () => controller.abort();
  }, [statusFilter]);

  const updateStatus = async (classId, status) => {
    setActionId(classId);
    setError("");

    try {
      const response = await fetch(apiUrl(`/api/classes/${classId}/status`), {
        method: "PATCH",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to update class.");
      }

      setClasses((currentClasses) =>
        currentClasses
          .map((classItem) => (classItem._id === result._id ? result : classItem))
          .filter((classItem) =>
            statusFilter === "All" ? true : classItem.status === statusFilter,
          ),
      );
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setActionId("");
    }
  };

  const deleteClass = async (classId) => {
    const confirmed = window.confirm("Delete this class permanently?");

    if (!confirmed) {
      return;
    }

    setActionId(classId);
    setError("");

    try {
      const response = await fetch(apiUrl(`/api/classes/${classId}`), {
        method: "DELETE",
        credentials: 'include',
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to delete class.");
      }

      setClasses((currentClasses) =>
        currentClasses.filter((classItem) => classItem._id !== classId),
      );
    } catch (deleteError) {
      setError(deleteError.message);
    } finally {
      setActionId("");
    }
  };

  return (
    <>
      <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-normal">
            Manage Classes
          </h1>
          <p className="mt-2 text-sm text-white/55">
            Approve, reject, or remove trainer-submitted classes.
          </p>
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="h-12 rounded-md border border-white/10 bg-[#0b1217] px-4 text-sm font-semibold text-white outline-none transition focus:border-orange-400"
        >
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
      </header>

      <article className="mt-6 overflow-hidden rounded-md border border-white/10 bg-[#0c1117] shadow-xl shadow-black/20">
        {error && (
          <p className="border-b border-red-400/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
            {error}
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-white/[0.04] text-xs font-black uppercase tracking-normal text-white/55">
              <tr>
                <th className="px-5 py-4">Class</th>
                <th className="px-5 py-4">Trainer</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Price</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading ? (
                <tr>
                  <td className="px-5 py-8 text-center text-white/55" colSpan={6}>
                    Loading classes...
                  </td>
                </tr>
              ) : classes.length ? (
                classes.map((classItem) => (
                  <tr key={classItem._id} className="text-white/70">
                    <td className="px-5 py-4">
                      <p className="font-black text-white">{classItem.name}</p>
                      <p className="mt-1 max-w-sm truncate text-xs text-white/45">
                        {classItem.schedule || "No schedule"}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold">
                        {classItem.trainerName || "Unknown"}
                      </p>
                      <p className="mt-1 text-xs text-white/45">
                        {classItem.trainerEmail || "No email"}
                      </p>
                    </td>
                    <td className="px-5 py-4 font-semibold">
                      {classItem.category}
                    </td>
                    <td className="px-5 py-4 font-black text-white">
                      ${classItem.price}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={classItem.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          disabled={actionId === classItem._id}
                          onClick={() => updateStatus(classItem._id, "Approved")}
                          className="rounded-md border border-green-500/50 px-3 py-2 text-xs font-black text-green-300 transition hover:bg-green-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={actionId === classItem._id}
                          onClick={() => updateStatus(classItem._id, "Rejected")}
                          className="rounded-md border border-orange-500/50 px-3 py-2 text-xs font-black text-orange-300 transition hover:bg-orange-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          disabled={actionId === classItem._id}
                          onClick={() => deleteClass(classItem._id)}
                          className="rounded-md border border-red-500/50 px-3 py-2 text-xs font-black text-red-300 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-5 py-8 text-center text-white/55" colSpan={6}>
                    No classes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>
    </>
  );
}
