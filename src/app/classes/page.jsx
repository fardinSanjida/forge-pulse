import Image from "next/image";
import Link from "next/link";
import { featureClasses } from "@/lib/feature-classes";

export const metadata = {
  title: "All Classes | Forge Pulse",
  description: "Explore all Forge Pulse fitness classes.",
};

export default function ClassesPage() {
  return (
    <section className="min-h-screen bg-[#111318] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold text-orange-500">All Classes</p>
            <h1 className="mt-4 text-3xl font-black uppercase leading-tight sm:text-5xl">
              9 classes built for steady progress
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
              Compare trainers, categories, pricing, duration, and booking
              demand before choosing your next session.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex w-fit items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-bold uppercase text-white transition hover:border-orange-400 hover:text-orange-300"
          >
            Back Home
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featureClasses.map((classItem) => (
            <article
              id={classItem.id}
              key={classItem.id}
              className="scroll-mt-28 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={classItem.image}
                  alt={`${classItem.name} class`}
                  fill
                  sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />
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
                  <p className="mt-1 text-lg font-bold">{classItem.trainer}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-black/30 p-4">
                    <p className="text-white/45">Price / Duration</p>
                    <p className="mt-1 font-bold">{classItem.price}</p>
                  </div>
                  <div className="rounded-2xl bg-black/30 p-4">
                    <p className="text-white/45">Bookings</p>
                    <p className="mt-1 font-bold text-orange-400">
                      {classItem.bookingCount}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/classes/${classItem.id}`}
                  className="inline-flex w-full items-center justify-center rounded-full bg-orange-500 px-5 py-3 text-sm font-bold uppercase text-white transition hover:bg-orange-400"
                >
                  Details
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
