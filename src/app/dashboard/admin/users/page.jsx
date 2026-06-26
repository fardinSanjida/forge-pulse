"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";

function StatusBadge({ banned }) {
  return (
    <span
      className={`inline-flex min-w-20 justify-center rounded-md px-3 py-2 text-xs font-black ${
        banned ? "bg-red-500/20 text-red-300" : "bg-green-500/20 text-green-300"
      }`}
    >
      {banned ? "Blocked" : "Active"}
    </span>
  );
}

function RoleBadge({ role }) {
  const map = {
    admin: "bg-orange-500/20 text-orange-300",
    trainer: "bg-blue-500/20 text-blue-300",
    user: "bg-white/10 text-white/60",
  };
  return (
    <span
      className={`inline-flex min-w-16 justify-center rounded-md px-3 py-2 text-xs font-black capitalize ${
        map[role] || map.user
      }`}
    >
      {role || "user"}
    </span>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [draftSearch, setDraftSearch] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState("");
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({ page, limit: 10 });
        if (search) params.set("search", search);
        if (roleFilter !== "all") params.set("role", roleFilter);
        const res = await fetch(apiUrl(`/api/users?${params}`), {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load users.");
        const data = await res.json();
        setUsers(data.data ?? []);
        setPagination(data.pagination ?? null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [page, search, roleFilter, refreshTick]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(draftSearch);
  };

  async function patchUser(id, endpoint, body, label) {
    setActionLoading(id + label);
    setError("");
    try {
      const res = await fetch(apiUrl(`/api/users/${id}/${endpoint}`), {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Action failed.");
      }
      setRefreshTick((t) => t + 1);
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
          <h1 className="text-3xl font-black tracking-normal">Users</h1>
          <p className="mt-2 text-sm text-white/55">
            Manage user roles and block status.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="h-12 rounded-md border border-white/10 bg-[#0b1217] px-4 text-sm font-semibold text-white outline-none transition focus:border-orange-400"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="trainer">Trainer</option>
            <option value="admin">Admin</option>
          </select>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="search"
              value={draftSearch}
              onChange={(e) => setDraftSearch(e.target.value)}
              placeholder="Search by name or email…"
              className="h-12 rounded-md border border-white/10 bg-[#0b1217] px-4 text-sm text-white outline-none transition focus:border-orange-400 w-56"
            />
            <button
              type="submit"
              className="h-12 rounded-md bg-orange-500 px-5 text-sm font-black text-white transition hover:bg-orange-400"
            >
              Search
            </button>
          </form>
        </div>
      </header>

      {error && (
        <p className="mt-4 rounded-md border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
          {error}
        </p>
      )}

      <article className="mt-6 overflow-hidden rounded-md border border-white/10 bg-[#0c1117] shadow-xl shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full min-w-225 text-left text-sm">
            <thead className="bg-white/4 text-xs font-black uppercase tracking-normal text-white/55">
              <tr>
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading ? (
                <tr>
                  <td className="px-5 py-8 text-center text-white/55" colSpan={4}>
                    Loading users…
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-center text-white/55" colSpan={4}>
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const busy = (label) => actionLoading === u._id + label;
                  return (
                    <tr key={u._id} className="text-white/70">
                      <td className="px-5 py-4">
                        <p className="font-black text-white">{u.name || "—"}</p>
                        <p className="mt-1 text-xs text-white/45">{u.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <RoleBadge role={u.role} />
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge banned={u.banned} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap justify-end gap-2">
                          {u.role !== "admin" && (
                            <button
                              type="button"
                              disabled={!!actionLoading}
                              onClick={() =>
                                patchUser(u._id, "role", { role: "admin" }, "role")
                              }
                              className="rounded-md border border-orange-500/50 px-3 py-2 text-xs font-black text-orange-300 transition hover:bg-orange-500 hover:text-white disabled:opacity-50"
                            >
                              {busy("role") ? "…" : "Make Admin"}
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={!!actionLoading}
                            onClick={() =>
                              patchUser(u._id, "status", { banned: !u.banned }, "status")
                            }
                            className={`rounded-md border px-3 py-2 text-xs font-black transition disabled:opacity-50 ${
                              u.banned
                                ? "border-green-500/50 text-green-300 hover:bg-green-600 hover:text-white"
                                : "border-red-500/50 text-red-300 hover:bg-red-600 hover:text-white"
                            }`}
                          >
                            {busy("status") ? "…" : u.banned ? "Unblock" : "Block"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/10 px-5 py-4 text-sm text-white/55">
            <p>
              Page {pagination.page} of {pagination.totalPages} &mdash;{" "}
              {pagination.total} users
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
