/**
 * A raiz não desenha nada: o <html> vive em [locale]/layout.tsx,
 * porque é lá que se sabe a língua para o `lang`. Este ficheiro só
 * existe para o Next ter uma raiz para o not-found global.
 */
export default function RaizSemLingua({ children }: { children: React.ReactNode }) {
  return children;
}
