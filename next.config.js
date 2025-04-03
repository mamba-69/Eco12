/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: [
      "placehold.co",
      "res.cloudinary.com",
      "images.unsplash.com",
      "i.postimg.cc",
      "commondatastorage.googleapis.com",
    ],
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "react-icons"],
  },
  output: "standalone",
};

module.exports = nextConfig;
