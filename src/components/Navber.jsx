"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import logo from "../../asset/logo.png";
import { signOut, useSession } from "@/lib/auth-client";
import { getDashboardHref, normalizeDashboardRole } from "@/lib/dashboard-route";

const fallbackProfileImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' rx='48' fill='%23fff3d1'/%3E%3Ccircle cx='48' cy='37' r='18' fill='%23ff7a00'/%3E%3Cpath d='M20 84c5-19 18-29 28-29s23 10 28 29' fill='%238a5a2b'/%3E%3C/svg%3E";

const baseLinks = [
  { label: "Home", href: "/" },
  { label: "All Classes", href: "/classes" },
  { label: "Community Forum", href: "/community" },
];

function Navber() {
  const router = useRouter();
  const { data: session, refetch } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedRole] = useState(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem("forge-pulse-selected-role");
  });
  const currentUser = session?.user;
  const profileImage = currentUser?.image || fallbackProfileImage;
  const profileName = currentUser?.name || currentUser?.email || "User";
  const dashboardRole =
    normalizeDashboardRole(currentUser?.role) === "user"
      ? selectedRole || currentUser?.role
      : currentUser?.role;

  const navigationLinks = useMemo(() => {
    if (!currentUser) {
      return baseLinks;
    }

    return [
      ...baseLinks,
      {
        label: "Dashboard",
        href: getDashboardHref(dashboardRole),
      },
    ];
  }, [currentUser, dashboardRole]);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    await signOut();
    await refetch();
    closeMenu();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-orange-300/50 bg-neutral-950/90 text-white shadow-lg shadow-black/10 backdrop-blur-xl">
      <header className=" flex h-20 w-full items-center justify-between px-1 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3"
          onClick={closeMenu}
          aria-label="Forge Pulse home"
        >
          <span className="relative flex h-20 w-50 shrink-0 overflow-hidden rounded-full">
            <Image
              src={logo}
              alt="Forge Pulse logo"
              sizes="full"
              className=" object-left"
              priority
            />
          </span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {navigationLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-md px-4 py-2 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-orange-300/80"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          {currentUser ? (
            <>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 py-1 pl-1 pr-3 text-sm font-medium text-white/85">
                <span className="relative h-9 w-9 overflow-hidden rounded-full bg-orange-100">
                  <Image
                    src={profileImage}
                    alt={`${profileName} profile picture`}
                    fill
                    sizes="36px"
                    className="object-cover"
                    unoptimized
                  />
                </span>
                <span>{profileName}</span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              Login
            </Link>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/10 text-white transition hover:bg-white/10 lg:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          <span className="sr-only">Menu</span>
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18 18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </header>

      {isMenuOpen && (
        <div className="border-t border-orange-300/50 bg-neutral-950 px-4 pb-5 pt-3 lg:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigationLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={closeMenu}
                  className="block rounded-md px-3 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mx-auto mt-4 flex max-w-7xl items-center justify-end gap-3 border-t border-orange-300/50 pt-4">
            {currentUser ? (
              <>
                <div
                  className="mr-auto flex min-w-0 items-center gap-3"
                >
                  <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-orange-100">
                    <Image
                      src={profileImage}
                      alt={`${profileName} profile picture`}
                      fill
                      sizes="44px"
                      className="object-cover"
                      unoptimized
                    />
                  </span>
                  <span className="block min-w-0 truncate text-sm font-semibold text-white">
                    {profileName}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="shrink-0 rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={closeMenu}
                className="shrink-0 rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navber;
