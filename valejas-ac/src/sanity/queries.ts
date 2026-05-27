import { sanityClient, isSanityConfigured } from "./client";
import type { Artigo, Categoria } from "@/lib/data/noticias";

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

interface SanityJogador {
  _id:          string;
  nome:         string;
  numero:       number;
  posicao:      string;
  equipa:       string;
  ativo:        boolean;
  foto?:        { asset: { _ref: string }; alt?: string };
  golos:        number;
  assistencias: number;
  rating:       number;
  epoca:        string;
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

export async function fetchJogadores(equipa?: string): Promise<SanityJogador[] | null> {
  if (!isSanityConfigured()) return null;
  try {
    const filter = equipa
      ? `*[_type == "jogador" && ativo == true && equipa == $equipa] | order(numero asc)`
      : `*[_type == "jogador" && ativo == true] | order(numero asc)`;

    return await sanityClient.fetch<SanityJogador[]>(
      `${filter} {
        _id, nome, numero, posicao, equipa, ativo,
        foto { asset, alt },
        golos, assistencias, rating, epoca
      }`,
      equipa ? { equipa } : {}
    );
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
