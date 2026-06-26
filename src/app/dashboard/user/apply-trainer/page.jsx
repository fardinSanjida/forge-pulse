"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  DashboardShell,
  PageHeader,
  Panel,
  StatusBadge,
} from "@/components/dashboard/UserDashboardShared";
import { apiUrl } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getStatusTone(status) {
  if (status === "Pending") {
    return "orange";
  }

  if (status === "Rejected") {
    return "blue";
  }

  return "green";
}

export default function Page() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [experience, setExperience] = useState("5");
  const [specialty, setSpecialty] = useState("Yoga");
  const [bio, setBio] = useState(
    "Passionate fitness trainer with 5 years of experience in yoga, flexibility, and mindfulness training.",
  );
  const [selectedDays, setSelectedDays] = useState([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
  ]);
  const [application, setApplication] = useState(null);
  const [isLoadingApplication, setIsLoadingApplication] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const isSubmitted = Boolean(application);
  const submittedDate = application?.createdAt
    ? new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(application.createdAt))
    : "";

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (!user?.email) {
      router.push("/login?redirectTo=/dashboard/user/apply-trainer");
      return;
    }

    const controller = new AbortController();

    async function loadApplication() {
      setIsLoadingApplication(true);
      setError("");

      try {
        const response = await fetch(
          apiUrl(
            `/api/trainer-applications?userEmail=${encodeURIComponent(
              user.email,
            )}`,
          ),
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Unable to load application status.");
        }

        const applications = await response.json();
        const currentApplication = applications[0] || null;
        setApplication(currentApplication);

        if (currentApplication) {
          setExperience(String(currentApplication.experience || "5"));
          setSpecialty(currentApplication.specialty || "Yoga");
          setBio(currentApplication.bio || "");
          setSelectedDays(
            currentApplication.availableDays?.length
              ? currentApplication.availableDays
              : ["Mon", "Tue", "Wed", "Thu", "Fri"],
          );
        }
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message);
        }
      } finally {
        setIsLoadingApplication(false);
      }
    }

    loadApplication();

    return () => controller.abort();
  }, [isPending, router, user?.email]);

  const toggleDay = (day) => {
    setSelectedDays((currentDays) =>
      currentDays.includes(day)
        ? currentDays.filter((currentDay) => currentDay !== day)
        : [...currentDays, day],
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user?.email) {
      router.push("/login?redirectTo=/dashboard/user/apply-trainer");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(apiUrl("/api/trainer-applications"), {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: user.name,
          userEmail: user.email,
          experience,
          specialty,
          bio,
          availableDays: selectedDays,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to submit application.");
      }

      setApplication(result);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardShell activeSection="apply-trainer">
      <PageHeader
        title="Apply as Trainer"
        subtitle="Share your expertise and inspire others on their fitness journey."
      />

      <div className="mt-6 grid gap-5 xl:grid-cols-2">
        <Panel>
          <h2 className="text-lg font-black">Application Form</h2>
          <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-white/70">
                Experience Years
                <input
                  type="number"
                  min="0"
                  value={experience}
                  onChange={(event) => setExperience(event.target.value)}
                  disabled={isSubmitted}
                  className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#081016] px-4 text-white outline-none focus:border-green-400 disabled:opacity-70"
                />
              </label>
              <label className="text-sm font-semibold text-white/70">
                Specialty
                <select
                  value={specialty}
                  onChange={(event) => setSpecialty(event.target.value)}
                  disabled={isSubmitted}
                  className="mt-2 h-11 w-full rounded-md border border-white/10 bg-[#081016] px-4 text-white outline-none focus:border-green-400 disabled:opacity-70"
                >
                  <option>Yoga</option>
                  <option>Strength</option>
                  <option>Cardio</option>
                  <option>Weights</option>
                  <option>Mobility</option>
                </select>
              </label>
            </div>
            <label className="block text-sm font-semibold text-white/70">
              Short Bio
              <textarea
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                disabled={isSubmitted}
                className="mt-2 min-h-32 w-full rounded-md border border-white/10 bg-[#081016] px-4 py-3 text-white outline-none focus:border-green-400 disabled:opacity-70"
              />
            </label>
            <div>
              <p className="text-sm font-semibold text-white/70">
                Available Days
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {weekdays.map((day) => {
                  const isSelected = selectedDays.includes(day);

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      disabled={isSubmitted}
                      className={`rounded-md px-3 py-2 text-xs font-black transition disabled:cursor-not-allowed ${
                        isSelected
                          ? "bg-green-500/20 text-green-300"
                          : "bg-white/[0.04] text-white/45"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
            {error && (
              <p className="rounded-md border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting || isLoadingApplication || isSubmitted}
              className="h-12 w-full rounded-md bg-green-600 text-sm font-black text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? "Submitting..."
                : isSubmitted
                  ? "Application Submitted"
                  : "Submit Application"}
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
                Status:{" "}
                <StatusBadge tone={getStatusTone(application.status)}>
                  {application.status}
                </StatusBadge>
              </p>
              {application.feedback && (
                <div className="mt-5 rounded-md border border-blue-300/20 bg-blue-400/5 px-4 py-3 text-sm text-white/65">
                  {application.feedback}
                </div>
              )}
              <p className="mt-5 max-w-md text-sm leading-6 text-white/60">
                Your application is under review by our admin team. We will
                notify you once there is an update.
              </p>
              {submittedDate && (
                <p className="mt-4 text-sm text-white/55">
                  Submitted on: {submittedDate}
                </p>
              )}
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
