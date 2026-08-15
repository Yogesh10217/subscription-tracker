/** @type {import('next').NextConfig} */
const isStaticExport = process.env.NEXT_PUBLIC_EXPORT === 'true';

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
  ...(isStaticExport ? { output: 'export' } : {}),
};

export default nextConfig;
