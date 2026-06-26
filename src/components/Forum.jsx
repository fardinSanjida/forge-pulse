"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import fallbackPostImage from "../../asset/boxing.jpg";
import { apiUrl } from "@/lib/api";

function getImageSource(post) {
  if (
    typeof post.image === "string" &&
    (post.image.startsWith("http://") || post.image.startsWith("https://"))
  ) {
    return post.image;
  }

  return fallbackPostImage;
}

function Forum() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRecentPosts() {
      try {
        const response = await fetch(apiUrl("/api/forum-posts?page=1&limit=3"));
        if (response.ok) {
          const result = await response.json();
          setPosts(result.data || []);
        }
      } catch (err) {
        console.error("Failed to load community posts:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadRecentPosts();
  }, []);

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
          {isLoading ? (
            <p className="col-span-full text-center text-white/55">Loading posts...</p>
          ) : posts.length ? (
            posts.map((post) => {
              const formattedDate = post.createdAt
                ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
                    new Date(post.createdAt)
                  )
                : "Recent";

              return (
                <article
                  key={post._id}
                  className="group overflow-hidden bg-[#111111] shadow-[0_18px_40px_rgba(0,0,0,0.38)]"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={getImageSource(post)}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                      unoptimized={typeof getImageSource(post) === "string"}
                    />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-black leading-snug text-white line-clamp-2">
                      {post.title}
                    </h3>

                    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-white/45">
                      <span>{formattedDate}</span>
                      <span>{post.commentCount || 0} Comments</span>
                    </div>

                    <p className="mt-5 text-sm leading-6 text-white/55 line-clamp-3">
                      {post.description}
                    </p>

                    <Link
                      href={`/community/${post._id}`}
                      className="mt-6 inline-block bg-orange-500 px-7 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:bg-orange-400"
                    >
                      Read More
                    </Link>
                  </div>
                </article>
              );
            })
          ) : (
            <p className="col-span-full text-center text-white/55">No forum posts found.</p>
          )}
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
