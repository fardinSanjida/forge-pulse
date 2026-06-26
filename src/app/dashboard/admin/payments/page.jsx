"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatAmount(dollars) {
  if (!dollars && dollars !== 0) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(dollars);
}

export default function AdminPaymentsPage() {
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadBookings = async () => {
      setIsLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          page: String(page),
          limit: "10",
        });

        const res = await fetch(apiUrl(`/api/bookings?${params}`), {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to load transactions.");

        const data = await res.json();

        if (!ignore) {
          setBookings(data.data || data);
          setPagination(data.pagination || null);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadBookings();

    return () => {
      ignore = true;
    };
  }, [page]);

  return (
    <>
      <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-normal">
            Transactions
          </h1>
          <p className="mt-2 text-sm text-white/55">
            All class bookings and payment records.
          </p>
        </div>

        {pagination && (
          <span className="rounded-md border border-white/10 bg-white/4 px-5 py-3 text-sm font-black text-white/70">
            {pagination.total} total transactions
          </span>
        )}
      </header>

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
                <th className="px-5 py-4">User</th>
                <th className="px-5 py-4">Class</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Transaction ID</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-white/55">
                    Loading transactions…
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-white/55">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id} className="text-white/70">
                    <td className="px-5 py-4">
                      <p className="font-black text-white">
                        {b.userName || "—"}
                      </p>
                      <p className="mt-1 text-xs text-white/45">
                        {b.userEmail}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-white">
                        {b.className || "—"}
                      </p>
                    </td>

                    <td className="px-5 py-4 font-black text-green-300">
                      {formatAmount(b.amount)}
                    </td>

                    <td className="px-5 py-4 text-white/60">
                      {formatDate(b.bookedAt || b.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      {b.transactionId ? (
                        <span className="rounded-md bg-white/5 px-3 py-1 font-mono text-xs text-white/40">
                          {b.transactionId.slice(0, 20)}…
                        </span>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
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