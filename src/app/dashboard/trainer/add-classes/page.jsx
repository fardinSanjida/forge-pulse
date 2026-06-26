"use client";

/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { apiUrl } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { uploadToImgbb } from "@/lib/imgbb";

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const difficulties = ["Beginner", "Intermediate", "Advanced"];

export default function Page() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const fileInputRef = useRef(null);
  const [className, setClassName] = useState("Power Yoga Flow");
  const [category, setCategory] = useState("Yoga");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [duration, setDuration] = useState("60");
  const [price, setPrice] = useState("42.99");
  const [description, setDescription] = useState(
    "A dynamic yoga class to improve flexibility, strength and mental clarity.",
  );
  const [selectedDays, setSelectedDays] = useState([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
  ]);
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

  const toggleDay = (day) => {
    setSelectedDays((currentDays) =>
      currentDays.includes(day)
        ? currentDays.filter((currentDay) => currentDay !== day)
        : [...currentDays, day],
    );
  };

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

  const resetForm = () => {
    setClassName("");
    setCategory("Yoga");
    setDifficulty("Beginner");
    setDuration("");
    setPrice("");
    setDescription("");
    setSelectedDays([]);
    setFileName("");
    setImageFile(null);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (isPending) {
      return;
    }

    if (!session?.user?.email) {
      router.push("/login?redirectTo=/dashboard/trainer/add-classes");
      return;
    }

    if (!selectedDays.length) {
      setError("Select at least one class day.");
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

      const response = await fetch(apiUrl("/api/classes"), {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: className,
          image: imageUrl || fileName,
          category,
          difficulty,
          duration: `${duration} min`,
          schedule: selectedDays.join(", "),
          price,
          description,
          trainerName: session.user.name || "",
          trainerEmail: session.user.email,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to create class.");
      }

      setSuccess("Class submitted for admin approval.");
      resetForm();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black tracking-normal">Add Class</h1>
      </header>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.85fr)]">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block text-sm font-black text-white/75">
            Class Name
            <input
              type="text"
              value={className}
              onChange={(event) => setClassName(event.target.value)}
              className="mt-2 h-14 w-full rounded-md border border-white/10 bg-[#0c1117] px-5 text-base font-semibold text-white outline-none transition placeholder:text-white/30 focus:border-orange-400"
            />
          </label>

          <div>
            <p className="text-sm font-black text-white/75">Class Image</p>
            <div className="mt-2 grid gap-4 md:grid-cols-[minmax(220px,1fr)_130px_180px]">
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-14 rounded-md border border-white/10 bg-[#0c1117] px-5 text-base font-semibold text-white outline-none focus:border-orange-400"
              >
                <option>Yoga</option>
                <option>Strength</option>
                <option>HIIT</option>
                <option>Cardio</option>
                <option>Mobility</option>
              </select>

              <div className="relative h-20 overflow-hidden rounded-md border border-white/10 bg-[#0c1117]">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-xs font-semibold text-white/35">
                    Preview
                  </div>
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
                  className="h-14 w-full rounded-md border border-white/10 bg-[#0c1117] px-5 text-sm font-black text-white/75 transition hover:border-orange-400 hover:text-white"
                >
                  Change Image
                </button>
                {fileName && (
                  <p className="mt-2 truncate text-xs text-white/45">{fileName}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-black text-white/75">
              Difficulty
              <select
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value)}
                className="mt-2 h-14 w-full rounded-md border border-white/10 bg-[#0c1117] px-5 text-base font-semibold text-white outline-none focus:border-orange-400"
              >
                {difficulties.map((level) => (
                  <option key={level}>{level}</option>
                ))}
              </select>
            </label>

            <div className="mt-2 grid grid-cols-3 overflow-hidden rounded-md border border-white/10 bg-[#0c1117]">
              {difficulties.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`h-12 text-sm font-black transition ${
                    difficulty === level
                      ? "bg-orange-500 text-white"
                      : "text-white/45 hover:bg-white/4 hover:text-white"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <label className="block text-sm font-black text-white/75">
            Duration
            <div className="mt-2 flex gap-3">
              <input
                type="number"
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                className="h-14 min-w-0 flex-1 rounded-md border border-white/10 bg-[#0c1117] px-5 text-base font-semibold text-white outline-none focus:border-orange-400"
              />
              <span className="grid h-14 w-24 place-items-center rounded-md border border-white/10 bg-[#0c1117] text-sm font-black text-white/65">
                Minutes
              </span>
            </div>
          </label>

          <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
            {weekdays.map((day) => {
              const isSelected = selectedDays.includes(day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`h-12 rounded-md text-sm font-black transition ${
                    isSelected
                      ? "bg-orange-500 text-white"
                      : "border border-white/10 bg-[#0c1117] text-white/45 hover:bg-white/4 hover:text-white"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <label className="block text-sm font-black text-white/75">
            Price
            <div className="mt-2 flex overflow-hidden rounded-md border border-white/10 bg-[#0c1117]">
              <span className="grid w-14 place-items-center border-r border-white/10 text-lg font-black text-white/70">
                $
              </span>
              <input
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                className="h-14 min-w-0 flex-1 bg-transparent px-5 text-base font-semibold text-white outline-none"
              />
            </div>
          </label>

          <label className="block text-sm font-black text-white/75">
            Description
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-2 min-h-16 w-full rounded-md border border-white/10 bg-[#0c1117] px-5 py-4 text-base font-semibold text-white outline-none focus:border-orange-400"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-14 w-full rounded-md bg-orange-500 text-base font-black text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Submitting..." : "Create Class"}
          </button>
          {success && (
            <p className="rounded-md border border-green-400/25 bg-green-500/10 px-4 py-3 text-sm font-semibold text-green-200">
              {success}
            </p>
          )}
          {error && (
            <p className="rounded-md border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-100">
              {error}
            </p>
          )}
        </form>

        <aside className="rounded-md border border-white/10 bg-[#10161d] p-6 shadow-xl shadow-black/20">
          <h2 className="text-xl font-black">Class Preview</h2>

          <div className="mt-6 overflow-hidden rounded-md border border-white/10 bg-[#060b10]">
            <div className="relative h-64 bg-[#0c1117]">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center text-sm font-semibold text-white/35">
                  Choose a class image
                </div>
              )}
            </div>

            <div className="p-5">
              <h3 className="text-3xl font-black leading-tight tracking-normal">
                {className || "Untitled Class"}
              </h3>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="rounded-md border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-black text-orange-300">
                  {category}
                </span>
                <span className="rounded-md border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-sm font-black text-orange-300">
                  {difficulty}
                </span>
              </div>

              <div className="mt-7 grid gap-4 text-sm font-black text-white/70 sm:grid-cols-2">
                <p>{duration || "0"} Min</p>
                <p>${price || "0.00"}</p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {selectedDays.map((day) => (
                  <span
                    key={day}
                    className="rounded-md border border-white/10 bg-white/4 px-3 py-2 text-xs font-black text-white/70"
                  >
                    {day}
                  </span>
                ))}
              </div>

              <p className="mt-5 text-sm leading-6 text-white/55">
                {description}
              </p>

              <div className="mt-6 rounded-md border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-center text-sm font-black text-amber-300">
                PENDING APPROVAL
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
