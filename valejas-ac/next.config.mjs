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
  // A história passou a ser a abertura de /clube, e o emblema desceu
  // para /clube/emblema. Os endereços antigos continuam a funcionar —
  // podem estar partilhados algures.
  async redirects() {
    return [
      { source: "/historia", destination: "/clube", permanent: true },
      /*
       * As notícias e os comunicados eram dois sítios para escrever a
       * mesma coisa, e um deles estava vazio — as quatro notícias que lá
       * estavam eram inventadas e foram apagadas. O clube publica
       * comunicados; é para lá que se vai.
       */
      { source: "/noticias", destination: "/comunicados", permanent: true },
    ];
  },
};

export default nextConfig;
