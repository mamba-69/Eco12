/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      "placehold.co",
      "res.cloudinary.com",
      "images.unsplash.com",
      "i.postimg.cc",
      "commondatastorage.googleapis.com",
    ],
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ["framer-motion", "react-icons"],
  },
  output: "standalone",
};

module.exports = nextConfig;
