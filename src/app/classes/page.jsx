"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import fallbackClassImage from "../../../asset/strength.jpg";
import { apiUrl } from "@/lib/api";

const categories = ["Yoga", "Strength", "HIIT", "Cardio", "Mobility", "Boxing"];

function getTrainerName(classItem) {
  return classItem.trainerName || classItem.trainer || "Unknown trainer";
}

function getImageSource(classItem) {
  if (
    typeof classItem.image === "string" &&
    (classItem.image.startsWith("http://") || classItem.image.startsWith("https://"))
  ) {
    return classItem.image;
  }

  return fallbackClassImage;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const queryString = useMemo(() => {
    const params = new URLSearchParams({
      status: "Approved",
      page: String(page),
      limit: "6",
    });

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (category) {
      params.set("category", category);
    }

    return params.toString();
  }, [category, page, search]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadClasses() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(apiUrl(`/api/classes?${queryString}`), {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load classes.");
        }

        const result = await response.json();
        setClasses(result.data || []);
        setPagination(result.pagination || { total: 0, totalPages: 1 });
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadClasses();

    return () => controller.abort();
  }, [queryString]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };

  return (
    <section className="min-h-screen bg-[#111318] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold text-orange-500">All Classes</p>
            <h1 className="mt-4 text-3xl font-black uppercase leading-tight sm:text-5xl">
              Approved classes built for steady progress
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
              Search by class name, filter by category, and choose your next
              training session.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex w-fit items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-bold uppercase text-white transition hover:border-orange-400 hover:text-orange-300"
          >
            Back Home
          </Link>
        </div>

        <div className="mt-10 grid gap-4 rounded-2xl border border-white/10 bg-white/3 p-4 md:grid-cols-[1fr_220px]">
          <input
            type="search"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search class name..."
            className="h-12 rounded-md border border-white/10 bg-[#0b1217] px-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-orange-400"
          />
          <select
            value={category}
            onChange={handleCategoryChange}
            className="h-12 rounded-md border border-white/10 bg-[#0b1217] px-4 text-sm text-white outline-none focus:border-orange-400"
          >
            <option value="">All Categories</option>
            {categories.map((categoryName) => (
              <option key={categoryName} value={categoryName}>
                {categoryName}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <p className="mt-6 rounded-md border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </p>
        )}

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            <p className="col-span-full text-center text-white/55">
              Loading classes...
            </p>
          ) : classes.length ? (
            classes.map((classItem) => (
              <article
                id={classItem._id}
                key={classItem._id}
                className="scroll-mt-28 overflow-hidden rounded-3xl border border-white/10 bg-white/3"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={getImageSource(classItem)}
                    alt={`${classItem.name} class`}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                    unoptimized={typeof getImageSource(classItem) === "string"}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/30 to-transparent" />
                  <span className="absolute left-5 top-5 rounded-full bg-orange-500 px-4 py-2 text-xs font-bold uppercase tracking-wide">
                    {classItem.category}
                  </span>
                  <h2 className="absolute bottom-5 left-5 right-5 text-2xl font-black">
                    {classItem.name}
                  </h2>
                </div>

                <div className="space-y-5 p-5">
                  <div>
                    <p className="text-sm text-white/45">Trainer Name</p>
                    <p className="mt-1 text-lg font-bold">
                      {getTrainerName(classItem)}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-black/30 p-4">
                      <p className="text-white/45">Price / Duration</p>
                      <p className="mt-1 font-bold">
                        ${classItem.price} / {classItem.duration}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-black/30 p-4">
                      <p className="text-white/45">Bookings</p>
                      <p className="mt-1 font-bold text-orange-400">
                        {classItem.bookingCount || 0}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/classes/${classItem._id}`}
                    className="inline-flex w-full items-center justify-center rounded-full bg-orange-500 px-5 py-3 text-sm font-bold uppercase text-white transition hover:bg-orange-400"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <p className="col-span-full text-center text-white/55">
              No approved classes found.
            </p>
          )}
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((currentPage) => currentPage - 1)}
            className="rounded-md border border-white/10 px-4 py-2 text-sm font-bold text-white/70 transition hover:bg-white/6 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-white/55">
            Page {page} of {pagination.totalPages || 1}
          </span>
          <button
            type="button"
            disabled={page >= (pagination.totalPages || 1)}
            onClick={() => setPage((currentPage) => currentPage + 1)}
            className="rounded-md border border-white/10 px-4 py-2 text-sm font-bold text-white/70 transition hover:bg-white/6 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
