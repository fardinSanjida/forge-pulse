"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/dashboard/DashboardShareStates";
import {
  DashboardShell,
  PageHeader,
  Panel,
  StatusBadge,
  dashboardImages,
  userStats,
} from "@/components/dashboard/UserDashboardShared";
import { apiUrl } from "@/lib/api";

function getStatusTone(status) {
  if (status === "Approved") return "green";
  if (status === "Rejected") return "blue";
  return "orange";
}

export default function Page() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const user = session?.user;

  const [totalClasses, setTotalClasses] = useState(null);
  const [bookingCount, setBookingCount] = useState(null);
  const [favoritesCount, setFavoritesCount] = useState(null);
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;
    if (!user?.email) {
      router.push("/login");
      return;
    }

    const email = encodeURIComponent(user.email);

    async function loadAll() {
      setIsLoading(true);
      try {
        const [classesRes, bookingsRes, favoritesRes, appRes] = await Promise.all([
          fetch(apiUrl("/api/classes?limit=1"), { credentials: "include" }),
          fetch(apiUrl(`/api/bookings?userEmail=${email}`), { credentials: "include" }),
          fetch(apiUrl(`/api/favorites?userEmail=${email}`), { credentials: "include" }),
          fetch(apiUrl(`/api/trainer-applications?userEmail=${email}`)),
        ]);

        if (classesRes.ok) {
          const json = await classesRes.json();
          setTotalClasses(json.pagination?.total ?? (Array.isArray(json) ? json.length : 0));
        }
        if (bookingsRes.ok) {
          const data = await bookingsRes.json();
          setBookingCount(Array.isArray(data) ? data.length : (data.data?.length ?? 0));
        }
        if (favoritesRes.ok) {
          const data = await favoritesRes.json();
          setFavoritesCount(Array.isArray(data) ? data.length : 0);
        }
        if (appRes.ok) {
          const apps = await appRes.json();
          setApplication(apps[0] || null);
        }
      } catch {
        // non-fatal
      } finally {
        setIsLoading(false);
      }
    }

    loadAll();
  }, [isPending, user?.email, router]);

  const applicationStatus = application?.status || "Not Applied";
  const hasApplied = !!application;

  const overviewStats = userStats.map((stat) => {
    if (stat.label === "Total Class") {
      return { ...stat, value: isLoading ? "—" : String(totalClasses ?? 0) };
    }
    if (stat.label === "Total Booked Classes") {
      return { ...stat, value: isLoading ? "—" : String(bookingCount ?? 0) };
    }
    if (stat.label === "Total Favorites") {
      return { ...stat, value: isLoading ? "—" : String(favoritesCount ?? 0).padStart(2, "0") };
    }
    if (stat.label === "Application Status") {
      return {
        ...stat,
        value: isLoading ? "—" : applicationStatus,
        tint: hasApplied ? "from-amber-500/50 to-[#130d02]" : "from-slate-500/45 to-[#0b1118]",
      };
    }
    return stat;
  });

  const memberSince = user?.createdAt
    ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(user.createdAt))
    : "—";

  return (
    <DashboardShell activeSection="overview">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] || "there"}`}
        subtitle="Track your fitness journey and achieve your goals."
        action={
          <Link
            href="/classes"
            className="w-full rounded-md bg-orange-500 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-orange-400 sm:w-auto"
          >
            Explore Classes <span aria-hidden="true">-&gt;</span>
          </Link>
        }
      />

      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Panel>
          <div className="flex items-center gap-5">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name}
                width={96}
                height={96}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-orange-500/20 text-4xl font-black text-orange-300">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black">{user?.name || "—"}</h2>
                <StatusBadge>User</StatusBadge>
              </div>
              <p className="mt-2 text-sm text-white/55">{user?.email}</p>
            </div>
          </div>
          <div className="mt-8 flex items-end justify-between gap-4">
            <p className="text-sm text-white/55">
              Member since
              <span className="mt-1 block font-semibold text-white/75">{memberSince}</span>
            </p>
            <Link
              href="/dashboard/user/profile-settings"
              className="rounded-md bg-white/[0.06] px-5 py-3 text-sm font-bold text-white/80 transition hover:bg-white/[0.1]"
            >
              Edit Profile
            </Link>
          </div>
        </Panel>

        <Panel className="relative overflow-hidden lg:col-span-2">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-orange-500/10 to-transparent" />
          <div className="relative max-w-xl">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-black">Trainer Application</h2>
              <StatusBadge tone={hasApplied ? getStatusTone(application?.status) : "blue"}>
                {hasApplied ? applicationStatus : "Not Applied"}
              </StatusBadge>
            </div>
            {hasApplied ? (
              <div className="mt-5 space-y-4">
                <p className="text-sm leading-6 text-white/70">
                  Your application is currently{" "}
                  {applicationStatus === "Approved"
                    ? "approved! You are now a trainer."
                    : applicationStatus === "Rejected"
                    ? "rejected by the admin team."
                    : "under review by our admin team."}
                </p>
                {application.createdAt && (
                  <p className="text-sm text-white/55">
                    Submitted on:{" "}
                    {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
                      new Date(application.createdAt)
                    )}
                  </p>
                )}
                {application.feedback && (
                  <div className="rounded-md border border-orange-300/20 bg-orange-400/5 px-4 py-3 text-sm text-white/65">
                    Admin feedback: {application.feedback}
                  </div>
                )}
                {applicationStatus === "Pending" && (
                  <div className="rounded-md border border-orange-300/20 bg-orange-400/5 px-4 py-3 text-sm text-white/65">
                    We will notify you once there is an update on your application.
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <p className="text-sm leading-6 text-white/70">
                  You have not submitted a trainer application yet.
                </p>
                <p className="text-sm text-white/55">
                  Complete the application form to start the review process.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/dashboard/user/apply-trainer"
                    className="rounded-md bg-green-600 px-5 py-3 text-sm font-black text-white transition hover:bg-green-500"
                  >
                    Apply as Trainer
                  </Link>
                </div>
                <div className="rounded-md border border-blue-300/20 bg-blue-400/5 px-4 py-3 text-sm text-white/65">
                  No application has been submitted from this account.
                </div>
              </div>
            )}
          </div>
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Panel>
          <h2 className="text-lg font-black">Quick Links</h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {[
              { label: "Browse Classes", href: "/classes" },
              { label: "My Bookings", href: "/dashboard/user/booked-classes" },
              { label: "Favorites", href: "/dashboard/user/favorite-classes" },
              { label: "Apply as Trainer", href: "/dashboard/user/apply-trainer" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="flex h-14 items-center justify-center rounded-md border border-white/10 px-4 text-sm font-black text-white/70 transition hover:bg-white/5 hover:text-white"
              >
                {label}
              </Link>
            ))}
          </div>
        </Panel>

        <Panel>
          <h2 className="text-lg font-black">Activity Summary</h2>
          <div className="mt-5 space-y-4 text-sm">
            {[
              { label: "Available Classes", value: isLoading ? "—" : (totalClasses ?? 0), color: "text-sky-300" },
              { label: "Classes Booked", value: isLoading ? "—" : (bookingCount ?? 0), color: "text-green-300" },
              { label: "Favorite Classes", value: isLoading ? "—" : (favoritesCount ?? 0), color: "text-orange-300" },
              { label: "Application Status", value: isLoading ? "—" : applicationStatus, color: "text-blue-300" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                <span className="text-white/60">{label}</span>
                <strong className={color}>{value}</strong>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
