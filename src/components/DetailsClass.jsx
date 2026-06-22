"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "@/lib/auth-client";

function readCollection(key) {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    return JSON.parse(window.localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function writeCollection(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function getUserKey(email) {
  return email?.toLowerCase() || "guest";
}

export default function DetailsClass({ classItem }) {
  const router = useRouter();
  const { data: session } = useSession();
  const userKey = getUserKey(session?.user?.email);
  const bookingKey = useMemo(
    () => `forge-pulse-bookings:${userKey}`,
    [userKey],
  );
  const favoriteKey = useMemo(
    () => `forge-pulse-favorites:${userKey}`,
    [userKey],
  );
  const [, refreshCollections] = useState(0);
  const isBooked = readCollection(bookingKey).some(
    (booking) => booking.classId === classItem.id,
  );
  const isFavorite = readCollection(favoriteKey).some(
    (favorite) => favorite.classId === classItem.id,
  );

  const requireLogin = () => {
    if (session?.user) {
      return false;
    }

    toast.error("Please log in first.");
    router.push(`/login?redirectTo=/classes/${classItem.id}`);
    return true;
  };

  const handleBookNow = () => {
    if (requireLogin()) {
      return;
    }

    if (isBooked) {
      toast.error("You have already booked this class");
      return;
    }

    router.push(`/payment/${classItem.id}`);
  };

  const handleFavorite = () => {
    if (requireLogin()) {
      return;
    }

    const favorites = readCollection(favoriteKey);
    const alreadyFavorite = favorites.some(
      (favorite) => favorite.classId === classItem.id,
    );

    if (alreadyFavorite) {
      const updatedFavorites = favorites.filter(
        (favorite) => favorite.classId !== classItem.id,
      );
      writeCollection(favoriteKey, updatedFavorites);
      refreshCollections((version) => version + 1);
      toast.success("Removed from your favorites.");
      return;
    }

    writeCollection(favoriteKey, [
      ...favorites,
      {
        classId: classItem.id,
        name: classItem.name,
        trainer: classItem.trainer,
        price: classItem.price,
        schedule: classItem.schedule,
      },
    ]);
    refreshCollections((version) => version + 1);
    toast.success("Successfully added to your favorites!");
  };

  return (
    <section className="min-h-screen bg-[#111318] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
          <div className="relative min-h-[420px]">
            <Image
              src={classItem.image}
              alt={`${classItem.name} class`}
              fill
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <span className="absolute left-6 top-6 rounded-full bg-orange-500 px-4 py-2 text-xs font-black uppercase tracking-wide">
              {classItem.category}
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <Link
            href="/classes"
            className="text-sm font-bold uppercase text-orange-300 transition hover:text-orange-200"
          >
            Back to Classes
          </Link>

          <h1 className="mt-5 text-4xl font-black uppercase leading-tight sm:text-5xl">
            {classItem.name}
          </h1>
          <p className="mt-3 text-lg font-semibold text-white/70">
            Trainer: {classItem.trainer}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <InfoCard label="Price / Duration" value={classItem.price} />
            <InfoCard label="Schedule" value={classItem.schedule} />
            <InfoCard label="Difficulty" value={classItem.difficulty || "All Levels"} />
            <InfoCard label="Bookings" value={classItem.bookingCount} />
          </div>

          <div className="mt-8">
            <p className="text-sm font-black uppercase text-orange-400">
              Description
            </p>
            <p className="mt-3 text-sm leading-7 text-white/65">
              {classItem.description}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleBookNow}
              className={`inline-flex flex-1 items-center justify-center rounded-full px-5 py-3 text-sm font-black uppercase transition ${
                isBooked
                  ? "bg-white/10 text-white/45"
                  : "bg-orange-500 text-white hover:bg-orange-400"
              }`}
            >
              {isBooked ? "Already Booked" : "Book Now"}
            </button>
            <button
              type="button"
              onClick={handleFavorite}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-orange-400/60 px-5 py-3 text-sm font-black uppercase text-white transition hover:bg-orange-500"
            >
              {isFavorite ? "Remove Favorite" : "Add to Favorites"}
            </button>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        pauseOnHover
        theme="dark"
      />
    </section>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-black/30 p-4">
      <p className="text-sm text-white/45">{label}</p>
      <p className="mt-1 font-bold text-white">{value}</p>
    </div>
  );
}
