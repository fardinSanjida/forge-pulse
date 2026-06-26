"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PaymentCheckout from "@/components/PaymentCheckout";
import { apiUrl } from "@/lib/api";

export default function PaymentCheckoutLoader({ id }) {
  const [classItem, setClassItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadClass() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(apiUrl(`/api/classes/${id}`), {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Class not found.");
        }

        setClassItem(await response.json());
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadClass();

    return () => controller.abort();
  }, [id]);

  if (isLoading) {
    return (
      <section className="min-h-screen bg-[#111318] px-4 py-16 text-center text-white">
        Loading checkout...
      </section>
    );
  }

  if (error || !classItem) {
    return (
      <section className="min-h-screen bg-[#111318] px-4 py-16 text-center text-white">
        <h1 className="text-3xl font-black">Class Not Found</h1>
        <p className="mt-3 text-white/55">{error || "Unable to load class."}</p>
        <Link
          href="/classes"
          className="mt-6 inline-flex rounded-full bg-orange-500 px-5 py-3 text-sm font-black uppercase"
        >
          Back to Classes
        </Link>
      </section>
    );
  }

  return <PaymentCheckout classItem={classItem} />;
}
