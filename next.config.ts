import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google Profile Pictures
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
