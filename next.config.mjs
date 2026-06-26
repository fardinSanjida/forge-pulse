/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.1.190"],

  async rewrites() {
    const serverUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    return [
      {
        // Proxy Express API calls through /server/* so they never conflict
        // with better-auth's /api/auth/* filesystem routes.
        source: "/server/:path*",
        destination: `${serverUrl}/:path*`,
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