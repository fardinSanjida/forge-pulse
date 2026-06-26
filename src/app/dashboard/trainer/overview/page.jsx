"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/dashboard/DashboardShareStates";
import { apiUrl } from "@/lib/api";
import classImage from "../../../../../asset/strength.jpg";
import bookingImage from "../../../../../asset/gym3.jpg";
import forumImage from "../../../../../asset/image21.jpg";

export default function Page() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const user = session?.user;

  const [classes, setClasses] = useState([]);
  const [forumPosts, setForumPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;
    if (!user?.email) {
      router.push("/login");
      return;
    }

    const email = encodeURIComponent(user.email);

    async function load() {
      setIsLoading(true);
      try {
        const [classesRes, postsRes] = await Promise.all([
          fetch(apiUrl(`/api/classes?trainerEmail=${email}`), { credentials: "include" }),
          fetch(apiUrl(`/api/forum-posts?authorEmail=${email}`), { credentials: "include" }),
        ]);
        if (classesRes.ok) {
          const json = await classesRes.json();
          setClasses(Array.isArray(json) ? json : (json.data || []));
        }
        if (postsRes.ok) {
          const json = await postsRes.json();
          setForumPosts(Array.isArray(json) ? json : (json.data || []));
        }
      } catch {
        // non-fatal
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [isPending, user?.email, router]);

  const totalStudents = classes.reduce((sum, c) => sum + (c.bookingCount || 0), 0);
  const classCount = classes.length;
  const postCount = forumPosts.length;

  const trainerStats = [
    {
      label: "Total Classes",
      value: isLoading ? "—" : String(classCount),
      action: "Manage classes",
      image: classImage,
      tint: "from-emerald-500/45 to-[#071016]",
      icon: (
        <>
          <rect width="16" height="16" x="4" y="4" rx="2" />
          <path d="M8 9h8M8 13h5" />
        </>
      ),
    },
    {
      label: "Total Students",
      value: isLoading ? "—" : String(totalStudents),
      action: "View bookings",
      image: bookingImage,
      tint: "from-orange-500/45 to-[#130805]",
      icon: (
        <>
          <path d="M7 3v4M17 3v4M4 9h16" />
          <rect width="16" height="17" x="4" y="5" rx="2" />
        </>
      ),
    },
    {
      label: "Forum Posts",
      value: isLoading ? "—" : String(postCount).padStart(2, "0"),
      action: "View posts",
      image: forumImage,
      tint: "from-violet-500/50 to-[#0d0620]",
      icon: (
        <>
          <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
          <path d="M8 9h8M8 13h5" />
        </>
      ),
    },
  ];

  return (
    <>
      <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-normal">Trainer Overview</h1>
          <p className="mt-2 text-sm text-white/55">
            Manage classes, forum posts, and member activity.
          </p>
        </div>
        <Link
          href="/dashboard/trainer/add-classes"
          className="w-full rounded-md bg-orange-500 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-orange-400 sm:w-auto"
        >
          Add Class <span aria-hidden="true">-&gt;</span>
        </Link>
      </header>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {trainerStats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <article className="rounded-md border border-white/10 bg-[#0c151d] p-6 shadow-xl shadow-black/20">
          <div className="flex items-center gap-5">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="h-24 w-24 rounded-full object-cover"
              />
            ) : (
              <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-orange-500/20 text-4xl font-black text-orange-300">
                {user?.name?.[0]?.toUpperCase() || "T"}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-black">{user?.name || "—"}</h2>
                <span className="rounded-md bg-green-400/15 px-3 py-1 text-xs font-black text-green-300">
                  Trainer
                </span>
              </div>
              <p className="mt-2 text-sm text-white/55">{user?.email}</p>
            </div>
          </div>
          <div className="mt-8 flex items-end justify-between gap-4">
            <p className="text-sm text-white/55">
              Classes
              <span className="mt-1 block font-semibold text-white/75">
                {isLoading ? "—" : `${classCount} published`}
              </span>
            </p>
            <Link
              href="/dashboard/trainer/profile-settings"
              className="rounded-md bg-white/6 px-5 py-3 text-sm font-bold text-white/80 transition hover:bg-white/10"
            >
              Edit Profile
            </Link>
          </div>
        </article>

        <article className="rounded-md border border-white/10 bg-[#0c151d] p-6 shadow-xl shadow-black/20 xl:col-span-2">
          <h2 className="text-xl font-black">My Classes</h2>
          {isLoading ? (
            <p className="mt-4 text-sm text-white/55">Loading…</p>
          ) : classes.length === 0 ? (
            <p className="mt-4 text-sm text-white/55">No classes yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {classes.slice(0, 3).map((c) => (
                <div
                  key={c._id}
                  className="flex items-center justify-between gap-4 rounded-md border border-white/10 bg-white/3 px-4 py-3 text-sm text-white/70"
                >
                  <span className="font-black text-white">{c.name}</span>
                  <span
                    className={`rounded-md px-3 py-1 text-xs font-black ${
                      c.status === "Approved"
                        ? "bg-green-500/20 text-green-300"
                        : c.status === "Rejected"
                        ? "bg-red-500/20 text-red-300"
                        : "bg-orange-500/20 text-orange-300"
                    }`}
                  >
                    {c.status || "Pending"}
                  </span>
                </div>
              ))}
              {classes.length > 3 && (
                <Link
                  href="/dashboard/trainer/my-classes"
                  className="block text-center text-sm font-black text-orange-300 hover:text-orange-400"
                >
                  View all {classes.length} classes
                </Link>
              )}
            </div>
          )}
        </article>
      </div>
    </>
  );
}
