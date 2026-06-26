"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiUrl } from "@/lib/api";

export default function PaymentSuccessPage() {
  const search = useSearchParams();
  const sessionId = search?.get("session_id");
  const router = useRouter();
  const [status, setStatus] = useState("Processing payment...");

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    let mounted = true;

    async function complete() {
      try {
        const res = await fetch(apiUrl("/api/complete-checkout"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ sessionId }),
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || "Failed to confirm payment");
        }

        if (!mounted) return;
        setStatus(json.already ? "Booking already exists. Redirecting..." : "Payment confirmed — booking saved. Redirecting...");
        setTimeout(() => router.push("/classes"), 2500);
      } catch (err) {
        if (!mounted) return;
        setStatus("Error: " + (err.message || String(err)));
      }
    }

    complete();

    return () => {
      mounted = false;
    };
  }, [sessionId, router]);

  return (
    <section className="min-h-screen bg-[#111318] px-4 py-16 text-white">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8 text-center">
        <h1 className="text-3xl font-black">Payment Status</h1>
        <p className="mt-4 text-white/70">{status}</p>
      </div>
    </section>
  );
}
