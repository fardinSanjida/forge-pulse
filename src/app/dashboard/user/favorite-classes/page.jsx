"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  DashboardShell,
  PageHeader,
  Panel,
} from "@/components/dashboard/UserDashboardShared";
import { apiUrl } from "@/lib/api";

export default function Page() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const user = session?.user;

  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;
    if (!user?.email) {
      router.push("/login");
      return;
    }

    async function load() {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(
          apiUrl(`/api/favorites?userEmail=${encodeURIComponent(user.email)}`),
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to load favorites.");
        setFavorites(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [isPending, user?.email, router]);

  async function removeFavorite(id) {
    setRemovingId(id);
    try {
      const res = await fetch(apiUrl(`/api/favorites/${id}`), {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed to remove favorite.");
      }
      setFavorites((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <DashboardShell activeSection="favorite-classes">
      <PageHeader
        title="Favorite Classes"
        subtitle="Classes you love and want to revisit."
      />

      {error && (
        <p className="mt-4 rounded-md border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm text-red-100">
          {error}
        </p>
      )}

      {isLoading ? (
        <div className="mt-10 text-center text-white/55">Loading favorites…</div>
      ) : favorites.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-white/55">You have no favorite classes yet.</p>
          <Link
            href="/classes"
            className="mt-4 inline-block rounded-md bg-orange-500 px-6 py-3 text-sm font-black text-white transition hover:bg-orange-400"
          >
            Browse Classes
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {favorites.map((item) => (
            <Panel key={item._id} className="p-0">
              <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-t-md bg-white/5">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-16 w-16 text-white/10"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                >
                  <path d="M7 3v4M17 3v4M4 9h16" />
                  <rect width="16" height="17" x="4" y="5" rx="2" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c151d] to-transparent" />
                <span className="absolute right-4 top-4 text-xl text-orange-400">♥</span>
              </div>
              <div className="p-5">
                <h2 className="font-black text-white">{item.className || "—"}</h2>
                <p className="mt-1 text-sm text-white/55">
                  with {item.trainerName || "—"}
                </p>
                {item.schedule && (
                  <p className="mt-2 text-xs text-white/45">{item.schedule}</p>
                )}
                {item.price && (
                  <p className="mt-1 text-sm font-black text-green-300">{item.price}</p>
                )}
                <div className="mt-5 flex gap-3">
                  <Link
                    href={`/classes/${item.classId}`}
                    className="flex-1 rounded-md border border-white/10 px-4 py-2 text-center text-xs font-black text-white/80 transition hover:bg-white/5"
                  >
                    View
                  </Link>
                  <button
                    type="button"
                    disabled={removingId === item._id}
                    onClick={() => removeFavorite(item._id)}
                    className="flex-1 rounded-md border border-red-500/60 px-4 py-2 text-xs font-black text-red-300 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
                  >
                    {removingId === item._id ? "…" : "Remove"}
                  </button>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
