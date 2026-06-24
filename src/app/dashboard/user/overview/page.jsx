"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { StatCard } from "@/components/dashboard/DashboardShareStates";
import {
  DashboardShell,
  PageHeader,
  Panel,
  StatusBadge,
  dashboardImages,
  trainerApplicationStatusKey,
  userStats,
} from "@/components/dashboard/UserDashboardShared";

export default function Page() {
  const [applicationStatus] = useState(() =>
    typeof window !== "undefined"
      ? window.localStorage.getItem(trainerApplicationStatusKey) ||
        "not-applied"
      : "not-applied",
  );

  const hasApplied = applicationStatus === "pending";
  const overviewStats = userStats.map((stat) =>
    stat.label === "Application Status" && hasApplied
      ? {
          ...stat,
          value: "Applied",
          action: "View application",
          tint: "from-amber-500/50 to-[#130d02]",
        }
      : stat,
  );

  return (
    <DashboardShell activeSection="overview">
      <PageHeader
        title="Welcome back, John"
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
            <Image
              src={dashboardImages.profileImage}
              alt="John Doe"
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover"
              placeholder="blur"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black">John Doe</h2>
                <StatusBadge>User</StatusBadge>
              </div>
              <p className="mt-2 text-sm text-white/55">john.doe@email.com</p>
            </div>
          </div>
          <div className="mt-8 flex items-end justify-between gap-4">
            <p className="text-sm text-white/55">
              Member since
              <span className="mt-1 block font-semibold text-white/75">
                15 Mar 2024
              </span>
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
              <StatusBadge tone={hasApplied ? "orange" : "blue"}>
                {hasApplied ? "Pending" : "Not Applied"}
              </StatusBadge>
            </div>
            {hasApplied ? (
              <div className="mt-5 space-y-4">
                <p className="text-sm leading-6 text-white/70">
                  Your application is currently under review by our admin team.
                </p>
                <p className="text-sm text-white/55">
                  Submitted on: 18 May 2024
                </p>
                <div className="rounded-md border border-orange-300/20 bg-orange-400/5 px-4 py-3 text-sm text-white/65">
                  We will notify you once there is an update on your
                  application.
                </div>
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
                  No application has been applied from this account.
                </div>
              </div>
            )}
          </div>
        </Panel>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Panel>
          <h2 className="text-lg font-black">Upcoming Class</h2>
          <div className="mt-5 flex gap-4">
            <Image
              src={dashboardImages.upcomingImage}
              alt="Yoga Flow class"
              width={140}
              height={100}
              className="h-24 w-32 rounded-md object-cover"
              placeholder="blur"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-black">Yoga Flow</h3>
              <p className="mt-1 text-sm text-white/55">with Sarah Khan</p>
              <p className="mt-4 text-sm text-white/65">
                Mon, 20 May - 08:00 PM
              </p>
              <p className="mt-1 text-sm text-white/65">Premium Studio</p>
            </div>
          </div>
          <button
            type="button"
            className="mt-5 rounded-md border border-orange-500/60 px-5 py-3 text-sm font-black text-orange-300 transition hover:bg-orange-500 hover:text-white"
          >
            View Details
          </button>
        </Panel>

        <Panel>
          <h2 className="text-lg font-black">Progress Overview</h2>
          <div className="mt-5 flex items-center gap-6">
            <div className="grid h-32 w-32 shrink-0 place-items-center rounded-full bg-[conic-gradient(#22c55e_0_75%,#f59e0b_75%_91%,#ef4444_91%_100%)]">
              <div className="grid h-24 w-24 place-items-center rounded-full bg-[#0c151d] text-3xl font-black">
                75%
              </div>
            </div>
            <div className="min-w-0 flex-1 space-y-4 text-sm">
              {[
                ["Completed", "18", "bg-green-500", "text-green-300"],
                ["Booked", "12", "bg-orange-400", "text-orange-300"],
                ["Canceled", "2", "bg-red-400", "text-red-300"],
              ].map(([label, value, dot, color]) => (
                <p
                  key={label}
                  className="flex items-center justify-between gap-4 text-white/70"
                >
                  <span className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${dot}`} />
                    {label}
                  </span>
                  <strong className={color}>{value}</strong>
                </p>
              ))}
            </div>
          </div>
        </Panel>
      </div>
    </DashboardShell>
  );
}
