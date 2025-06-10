/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'cdn.dummyjson.com',
      },
    ],
    domains: [
      'm.media-amazon.com',
      'googleapis.com',
      'lh3.googleusercontent.com',
      'cdn.dummyjson.com',
    ],
  },
};

module.exports = nextConfig;
