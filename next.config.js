/** @type {import('next').NextConfig} */
const isExport = process.env.GITHUB_ACTIONS === 'true' || process.env.NEXT_PUBLIC_EXPORT === 'true';

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  ...(isExport ? { output: 'export' } : {}),
};

export default nextConfig;
