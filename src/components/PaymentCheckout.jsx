"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

function readCollection(key) {
  try {
    return JSON.parse(window.localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function writeCollection(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export default function PaymentCheckout({ classItem }) {
  const router = useRouter();
  const { data: session } = useSession();
  const userKey = session?.user?.email?.toLowerCase() || "guest";

  const completePayment = () => {
    if (!session?.user) {
      router.push(`/login?redirectTo=/payment/${classItem.id}`);
      return;
    }

    const bookingKey = `forge-pulse-bookings:${userKey}`;
    const bookings = readCollection(bookingKey);
    const alreadyBooked = bookings.some(
      (booking) => booking.classId === classItem.id,
    );

    if (!alreadyBooked) {
      writeCollection(bookingKey, [
        ...bookings,
        {
          classId: classItem.id,
          name: classItem.name,
          trainer: classItem.trainer,
          schedule: classItem.schedule,
          price: classItem.price,
          transactionId: `local_${Date.now()}`,
        },
      ]);
    }

    router.push(`/classes/${classItem.id}`);
  };

  return (
    <section className="min-h-screen bg-[#111318] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
        <Link
          href={`/classes/${classItem.id}`}
          className="text-sm font-bold uppercase text-orange-300 hover:text-orange-200"
        >
          Back to Details
        </Link>
        <h1 className="mt-5 text-3xl font-black uppercase">
          Complete Payment
        </h1>
        <p className="mt-3 text-white/60">
          Stripe checkout will be connected here. For now, this button simulates
          a successful payment and stores the booking locally.
        </p>

        <div className="mt-8 rounded-2xl bg-black/30 p-5">
          <p className="text-sm text-white/45">Class</p>
          <h2 className="mt-1 text-2xl font-black">{classItem.name}</h2>
          <p className="mt-2 text-sm text-white/65">
            {classItem.trainer} • {classItem.schedule}
          </p>
          <p className="mt-4 text-xl font-black text-orange-400">
            {classItem.price}
          </p>
        </div>

        <button
          type="button"
          onClick={completePayment}
          className="mt-8 w-full rounded-full bg-orange-500 px-5 py-3 text-sm font-black uppercase text-white transition hover:bg-orange-400"
        >
          Complete Stripe Checkout
        </button>
      </div>
    </section>
  );
}
