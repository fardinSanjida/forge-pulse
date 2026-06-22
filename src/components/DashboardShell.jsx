"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import AdminDashboard, { adminPages } from "@/components/Admin";
import TrainerDashboard, { trainerPages } from "@/components/Trainer";
import UserDashboard, { userPages } from "@/components/User";
import { useSession } from "@/lib/auth-client";
import {
  demoApplications,
  demoClasses,
  demoForumPosts,
  demoTransactions,
  demoUsers,
} from "@/lib/dashboard-data";
import { featureClasses } from "@/lib/feature-classes";
import { getDashboardHref, normalizeDashboardRole } from "@/lib/dashboard-route";

const rolePages = {
  user: userPages,
  trainer: trainerPages,
  admin: adminPages,
};

function getStoredRole() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("forge-pulse-selected-role");
}

function getSectionTitle(role, section) {
  return rolePages[role].find(([key]) => key === section)?.[1] || "Overview";
}

function DashboardLayout({
  activeRole,
  activeSection,
  allowedSections,
  notice,
  children,
}) {
  return (
    <section className="min-h-screen bg-[#0b0d10] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-lg border border-white/10 bg-white/[0.04] p-5">
          <p className="text-sm font-black uppercase text-orange-400">
            {activeRole} Dashboard
          </p>
          <nav className="mt-5 space-y-2">
            {allowedSections.map(([key, label]) => (
              <Link
                key={key}
                href={`/dashboard/${activeRole}/${key}`}
                className={`block rounded-md px-3 py-2 text-sm font-bold transition ${
                  activeSection === key
                    ? "bg-orange-500 text-white"
                    : "text-white/65 hover:bg-white/10 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <Link
            href="/"
            className="mt-5 block rounded-md border border-white/10 px-3 py-2 text-sm font-bold text-white/65 transition hover:border-orange-400 hover:text-orange-300"
          >
            Back Home
          </Link>
        </aside>

        <main className="min-w-0">
          <div className="mb-6 rounded-lg border border-white/10 bg-white/[0.04] p-6">
            <p className="text-sm font-bold uppercase text-white/45">
              Private Area
            </p>
            <h1 className="mt-2 text-3xl font-black">
              {getSectionTitle(activeRole, activeSection)}
            </h1>
            {notice && (
              <p className="mt-4 rounded-md border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {notice}
              </p>
            )}
          </div>

          {children}
        </main>
      </div>
    </section>
  );
}

export default function DashboardShell({ role, section }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [storedRole] = useState(() => getStoredRole());
  const [users, setUsers] = useState(demoUsers);
  const [classes, setClasses] = useState(demoClasses);
  const [forumPosts, setForumPosts] = useState(demoForumPosts);
  const [applications, setApplications] = useState(demoApplications);
  const [favorites, setFavorites] = useState(featureClasses.slice(0, 3));
  const [application, setApplication] = useState({
    status: "Not Applied",
    feedback: "",
  });
  const [notice, setNotice] = useState("");

  const sessionRole = session?.user?.role;
  const activeRole = normalizeDashboardRole(
    sessionRole === "user"
      ? storedRole || sessionRole
      : sessionRole || storedRole || role,
  );
  const allowedSections = rolePages[activeRole];
  const activeSection = allowedSections.some(([key]) => key === section)
    ? section
    : "overview";

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (!session?.user) {
      router.replace(
        `/login?redirectTo=/dashboard/${normalizeDashboardRole(role)}/${section}`,
      );
      return;
    }

    if (normalizeDashboardRole(role) !== activeRole) {
      router.replace(getDashboardHref(activeRole));
    }
  }, [activeRole, isPending, role, router, section, session]);

  const bookedClasses = useMemo(() => classes.slice(0, 3), [classes]);
  const trainerClasses = useMemo(() => {
    const email = session?.user?.email || "marcus@example.com";
    return classes.filter((classItem) => classItem.trainerEmail === email);
  }, [classes, session]);

  const currentUserRecord = users.find(
    (user) => user.email === session?.user?.email,
  );
  const isBlocked = currentUserRecord?.status === "Blocked";
  const restrictAction = () => {
    if (!isBlocked) {
      return false;
    }

    setNotice("Action restricted by Admin");
    return true;
  };

  if (isPending) {
    return (
      <section className="min-h-screen bg-[#0b0d10] px-4 py-20 text-white">
        <div className="mx-auto max-w-7xl rounded-lg border border-white/10 bg-white/[0.04] p-6">
          Loading your dashboard...
        </div>
      </section>
    );
  }

  return (
    <DashboardLayout
      activeRole={activeRole}
      activeSection={activeSection}
      allowedSections={allowedSections}
      notice={notice}
    >
      {activeRole === "admin" ? (
        <AdminDashboard
          section={activeSection}
          currentUser={session?.user}
          users={users}
          setUsers={setUsers}
          applications={applications}
          setApplications={setApplications}
          classes={classes}
          setClasses={setClasses}
          forumPosts={forumPosts}
          setForumPosts={setForumPosts}
          transactions={demoTransactions}
        />
      ) : activeRole === "trainer" ? (
        <TrainerDashboard
          section={activeSection}
          currentUser={session?.user}
          trainerClasses={trainerClasses}
          setClasses={setClasses}
          forumPosts={forumPosts}
          setForumPosts={setForumPosts}
        />
      ) : (
        <UserDashboard
          section={activeSection}
          currentUser={session?.user}
          bookedClasses={bookedClasses}
          favorites={favorites}
          setFavorites={setFavorites}
          application={application}
          setApplication={setApplication}
          restrictAction={restrictAction}
        />
      )}
    </DashboardLayout>
  );
}
