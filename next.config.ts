import type { NextConfig } from "next";
import nextIntl from "next-intl/plugin";

const withNextIntl = nextIntl();

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: __dirname,
};

export default withNextIntl(nextConfig);
