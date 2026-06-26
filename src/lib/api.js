export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function apiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  // In the browser, prefix with /server so Next.js rewrites proxy the request
  // to the Express server — this keeps cookies same-origin and avoids any
  // conflict with better-auth's /api/auth/* routes.
  if (typeof window !== "undefined") {
    return `/server${normalizedPath}`;
  }
  // Server-side rendering: call the Express server directly with an absolute URL.
  return new URL(normalizedPath, API_BASE_URL).toString();
}
