"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import fallbackClassImage from "../../asset/strength.jpg";
import { apiUrl } from "@/lib/api";

function getImageSource(classItem) {
  if (
    typeof classItem.image === "string" &&
    (classItem.image.startsWith("http://") || classItem.image.startsWith("https://"))
  ) {
    return classItem.image;
  }

  return fallbackClassImage;
}

function getTrainerName(classItem) {
  return classItem.trainerName || classItem.trainer || "Unknown trainer";
}

function FeatureClasses() {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadClasses() {
      try {
        const res = await fetch(apiUrl("/api/classes?status=Approved&limit=20"));
        if (res.ok) {
          const result = await res.json();
          const sorted = (result.data || [])
            .sort((a, b) => (b.bookingCount || 0) - (a.bookingCount || 0))
            .slice(0, 3);
          setClasses(sorted);
        }
      } catch (err) {
        console.error("Failed to load featured classes:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadClasses();
  }, []);

  return (
    <section className="relative overflow-hidden bg-black px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-4xl">
            <p className="text-sm font-bold text-orange-500">Featured Classes</p>
            <h2 className="mt-5 text-3xl font-black uppercase leading-tight tracking-wide text-white sm:text-5xl lg:text-6xl">
              Unleash your potential:
              <span className="text-orange-500"> top booked fitness classes</span>
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
              Explore the most-booked sessions at Forge Pulse, ranked by real
              booking momentum from our full class lineup.
            </p>
          </div>

          <div className="flex shrink-0">
            <Link
              href="/classes"
              className="inline-flex items-center justify-center rounded-full bg-orange-500 px-6 py-3 text-sm font-bold uppercase text-white transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              View All
            </Link>
          </div>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            <p className="col-span-full text-center text-white/55">Loading classes...</p>
          ) : classes.length ? (
            classes.map((classItem, index) => (
              <motion.article
                key={classItem._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.12 }}
                className="group overflow-hidden rounded-3xl border border-white/10 bg-white/3 shadow-2xl shadow-black/25"
              >
                <div className="relative h-72 overflow-hidden">
                  <Image
                    src={getImageSource(classItem)}
                    alt={`${classItem.name} class`}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                    unoptimized={typeof getImageSource(classItem) === "string"}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/35 to-transparent" />
                  <span className="absolute left-5 top-5 rounded-full bg-orange-500 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white">
                    {classItem.category}
                  </span>
                  <div className="absolute bottom-5 left-5 right-5">
                    <h3 className="text-2xl font-black text-white">
                      {classItem.name}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-white/70">
                      Trainer: {getTrainerName(classItem)}
                    </p>
                  </div>
                </div>

                <div className="space-y-5 p-5">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-black/30 p-4">
                      <p className="text-white/45">Price / Duration</p>
                      <p className="mt-1 font-bold text-white">
                        ${classItem.price} / {classItem.duration}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-black/30 p-4">
                      <p className="text-white/45">Booking Count</p>
                      <p className="mt-1 font-bold text-orange-400">
                        {classItem.bookingCount || 0}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={`/classes/${classItem._id}`}
                    className="inline-flex w-full items-center justify-center rounded-full border border-orange-400/60 px-5 py-3 text-sm font-bold uppercase text-white transition hover:bg-orange-500"
                  >
                    Details
                  </Link>
                </div>
              </motion.article>
            ))
          ) : (
            <p className="col-span-full text-center text-white/55">No approved classes found.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default FeatureClasses;
