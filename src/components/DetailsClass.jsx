"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiUrl } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

function getClassId(classItem) {
  return classItem._id || classItem.id;
}

function getTrainerName(classItem) {
  return classItem.trainerName || classItem.trainer || "Unknown trainer";
}

export default function DetailsClass({ classItem }) {
  const router = useRouter();
  const { data: session } = useSession();
  const classId = getClassId(classItem);
  const [booking, setBooking] = useState(null);
  const [favorite, setFavorite] = useState(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [isSavingFavorite, setIsSavingFavorite] = useState(false);
  const isBooked = Boolean(booking);
  const isFavorite = Boolean(favorite);

useEffect(() => {
  if (!session?.user?.email) {
    return;
  }

  const controller = new AbortController();

  async function loadClassStatus() {
    setIsLoadingStatus(true);

    try {
      const params = new URLSearchParams({
        userEmail: session.user.email,
        classId,
      });

      const [bookingsResponse, favoritesResponse] = await Promise.all([
        fetch(apiUrl(`/api/bookings?${params.toString()}`), {
          signal: controller.signal,
          credentials: "include",
        }),
        fetch(
          apiUrl(
            `/api/favorites?userEmail=${encodeURIComponent(session.user.email)}`
          ),
          { signal: controller.signal, credentials: "include" }
        ),
      ]);

      const [bookings, favorites] = await Promise.all([
        bookingsResponse.json(),
        favoritesResponse.json(),
      ]);

      setBooking(bookings?.[0] || null);
      setFavorite(favorites?.find((f) => f.classId === classId) || null);
    } catch (error) {
      if (error.name !== "AbortError") {
        toast.error(error.message);
      }
    } finally {
      setIsLoadingStatus(false);
    }
  }

  loadClassStatus();

  return () => controller.abort();
}, [classId, session?.user?.email]);

  const requireLogin = () => {
    if (session?.user) {
      return false;
    }

    toast.error("Please log in first.");
    router.push(`/login?redirectTo=/classes/${classId}`);
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

    router.push(`/payment/${classId}`);
  };

  const handleFavorite = async () => {
    if (requireLogin()) {
      return;
    }

    setIsSavingFavorite(true);

    try {
      if (favorite?._id) {
        const response = await fetch(apiUrl(`/api/favorites/${favorite._id}`), {
          method: "DELETE",
          credentials: 'include',
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Unable to remove favorite.");
        }

        setFavorite(null);
        toast.success("Removed from your favorites.");
        return;
      }

      const response = await fetch(apiUrl("/api/favorites"), {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: session.user.email,
          classId,
          className: classItem.name,
          trainerName: getTrainerName(classItem),
          price: classItem.price,
          schedule: classItem.schedule,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save favorite.");
      }

      setFavorite(result);
      toast.success("Successfully added to your favorites!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSavingFavorite(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#111318] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/3">
          <div className="relative min-h-[420px]">
            <Image
              src={classItem.image}
              alt={`${classItem.name} class`}
              fill
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
            <span className="absolute left-6 top-6 rounded-full bg-orange-500 px-4 py-2 text-xs font-black uppercase tracking-wide">
              {classItem.category}
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/4 p-6 sm:p-8">
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
            Trainer: {getTrainerName(classItem)}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <InfoCard label="Price / Duration" value={classItem.price} />
            <InfoCard label="Schedule" value={classItem.schedule} />
            <InfoCard label="Difficulty" value={classItem.difficulty || "All Levels"} />
            <InfoCard label="Bookings" value={classItem.bookingCount || 0} />
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
              disabled={isLoadingStatus}
              className={`inline-flex flex-1 items-center justify-center rounded-full px-5 py-3 text-sm font-black uppercase transition disabled:cursor-not-allowed disabled:opacity-70 ${
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
              disabled={isLoadingStatus || isSavingFavorite}
              className="inline-flex flex-1 items-center justify-center rounded-full border border-orange-400/60 px-5 py-3 text-sm font-black uppercase text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSavingFavorite
                ? "Saving..."
                : isFavorite
                  ? "Remove Favorite"
                  : "Add to Favorites"}
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
