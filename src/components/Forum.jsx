"use client";

import Image from "next/image";
import Link from "next/link";
import { getRecentCommunityPosts } from "@/lib/community-posts";

const recentPosts = getRecentCommunityPosts(3);

function Forum() {
  return (
    <section className="relative overflow-hidden bg-[#282828] px-4 py-20 text-white sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.12),transparent_28%),radial-gradient(circle_at_82%_70%,rgba(249,115,22,0.1),transparent_30%)]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm font-black uppercase text-orange-400">Forum</p>
          <h2 className="mt-5 text-4xl font-light leading-tight text-white sm:text-5xl">
            Our Latest <span className="font-black text-orange-500">Posts</span>{" "}
            & Discussions
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {recentPosts.map((post) => (
            <article
              key={post.id}
              className="group overflow-hidden bg-[#111111] shadow-[0_18px_40px_rgba(0,0,0,0.38)]"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/10" />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-black leading-snug text-white">
                  {post.title}
                </h3>

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

        <div className="mt-10 flex justify-center">
          <Link
            href="/community"
            className="inline-flex items-center justify-center rounded-full bg-orange-500 px-7 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
          >
            View More
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Forum;
