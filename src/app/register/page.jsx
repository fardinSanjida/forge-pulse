"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "../../../asset/footer-background.jpg";
import registerImage from "../../../asset/image10.jpg";
import logo from "../../../asset/logo.png";
import { apiUrl } from "@/lib/api";
import { uploadToImgbb } from "@/lib/imgbb";

function getIntendedRoute() {
  if (typeof window === "undefined") return "/";
  const searchParams = new URLSearchParams(window.location.search);
  const route =
    searchParams.get("redirectTo") ||
    searchParams.get("callbackUrl") ||
    searchParams.get("callbackURL") ||
    "/";
  if (!route.startsWith("/") || route.startsWith("//") || route.startsWith("/login") || route.startsWith("/register")) {
    return "/";
  }
  return route;
}

function isValidPassword(password) {
  return password.length >= 6 && /[A-Z]/.test(password) && /[a-z]/.test(password);
}

export default function RegisterPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");

    if (!isValidPassword(password)) {
      setError("Password must be at least 6 characters and include uppercase and lowercase letters.");
      return;
    }

    setIsLoading(true);

    try {
      // Upload profile photo first if selected
      let imageUrl = "";
      if (imageFile) {
        try {
          imageUrl = await uploadToImgbb(imageFile);
        } catch (uploadErr) {
          setError(uploadErr.message);
          setIsLoading(false);
          return;
        }
      }

      const { signUp } = await import("@/lib/auth-client");
      const intendedRoute = getIntendedRoute();
      const response = await signUp.email({
        name,
        email,
        image: imageUrl || undefined,
        password,
        callbackURL: intendedRoute,
      });

      if (response?.error) {
        setError(response.error.message || "Unable to create your account.");
        return;
      }

      try {
        await fetch(apiUrl("/api/auth/issue-cookie"), {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
      } catch { /* non-fatal */ }

      toast.success("Registration completed successfully!");
      setTimeout(() => router.push(response?.data?.url || intendedRoute), 1400);
    } catch {
      setError("Unable to create your account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#030d0d] px-5 py-10 text-white sm:px-8 lg:px-12">
      <div className="absolute inset-0 -z-20 opacity-50">
        <Image src={backgroundImage} alt="" fill sizes="100vw" className="object-cover" priority />
      </div>
      <div className="absolute inset-0 -z-10 bg-[#031010]/85" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(255,87,24,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,87,24,0.24),transparent_32%)]" />

      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.14fr_0.86fr]">
        <div className="relative min-h-[420px] overflow-hidden rounded-4xl border-b-8 border-t-8 border-orange-500 shadow-2xl shadow-black/40 sm:min-h-[560px] lg:min-h-[calc(100vh-5rem)]">
          <Image src={registerImage} alt="Fitness member training" fill sizes="(max-width: 1024px) 100vw, 56vw" className="object-cover" priority />
        </div>

        <div className="mx-auto w-full max-w-[390px] lg:mr-auto">
          <Link href="/" className="mb-10 inline-flex items-center gap-3">
            <span className="relative block h-12 w-40">
              <Image src={logo} alt="Forge Pulse logo" fill sizes="160px" className="object-contain object-left" priority />
            </span>
          </Link>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
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
                onChange={(e) => setName(e.target.value)}
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
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 w-full rounded-md border border-white/20 bg-white/95 px-4 py-3 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-[#ff5b18] focus:ring-2 focus:ring-[#ff5b18]/30"
              />
            </label>

            {/* Profile Photo */}
            <div>
              <span className="text-sm font-semibold text-white/75">
                Profile Photo <span className="font-normal text-white/40">(optional)</span>
              </span>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white/10">
                  {imagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-white/30">
                      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="4" /><path d="M4 20a8 8 0 0 1 16 0" />
                      </svg>
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="sr-only" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 rounded-md border border-white/20 bg-white/10 px-4 py-3 text-left text-sm text-white/60 transition hover:border-[#ff5b18]/60 hover:text-white"
                >
                  {imageFile ? imageFile.name : "Choose photo…"}
                </button>
              </div>
            </div>

            <div>
              <label className="block">
                <span className="text-sm font-semibold text-white/75">Password</span>
                <div className="relative mt-2">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
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
              <span className="mt-2 block text-xs text-white/45">
                Minimum 6 characters, one uppercase and one lowercase letter.
              </span>
            </div>

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
            <Link href="/login" className="font-semibold text-[#ff5b18] transition hover:text-[#ff8752]">
              Log In
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={1400} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss={false} pauseOnHover theme="dark" />
    </section>
  );
}
