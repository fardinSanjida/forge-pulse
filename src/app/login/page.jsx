"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Description, Label, Radio, RadioGroup } from "@heroui/react";
import backgroundImage from "../../../asset/footer-background.jpg";
import loginImage from "../../../asset/image11.jpg";
import logo from "../../../asset/logo.png";
import { apiUrl } from "@/lib/api";

function getIntendedRoute() {
  if (typeof window === "undefined") {
    return "/";
  }

  const searchParams = new URLSearchParams(window.location.search);
  const route =
    searchParams.get("redirectTo") ||
    searchParams.get("callbackUrl") ||
    searchParams.get("callbackURL") ||
    "/dashboard";

  if (
    !route.startsWith("/") ||
    route.startsWith("//") ||
    route.startsWith("/login")
  ) {
    return "/dashboard";
  }

  return route;
}

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isCredentialLoading, setIsCredentialLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const redirectAfterLogin = (url = getIntendedRoute()) => {
    const safeUrl = url.startsWith("/login") ? getIntendedRoute() : url;
    router.push(safeUrl);
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
        role,
        callbackURL: intendedRoute,
      });

      if (response?.error) {
        setError(response.error.message || "Unable to sign in.");
        return;
      }

      // attempt to set HttpOnly JWT cookie on server for this user
      try {
        await fetch(apiUrl("/api/user-token"), {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
      } catch (cookieErr) {
        // non-fatal: continue even if cookie issuance fails
        console.error("Failed to set auth cookie:", cookieErr);
      }

      toast.success("Login completed successfully!");
      setTimeout(() => {
        redirectAfterLogin(response?.data?.url || intendedRoute);
      }, 1400);
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
      const { getDashboardHref } = await import("@/lib/dashboard-route");
      const demo = credentials[role] ?? credentials.user;

      const res = await signIn.email({ email: demo.email, password: demo.password });

      if (res?.error) {
        setError("Demo login failed. Please try again.");
        return;
      }

      // Issue JWT cookie with the selected role
      try {
        await fetch(apiUrl("/api/user-token"), {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: demo.email, role }),
        });
      } catch { /* non-fatal */ }

      toast.success("Login completed successfully!");
      setTimeout(() => router.push(getDashboardHref(role)), 1400);
    } catch {
      setError("Unable to continue. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const credentials = {
    user: {
      email: "user@example.com",
      password: "User1234",
    },
    trainer: {
      email: "trainer@example.com",
      password: "Trainer1234",
    },
    admin: {
      email: "admin@gmail.com",
      password: "Admin1234",
    },
  };

  const handleRoleChange = (value) => {
    setRole(value);

    if (credentials[value]) {
      setEmail(credentials[value].email);
      setPassword(credentials[value].password);
    }
  };

  return (
    <>
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

            <div className="flex flex-col gap-4 mt-6">
              <RadioGroup
                defaultValue="user"
                name="plan-orientation"
                onChange={handleRoleChange}
                orientation="horizontal"
              >
                <Radio value="user">
                  <Radio.Content>
                    <Radio.Control>
                      <Radio.Indicator />
                    </Radio.Control>
                    <p className="border-2 border-orange-500/50 px-5 py-2 rounded-lg gap-2 ">
                      User
                    </p>
                  </Radio.Content>
                </Radio>
                <Radio value="trainer">
                  <Radio.Content>
                    <Radio.Control>
                      <Radio.Indicator />
                    </Radio.Control>
                    <p className="border-2 border-orange-500/50 px-5 py-2 rounded-lg gap-2">
                      Trainer
                    </p>
                  </Radio.Content>
                </Radio>
                <Radio value="admin">
                  <Radio.Content>
                    <Radio.Control>
                      <Radio.Indicator />
                    </Radio.Control>
                    <p className="border-2 border-orange-500/50 px-5 py-2 rounded-lg gap-2">
                      Admin
                    </p>
                  </Radio.Content>
                </Radio>
              </RadioGroup>
            </div>

            <div className="my-7 h-px bg-white/55" />

            <form className="space-y-5" onSubmit={handleCredentialLogin}>
              <label className="block">
                <span className="text-sm font-semibold text-white/75">
                  Email
                </span>
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
                <div className="relative mt-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="********"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    className="w-full rounded-md border border-white/20 bg-white/95 px-4 py-3 pr-11 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-[#ff5b18] focus:ring-2 focus:ring-[#ff5b18]/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-3 flex items-center text-neutral-400 hover:text-neutral-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
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
    </>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}
