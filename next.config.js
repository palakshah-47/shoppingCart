/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    esmExternals: false,
  },
  images: {
    domains: [
      'm.media-amazon.com',
      'googleapis.com',
      'lh3.googleusercontent.com',
      'cdn.dummyjson.com',
    ],
  },
};

module.exports = nextConfig;
