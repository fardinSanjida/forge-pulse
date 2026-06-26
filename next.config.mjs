/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.1.190"],

  async rewrites() {
    const serverUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    return [
      {
        // Forward all /api/* to the Express server EXCEPT /api/auth/* (handled by better-auth)
        source: "/api/:path((?!auth).*)",
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