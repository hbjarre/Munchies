/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['work-test-web-2024-eze6j4scpq-lz.a.run.app'], // Allow images from our API domain
    unoptimized: true, // Required for static export
  },
  output: 'standalone', // Optimized for production deployments
};

module.exports = nextConfig; 