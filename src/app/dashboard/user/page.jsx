"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { StatCard } from "@/components/dashboard/DashboardShareStates";
import bookedImage from "../../../../asset/image6.jpg";
import favoriteImage from "../../../../asset/hit2.jpg";
import totalClassImage from "../../../../asset/image17.jpg";
import profileImage from "../../../../asset/profile.jpg";
import upcomingImage from "../../../../asset/yoga3.jpg";
import yogaFlowImage from "../../../../asset/yoga6.jpg";

const stats = [
  {
    label: "Total Class",
    value: "32",
    action: "Explore all classes",
    image: totalClassImage,
    tint: "from-sky-500/45 to-[#06131d]",
    icon: (
      <>
        <path d="M4 19.5V5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-1.5Z" />
        <path d="M8 7h6M8 11h6" />
      </>
    ),
  },
  {
    label: "Total Booked Classes",
    value: "12",
    action: "View all booked classes",
    image: bookedImage,
    tint: "from-emerald-500/45 to-[#071016]",
    icon: (
      <>
        <path d="M7 3v4M17 3v4M4 9h16" />
        <rect width="16" height="17" x="4" y="5" rx="2" />
      </>
    ),
  },
  {
    label: "Total Favorites",
    value: "08",
    action: "View your favorites",
    image: favoriteImage,
    tint: "from-orange-500/45 to-[#130805]",
    icon: (
      <path d="M20.4 5.6a5.2 5.2 0 0 0-7.4 0L12 6.7l-1-1.1a5.2 5.2 0 1 0-7.4 7.4l8.4 8.2 8.4-8.2a5.2 5.2 0 0 0 0-7.4Z" />
    ),
  },
  {
    label: "Next Upcoming Class",
    value: "Yoga Flow",
    action: "Mon, 20 May  -  08:00 PM",
    image: yogaFlowImage,
    tint: "from-violet-500/50 to-[#0d0620]",
    icon: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" />
      </>
    ),
  },
];

function TrainerApplication() {
  const [status, setStatus] = useState("idle");

  return (
    <article className="relative overflow-hidden rounded-md border border-white/10 bg-[#0c151d] p-6 shadow-xl shadow-black/20 lg:col-span-2">
      <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-orange-500/10 to-transparent" />
      <div className="relative max-w-xl">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-black">Trainer Application</h2>
          {status === "pending" && (
            <span className="rounded-full bg-orange-400/15 px-3 py-1 text-xs font-black text-orange-300">
              Pending
            </span>
          )}
        </div>

        {status === "pending" ? (
          <div className="mt-5 space-y-4">
            <p className="text-sm leading-6 text-white/70">
              Your application is currently under review by our admin team.
            </p>
            <p className="text-sm text-white/55">Submitted: 24 June 2026</p>
            <div className="rounded-md border border-orange-300/20 bg-orange-400/5 px-4 py-3 text-sm text-white/65">
              We will notify you once there is an update on your application.
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-5">
            <p className="text-sm leading-6 text-white/70">
              Share your coaching experience and start guiding Forge Pulse members
              through stronger classes.
            </p>
            <button
              type="button"
              onClick={() => setStatus("pending")}
              className="rounded-md bg-orange-500 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              Apply for Trainer
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

function ProgressChart() {
  const circumference = 2 * Math.PI * 42;
  const completed = circumference * 0.25;

  return (
    <article className="rounded-md border border-white/10 bg-[#0c151d] p-6 shadow-xl shadow-black/20">
      <h2 className="text-lg font-black">Progress Overview</h2>
      <div className="mt-5 flex items-center gap-6">
        <div className="relative h-32 w-32 shrink-0">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="12"
              fill="none"
            />
            <circle
              className="progress-ring"
              cx="50"
              cy="50"
              r="42"
              stroke="#22c55e"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={completed}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-3xl font-black">
            75%
          </span>
        </div>
        <div className="min-w-0 flex-1 space-y-4 text-sm">
          <p className="flex items-center justify-between gap-4 text-white/70">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-500" />
              Completed
            </span>
            <strong className="text-green-300">18</strong>
          </p>
          <p className="flex items-center justify-between gap-4 text-white/70">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-orange-400" />
              Booked
            </span>
            <strong className="text-orange-300">12</strong>
          </p>
          <p className="flex items-center justify-between gap-4 text-white/70">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              Canceled
            </span>
            <strong className="text-red-300">2</strong>
          </p>
        </div>
      </div>
      <style jsx>{`
        .progress-ring {
          animation: drawProgress 1.2s ease-out both;
        }

        @keyframes drawProgress {
          from {
            stroke-dashoffset: ${circumference};
          }
          to {
            stroke-dashoffset: ${completed};
          }
        }
      `}</style>
    </article>
  );
}

function UserDashboardPage() {
  const searchParams = useSearchParams();
  const activeSection = searchParams.get("section") || "overview";

  return (
    <section className="min-h-screen bg-[#080e13] text-white">
      <div className="flex flex-col gap-6 lg:flex-row">
        <DashboardSidebar activeSection={activeSection} />

        <div className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-normal">
                Welcome back, John
              </h1>
              <p className="mt-2 text-sm text-white/55">
                Track your fitness journey and achieve your goals.
              </p>
            </div>
            <button
              type="button"
              className="w-full rounded-md bg-orange-500 px-5 py-3 text-sm font-black text-white transition hover:bg-orange-400 sm:w-auto"
            >
              Explore Classes <span aria-hidden="true">-&gt;</span>
            </button>
          </header>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-3">
            <article className="rounded-md border border-white/10 bg-[#0c151d] p-6 shadow-xl shadow-black/20">
              <div className="flex items-center gap-5">
                <Image
                  src={profileImage}
                  alt="John Doe"
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full object-cover"
                  placeholder="blur"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-black">John Doe</h2>
                    <span className="rounded-full bg-green-400/15 px-2 py-1 text-xs font-black text-green-300">
                      User
                    </span>
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
                <button
                  type="button"
                  className="rounded-md bg-white/[0.06] px-5 py-3 text-sm font-bold text-white/80 transition hover:bg-white/[0.1]"
                >
                  Edit Profile
                </button>
              </div>
            </article>

            <TrainerApplication />
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <article className="rounded-md border border-white/10 bg-[#0c151d] p-6 shadow-xl shadow-black/20">
              <h2 className="text-lg font-black">Upcoming Class</h2>
              <div className="mt-5 flex gap-4">
                <Image
                  src={upcomingImage}
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
                    Mon, 20 May  -  08:00 PM
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
            </article>

            <ProgressChart />
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserDashboardPage;
