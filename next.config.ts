import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images from any domain.
    // This is a flexible but less secure option. For a production application,
    // it's better to specify the exact domains you expect to load images from.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;