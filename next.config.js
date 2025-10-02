/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  outputFileTracingRoot: '/app',
  images: {
    domains: ['localhost'],
    unoptimized: true,
  },
}

export default nextConfig
