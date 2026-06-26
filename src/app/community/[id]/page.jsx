"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import fallbackPostImage from "../../../../asset/boxing.jpg";
import { apiUrl } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

function getImageSource(post) {
  if (
    typeof post?.image === "string" &&
    (post.image.startsWith("http://") || post.image.startsWith("https://"))
  ) {
    return post.image;
  }

  return fallbackPostImage;
}

export default function ForumPostDetailsPage({ params }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [postId, setPostId] = useState("");
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function resolveParams() {
      const resolvedParams = await params;
      setPostId(resolvedParams.id);
    }

    resolveParams();
  }, [params]);

  useEffect(() => {
    if (isPending || !postId) {
      return;
    }

    if (!session?.user) {
      router.push(`/login?redirectTo=/community/${postId}`);
      return;
    }

    const controller = new AbortController();

    async function loadPost() {
      setIsLoading(true);
      setError("");

      try {
        const [postResponse, commentsResponse] = await Promise.all([
          fetch(apiUrl(`/api/forum-posts/${postId}`), {
            signal: controller.signal,
          }),
          fetch(apiUrl(`/api/forum-posts/${postId}/comments`), {
            signal: controller.signal,
            credentials: 'include',
          }),
        ]);

        if (!postResponse.ok || !commentsResponse.ok) {
          throw new Error("Unable to load forum post.");
        }

        setPost(await postResponse.json());
        setComments(await commentsResponse.json());
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadPost();

    return () => controller.abort();
  }, [isPending, postId, router, session?.user]);

  const vote = async (voteType) => {
    if (!session?.user?.email) {
      return;
    }

    setError("");

    try {
      const response = await fetch(apiUrl(`/api/forum-posts/${postId}/vote`), {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: session.user.email,
          voteType,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to save vote.");
      }

      setPost(result);
    } catch (voteError) {
      setError(voteError.message);
    }
  };

  const addComment = async (event) => {
    event.preventDefault();

    if (!commentText.trim() || !session?.user?.email) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(apiUrl(`/api/forum-posts/${postId}/comments`), {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: commentText,
          parentId: replyTo?._id || null,
          authorName: session.user.name || "",
          authorEmail: session.user.email,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to add comment.");
      }

      setComments((currentComments) => [result, ...currentComments]);
      setCommentText("");
      setReplyTo(null);
    } catch (commentError) {
      setError(commentError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = async (commentId) => {
    if (!editText.trim()) return;
    setIsSavingEdit(true);
    setError("");
    try {
      const response = await fetch(apiUrl(`/api/forum-comments/${commentId}`), {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: editText }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to update comment.");
      }
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, text: result.text, updatedAt: result.updatedAt } : c))
      );
      cancelEdit();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const deleteComment = async (commentId) => {
    const confirmed = window.confirm("Delete this comment?");

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(apiUrl(`/api/forum-comments/${commentId}`), {
        method: "DELETE",
        credentials: 'include',
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to delete comment.");
      }

      setComments((currentComments) =>
        currentComments.filter((comment) => comment._id !== commentId),
      );
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  if (isLoading) {
    return (
      <section className="min-h-screen bg-[#111111] px-4 py-16 text-center text-white">
        Loading post...
      </section>
    );
  }

  if (error && !post) {
    return (
      <section className="min-h-screen bg-[#111111] px-4 py-16 text-center text-white">
        <h1 className="text-3xl font-black">Post Not Found</h1>
        <p className="mt-3 text-white/55">{error}</p>
        <Link
          href="/community"
          className="mt-6 inline-flex rounded-md bg-orange-500 px-5 py-3 text-sm font-black uppercase"
        >
          Back to Forum
        </Link>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#111111] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/community" className="text-sm font-black text-orange-300">
          Back to Forum
        </Link>

        <div className="relative mt-8 h-105 overflow-hidden rounded-md">
          <Image
            src={getImageSource(post)}
            alt={post.title}
            fill
            sizes="100vw"
            className="object-cover"
            unoptimized={typeof getImageSource(post) === "string"}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/90 to-transparent" />
          <h1 className="absolute bottom-8 left-6 right-6 text-3xl font-black sm:text-5xl">
            {post.title}
          </h1>
        </div>

        <div className="mt-8 rounded-md border border-white/10 bg-white/3 p-6">
          <p className="text-sm text-white/50">
            By {post.authorName || post.authorRole}
          </p>
          <p className="mt-5 whitespace-pre-line text-base leading-8 text-white/75">
            {post.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => vote("like")}
              className="rounded-md bg-green-600 px-5 py-3 text-sm font-black text-white"
            >
              Like ({post.likes || 0})
            </button>
            <button
              type="button"
              onClick={() => vote("dislike")}
              className="rounded-md bg-red-600 px-5 py-3 text-sm font-black text-white"
            >
              Dislike ({post.dislikes || 0})
            </button>
          </div>
        </div>

        {error && (
          <p className="mt-6 rounded-md border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </p>
        )}

        <section className="mt-8 rounded-md border border-white/10 bg-[#191919] p-6">
          <h2 className="text-2xl font-black">Comments</h2>
          {replyTo && (
            <p className="mt-4 rounded-md bg-white/4 px-4 py-3 text-sm text-white/65">
              Replying to {replyTo.authorName || replyTo.authorEmail}
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="ml-3 font-black text-orange-300"
              >
                Cancel
              </button>
            </p>
          )}
          <form className="mt-5 space-y-3" onSubmit={addComment}>
            <textarea
              value={commentText}
              onChange={(event) => setCommentText(event.target.value)}
              className="min-h-28 w-full rounded-md border border-white/10 bg-[#0c1117] px-4 py-3 text-white outline-none focus:border-orange-400"
              placeholder="Write a comment..."
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-orange-500 px-5 py-3 text-sm font-black uppercase text-white disabled:opacity-60"
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
          </form>

          <div className="mt-8 space-y-4">
            {comments.map((comment) => {
              const isOwn = comment.authorEmail === session?.user?.email?.toLowerCase();
              const isEditing = editingId === comment._id;

              return (
                <article
                  key={comment._id}
                  className={`rounded-md border border-white/10 bg-white/3 p-4 ${
                    comment.parentId ? "ml-6" : ""
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-black">
                      {comment.authorName || comment.authorEmail}
                    </p>
                    {comment.updatedAt && (
                      <span className="text-xs text-white/30">edited</span>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="mt-3 space-y-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="min-h-20 w-full rounded-md border border-white/10 bg-[#0c1117] px-4 py-3 text-sm text-white outline-none focus:border-orange-400"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={isSavingEdit}
                          onClick={() => saveEdit(comment._id)}
                          className="rounded-md bg-orange-500 px-4 py-2 text-xs font-black text-white transition hover:bg-orange-400 disabled:opacity-60"
                        >
                          {isSavingEdit ? "Saving…" : "Save"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="rounded-md border border-white/10 px-4 py-2 text-xs font-black text-white/60 transition hover:bg-white/5"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm leading-6 text-white/70">
                      {comment.text}
                    </p>
                  )}

                  {!isEditing && (
                    <div className="mt-4 flex gap-3 text-xs font-black">
                      <button
                        type="button"
                        onClick={() => setReplyTo(comment)}
                        className="text-orange-300"
                      >
                        Reply
                      </button>
                      {isOwn && (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(comment)}
                            className="text-blue-300"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteComment(comment._id)}
                            className="text-red-300"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}
