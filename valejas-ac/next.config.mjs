/** @type {import('next').NextConfig} */

// Deploy em Vercel: Next.js completo (SSR/ISR) + Sanity Studio em /studio.
// (Objetivo: presidente/direção publica comunicados no site → fan-out p/ redes.)
const nextConfig = {
  images: {
    // Imagens servidas pelo Sanity CDN
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  // Sanity usa módulos que não devem ser bundled pelo servidor Next.js
  experimental: {
    serverComponentsExternalPackages: ["sanity"],
  },
};

export default nextConfig;
