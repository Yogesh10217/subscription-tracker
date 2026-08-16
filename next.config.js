/** @type {import('next').NextConfig} */
const isExport = process.env.GITHUB_ACTIONS === 'true' || process.env.NEXT_PUBLIC_EXPORT === 'true';

// Dynamically extract repository name from GITHUB_REPOSITORY env var (e.g. "yogesh10217/SubPulse" -> "SubPulse")
const rawRepo = process.env.GITHUB_REPOSITORY ? process.env.GITHUB_REPOSITORY.split('/')[1] : '';
const repoName = rawRepo || process.env.NEXT_PUBLIC_REPO_NAME || 'SubPulse';
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
