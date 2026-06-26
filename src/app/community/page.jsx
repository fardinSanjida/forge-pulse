"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import fallbackPostImage from "../../../asset/boxing.jpg";
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

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadPosts() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          apiUrl(`/api/forum-posts?page=${page}&limit=6`),
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Unable to load forum posts.");
        }

        const result = await response.json();
        setPosts(result.data || []);
        setPagination(result.pagination || { totalPages: 1 });
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();

    return () => controller.abort();
  }, [page]);

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
              Browse recent conversations from trainers and admins about
              training, recovery, motivation, and gym progress.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex w-fit items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-bold uppercase text-white transition hover:border-orange-400 hover:text-orange-300"
          >
            Back Home
          </Link>
        </div>

        {error && (
          <p className="mt-6 rounded-md border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </p>
        )}

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            <p className="col-span-full text-center text-white/55">
              Loading posts...
            </p>
          ) : posts.length ? (
            posts.map((post) => (
              <article
                key={post._id}
                className="group overflow-hidden bg-[#191919] shadow-[0_18px_40px_rgba(0,0,0,0.38)]"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={getImageSource(post)}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                    unoptimized={typeof getImageSource(post) === "string"}
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-black leading-snug text-white">
                    {post.title}
                  </h2>

                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-white/45">
                    <span>{post.authorName || post.authorRole}</span>
                    <span>{post.commentCount || 0} Comments</span>
                  </div>

                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-white/55">
                    {post.description}
                  </p>

                  <Link
                    href={`/community/${post._id}`}
                    className="mt-6 inline-flex bg-orange-500 px-7 py-3 text-xs font-black uppercase tracking-wide text-white transition hover:bg-orange-400"
                  >
                    Read More
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <p className="col-span-full text-center text-white/55">
              No forum posts found.
            </p>
          )}
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((currentPage) => currentPage - 1)}
            className="rounded-md border border-white/10 px-4 py-2 text-sm font-bold text-white/70 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
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
            className="rounded-md border border-white/10 px-4 py-2 text-sm font-bold text-white/70 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
