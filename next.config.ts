import type { NextConfig } from "next";

const CANONICAL_HOST = "www.khudulichsonkieu.vn";
const DEMO_HOSTS = ["demosonkieu.site", "www.demosonkieu.site"];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
    formats: ["image/webp"],
  },

  async redirects() {
    return [
      // 301 redirect: demosonkieu.site → khudulichsonkieu.vn (cả www và non-www)
      ...DEMO_HOSTS.map(host => ({
        source:      "/:path*",
        has:         [{ type: "host" as const, value: host }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent:   true,
      })),
      // 301 redirect: non-www khudulichsonkieu.vn → www
      {
        source:      "/:path*",
        has:         [{ type: "host" as const, value: "khudulichsonkieu.vn" }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent:   true,
      },
    ];
  },
};

export default nextConfig;
