import type { NextConfig } from "next";
import nextIntl from "next-intl/plugin";

const withNextIntl = nextIntl();

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

};

export default withNextIntl(nextConfig);
