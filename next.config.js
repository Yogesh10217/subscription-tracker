/** @type {import('next').NextConfig} */
const isExport = process.env.GITHUB_ACTIONS === 'true' || process.env.NEXT_PUBLIC_EXPORT === 'true';
const repoName = 'subscription-tracker';
const basePath = isExport ? `/${repoName}` : '';

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
  ...(isExport
    ? {
        output: 'export',
        basePath: basePath,
        assetPrefix: `${basePath}/`,
      }
    : {}),
};

export default nextConfig;
