/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "logo.clearbit.com",
      },
    ],
  },

  // Enable strict React behavior during development
  reactStrictMode: true,

  // Keep Next.js powered by its default optimizations
  poweredByHeader: false,
};

module.exports = nextConfig;
