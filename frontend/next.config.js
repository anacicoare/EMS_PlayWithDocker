module.exports = {
  experimental: {
    appDir: true,  // enables app directory in Next.js 13
  },
  compress: true,  // enables gzip compression
  images: {
    domains: ['example.com'],  // allow optimized external images
  },
  webpack(config) {
    config.optimization.minimize = true;
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer({});
