"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";

function formatDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
    new Date(value)
  );
}

export default function AdminForumPostsPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await fetch(apiUrl("/api/forum-posts"), {
          credentials: "include",
        });
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
  }, []);

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
      <header className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black tracking-normal">Forum Posts</h1>
        <p className="mt-2 text-sm text-white/55">
          All community posts — admins can delete any post.
        </p>
      </header>

      {error && (
        <p className="mt-4 rounded-md border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
          {error}
        </p>
      )}

      <article className="mt-6 overflow-hidden rounded-md border border-white/10 bg-[#0c1117] shadow-xl shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-white/[0.04] text-xs font-black uppercase tracking-normal text-white/55">
              <tr>
                <th className="px-5 py-4">Title</th>
                <th className="px-5 py-4">Author</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {isLoading ? (
                <tr>
                  <td className="px-5 py-8 text-center text-white/55" colSpan={4}>
                    Loading posts…
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td className="px-5 py-8 text-center text-white/55" colSpan={4}>
                    No forum posts found.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post._id} className="text-white/70">
                    <td className="px-5 py-4">
                      <p className="font-black text-white line-clamp-1">
                        {post.title}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-white">
                        {post.authorName || "—"}
                      </p>
                      <p className="mt-1 text-xs text-white/45">
                        {post.authorEmail}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-white/60">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {confirmId === post._id ? (
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setConfirmId(null)}
                            className="rounded-md border border-white/10 px-3 py-2 text-xs font-black text-white/60 transition hover:bg-white/5"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={deletingId === post._id}
                            onClick={() => deletePost(post._id)}
                            className="rounded-md bg-red-600 px-3 py-2 text-xs font-black text-white transition hover:bg-red-500 disabled:opacity-50"
                          >
                            {deletingId === post._id ? "Deleting…" : "Confirm"}
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmId(post._id)}
                          className="rounded-md border border-red-500/50 px-4 py-2 text-xs font-black text-red-300 transition hover:bg-red-600 hover:text-white"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </article>
    </>
  );
}
