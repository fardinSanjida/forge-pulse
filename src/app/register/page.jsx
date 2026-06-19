"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "../../../asset/footer-background.jpg";
import registerImage from "../../../asset/image10.jpg";
import logo from "../../../asset/logo.png";

function getIntendedRoute() {
  if (typeof window === "undefined") {
    return "/";
  }

  const searchParams = new URLSearchParams(window.location.search);
  const route =
    searchParams.get("redirectTo") ||
    searchParams.get("callbackUrl") ||
    searchParams.get("callbackURL") ||
    "/";

  if (!route.startsWith("/") || route.startsWith("//")) {
    return "/home";
  }

  return route;
}

function isValidPassword(password) {
  return (
    password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password)
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");

    if (!isValidPassword(password)) {
      setError(
        "Password must be at least 6 characters and include uppercase and lowercase letters.",
      );
      return;
    }

    setIsLoading(true);

    try {
      const { signUp } = await import("@/lib/auth-client");
      const intendedRoute = getIntendedRoute();
      const response = await signUp.email({
        name,
        email,
        image,
        password,
        callbackURL: intendedRoute,
      });

      if (response?.error) {
        setError(response.error.message || "Unable to create your account.");
        return;
      }

      toast.success("Registration completed successfully!");

      setTimeout(() => {
        router.push(response?.data?.url || intendedRoute);
        router.refresh();
      }, 1400);
    } catch {
      setError("Unable to create your account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#030d0d] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="absolute inset-0 -z-20 opacity-50">
        <Image
          src={backgroundImage}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-[#031010]/85" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,87,24,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,87,24,0.24),transparent_32%)]" />

      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.14fr_0.86fr]">
        <div className="relative min-h-[420px] overflow-hidden rounded-4xl border-b-8 border-t-8 border-orange-500 shadow-2xl shadow-black/40 sm:min-h-[560px] lg:min-h-[calc(100vh-5rem)]">
          <Image
            src={registerImage}
            alt="Fitness member training"
            fill
            sizes="(max-width: 1024px) 100vw, 56vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="mx-auto w-full max-w-[390px] lg:mr-auto">
          <Link href="/" className="mb-10 inline-flex items-center gap-3">
            <span className="relative block h-12 w-40">
              <Image
                src={logo}
                alt="Forge Pulse logo"
                fill
                sizes="160px"
                className="object-contain object-left"
                priority
              />
            </span>
          </Link>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Create your account
            </h1>
            <p className="mt-2 text-sm font-medium text-white/45">
              All new accounts register as standard users by default.
            </p>
          </div>

          <form className="mt-7 space-y-5" onSubmit={handleRegister}>
            <label className="block">
              <span className="text-sm font-semibold text-white/75">Name</span>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="mt-2 w-full rounded-md border border-white/20 bg-white/95 px-4 py-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-[#ff5b18] focus:ring-2 focus:ring-[#ff5b18]/30"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-white/75">Email</span>
              <input
                type="email"
                name="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="mt-2 w-full rounded-md border border-white/20 bg-white/95 px-4 py-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-[#ff5b18] focus:ring-2 focus:ring-[#ff5b18]/30"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-white/75">
                Image URL
              </span>
              <input
                type="url"
                name="image"
                placeholder="https://example.com/profile.jpg"
                value={image}
                onChange={(event) => setImage(event.target.value)}
                required
                className="mt-2 w-full rounded-md border border-white/20 bg-white/95 px-4 py-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-[#ff5b18] focus:ring-2 focus:ring-[#ff5b18]/30"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-white/75">
                Password
              </span>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                minLength={6}
                pattern="(?=.*[a-z])(?=.*[A-Z]).{6,}"
                className="mt-2 w-full rounded-md border border-white/20 bg-white/95 px-4 py-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-[#ff5b18] focus:ring-2 focus:ring-[#ff5b18]/30"
              />
              <span className="mt-2 block text-xs text-white/45">
                Minimum 6 characters, one uppercase letter, and one lowercase
                letter.
              </span>
            </label>

            {error && (
              <p className="rounded-md border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-full bg-[#ff5b18] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#ff7338] focus:outline-none focus:ring-2 focus:ring-[#ff5b18]/60 focus:ring-offset-2 focus:ring-offset-[#030d0d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-sm font-medium text-white/70">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#ff5b18] transition hover:text-[#ff8752]"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={1400}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss={false}
        pauseOnHover
        theme="dark"
      />
    </section>
  );
}
