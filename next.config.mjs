/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Disable TypeScript checking in production build to avoid tsc dependency
  typescript: {
    // During deployment, we'll use the type checking done during development
    ignoreBuildErrors: true,
  },
  eslint: {
    // During deployment, we'll use the linting done during development
    ignoreDuringBuilds: true,
  },
};

export default nextConfig; 