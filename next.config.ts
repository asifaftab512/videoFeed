// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   reactStrictMode: true,
// };

// export default nextConfig;



import type { NextConfig } from "next";

// module.exports = {
//   output: 'standalone',
// };

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // reactStrictMode: true,
  output: "standalone",

  images: {
    remotePatterns: [
      // Local uploads (during dev)
      // {
      //   protocol: "http",
      //   hostname: "localhost",
      //   port: "3000",
      //   pathname: "/uploads/**",
      // },
      // S3 bucket (for production thumbnails)
      {
        protocol: "https",
        hostname: "videoshare-uploads.s3.amazonaws.com",
        pathname: "/**",
      },
      // Azure Blob storage
      {
        protocol: "https",
        hostname: "asifvideoshare.blob.core.windows.net",
        pathname: "/**",
      },
      // Placehold.co (for fallback thumbnails)
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
