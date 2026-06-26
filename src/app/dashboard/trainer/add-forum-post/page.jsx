"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef, useState } from "react";
import { apiUrl } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { uploadToImgbb } from "@/lib/imgbb";

const defaultPost = `Building muscle takes time and consistency.

1. Eat enough protein
2. Stay consistent
3. Progressive overload
4. Get enough sleep
5. Track your progress`;

function FormattingButton({ children }) {
  return (
    <button
      type="button"
      className="grid h-9 w-9 place-items-center rounded-md text-sm font-black text-white/70 transition hover:bg-white/6 hover:text-white"
    >
      {children}
    </button>
  );
}

export default function Page() {
  const { data: session } = useSession();
  const fileInputRef = useRef(null);
  const [title, setTitle] = useState("5 Tips for Building Muscle Fast");
  const [description, setDescription] = useState(defaultPost);
  const [imagePreview, setImagePreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const previewLines = useMemo(
    () => description.split("\n").filter((line) => line.trim()),
    [description],
  );

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setFileName(file.name);
    setImagePreview(URL.createObjectURL(file));
  };

  const publishPost = async () => {
    setError("");
    setSuccess("");

    if (!session?.user?.email) {
      setError("Please log in before publishing a forum post.");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        try {
          imageUrl = await uploadToImgbb(imageFile);
        } catch (uploadErr) {
          setError(uploadErr.message);
          setIsSubmitting(false);
          return;
        }
      }

      const response = await fetch(apiUrl("/api/forum-posts"), {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          image: imageUrl || fileName,
          description,
          authorName: session.user.name || "",
          authorEmail: session.user.email,
          authorRole: session.user.role || "trainer",
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to publish forum post.");
      }

      setSuccess("Forum post published successfully.");
      setTitle("");
      setDescription("");
      setFileName("");
      setImageFile(null);

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview("");
      }
    } catch (publishError) {
      setError(publishError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black tracking-normal">Add Forum Post</h1>
      </header>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.85fr)]">
        <section className="space-y-6">
          <label className="block text-sm font-black text-white/75">
            Title
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 h-14 w-full rounded-md border border-white/10 bg-[#0c1117] px-5 text-base font-semibold text-white outline-none transition placeholder:text-white/30 focus:border-orange-400"
              placeholder="Write a forum post title"
            />
          </label>

          <div>
            <p className="text-sm font-black text-white/75">Featured Image</p>
            <div className="mt-2 grid gap-4 sm:grid-cols-[160px_220px_minmax(180px,1fr)]">
              <div className="relative h-24 overflow-hidden rounded-md border border-white/10 bg-[#0c1117]">
                {imagePreview ? (
                  <img src={imagePreview} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-xs font-semibold text-white/35">
                    No image
                  </div>
                )}
              </div>
              <div className="relative h-24 overflow-hidden rounded-md border border-white/10 bg-[#0c1117]">
                {imagePreview ? (
                  <img src={imagePreview} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-xs font-semibold text-white/35">
                    Preview
                  </div>
                )}
              </div>
              <div className="flex min-h-24 flex-col justify-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-14 rounded-md border border-white/10 bg-[#0c1117] px-5 text-sm font-black text-white/75 transition hover:border-orange-400 hover:text-white"
                >
                  Choose Image
                </button>
                {fileName && (
                  <p className="mt-2 truncate text-xs text-white/45">{fileName}</p>
                )}
              </div>
            </div>
          </div>

          <label className="block text-sm font-black text-white/75">
            Description
            <div className="mt-2 overflow-hidden rounded-md border border-white/10 bg-[#10161d]">
              <div className="flex flex-wrap items-center gap-2 border-b border-white/10 bg-white/3 px-4 py-3">
                {["B", "I", "U", "Undo", "Redo", "List"].map((tool) => (
                  <FormattingButton key={tool}>{tool}</FormattingButton>
                ))}
              </div>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="min-h-80 w-full resize-y bg-transparent px-7 py-6 text-lg font-semibold leading-8 text-white outline-none placeholder:text-white/30"
                placeholder="Write your forum post..."
              />
            </div>
          </label>
        </section>

        <aside className="rounded-md border border-white/10 bg-[#10161d] p-6 shadow-xl shadow-black/20">
          <h2 className="text-xl font-black">Live Preview</h2>
          <div className="mt-6 overflow-hidden rounded-md border border-white/10 bg-[#060b10]">
            <div className="relative h-56 bg-[#0c1117]">
              {imagePreview ? (
                <img src={imagePreview} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full place-items-center text-sm font-semibold text-white/35">
                  Choose an image to preview
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-[#060b10] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 h-1.5 w-28 rounded-full bg-orange-500" />
            </div>

            <div className="p-5">
              <h3 className="text-3xl font-black leading-tight tracking-normal">
                {title || "Untitled Forum Post"}
              </h3>
              <div className="mt-6 space-y-3 text-sm font-semibold leading-6 text-white/65">
                {previewLines.slice(0, 7).map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={publishPost}
            disabled={isSubmitting}
            className="mt-6 h-14 w-full rounded-md bg-orange-500 text-base font-black text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Publishing..." : "Publish Forum Post"}
          </button>
          {success && (
            <p className="mt-4 rounded-md border border-green-400/25 bg-green-500/10 px-4 py-3 text-sm text-green-100">
              {success}
            </p>
          )}
          {error && (
            <p className="mt-4 rounded-md border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </p>
          )}
        </aside>
      </div>
    </>
  );
}
