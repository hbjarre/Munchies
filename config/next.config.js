/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'work-test-web-2024-eze6j4scpq-lz.a.run.app',
        pathname: '/images/**',
      }
    ],
  },
  experimental: {
    esmExternals: true
  },
  output: 'standalone', // Optimized for production deployments
};

module.exports = config; 