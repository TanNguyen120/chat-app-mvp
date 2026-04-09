import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    // 1. Tell Next.js it's okay to render SVGs from the internet
    dangerouslyAllowSVG: true,
    // 2. Add a basic security policy for those SVGs
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google Profile Pictures
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/7.x/**', // This allows all version 7 avatars
      },
    ],
  },
};

export default nextConfig;
