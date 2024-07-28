/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "edenartlab-prod-data.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "edenartlab-stage-data.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "edenartlab-stage-data.s3.amazonaws.com"
      },
      {
        protocol: "https",
        hostname: "olxfpizvsxntekjdsopx.supabase.co"
      },
    ],
  },
};

module.exports = nextConfig;
