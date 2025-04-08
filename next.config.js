/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: [
      "placehold.co",
      "images.unsplash.com",
      "i.postimg.cc",
      "commondatastorage.googleapis.com",
      "cloud.appwrite.io",
    ],
    unoptimized: true,
  },
  experimental: {},
  webpack: (config, { isServer, dev }) => {
    // Fallbacks for browser globals
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      module: false,
      path: false,
      os: false,
      crypto: false,
    };

    // Complete externalization of framer-motion in SSR
    if (isServer) {
      if (!Array.isArray(config.externals)) {
        config.externals = [];
      }

      // Add framer-motion to externals
      config.externals.push("framer-motion");
    }

    return config;
  },
  // Removed standalone output
};

export default nextConfig;
