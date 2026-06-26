"use client";

import Link from "next/link";
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
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (isPending) return;
    if (!user?.email) {
      router.push("/login");
      return;
    }

    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(
          apiUrl(`/api/bookings?userEmail=${encodeURIComponent(user.email)}`),
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to load bookings.");
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : (data.data || []));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [isPending, user?.email, router]);

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    return (
      !q ||
      b.className?.toLowerCase().includes(q) ||
      b.trainerName?.toLowerCase().includes(q)
    );
  });

  return (
    <DashboardShell activeSection="booked-classes">
      <PageHeader
        title="Booked Classes"
        subtitle="All your registered and paid classes."
      />

      <Panel className="mt-6">
        <div className="flex flex-col gap-3 border-b border-white/10 pb-4 sm:flex-row">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by class or trainer…"
            className="h-11 flex-1 rounded-md border border-white/10 bg-[#081016] px-4 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-green-400"
          />
        </div>

        {error && (
          <p className="mt-4 rounded-md border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </p>
        )}

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-white/[0.03] text-xs font-black uppercase text-white/60">
              <tr>
                <th className="px-4 py-4">Class</th>
                <th className="px-4 py-4">Trainer</th>
                <th className="px-4 py-4">Schedule</th>
                <th className="px-4 py-4">Amount</th>
                <th className="px-4 py-4">Date</th>
                <th className="px-4 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading ? (
                <tr>
                  <td className="px-4 py-8 text-center text-white/55" colSpan={6}>
                    Loading bookings…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-white/55" colSpan={6}>
                    {search ? "No classes match your search." : "You have no booked classes yet."}
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b._id} className="text-white/75">
                    <td className="px-4 py-4">
                      <p className="font-black text-white">{b.className || "—"}</p>
                    </td>
                    <td className="px-4 py-4">{b.trainerName || "—"}</td>
                    <td className="max-w-48 px-4 py-4 text-white/60">
                      {b.schedule || "—"}
                    </td>
                    <td className="px-4 py-4 font-black text-green-300">
                      {formatAmount(b.amount)}
                    </td>
                    <td className="px-4 py-4 text-white/60">
                      {formatDate(b.createdAt)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <StatusBadge>Paid</StatusBadge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && filtered.length > 0 && (
          <div className="mt-5 text-xs text-white/45">
            Showing {filtered.length} of {bookings.length} bookings
          </div>
        )}
      </Panel>
    </DashboardShell>
  );
}
