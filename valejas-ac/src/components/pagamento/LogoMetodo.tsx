import Image from "next/image";

/**
 * LOGÓTIPO DE MÉTODO DE PAGAMENTO
 * ─────────────────────────────────────────────────────────────────
 * As marcas da SIBS são a preto e azul, desenhadas para fundo claro.
 * Em modo escuro ficariam ilegíveis, e recolorir marca registada não
 * se faz — por isso vão sempre sobre uma placa branca, que é como
 * aparecem em qualquer caixa de pagamento.
 *
 * `unoptimized` porque uma delas é SVG: o otimizador de imagens do
 * Next não trata SVG, e estes ficheiros já vêm leves da origem.
 * ─────────────────────────────────────────────────────────────────
 */
export default function LogoMetodo({
  logo,
  altura = 22,
}: {
  logo: { src: string; alt: string; largura: number; altura: number };
  altura?: number;
}) {
  const largura = Math.round((logo.largura / logo.altura) * altura);

  return (
    <span className="inline-flex items-center justify-center bg-white px-2.5 py-1.5 shrink-0">
      <Image
        src={logo.src}
        alt={logo.alt}
        width={largura}
        height={altura}
        unoptimized
        style={{ height: altura, width: "auto" }}
      />
    </span>
  );
}
