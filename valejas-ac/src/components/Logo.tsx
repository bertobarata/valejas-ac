import Image from "next/image";
import Link from "next/link";

/**
 * Emblema oficial do Valejas AC (águia + escudo VAC).
 * Fonte única do logo — usar em navbar, footer, hero.
 * Ficheiro: /public/brand/crest.png (versão sem fundo).
 */
export default function Logo({
  size = 40,
  withWordmark = true,
  className = "",
  /**
   * A partir de que largura aparece o nome ao lado do emblema. Na barra
   * do topo só há espaço para ele nos ecrãs largos — com a navegação
   * toda, mais estreito que isto o nome partia-se em três linhas por
   * cima dos links.
   */
  wordmarkClass = "hidden sm:block",
}: {
  size?: number;
  withWordmark?: boolean;
  className?: string;
  wordmarkClass?: string;
}) {
  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      <Image
        src="/brand/crest.png"
        alt="Emblema do Valejas Atlético Clube"
        width={size}
        height={size}
        priority
        className="object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.28)] transition-transform duration-300 group-hover:scale-105"
        style={{ height: size, width: "auto" }}
      />
      {withWordmark && (
        <span className={`${wordmarkClass} leading-none`}>
          <span className="block font-headline font-black text-base md:text-lg uppercase text-on-surface tracking-tight">
            Valejas
          </span>
          <span className="block font-body text-xs md:text-xs text-on-surface-muted uppercase tracking-widest">
            Atlético Clube
          </span>
        </span>
      )}
    </Link>
  );
}
