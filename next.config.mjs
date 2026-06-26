/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.1.190"],

  async rewrites() {
    const serverUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    return [
      {
        // Forward /api/* to the Express server.
        // Next.js filesystem routes (app/api/auth/[...all]) take priority,
        // so better-auth's /api/auth/* is never touched by this rewrite.
        source: "/api/:path*",
        destination: `${serverUrl}/api/:path*`,
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;