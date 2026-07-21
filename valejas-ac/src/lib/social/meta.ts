/**
 * FAN-OUT PARA REDES SOCIAIS (Meta Graph API)
 * ─────────────────────────────────────────────────────────────────
 * Publica um comunicado no Facebook (Página) e Instagram (Business).
 *
 * MODO DRY-RUN: se faltarem tokens/IDs (ou META_DRY_RUN=1), NADA é
 * enviado — as funções devolvem o payload que *seria* publicado.
 * Isto permite demonstrar o fluxo ao cliente sem credenciais Meta.
 *
 * Para ativar a sério, define em produção (Vercel → Env):
 *   META_GRAPH_VERSION      (opcional, default v21.0)
 *   META_PAGE_ID            id da Página Facebook do clube
 *   META_PAGE_ACCESS_TOKEN  token de longa duração (pages_manage_posts)
 *   META_IG_USER_ID         id da conta Instagram Business ligada à Página
 * Permissões necessárias: pages_manage_posts, instagram_content_publish,
 * pages_read_engagement. Algumas exigem App Review da Meta.
 * ─────────────────────────────────────────────────────────────────
 */

const GRAPH = `https://graph.facebook.com/${process.env.META_GRAPH_VERSION ?? "v21.0"}`;

const PAGE_ID = process.env.META_PAGE_ID;
const PAGE_TOKEN = process.env.META_PAGE_ACCESS_TOKEN;
const IG_USER_ID = process.env.META_IG_USER_ID;

export type CanalResultado = {
  canal: "facebook" | "instagram";
  ok: boolean;
  dryRun: boolean;
  postId?: string;
  detalhe: string;
};

export type Comunicado = {
  titulo: string;
  legenda: string;   // texto para redes (resumoRedes ?? titulo)
  imagemUrl?: string; // URL público da imagem (obrigatório p/ Instagram)
  urlSite?: string;   // link para o comunicado no site
};

function fbConfigured() {
  return Boolean(PAGE_ID && PAGE_TOKEN);
}
function igConfigured() {
  return Boolean(IG_USER_ID && PAGE_TOKEN);
}

const forceDryRun = process.env.META_DRY_RUN === "1";

// ── Facebook ──────────────────────────────────────────────────────
export async function postToFacebook(c: Comunicado): Promise<CanalResultado> {
  const mensagem = c.urlSite ? `${c.legenda}\n\n${c.urlSite}` : c.legenda;

  if (forceDryRun || !fbConfigured()) {
    return {
      canal: "facebook",
      ok: true,
      dryRun: true,
      detalhe: `[DRY-RUN] Publicaria no Facebook: "${mensagem.slice(0, 80)}…"${
        c.imagemUrl ? " (com imagem)" : ""
      }`,
    };
  }

  try {
    // Com imagem → /photos; sem imagem → /feed
    const endpoint = c.imagemUrl
      ? `${GRAPH}/${PAGE_ID}/photos`
      : `${GRAPH}/${PAGE_ID}/feed`;
    const body = new URLSearchParams({ access_token: PAGE_TOKEN! });
    if (c.imagemUrl) {
      body.set("url", c.imagemUrl);
      body.set("caption", mensagem);
    } else {
      body.set("message", mensagem);
    }

    const res = await fetch(endpoint, { method: "POST", body });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error?.message ?? "Erro Facebook");
    return { canal: "facebook", ok: true, dryRun: false, postId: json.id ?? json.post_id, detalhe: "Publicado no Facebook" };
  } catch (e) {
    return { canal: "facebook", ok: false, dryRun: false, detalhe: e instanceof Error ? e.message : "Erro Facebook" };
  }
}

// ── Instagram (2 passos: container → publish) ─────────────────────
export async function postToInstagram(c: Comunicado): Promise<CanalResultado> {
  const legenda = c.urlSite ? `${c.legenda}\n\n${c.urlSite}` : c.legenda;

  if (!c.imagemUrl) {
    return {
      canal: "instagram",
      ok: false,
      dryRun: false,
      detalhe: "Instagram ignorado: exige imagem e o comunicado não tem.",
    };
  }

  if (forceDryRun || !igConfigured()) {
    return {
      canal: "instagram",
      ok: true,
      dryRun: true,
      detalhe: `[DRY-RUN] Publicaria no Instagram (imagem + legenda "${legenda.slice(0, 60)}…")`,
    };
  }

  try {
    // 1) criar container
    const createBody = new URLSearchParams({
      image_url: c.imagemUrl,
      caption: legenda,
      access_token: PAGE_TOKEN!,
    });
    const createRes = await fetch(`${GRAPH}/${IG_USER_ID}/media`, { method: "POST", body: createBody });
    const createJson = await createRes.json();
    if (!createRes.ok) throw new Error(createJson?.error?.message ?? "Erro ao criar container IG");

    // 2) publicar container
    const pubBody = new URLSearchParams({ creation_id: createJson.id, access_token: PAGE_TOKEN! });
    const pubRes = await fetch(`${GRAPH}/${IG_USER_ID}/media_publish`, { method: "POST", body: pubBody });
    const pubJson = await pubRes.json();
    if (!pubRes.ok) throw new Error(pubJson?.error?.message ?? "Erro ao publicar no IG");

    return { canal: "instagram", ok: true, dryRun: false, postId: pubJson.id, detalhe: "Publicado no Instagram" };
  } catch (e) {
    return { canal: "instagram", ok: false, dryRun: false, detalhe: e instanceof Error ? e.message : "Erro Instagram" };
  }
}

/** True se estamos globalmente em modo demonstração (sem credenciais). */
export function isDryRun(): boolean {
  return forceDryRun || (!fbConfigured() && !igConfigured());
}
