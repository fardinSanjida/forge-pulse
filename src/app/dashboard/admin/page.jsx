"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { apiUrl } from "@/lib/api";

export default function AdminDashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch(apiUrl("/api/admin/stats"), {
          credentials: "include",
        });
        if (res.ok) setStats(await res.json());
      } catch {
        // stats stay null
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  const cards = [
    { label: "Total Users", value: stats?.totalUsers },
    { label: "Total Classes", value: stats?.totalClasses },
    { label: "Total Booked Classes", value: stats?.totalBookings },
  ];

  return (
    <>
      <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-normal">Admin Overview</h1>
          <p className="mt-2 text-sm text-white/55">
            Welcome back, {session?.user?.name || "Admin"}.
          </p>
        </div>
        <Link
          href="/dashboard/admin/applied-trainers"
          className="w-full rounded-md bg-orange-500 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-orange-400 sm:w-auto"
        >
          Review Applications
        </Link>
      </header>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {cards.map(({ label, value }) => (
          <article
            key={label}
            className="rounded-md border border-white/10 bg-[#10161d] p-6 shadow-xl shadow-black/20"
          >
            <p className="text-sm font-black text-white/55">{label}</p>
            <h2 className="mt-3 text-4xl font-black tracking-normal text-white">
              {isLoading ? "—" : (value ?? 0)}
            </h2>
          </article>
        ))}
      </div>

      <div className="mt-6 rounded-md border border-white/10 bg-[#0c151d] p-6 shadow-xl shadow-black/20">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-orange-500/15 text-orange-300">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
              <path d="M12 3 5 7v6c0 4 3 7 7 8 4-1 7-4 7-8V7l-7-4Z" />
            </svg>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xl font-black">{session?.user?.name || "Admin"}</p>
              <span className="rounded-md bg-orange-500/15 px-3 py-1 text-xs font-black text-orange-300">Admin</span>
            </div>
            <p className="mt-1 text-sm text-white/55">{session?.user?.email}</p>
          </div>
        </div>
      </div>
    </>
  );
}
