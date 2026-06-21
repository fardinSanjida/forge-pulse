import Image from "next/image";
import Link from "next/link";
import { communityPosts } from "@/lib/community-posts";

export const metadata = {
  title: "Community Forum | Forge Pulse",
  description: "Explore the latest Forge Pulse community forum posts.",
};

export default function CommunityPage() {
  return (
    <section className="min-h-screen bg-[#111111] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase text-orange-400">
              Community Forum
            </p>
            <h1 className="mt-4 text-3xl font-light leading-tight sm:text-5xl">
              Latest <span className="font-black text-orange-500">Posts</span>{" "}
              & Discussions
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/60 sm:text-base">
              Browse recent conversations from Forge Pulse members about
              training, consistency, recovery, motivation, and gym progress.
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
          {communityPosts.map((post) => (
            <article
              id={post.id}
              key={post.id}
              className="group scroll-mt-28 overflow-hidden bg-[#191919] shadow-[0_18px_40px_rgba(0,0,0,0.38)]"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.alt}
                  fill
                  sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>

              <div className="p-6">
                <h2 className="text-xl font-black leading-snug text-white">
                  {post.title}
                </h2>

                <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-white/45">
                  <span>{post.date}</span>
                  <span>{post.comments} Comments</span>
                </div>

                <p className="mt-5 text-sm leading-6 text-white/55">
                  {post.excerpt}
                </p>

                <button
                  type="button"
                  className="mt-6 bg-orange-500 px-7 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:bg-orange-400"
                >
                  Read More
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
