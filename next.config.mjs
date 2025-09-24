/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["next-international", "international-types"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
