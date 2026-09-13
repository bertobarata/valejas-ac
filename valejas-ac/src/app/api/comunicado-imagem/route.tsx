/**
 * API — IMAGEM DO COMUNICADO
 * ─────────────────────────────────────────────────────────────────
 * Gera um cartão 1080×1080 com o emblema do clube e o texto do
 * comunicado, para publicar no Instagram e no Facebook.
 *
 * Existe porque o Instagram NÃO aceita publicações só de texto: sem
 * imagem não há publicação. Assim o Presidente escreve texto e o
 * site trata da imagem sozinho.
 *
 * Uso:
 *   /api/comunicado-imagem?titulo=...&texto=...&data=...
 *
 * O URL é público de propósito — a Meta tem de conseguir ir buscar
 * a imagem para a publicar. Não expõe nada que não vá sair na rede.
 * ─────────────────────────────────────────────────────────────────
 */

import { ImageResponse } from "next/og";

export const runtime = "edge";

const AMARELO = "#FADB09";
const AZUL    = "#1554BB";
const ESCURO  = "#0B1220";

/** Corta sem partir palavras a meio. */
function limitar(texto: string, max: number): string {
  if (texto.length <= max) return texto;
  const corte = texto.slice(0, max);
  const espaco = corte.lastIndexOf(" ");
  return (espaco > max * 0.6 ? corte.slice(0, espaco) : corte).trimEnd() + "…";
}

/**
 * Archivo é a tipografia dos títulos do clube. Vem do próprio site em
 * TTF: o satori, que está por trás do ImageResponse, não lê woff2 nem
 * interpreta eixos variáveis — por isso são instâncias fixas, já na
 * largura semi-condensada que o site usa nos títulos grandes.
 */
async function carregarFonte(ficheiro: string, origem: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(`${origem}/fonts/${ficheiro}`);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    // Sem fonte, o ImageResponse usa a de sistema. Melhor isso do que falhar.
    return null;
  }
}

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const origem = new URL(req.url).origin;

  const titulo = limitar((params.get("titulo") ?? "Comunicado Oficial").trim(), 120);
  const data   = params.get("data") ?? "";

  const dataLegivel = data
    ? new Intl.DateTimeFormat("pt-PT", {
        day: "2-digit", month: "long", year: "numeric", timeZone: "Europe/Lisbon",
      }).format(new Date(data))
    : "";

  const [black, semibold] = await Promise.all([
    carregarFonte("Archivo-SemiCondensed-Black.ttf", origem),
    carregarFonte("Archivo-SemiCondensed-SemiBold.ttf", origem),
  ]);

  const fonts = [
    black    && { name: "Archivo", data: black,    weight: 900 as const, style: "normal" as const },
    semibold && { name: "Archivo", data: semibold, weight: 600 as const, style: "normal" as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 900 | 600; style: "normal" }[];

  return new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1080px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: "60px",
          background: ESCURO,
          padding: "80px",
          fontFamily: fonts.length ? "Archivo" : "sans-serif",
          position: "relative",
        }}
      >
        {/* Barra de cor do clube */}
        <div style={{ display: "flex", position: "absolute", top: 0, left: 0, right: 0, height: "14px" }}>
          <div style={{ flex: 1, background: AMARELO }} />
          <div style={{ flex: 1, background: AZUL }} />
        </div>

        {/* Topo — o emblema manda, o nome do clube acompanha ao lado */}
        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          <img
            src={`${origem}/brand/crest.png`}
            width={230}
            height={230}
            style={{ objectFit: "contain" }}
            alt=""
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <span
              style={{
                fontSize: "56px",
                fontWeight: 900,
                color: "#FFFFFF",
                lineHeight: 0.95,
                letterSpacing: "-1.5px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <span>VALEJAS</span>
              <span>ATLÉTICO CLUBE</span>
            </span>
            <span style={{ fontSize: "24px", fontWeight: 600, color: AMARELO, letterSpacing: "6px" }}>
              COMUNICADO OFICIAL
            </span>
          </div>
        </div>

        {/* Corpo — só o título. O comunicado vai na legenda da publicação. */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
          <span
            style={{
              fontSize:
                titulo.length > 90 ? "66px" :
                titulo.length > 55 ? "82px" : "104px",
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 0.98,
              letterSpacing: "-3px",
              textTransform: "uppercase",
            }}
          >
            {titulo}
          </span>
        </div>

        {/* Rodapé — data e assinatura */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: `4px solid ${AMARELO}`,
            paddingTop: "28px",
          }}
        >
          <span style={{ fontSize: "28px", fontWeight: 600, color: "#8FA0BC" }}>
            {dataLegivel}
          </span>
          <span style={{ fontSize: "28px", fontWeight: 900, color: AMARELO, letterSpacing: "1px" }}>
            A DIREÇÃO
          </span>
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
      fonts: fonts.length ? fonts : undefined,
      headers: {
        // A Meta vai buscar esta imagem; vale a pena ficar em cache.
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    }
  );
}
