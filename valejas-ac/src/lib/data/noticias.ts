/**
 * CAMADA DE DADOS — NOTÍCIAS
 * ─────────────────────────────────────────────────────────────────
 * Estes dados virão futuramente de um CMS (Sanity.io recomendado).
 * Enquanto o CMS não estiver configurado, edita diretamente este
 * ficheiro ou o ficheiro JSON correspondente.
 * ─────────────────────────────────────────────────────────────────
 */

export type Categoria = "Resultados" | "Mercado" | "Clube" | "Entrevista" | "Comunicado";

export interface Artigo {
  slug:       string;
  categoria:  Categoria;
  titulo:     string;
  excerto:    string;
  conteudo?:  string;
  data:       string;        // ISO date string, e.g. "2024-06-24"
  autor:      string;
  imagemUrl?: string;        // caminho em /public/images/news/
  destaque:   boolean;       // true = artigo em destaque no topo
}

// ── Mock articles — substituir por chamadas ao CMS ──────────────
export const ARTIGOS: Artigo[] = [
  {
    slug:      "derby-valejas-5-1",
    categoria: "Resultados",
    titulo:    "Domínio total no Derby: Valejas vence por 5–1",
    excerto:   "Em exibição de gala, a nossa equipa de futsal não deu hipóteses ao adversário, consolidando a liderança isolada do campeonato com um hat-trick de Ricardo Neves.",
    data:      "2024-06-24",
    autor:     "Redação Valejas AC",
    imagemUrl: "/images/news/derby-5-1.jpg",
    destaque:  true,
  },
  {
    slug:      "novo-reforco-brasileiro",
    categoria: "Mercado",
    titulo:    "Novo reforço brasileiro apresentado amanhã",
    excerto:   "Guarda-redes de 23 anos chega por cedência do São Paulo FC e reforça o plantel para a segunda metade da temporada.",
    data:      "2024-06-22",
    autor:     "Redação Valejas AC",
    imagemUrl: "/images/news/transfer.jpg",
    destaque:  false,
  },
  {
    slug:      "academia-formacao-construcao",
    categoria: "Clube",
    titulo:    "O Projeto da Academia: Moldando as Águias de Amanhã",
    excerto:   "O novo centro de treinos começa a ser construído no próximo mês no coração de Valejas.",
    data:      "2024-06-20",
    autor:     "Presidência VAC",
    imagemUrl: "/images/news/academy.jpg",
    destaque:  false,
  },
  {
    slug:      "entrevista-mister-rodrigues",
    categoria: "Entrevista",
    titulo:    '"Estamos a construir algo único" — Mister Rodrigues',
    excerto:   "Conversa exclusiva com o treinador principal sobre a ambição da temporada e o projeto de formação.",
    data:      "2024-06-18",
    autor:     "Redação Valejas AC",
    imagemUrl: "/images/news/interview.jpg",
    destaque:  false,
  },
  {
    slug:      "equipamento-24-25-revelado",
    categoria: "Clube",
    titulo:    "Equipamento Principal 2024/25 Revelado",
    excerto:   "A nova camisola mantém o azul e o amarelo do clube com um redesign moderno das faixas.",
    data:      "2024-06-15",
    autor:     "Redação Valejas AC",
    imagemUrl: "/images/news/kit.jpg",
    destaque:  false,
  },
  {
    slug:      "comunicado-assembleia-socios",
    categoria: "Comunicado",
    titulo:    "Convocatória — Assembleia Geral de Sócios",
    excerto:   "A Direção do Valejas Atlético Clube convoca todos os sócios para a Assembleia Geral a realizar no próximo dia 30 de Junho.",
    data:      "2024-06-12",
    autor:     "Direção VAC",
    imagemUrl: undefined,
    destaque:  false,
  },
  {
    slug:      "lendas-50-anos-silva",
    categoria: "Clube",
    titulo:    "Lendas: 50 Anos de Silva no Valejas",
    excerto:   "Uma homenagem ao histórico guarda-redes que defendeu as cores do clube durante cinco décadas.",
    data:      "2024-06-10",
    autor:     "Redação Valejas AC",
    imagemUrl: "/images/news/legend.jpg",
    destaque:  false,
  },
  {
    slug:      "boletim-clinico-retorno-silva",
    categoria: "Clube",
    titulo:    "Boletim Clínico: Silva de regresso aos treinos",
    excerto:   "O avançado recuperou da lesão muscular e deverá estar disponível para o próximo jogo da Liga.",
    data:      "2024-06-08",
    autor:     "Departamento Médico VAC",
    imagemUrl: undefined,
    destaque:  false,
  },
];

// ── Helpers ──────────────────────────────────────────────────────
export function getArtigoDestaque(): Artigo | undefined {
  return ARTIGOS.find((a) => a.destaque);
}

export function getArtigosByCategoria(cat: Categoria | "Tudo"): Artigo[] {
  if (cat === "Tudo") return ARTIGOS;
  return ARTIGOS.filter((a) => a.categoria === cat);
}

export function getArtigoBySlug(slug: string): Artigo | undefined {
  return ARTIGOS.find((a) => a.slug === slug);
}

export const CATEGORIAS: Array<Categoria | "Tudo"> = [
  "Tudo", "Resultados", "Mercado", "Clube", "Entrevista", "Comunicado",
];

export function formatData(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-PT", {
    day: "numeric", month: "long", year: "numeric",
  });
}
