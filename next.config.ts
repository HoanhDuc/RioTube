import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "i.ytimg.com",
      "yt3.ggpht.com",
      "storage.googleapis.com",
    ],
  },
  env: {
    GOOGLE_ID:
      "431960230379-e2t2dscqp1bo1ef9hlab94i2t75g0vsm.apps.googleusercontent.com",
    GOOGLE_SECRET: "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",
    NEXTAUTH_URL: "http://localhost:3000",
    NEXTAUTH_SECRET: "UZKbzPSxQo1FmATWhwwi7Ztcp6/pfCCMLi4MoVjiuO0=",
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    serverComponentsExternalPackages: ["mongoose"],
  },
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    return config;
  },
};

export default nextConfig;
