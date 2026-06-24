"use client";

import { useState } from "react";

function TrainerApplicationCard() {
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

export default TrainerApplicationCard;
