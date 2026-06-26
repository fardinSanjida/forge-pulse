"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  DashboardShell,
  PageHeader,
  Panel,
  StatusBadge,
} from "@/components/dashboard/UserDashboardShared";
import { apiUrl } from "@/lib/api";

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

function formatAmount(dollars) {
  if (!dollars && dollars !== 0) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(dollars);
}

export default function Page() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const user = session?.user;

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;
    if (!user?.email) { router.push("/login"); return; }

    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(
          apiUrl(`/api/bookings?userEmail=${encodeURIComponent(user.email)}`),
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to load payments.");
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : (data.data ?? []));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [isPending, user?.email, router]);

  return (
    <DashboardShell activeSection="payments">
      <PageHeader
        title="Payment History"
        subtitle="All your class payment transactions."
      />

      {error && (
        <p className="mt-4 rounded-md border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
      )}

      <Panel className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="bg-white/[0.03] text-xs font-black uppercase text-white/60">
              <tr>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4">Class</th>
                <th className="px-4 py-4">Trainer</th>
                <th className="px-4 py-4">Amount</th>
                <th className="px-4 py-4">Transaction ID</th>
                <th className="px-4 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading ? (
                <tr>
                  <td className="px-4 py-8 text-center text-white/55" colSpan={6}>
                    Loading transactions…
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-white/55" colSpan={6}>
                    No payment records found.
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id} className="text-white/70">
                    <td className="px-4 py-4 text-white/60">{formatDate(b.createdAt)}</td>
                    <td className="px-4 py-4 font-semibold text-white">{b.className || "—"}</td>
                    <td className="px-4 py-4">{b.trainerName || "—"}</td>
                    <td className="px-4 py-4 font-black text-green-300">{formatAmount(b.amount)}</td>
                    <td className="px-4 py-4 font-mono text-xs text-white/45">
                      {b.transactionId ? b.transactionId.slice(0, 24) + "…" : "—"}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge>Paid</StatusBadge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!isLoading && bookings.length > 0 && (
          <div className="mt-4 text-xs text-white/40">
            {bookings.length} transaction{bookings.length !== 1 ? "s" : ""} total
          </div>
        )}
      </Panel>
    </DashboardShell>
  );
}
