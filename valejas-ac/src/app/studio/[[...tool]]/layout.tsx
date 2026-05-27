/**
 * Desativa o layout global (Navbar/Footer) para a rota /studio.
 * O Sanity Studio tem o seu próprio chrome — não queremos o nav do site por cima.
 */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
