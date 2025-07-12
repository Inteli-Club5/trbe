/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable static export to allow client-side features
  output: undefined,
  trailingSlash: false,
  // Disable telemetry
  telemetry: false,
}

export default nextConfig
