import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dpdyqjheobadogaosupj.supabase.co',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    // Use custom loader to bypass private IP restriction
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
  },
};

export default nextConfig;
