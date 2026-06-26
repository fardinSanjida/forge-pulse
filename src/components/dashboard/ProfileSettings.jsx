"use client";

/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { useSession, updateUser } from "@/lib/auth-client";
import { uploadToImgbb } from "@/lib/imgbb";

export default function ProfileSettings() {
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Initialise once session loads
  const [initialised, setInitialised] = useState(false);
  if (!isPending && user && !initialised) {
    setName(user.name || "");
    setInitialised(true);
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setSuccess("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    setIsSaving(true);
    try {
      let imageUrl = user?.image || "";

      if (imageFile) {
        imageUrl = await uploadToImgbb(imageFile);
      }

      const result = await updateUser({ name: name.trim(), image: imageUrl });
      if (result?.error) throw new Error(result.error.message || "Update failed.");

      setSuccess("Profile updated successfully.");
      setImageFile(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview("");
      }
    } catch (err) {
      setError(err.message || "Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const displayImage = imagePreview || user?.image || "";
  const initials = (user?.name || user?.email || "U")[0].toUpperCase();

  if (isPending) {
    return <p className="mt-8 text-sm text-white/55">Loading profile…</p>;
  }

  return (
    <form onSubmit={handleSave} className="mt-6 max-w-2xl space-y-6">
      {/* Avatar */}
      <div className="flex flex-wrap items-center gap-5">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border border-white/10 bg-[#10161d]">
          {displayImage ? (
            <img src={displayImage} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            <span className="grid h-full w-full place-items-center text-3xl font-black text-orange-300">
              {initials}
            </span>
          )}
        </div>
        <div>
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
            className="inline-flex h-11 items-center gap-2 rounded-md border border-white/10 bg-[#10161d] px-5 text-sm font-black text-white/75 transition hover:border-orange-400 hover:text-white"
          >
            Change Photo
          </button>
          {imageFile && (
            <p className="mt-2 truncate text-xs text-white/45">{imageFile.name}</p>
          )}
        </div>
      </div>

      {/* Name */}
      <label className="block text-sm font-black text-white/75">
        Full Name
        <input
          type="text"
          value={name}
          onChange={(e) => { setName(e.target.value); setSuccess(""); }}
          required
          className="mt-2 h-12 w-full rounded-md border border-white/10 bg-[#10161d] px-4 text-base font-semibold text-white outline-none transition focus:border-orange-400"
        />
      </label>

      {/* Email — readonly */}
      <label className="block text-sm font-black text-white/75">
        Email
        <input
          type="email"
          value={user?.email || ""}
          readOnly
          className="mt-2 h-12 w-full cursor-not-allowed rounded-md border border-white/5 bg-white/3 px-4 text-base font-semibold text-white/40 outline-none"
        />
        <span className="mt-1 block text-xs text-white/35">Email cannot be changed.</span>
      </label>

      {error && (
        <p className="rounded-md border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-md border border-green-400/20 bg-green-500/10 px-4 py-3 text-sm text-green-200">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={isSaving}
        className="h-12 rounded-md bg-orange-500 px-8 text-sm font-black text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
