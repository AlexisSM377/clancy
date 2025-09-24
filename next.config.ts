import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ishopmx.vtexassets.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
