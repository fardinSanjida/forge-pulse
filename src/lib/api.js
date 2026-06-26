export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function apiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  // In the browser, use a relative URL so the Next.js rewrite proxy forwards the
  // request through forge-pulse.vercel.app — this keeps cookies same-origin and
  // prevents browsers from blocking third-party cookies.
  if (typeof window !== "undefined") {
    return normalizedPath;
  }
  // Server-side rendering: call the Express server directly with an absolute URL.
  return new URL(normalizedPath, API_BASE_URL).toString();
}
