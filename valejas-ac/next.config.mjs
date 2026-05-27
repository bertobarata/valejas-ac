/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Domínios permitidos para <Image> do Next.js
    domains: [
      "cdn.sanity.io", // imagens do Sanity
    ],
  },

  // Sanity usa módulos que não devem ser bundled pelo servidor Next.js
  experimental: {
    serverComponentsExternalPackages: ["sanity"],
  },
};

export default nextConfig;
