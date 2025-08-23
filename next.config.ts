/** @type {import('next').NextConfig} */
import type { NextConfig } from 'next';

const config: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // experimental: {
  //   allowedDevOrigins: [
  //       "https://6000-firebase-studio-1755797795778.cluster-cd3bsnf6r5bemwki2bxljme5as.cloudworkstations.dev",
  //   ],
  // },
};

export default config;
