export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";


export function apiUrl(path) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, API_BASE_URL).toString();
}
