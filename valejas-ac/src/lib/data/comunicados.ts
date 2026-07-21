/**
 * CAMADA DE DADOS — COMUNICADOS OFICIAIS
 * ─────────────────────────────────────────────────────────────────
 * Surface de publicação da Direção. Em produção vêm do Sanity; sem
 * CMS configurado, o site usa estes mocks (permite demo sem backend).
 * ─────────────────────────────────────────────────────────────────
 */

export type CanalPublicacao = "site" | "facebook" | "instagram";

export interface Comunicado {
  slug:        string;
  titulo:      string;
  data:        string;   // ISO
  autor:       string;
  resumoRedes: string;   // legenda para redes
  corpo:       string[]; // parágrafos
  imagemUrl?:  string;
  canais:      CanalPublicacao[];
}

export const COMUNICADOS: Comunicado[] = [
  {
    slug:  "epoca-2026-27-arranque",
    titulo: "Arranque da época 2026/27",
    data:  "2026-07-15T10:00:00.000Z",
    autor: "A Direção",
    resumoRedes:
      "É oficial: a época 2026/27 arranca a 1 de setembro. Contamos com todos, sócios, atletas e famílias, para mais um ano de Valejas. 🦅💙💛",
    corpo: [
      "A Direção do Valejas Atlético Clube informa que a época desportiva 2026/27 terá início oficial a 1 de setembro.",
      "Os treinos de todas as modalidades retomam nas datas a comunicar por cada secção. Renovações de quotas de sócio já estão abertas.",
      "Contamos com todos para mais um ano ao serviço do clube e da comunidade.",
    ],
    canais: ["site", "facebook", "instagram"],
  },
  {
    slug:  "assembleia-geral-ordinaria",
    titulo: "Convocatória — Assembleia Geral Ordinária",
    data:  "2026-06-20T18:00:00.000Z",
    autor: "A Mesa da Assembleia Geral",
    resumoRedes:
      "Convocamos todos os sócios para a Assembleia Geral Ordinária a 30 de junho, às 21h, na sede do clube.",
    corpo: [
      "Nos termos dos Estatutos, convocam-se todos os sócios para a Assembleia Geral Ordinária a realizar no dia 30 de junho, pelas 21h00, na sede do clube.",
      "Ordem de trabalhos: apreciação do relatório e contas, plano de atividades e outros assuntos de interesse para o clube.",
    ],
    canais: ["site", "facebook"],
  },
];

export function getComunicados(): Comunicado[] {
  return [...COMUNICADOS].sort((a, b) => b.data.localeCompare(a.data));
}

export function getComunicadoPorSlug(slug: string): Comunicado | undefined {
  return COMUNICADOS.find((c) => c.slug === slug);
}
