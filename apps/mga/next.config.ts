import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@mikala/ui', '@mikala/lib'],
};

export default nextConfig;
