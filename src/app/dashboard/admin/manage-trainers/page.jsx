"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";

export default function ManageTrainersPage() {
  const [trainers, setTrainers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [draftSearch, setDraftSearch] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({ role: "trainer", page, limit: 10 });
        if (search) params.set("search", search);
        const res = await fetch(apiUrl(`/api/users?${params}`), {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load trainers.");
        const data = await res.json();
        setTrainers(data.data ?? []);
        setPagination(data.pagination ?? null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [page, search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(draftSearch);
  };

  async function demoteToUser(id) {
    setActionLoading(id);
    setError("");
    try {
      const res = await fetch(apiUrl(`/api/users/${id}/role`), {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "user" }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to demote trainer.");
      }
      setTrainers((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <>
      <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-normal">Manage Trainers</h1>
          <p className="mt-2 text-sm text-white/55">
            View all trainers and demote them to regular users if needed.
          </p>
        </div>
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="search"
            value={draftSearch}
            onChange={(e) => setDraftSearch(e.target.value)}
            placeholder="Search trainers…"
            className="h-12 rounded-md border border-white/10 bg-[#0b1217] px-4 text-sm text-white outline-none transition focus:border-orange-400 w-56"
          />
          <button
            type="submit"
            className="h-12 rounded-md bg-orange-500 px-5 text-sm font-black text-white transition hover:bg-orange-400"
          >
            Search
          </button>
        </form>
      </header>

      {pagination && (
        <div className="mt-6 rounded-md border border-white/10 bg-[#10161d] p-5">
          <p className="text-sm font-black text-white/55">Total Trainers</p>
          <p className="mt-2 text-4xl font-black text-white">{pagination.total}</p>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-md border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
          {error}
        </p>
      )}

      <article className="mt-6 overflow-hidden rounded-md border border-white/10 bg-[#0c1117] shadow-xl shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full min-w-175 text-left text-sm">
            <thead className="bg-white/4 text-xs font-black uppercase tracking-normal text-white/55">
              <tr>
                <th className="px-5 py-4">Trainer</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading ? (
                <tr>
                  <td className="px-5 py-8 text-center text-white/55" colSpan={3}>
                    Loading trainers…
                  </td>
                </tr>
              ) : trainers.length === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-center text-white/55" colSpan={3}>
                    No trainers found.
                  </td>
                </tr>
              ) : (
                trainers.map((t) => (
                  <tr key={t._id} className="text-white/70">
                    <td className="px-5 py-4">
                      <p className="font-black text-white">{t.name || "—"}</p>
                      <p className="mt-1 text-xs text-white/45">{t.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-md px-3 py-2 text-xs font-black ${
                          t.banned
                            ? "bg-red-500/20 text-red-300"
                            : "bg-green-500/20 text-green-300"
                        }`}
                      >
                        {t.banned ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        disabled={actionLoading === t._id}
                        onClick={() => demoteToUser(t._id)}
                        className="rounded-md border border-red-500/50 px-4 py-2 text-xs font-black text-red-300 transition hover:bg-red-600 hover:text-white disabled:opacity-50"
                      >
                        {actionLoading === t._id ? "…" : "Demote to User"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/10 px-5 py-4 text-sm text-white/55">
            <p>
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-md border border-white/10 px-4 py-2 text-xs font-black text-white/70 transition hover:bg-white/5 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-md border border-white/10 px-4 py-2 text-xs font-black text-white/70 transition hover:bg-white/5 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </article>
    </>
  );
}
