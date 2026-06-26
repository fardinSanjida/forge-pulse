"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/lib/api";

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

export default function Page() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const user = session?.user;

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmId, setConfirmId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (isPending) return;
    if (!user?.email) { router.push("/login"); return; }

    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(
          apiUrl(`/api/forum-posts?authorEmail=${encodeURIComponent(user.email)}`),
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to load forum posts.");
        const json = await res.json();
        setPosts(Array.isArray(json) ? json : (json.data ?? []));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [isPending, user?.email, router]);

  async function deletePost(id) {
    setDeletingId(id);
    setError("");
    try {
      const res = await fetch(apiUrl(`/api/forum-posts/${id}`), {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to delete post.");
      }
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  return (
    <>
      <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-normal">My Forum Posts</h1>
          <p className="mt-2 text-sm text-white/55">Manage your community posts.</p>
        </div>
        <Link
          href="/dashboard/trainer/add-forum-post"
          className="w-full rounded-md bg-orange-500 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-orange-400 sm:w-auto"
        >
          Add Post
        </Link>
      </header>

      {error && (
        <p className="mt-4 rounded-md border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
          {error}
        </p>
      )}

      <div className="mt-6">
        {isLoading ? (
          <p className="text-center text-sm text-white/55 py-8">Loading posts…</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-white/55">You have not published any forum posts yet.</p>
            <Link
              href="/dashboard/trainer/add-forum-post"
              className="mt-4 inline-block rounded-md bg-orange-500 px-6 py-3 text-sm font-black text-white transition hover:bg-orange-400"
            >
              Write Your First Post
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <article
                key={post._id}
                className="rounded-md border border-white/10 bg-[#0c151d] p-6 shadow-xl shadow-black/20"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-black text-white line-clamp-2">{post.title}</h2>
                    <p className="mt-1 text-sm text-white/45">{formatDate(post.createdAt)}</p>
                    {post.description && (
                      <p className="mt-3 text-sm leading-6 text-white/60 line-clamp-2">
                        {post.description}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/40">
                      <span>
                        {post.likes?.length ?? 0} likes
                      </span>
                      <span>
                        {post.comments?.length ?? 0} comments
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={`/community/${post._id}`}
                      className="rounded-md border border-white/10 px-4 py-2 text-xs font-black text-white/70 transition hover:bg-white/5 hover:text-white"
                    >
                      View
                    </Link>
                    {confirmId === post._id ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setConfirmId(null)}
                          className="rounded-md border border-white/10 px-4 py-2 text-xs font-black text-white/60 transition hover:bg-white/5"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === post._id}
                          onClick={() => deletePost(post._id)}
                          className="rounded-md bg-red-600 px-4 py-2 text-xs font-black text-white transition hover:bg-red-500 disabled:opacity-50"
                        >
                          {deletingId === post._id ? "Deleting…" : "Confirm Delete"}
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmId(post._id)}
                        className="rounded-md border border-red-500/50 px-4 py-2 text-xs font-black text-red-300 transition hover:bg-red-600 hover:text-white"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
