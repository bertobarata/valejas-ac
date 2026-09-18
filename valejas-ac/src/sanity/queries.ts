import { sanityClient, isSanityConfigured } from "./client";
import { urlDaImagem, type ImagemSanity } from "./image";
import type { Artigo, Categoria } from "@/lib/data/noticias";
import type { JogadorSanity } from "@/lib/data/plantel";

// ────────────────────────────────────────────────────────────────────────────
// Tipos Sanity → tipos do site
// ────────────────────────────────────────────────────────────────────────────

interface SanityArtigo {
  _id:       string;
  titulo:    string;
  slug:      { current: string };
  categoria: Categoria;
  destaque:  boolean;
  data:      string;
  autor:     string;
  excerto:   string;
  imagem?:   { asset: { _ref: string }; alt?: string };
}

interface SanityJogo {
  _id:            string;
  adversario:     string;
  data:           string;
  local?:         string;
  competicao:     string;
  ehEmCasa:       boolean;
  jogado:         boolean;
  golosNossos?:   number;
  golosAdversario?: number;
  marcadores?:    string[];
  linkBilhetes?:  string;
}

// ────────────────────────────────────────────────────────────────────────────
// ARTIGOS
// ────────────────────────────────────────────────────────────────────────────

const ARTIGO_FIELDS = `
  _id, titulo,
  "slug": slug.current,
  categoria, destaque, data, autor, excerto,
  imagem { asset, alt }
`;

/** Todos os artigos, ordenados por data desc */
export async function fetchArtigos(): Promise<Artigo[] | null> {
  if (!isSanityConfigured()) return null;
  try {
    const results = await sanityClient.fetch<SanityArtigo[]>(
      `*[_type == "artigo"] | order(data desc) { ${ARTIGO_FIELDS} }`
    );
    return results.map(sanityArtigoToArtigo);
  } catch {
    return null;
  }
}

/** Artigo com destaque = true */
export async function fetchArtigoDestaque(): Promise<Artigo | null> {
  if (!isSanityConfigured()) return null;
  try {
    const result = await sanityClient.fetch<SanityArtigo | null>(
      `*[_type == "artigo" && destaque == true] | order(data desc) [0] { ${ARTIGO_FIELDS} }`
    );
    return result ? sanityArtigoToArtigo(result) : null;
  } catch {
    return null;
  }
}

/** Artigo por slug */
export async function fetchArtigoPorSlug(slug: string): Promise<Artigo | null> {
  if (!isSanityConfigured()) return null;
  try {
    const result = await sanityClient.fetch<SanityArtigo | null>(
      `*[_type == "artigo" && slug.current == $slug][0] { ${ARTIGO_FIELDS} }`,
      { slug }
    );
    return result ? sanityArtigoToArtigo(result) : null;
  } catch {
    return null;
  }
}

function sanityArtigoToArtigo(a: SanityArtigo): Artigo {
  return {
    slug:      a.slug,
    categoria: a.categoria,
    titulo:    a.titulo,
    excerto:   a.excerto,
    data:      a.data,
    autor:     a.autor,
    destaque:  a.destaque ?? false,
    imagemUrl: undefined, // URL gerada via urlFor() no componente
    // Guardamos a referência Sanity para uso futuro
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(a.imagem ? { _sanityImage: a.imagem } as any : {}),
  };
}

// ────────────────────────────────────────────────────────────────────────────
// JOGADORES
// ────────────────────────────────────────────────────────────────────────────

/**
 * O plantel guardado. Só quem está no plantel — quem saiu fica no CMS
 * desligado, para o histórico, mas não aparece no site.
 */
export async function fetchJogadores(equipa?: string): Promise<JogadorSanity[] | null> {
  if (!isSanityConfigured()) return null;
  try {
    const filtro = equipa
      ? `*[_type == "jogador" && ativo != false && equipa == $equipa] | order(numero asc)`
      : `*[_type == "jogador" && ativo != false] | order(numero asc)`;

    /*
     * A fotografia vem em bruto — referência, hotspot e recorte — porque
     * é disso que o construtor de endereços precisa. O `lqip` é uma
     * miniatura embutida que o Sanity calcula ao carregar o ficheiro:
     * serve de borrão enquanto o retrato não chega, e assim o cartão
     * não salta quando a imagem aparece.
     */
    const crus = await sanityClient.fetch<
      (JogadorSanity & {
        fotografia?: ImagemSanity;
        fotoLqipCru?: string;
      })[]
    >(
      `${filtro} {
        _id, nome, numero, posicao, equipa, capitao, ativo,
        fotografia,
        "fotoLqipCru": fotografia.asset->metadata.lqip
      }`,
      equipa ? { equipa } : {}
    );

    // Os retratos aparecem numa grelha de até quatro colunas; 800×1066
    // chega para ecrãs de alta densidade sem mandar ficheiros enormes.
    return crus.map(({ fotografia, fotoLqipCru, ...j }) => ({
      ...j,
      fotoUrl: urlDaImagem(fotografia, { largura: 800, altura: 1066 }),
      fotoLqip: fotoLqipCru,
    }));
  } catch {
    return null;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// JOGOS
// ────────────────────────────────────────────────────────────────────────────

/** Próximos jogos (não jogados), ordenados por data asc */
export async function fetchProximosJogos(limit = 5): Promise<SanityJogo[] | null> {
  if (!isSanityConfigured()) return null;
  try {
    return await sanityClient.fetch<SanityJogo[]>(
      `*[_type == "jogo" && jogado == false && data > now()] | order(data asc) [0...$limit] {
        _id, adversario, data, local, competicao, ehEmCasa, linkBilhetes
      }`,
      { limit }
    );
  } catch {
    return null;
  }
}

/** Resultados recentes (jogos já realizados), ordenados por data desc */
export async function fetchResultadosRecentes(limit = 5): Promise<SanityJogo[] | null> {
  if (!isSanityConfigured()) return null;
  try {
    return await sanityClient.fetch<SanityJogo[]>(
      `*[_type == "jogo" && jogado == true] | order(data desc) [0...$limit] {
        _id, adversario, data, local, competicao, ehEmCasa,
        golosNossos, golosAdversario, marcadores
      }`,
      { limit }
    );
  } catch {
    return null;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// COMUNICADOS OFICIAIS
// ────────────────────────────────────────────────────────────────────────────

/** Comunicados publicados, mais recentes primeiro. Null se Sanity ausente. */
export async function fetchComunicados(): Promise<unknown[] | null> {
  if (!isSanityConfigured()) return null;
  try {
    return await sanityClient.fetch(
      `*[_type == "comunicado" && publicado == true] | order(data desc) {
        "slug": slug.current, titulo, data, autor, resumoRedes, canais,
        "corpo": corpo[].children[].text,
        "imagemUrl": imagem.asset->url
      }`
    );
  } catch {
    return null;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// CONFIGURAÇÃO DO CLUBE
// ────────────────────────────────────────────────────────────────────────────

export async function fetchConfiguracao() {
  if (!isSanityConfigured()) return null;
  try {
    return await sanityClient.fetch(
      `*[_type == "configuracao"][0] {
        email, telefone, morada, codigoPostal, concelho,
        instagram, facebook, youtube, tiktok,
        totalSocios, sloganHero,
        proximoJogo -> { adversario, data, local, competicao, ehEmCasa, linkBilhetes },
        ultimoResultado -> { adversario, data, golosNossos, golosAdversario, competicao }
      }`
    );
  } catch {
    return null;
  }
}

/* ── Jogos e classificação ──────────────────────────────────────── */

import type { JogoSanity, LinhaClassificacao } from "@/lib/data/jogos";

/** Jogos guardados pelo departamento de comunicação. */
export async function fetchJogos(): Promise<JogoSanity[] | null> {
  if (!isSanityConfigured()) return null;
  try {
    return await sanityClient.fetch(
      `*[_type == "jogo"] | order(data desc){
        _id, adversario, data, local, competicao, ehEmCasa,
        jogado, golosNossos, golosAdversario
      }`
    );
  } catch {
    return null;
  }
}

/** Classificação guardada. Documento único. */
export async function fetchClassificacao(): Promise<LinhaClassificacao[] | null> {
  if (!isSanityConfigured()) return null;
  try {
    const doc = await sanityClient.fetch(
      `*[_id == "classificacao"][0]{ linhas }`
    );
    const linhas = doc?.linhas;
    return Array.isArray(linhas) && linhas.length > 0 ? linhas : null;
  } catch {
    return null;
  }
}
