/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // The bot's menu button still points to /auth/confirm (removed auth flow); send it to the questionnaire list
  async redirects() {
    return [{ source: '/auth/:path*', destination: '/', permanent: false }];
  },
  // Stabilize dev server HMR to prevent CSS from disappearing
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
