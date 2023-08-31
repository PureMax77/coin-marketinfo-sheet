/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/coinone/:path*",
        destination: "https://api.coinone.co.kr/public/v2/:path*",
      },
      {
        source: "/api/mexc/:path*",
        destination: "https://api.mexc.com/api/v3/:path*",
      },
      {
        source: "/api/upbit/:path*",
        destination: "https://api.upbit.com/v1/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
