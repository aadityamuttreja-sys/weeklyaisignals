/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    mdxRs: false,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "weeklyaisignals.com" }],
        destination: "https://www.weeklyaisignals.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
