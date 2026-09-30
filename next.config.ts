import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "images.unsplash.com",
      "plus.unsplash.com",
      "via.placeholder.com",
      "picsum.photos",
      "api.escuelajs.co",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/category/:path*",
        destination: "/categories/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
