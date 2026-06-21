"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import backgroundImage from "../../../asset/footer-background.jpg";
import loginImage from "../../../asset/image11.jpg";
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

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isCredentialLoading, setIsCredentialLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const redirectAfterLogin = (url = getIntendedRoute()) => {
    router.push(url);
    router.refresh();
  };

  const handleCredentialLogin = async (event) => {
    event.preventDefault();
    setError("");
    setIsCredentialLoading(true);

    try {
      const { signIn } = await import("@/lib/auth-client");
      const intendedRoute = getIntendedRoute();
      const response = await signIn.email({
        email,
        password,
        callbackURL: intendedRoute,
      });

      if (response?.error) {
        setError(response.error.message || "Unable to sign in.");
        return;
      }

      redirectAfterLogin(response?.data?.url || intendedRoute);
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setIsCredentialLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setIsGoogleLoading(true);

    try {
      const { signIn } = await import("@/lib/auth-client");
      const intendedRoute = getIntendedRoute();
      const response = await signIn.social({
        provider: "google",
        callbackURL: intendedRoute,
      });

      if (response?.error) {
        setError(response.error.message || "Unable to continue with Google.");
        return;
      }

      if (response?.data?.url) {
        window.location.href = response.data.url;
        return;
      }

      redirectAfterLogin();
    } catch {
      setError("Unable to continue with Google. Please try again.");
    } finally {
      setIsGoogleLoading(false);
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

      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-10 lg:grid-cols-[0.86fr_1.14fr]">
        <div className="mx-auto w-full max-w-97.5 lg:ml-auto">
          <Link href="/" className="mb-14 inline-flex items-center gap-3">
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
              Nice to see you again
            </h1>
            <p className="mt-2 text-sm font-medium text-white/45">
              Enter credentials to sign in to your account
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isCredentialLoading}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-full border border-white/55 px-5 py-3 text-sm font-semibold text-white/80 transition hover:border-white hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="text-lg font-bold text-[#4285f4]">G</span>
            {isGoogleLoading ? "Connecting..." : "Continue with Google"}
          </button>

          <div className="my-7 h-px bg-white/55" />

          <form className="space-y-5" onSubmit={handleCredentialLogin}>
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
                Password
              </span>
              <input
                type="password"
                name="password"
                placeholder="********"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="mt-2 w-full rounded-md border border-white/20 bg-white/95 px-4 py-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-[#ff5b18] focus:ring-2 focus:ring-[#ff5b18]/30"
              />
            </label>

            {error && (
              <p className="rounded-md border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isCredentialLoading || isGoogleLoading}
              className="w-full rounded-full bg-[#ff5b18] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#ff7338] focus:outline-none focus:ring-2 focus:ring-[#ff5b18]/60 focus:ring-offset-2 focus:ring-offset-[#030d0d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCredentialLoading ? "Signing In..." : "Log In"}
            </button>
          </form>

          <p className="mt-6 text-sm font-medium text-white/70">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#ff5b18] transition hover:text-[#ff8752]"
            >
             Register
            </Link>
          </p>
        </div>

        <div className="relative min-h-105 overflow-hidden border-t-8 border-b-8 border-orange-500 rounded-4xl shadow-2xl shadow-black/40 sm:min-h-75 lg:min-h-[calc(100vh-5rem)]">
          <Image
            src={loginImage}
            alt="Smiling trainer in a gym"
            fill
            sizes="(max-width: 1024px) 100vw, 56vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}
