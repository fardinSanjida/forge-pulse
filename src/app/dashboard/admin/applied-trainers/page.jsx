"use client";

import { useEffect, useMemo, useState } from "react";
import { apiUrl } from "@/lib/api";

function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function StatusBadge({ status }) {
  const classes = {
    Pending: "bg-orange-500/20 text-orange-300",
    Approved: "bg-green-500/20 text-green-300",
    Rejected: "bg-red-500/20 text-red-300",
  };

  return (
    <span
      className={`inline-flex min-w-24 justify-center rounded-md px-3 py-2 text-xs font-black ${
        classes[status] || classes.Pending
      }`}
    >
      {status}
    </span>
  );
}

export default function AppliedTrainersPage() {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const applicationCounts = useMemo(
    () => ({
      total: applications.length,
      pending: applications.filter((application) => application.status === "Pending")
        .length,
    }),
    [applications],
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadApplications() {
      setIsLoading(true);
      setError("");

      try {
        const query =
          statusFilter === "All" ? "" : `?status=${encodeURIComponent(statusFilter)}`;
        const response = await fetch(apiUrl(`/api/trainer-applications${query}`), {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load trainer applications.");
        }

        setApplications(await response.json());
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadApplications();

    return () => controller.abort();
  }, [statusFilter]);

  const openDetails = (application) => {
    setSelectedApplication(application);
    setFeedback(application.feedback || "");
    setError("");
  };

  const closeDetails = () => {
    setSelectedApplication(null);
    setFeedback("");
  };

  const updateApplicationStatus = async (status) => {
    if (!selectedApplication?._id) {
      return;
    }

    setIsUpdating(true);
    setError("");

    try {
      const response = await fetch(
        apiUrl(`/api/trainer-applications/${selectedApplication._id}`),
        {
          method: "PATCH",
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            feedback,
          }),
        },
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to update application.");
      }

      setApplications((currentApplications) =>
        currentApplications
          .map((application) =>
            application._id === result._id ? result : application,
          )
          .filter((application) =>
            statusFilter === "All" ? true : application.status === statusFilter,
          ),
      );
      closeDetails();
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-normal">
            Applied Trainers
          </h1>
          <p className="mt-2 text-sm text-white/55">
            Review trainer applications and record admin feedback.
          </p>
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="h-12 rounded-md border border-white/10 bg-[#0b1217] px-4 text-sm font-semibold text-white outline-none transition focus:border-orange-400"
        >
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
          <option>All</option>
        </select>
      </header>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <article className="rounded-md border border-white/10 bg-[#10161d] p-6 shadow-xl shadow-black/20">
          <p className="text-sm font-black text-white/55">Loaded Applications</p>
          <h2 className="mt-3 text-4xl font-black tracking-normal text-white">
            {applicationCounts.total}
          </h2>
        </article>
        <article className="rounded-md border border-white/10 bg-[#10161d] p-6 shadow-xl shadow-black/20">
          <p className="text-sm font-black text-white/55">Pending in View</p>
          <h2 className="mt-3 text-4xl font-black tracking-normal text-white">
            {applicationCounts.pending}
          </h2>
        </article>
      </div>

      <article className="mt-6 overflow-hidden rounded-md border border-white/10 bg-[#0c1117] shadow-xl shadow-black/20">
        {error && (
          <p className="border-b border-red-400/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
            {error}
          </p>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-225 text-left text-sm">
            <thead className="bg-white/4 text-xs font-black uppercase tracking-normal text-white/55">
              <tr>
                <th className="px-5 py-4">Applicant</th>
                <th className="px-5 py-4">Experience</th>
                <th className="px-5 py-4">Specialty</th>
                <th className="px-5 py-4">Submitted</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading ? (
                <tr>
                  <td className="px-5 py-8 text-center text-white/55" colSpan={6}>
                    Loading applications...
                  </td>
                </tr>
              ) : applications.length ? (
                applications.map((application) => (
                  <tr key={application._id} className="text-white/70">
                    <td className="px-5 py-4">
                      <p className="font-black text-white">
                        {application.userName || "Unnamed applicant"}
                      </p>
                      <p className="mt-1 text-xs text-white/45">
                        {application.userEmail}
                      </p>
                    </td>
                    <td className="px-5 py-4 font-semibold">
                      {application.experience} years
                    </td>
                    <td className="px-5 py-4 font-semibold">
                      {application.specialty}
                    </td>
                    <td className="px-5 py-4">{formatDate(application.createdAt)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={application.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => openDetails(application)}
                        className="rounded-md border border-orange-500/70 px-4 py-2 text-xs font-black text-orange-300 transition hover:bg-orange-500 hover:text-white"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-5 py-8 text-center text-white/55" colSpan={6}>
                    No trainer applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>

      {selectedApplication && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 px-4 py-8">
          <section className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-md border border-white/10 bg-[#0c151d] p-6 text-white shadow-2xl shadow-black/40">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <h2 className="text-2xl font-black">
                  {selectedApplication.userName || "Trainer Application"}
                </h2>
                <p className="mt-2 text-sm text-white/55">
                  {selectedApplication.userEmail}
                </p>
              </div>
              <button
                type="button"
                onClick={closeDetails}
                className="rounded-md border border-white/10 px-3 py-2 text-sm font-black text-white/60 transition hover:bg-white/6 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-white/10 bg-white/3 p-4">
                <p className="text-xs font-black uppercase text-white/40">
                  Experience
                </p>
                <p className="mt-2 font-black">
                  {selectedApplication.experience} years
                </p>
              </div>
              <div className="rounded-md border border-white/10 bg-white/3 p-4">
                <p className="text-xs font-black uppercase text-white/40">
                  Specialty
                </p>
                <p className="mt-2 font-black">{selectedApplication.specialty}</p>
              </div>
            </div>

            <div className="mt-5 rounded-md border border-white/10 bg-white/3 p-4">
              <p className="text-xs font-black uppercase text-white/40">Bio</p>
              <p className="mt-2 text-sm leading-6 text-white/70">
                {selectedApplication.bio || "No bio provided."}
              </p>
            </div>

            <div className="mt-5">
              <p className="text-xs font-black uppercase text-white/40">
                Available Days
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {(selectedApplication.availableDays || []).map((day) => (
                  <span
                    key={day}
                    className="rounded-md bg-green-500/15 px-3 py-2 text-xs font-black text-green-300"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>

            <label className="mt-5 block text-sm font-semibold text-white/70">
              Admin Feedback
              <textarea
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                className="mt-2 min-h-28 w-full rounded-md border border-white/10 bg-[#081016] px-4 py-3 text-white outline-none focus:border-orange-400"
                placeholder="Write feedback for rejection or internal review notes."
              />
            </label>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => updateApplicationStatus("Rejected")}
                className="h-12 rounded-md border border-red-500/50 text-sm font-black text-red-300 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Reject
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => updateApplicationStatus("Approved")}
                className="h-12 rounded-md bg-green-600 text-sm font-black text-white transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Approve
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
