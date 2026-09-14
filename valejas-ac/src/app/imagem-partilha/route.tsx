import { ImageResponse } from "next/og";

/**
 * CARTÃO DE PARTILHA
 * ─────────────────────────────────────────────────────────────────
 * A imagem que aparece quando o site é partilhado no WhatsApp, no
 * Facebook ou no Messenger — que é como este público partilha coisas.
 *
 * Gerada em vez de desenhada: não há fotografia do clube que sirva,
 * e o emblema sobre o azul diz o que é preciso. Quando houver uma
 * fotografia boa da equipa, troca-se isto por um ficheiro estático.
 *
 * Usa as mesmas instâncias TTF do comunicado — o satori não lê woff2.
 * ─────────────────────────────────────────────────────────────────
 */

export const runtime = "edge";

/* Não exportar `alt`, `size` nem `contentType`: nomes reservados dos
   ficheiros de imagem convencionais do Next, que num route handler
   fazem a verificação de tipos falhar. */
const TAMANHO = { width: 1200, height: 630 };

const AMARELO = "#FADB09";
const AZUL    = "#1554BB";

async function fonte(ficheiro: string, origem: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(`${origem}/fonts/${ficheiro}`);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const origem = new URL(req.url).origin;
  const black = await fonte("Archivo-SemiCondensed-Black.ttf", origem);

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          alignItems: "center",
          gap: "70px",
          padding: "0 90px",
          background: "radial-gradient(120% 90% at 70% 45%, #1B4FA8 0%, #10306B 40%, #05122E 100%)",
          fontFamily: black ? "Archivo" : "sans-serif",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", position: "absolute", top: 0, left: 0, right: 0, height: "12px" }}>
          <div style={{ flex: 1, background: AMARELO }} />
          <div style={{ flex: 1, background: AZUL }} />
        </div>

        <img src={`${origem}/brand/crest.png`} width={300} height={300} alt="" style={{ objectFit: "contain" }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <span style={{ fontSize: "82px", fontWeight: 900, color: "#FFFFFF", lineHeight: 0.92, letterSpacing: "-2px", display: "flex", flexDirection: "column" }}>
            <span>VALEJAS</span>
            <span style={{ color: AMARELO }}>ATLÉTICO CLUBE</span>
          </span>
          <span style={{ fontSize: "30px", fontWeight: 900, color: "#C6D4F0", letterSpacing: "2px" }}>
            O CLUBE DA NOSSA TERRA DESDE 1966
          </span>
        </div>
      </div>
    ),
    {
      ...TAMANHO,
      fonts: black
        ? [{ name: "Archivo", data: black, weight: 900 as const, style: "normal" as const }]
        : undefined,
      headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" },
    }
  );
}
