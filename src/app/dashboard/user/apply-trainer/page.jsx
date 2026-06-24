"use client";

import Link from "next/link";
import { useState } from "react";
import {
  DashboardShell,
  PageHeader,
  Panel,
  StatusBadge,
  trainerApplicationStatusKey,
} from "@/components/dashboard/UserDashboardShared";

export default function Page() {
  const [isSubmitted, setIsSubmitted] = useState(
    () =>
      typeof window !== "undefined" &&
      window.localStorage.getItem(trainerApplicationStatusKey) === "pending",
  );

  return (
    <DashboardShell activeSection="apply-trainer">
      <PageHeader
        title="Apply as Trainer"
        subtitle="Share your expertise and inspire others on their fitness journey."
      />

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <Panel>
          <h2 className="text-lg font-black">Application Form</h2>
          <form
            className="mt-5 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              window.localStorage.setItem(trainerApplicationStatusKey, "pending");
              setIsSubmitted(true);
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-white/70">
                Experience Years
                <input
                  type="number"
                  defaultValue="5"
                  className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#081016] px-4 text-white outline-none focus:border-green-400"
                />
              </label>
              <label className="text-sm font-semibold text-white/70">
                Specialty
                <select className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#081016] px-4 text-white outline-none focus:border-green-400">
                  <option>Yoga</option>
                  <option>Strength</option>
                  <option>Cardio</option>
                </select>
              </label>
            </div>
            <label className="block text-sm font-semibold text-white/70">
              Short Bio
              <textarea
                defaultValue="Passionate fitness trainer with 5 years of experience in yoga, flexibility, and mindfulness training."
                className="mt-2 min-h-32 w-full rounded-md border border-white/10 bg-[#081016] px-4 py-3 text-white outline-none focus:border-green-400"
              />
            </label>
            <label className="block text-sm font-semibold text-white/70">
              Certification Upload
              <div className="mt-2 flex min-h-11 items-center justify-between gap-3 rounded-md border border-white/10 bg-[#081016] px-4 text-sm text-white/70">
                <span>yoga_certification.pdf</span>
                <button type="button" className="font-black text-red-300">
                  Remove
                </button>
              </div>
            </label>
            <div>
              <p className="text-sm font-semibold text-white/70">
                Available Days
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <button
                      key={day}
                      type="button"
                      className={`rounded-md px-3 py-2 text-xs font-black ${
                        day === "Sat" || day === "Sun"
                          ? "bg-white/[0.04] text-white/45"
                          : "bg-green-500/20 text-green-300"
                      }`}
                    >
                      {day}
                    </button>
                  ),
                )}
              </div>
            </div>
            <button
              type="submit"
              className="h-12 w-full rounded-md bg-green-600 text-sm font-black text-white transition hover:bg-green-500"
            >
              {isSubmitted ? "Application Submitted" : "Submit Application"}
            </button>
          </form>
        </Panel>

        <Panel className="grid place-items-center text-center">
          {isSubmitted ? (
            <>
              <div className="grid h-28 w-28 place-items-center rounded-full border-4 border-green-500/70 text-green-300">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-14 w-14"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6M9 15l2 2 4-4" />
                </svg>
              </div>
              <h2 className="mt-8 text-2xl font-black">
                Application Submitted!
              </h2>
              <p className="mt-4 text-sm text-white/60">
                Status: <StatusBadge tone="orange">Pending</StatusBadge>
              </p>
              <p className="mt-5 max-w-md text-sm leading-6 text-white/60">
                Your application is under review by our admin team. We will
                notify you once there is an update.
              </p>
              <p className="mt-4 text-sm text-white/55">
                Submitted on: 18 May 2024
              </p>
              <Link
                href="/dashboard/user/overview"
                className="mt-6 rounded-md bg-white/[0.06] px-6 py-3 text-sm font-black text-white/80 transition hover:bg-white/[0.1]"
              >
                Go to Dashboard
              </Link>
            </>
          ) : (
            <>
              <div className="grid h-28 w-28 place-items-center rounded-full border-4 border-white/15 text-white/50">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-14 w-14"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6M9 13h6M9 17h4" />
                </svg>
              </div>
              <h2 className="mt-8 text-2xl font-black">
                No Application Applied
              </h2>
              <p className="mt-4 text-sm text-white/60">
                Status: <StatusBadge tone="blue">Not Applied</StatusBadge>
              </p>
              <p className="mt-5 max-w-md text-sm leading-6 text-white/60">
                Fill out the application form and submit it to send your trainer
                request for admin review.
              </p>
            </>
          )}
        </Panel>
      </div>
    </DashboardShell>
  );
}
