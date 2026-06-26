"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

const dashboardMenuItems = {
  user: [
  {
    label: "Overview",
    section: "overview",
    icon: (
      <path d="M4 10.5 12 4l8 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-8Z" />
    ),
  },
  {
    label: "Booked Classes",
    section: "booked-classes",
    icon: (
      <>
        <path d="M7 3v4M17 3v4M4 9h16" />
        <rect width="16" height="17" x="4" y="5" rx="2" />
        <path d="m9 14 2 2 4-4" />
      </>
    ),
  },
  {
    label: "Favorite Classes",
    section: "favorite-classes",
    icon: (
      <path d="M20.4 5.6a5.2 5.2 0 0 0-7.4 0L12 6.7l-1-1.1a5.2 5.2 0 1 0-7.4 7.4l8.4 8.2 8.4-8.2a5.2 5.2 0 0 0 0-7.4Z" />
    ),
  },
  {
    label: "Apply as Trainer",
    section: "apply-trainer",
    icon: (
      <>
        <circle cx="12" cy="7" r="4" />
        <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
      </>
    ),
  },
  {
    label: "Payments",
    section: "payments",
    icon: (
      <>
        <rect width="18" height="14" x="3" y="5" rx="2" />
        <path d="M3 10h18M7 15h4" />
      </>
    ),
  },
  {
    label: "Profile Settings",
    section: "profile-settings",
    icon: (
      <>
        <path d="M12 3 5 7v6c0 4 3 7 7 8 4-1 7-4 7-8V7l-7-4Z" />
        <path d="M9.5 12a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0ZM8 18a4 4 0 0 1 8 0" />
      </>
    ),
  },
  ],
  trainer: [
    {
      label: "Overview",
      section: "overview",
      icon: (
        <path d="M4 10.5 12 4l8 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-8Z" />
      ),
    },
    {
      label: "Add Classes",
      section: "add-classes",
      icon: (
        <>
          <rect width="16" height="16" x="4" y="4" rx="2" />
          <path d="M12 8v8M8 12h8" />
        </>
      ),
    },
    {
      label: "My Classes",
      section: "my-classes",
      icon: (
        <>
          <path d="M7 3v4M17 3v4M4 9h16" />
          <rect width="16" height="17" x="4" y="5" rx="2" />
        </>
      ),
    },
    {
      label: "Add Forum Post",
      section: "add-forum-post",
      icon: (
        <>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </>
      ),
    },
    {
      label: "My Forum Post",
      section: "my-forum-post",
      icon: (
        <>
          <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
          <path d="M8 9h8M8 13h5" />
        </>
      ),
    },
    {
      label: "Profile Settings",
      section: "profile-settings",
      icon: (
        <>
          <path d="M12 3 5 7v6c0 4 3 7 7 8 4-1 7-4 7-8V7l-7-4Z" />
          <path d="M9.5 12a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0ZM8 18a4 4 0 0 1 8 0" />
        </>
      ),
    },
  ],
  admin: [
    {
      label: "Overview",
      section: "overview",
      icon: (
        <path d="M4 10.5 12 4l8 6.5v8a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-8Z" />
      ),
    },
    {
      label: "Users",
      section: "users",
      icon: (
        <>
          <circle cx="9" cy="7" r="4" />
          <path d="M3 21a6 6 0 0 1 12 0M17 11a4 4 0 0 1 0 8" />
        </>
      ),
    },
    {
      label: "Applied Trainers",
      section: "applied-trainers",
      icon: (
        <>
          <circle cx="12" cy="7" r="4" />
          <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
          <path d="m16 11 2 2 4-4" />
        </>
      ),
    },
    {
      label: "Manage Trainers",
      section: "manage-trainers",
      icon: (
        <>
          <circle cx="12" cy="7" r="4" />
          <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
          <path d="M17 13l-4 4-2-2" />
        </>
      ),
    },
    {
      label: "Classes",
      section: "classes",
      icon: (
        <>
          <path d="M7 3v4M17 3v4M4 9h16" />
          <rect width="16" height="17" x="4" y="5" rx="2" />
        </>
      ),
    },
    {
      label: "Add Forum Post",
      section: "add-forum-post",
      icon: (
        <>
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </>
      ),
    },
    {
      label: "Forum Posts",
      section: "forum-posts",
      icon: (
        <>
          <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
          <path d="M8 9h8M8 13h5" />
        </>
      ),
    },
    {
      label: "Transactions",
      section: "payments",
      icon: (
        <>
          <rect width="18" height="14" x="3" y="5" rx="2" />
          <path d="M3 10h18M7 15h4" />
        </>
      ),
    },
    {
      label: "Profile Settings",
      section: "profile-settings",
      icon: (
        <>
          <path d="M12 3 5 7v6c0 4 3 7 7 8 4-1 7-4 7-8V7l-7-4Z" />
          <path d="M9.5 12a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0ZM8 18a4 4 0 0 1 8 0" />
        </>
      ),
    },
  ],
};

function MenuIcon({ children }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      {children}
    </svg>
  );
}

function DashboardSidebar({
  activeSection = "overview",
  basePath = "/dashboard/user",
  items,
  role = "user",
  label = "dashboard",
}) {
  const router = useRouter();
  const pathname = usePathname();
  const menuItems = items || dashboardMenuItems[role] || dashboardMenuItems.user;

  const getHref = (section) =>
    `${basePath}/${section}`;

  const activePathSection = pathname?.startsWith(basePath)
    ? pathname.slice(basePath.length).split("/").filter(Boolean)[0]
    : null;
  const currentSection = activePathSection || activeSection;
  const activeItem =
    menuItems.find((item) => item.section === currentSection) || menuItems[0];

  const handleLogout = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <aside className="w-full lg:w-72 lg:shrink-0">
      <div className="lg:hidden">
        <select
          id={`${role}-dashboard-menu`}
          value={activeItem.section}
          onChange={(event) => {
            router.push(getHref(event.target.value));
          }}
          className="h-12 w-full rounded-md border border-white/10 bg-[#0b1217] px-4 text-sm font-semibold text-white outline-none transition focus:border-orange-400"
        >
          {menuItems.map((item) => (
            <option key={item.section} value={item.section}>
              {item.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-3 h-12 w-full rounded-md border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white/75 transition hover:bg-white/[0.08] hover:text-white"
        >
          Logout
        </button>
      </div>

      <div className="hidden min-h-[calc(100vh-5rem)] flex-col border-r border-white/10 bg-[#071016] px-5 py-8 text-white shadow-2xl shadow-black/20 lg:flex">
        {/* <Link href="/" className="mb-10 flex items-center gap-3" aria-label="Forge Pulse home">
          <span className="relative h-20 w-60 shrink-0 overflow-hidden ">
            <Image src={logo} alt="" className="object-contain" />
          </span>
        </Link> */}

        <nav aria-label={`${label} navigation`} className="flex-1">
          <ul className="space-y-4">
            {menuItems.map((item) => {
              const isActive = item.section === activeItem.section;

              return (
                <li key={item.section}>
                  <Link
                    href={getHref(item.section)}
                    className={`flex min-h-14 items-center gap-4 rounded-md px-5 py-3 text-base font-semibold transition ${
                      isActive
                        ? "bg-orange-400/15 text-orange-400"
                        : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <MenuIcon>{item.icon}</MenuIcon>
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-orange-500 px-2 text-sm font-black text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 flex min-h-14 w-full items-center gap-4 rounded-md px-5 py-3 text-base font-semibold text-white/60 transition hover:bg-white/[0.04] hover:text-white"
        >
          <MenuIcon>
            <path d="M10 17l5-5-5-5" />
            <path d="M15 12H3" />
            <path d="M21 3v18" />
          </MenuIcon>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
