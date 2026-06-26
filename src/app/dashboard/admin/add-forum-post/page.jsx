"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { apiUrl } from "@/lib/api";
import { uploadToImgbb } from "@/lib/imgbb";

export default function AdminAddForumPostPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({ title: "", content: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadToImgbb(imageFile);
      }

      const payload = {
        title: form.title.trim(),
        description: form.content.trim(),
        image: imageUrl || undefined,
        authorName: session?.user?.name || "Admin",
        authorEmail: session?.user?.email || "",
        authorRole: "admin",
      };

      const res = await fetch(apiUrl("/api/forum-posts"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create post.");

      setSuccess(true);
      setForm({ title: "", content: "" });
      setImageFile(null);
      if (imagePreview) { URL.revokeObjectURL(imagePreview); setImagePreview(""); }
      setTimeout(() => router.push("/dashboard/admin/forum-posts"), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <header className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black tracking-normal">Add Forum Post</h1>
        <p className="mt-2 text-sm text-white/55">Create a community forum post as admin.</p>
      </header>

      <div className="mt-6 max-w-2xl">
        {error && (
          <p className="mb-4 rounded-md border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
            {error}
          </p>
        )}
        {success && (
          <p className="mb-4 rounded-md border border-green-400/20 bg-green-500/10 px-5 py-4 text-sm text-green-200">
            Post published! Redirecting…
          </p>
        )}

        <form onSubmit={handleSubmit} className="rounded-md border border-white/10 bg-[#0c151d] p-6 shadow-xl shadow-black/20 space-y-5">
          <label className="block">
            <span className="text-sm font-black text-white/70">Title *</span>
            <input
              type="text"
              name="title"
              required
              value={form.title}
              onChange={handleChange}
              placeholder="Post title…"
              className="mt-2 h-12 w-full rounded-md border border-white/10 bg-[#081016] px-4 text-white outline-none transition focus:border-orange-400"
            />
          </label>

          <label className="block">
            <span className="text-sm font-black text-white/70">Content *</span>
            <textarea
              name="content"
              required
              value={form.content}
              onChange={handleChange}
              placeholder="Write your post content here…"
              rows={6}
              className="mt-2 w-full rounded-md border border-white/10 bg-[#081016] px-4 py-3 text-white outline-none transition focus:border-orange-400 resize-none"
            />
          </label>

          {/* Cover Image */}
          <div>
            <span className="text-sm font-black text-white/70">
              Cover Image <span className="font-normal text-white/40">(optional)</span>
            </span>
            <div className="mt-2 flex items-center gap-3">
              {imagePreview && (
                <div className="h-16 w-24 shrink-0 overflow-hidden rounded-md border border-white/10">
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-12 flex-1 rounded-md border border-white/10 bg-[#081016] px-4 text-left text-sm text-white/50 transition hover:border-orange-400 hover:text-white"
              >
                {imageFile ? imageFile.name : "Choose image…"}
              </button>
              {imageFile && (
                <button
                  type="button"
                  onClick={() => { setImageFile(null); URL.revokeObjectURL(imagePreview); setImagePreview(""); }}
                  className="h-12 rounded-md border border-white/10 px-3 text-sm text-white/40 transition hover:text-red-300"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/dashboard/admin/forum-posts")}
              className="h-12 flex-1 rounded-md border border-white/10 text-sm font-black text-white/60 transition hover:bg-white/5 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 flex-1 rounded-md bg-orange-500 text-sm font-black text-white transition hover:bg-orange-400 disabled:opacity-60"
            >
              {isSubmitting ? "Publishing…" : "Publish Post"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
