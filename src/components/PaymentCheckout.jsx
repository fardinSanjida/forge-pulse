"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiUrl } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

function getClassId(classItem) {
  return classItem._id || classItem.id;
}

function getTrainerName(classItem) {
  return classItem.trainerName || classItem.trainer || "Unknown trainer";
}

function getClassAmount(price) {
  const amount = Number(String(price).match(/\d+(\.\d+)?/)?.[0] || 0);
  return amount;
}

export default function PaymentCheckout({ classItem }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const classId = getClassId(classItem);

  const completePayment = async () => {
    setError("");

    if (!session?.user) {
      router.push(`/login?redirectTo=/payment/${classId}`);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(apiUrl("/api/create-checkout-session"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify({
          classId,
          className: classItem.name,
          trainerName: getTrainerName(classItem),
          schedule: classItem.schedule,
          amount: getClassAmount(classItem.price),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const msg = result.detail
          ? `${result.error}: ${result.detail}`
          : result.error || "Unable to start checkout session.";
        throw new Error(msg);
      }

      // Redirect browser to Stripe Checkout
      if (result.url) {
        window.location.href = result.url;
        return;
      }

      throw new Error('No checkout url returned');
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#111318] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
        <Link
          href={`/classes/${classId}`}
          className="text-sm font-bold uppercase text-orange-300 hover:text-orange-200"
        >
          Back to Details
        </Link>
        <h1 className="mt-5 text-3xl font-black uppercase">
          Complete Payment
        </h1>
        <p className="mt-3 text-white/60">
          Stripe checkout will be connected later. This step now saves a real
          booking record in the database after confirmation.
        </p>

        <div className="mt-8 rounded-2xl bg-black/30 p-5">
          <p className="text-sm text-white/45">Class</p>
          <h2 className="mt-1 text-2xl font-black">{classItem.name}</h2>
          <p className="mt-2 text-sm text-white/65">
            {getTrainerName(classItem)} - {classItem.schedule}
          </p>
          <p className="mt-4 text-xl font-black text-orange-400">
            {classItem.price}
          </p>
        </div>

        {error && (
          <p className="mt-6 rounded-md border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={completePayment}
          disabled={isSubmitting}
          className="mt-8 w-full rounded-full bg-orange-500 px-5 py-3 text-sm font-black uppercase text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? "Saving Booking..." : "Complete Checkout"}
        </button>
      </div>
    </section>
  );
}
