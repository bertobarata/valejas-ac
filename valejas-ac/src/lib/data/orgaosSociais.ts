/**
 * CAMADA DE DADOS — ÓRGÃOS SOCIAIS
 * ─────────────────────────────────────────────────────────────────
 * Lista A, eleita para o mandato em curso.
 * Transcrito do cartaz oficial fornecido pela Direção (13/09/2026).
 *
 * Os anos de sócio são calculados a partir do ano de inscrição, não
 * escritos à mão — o cartaz diz "(45 anos)" e isso ficaria errado no
 * ano seguinte.
 *
 * ⚠️ Por confirmar com a Direção:
 *   - Mário Sérgio Barata e Teresa Santos têm ambos o nº 167 no cartaz
 *   - O Conselho Fiscal tem Relator, não Vice-Presidente
 *   - A Direção tem 4 vogais, não 5
 * ─────────────────────────────────────────────────────────────────
 */

export interface Membro {
  cargo:  string;
  nome:   string;
  /** Número de sócio. Não é publicado — ver nota em MOSTRAR_NUMERO_SOCIO. */
  numero: number;
  /** Ano em que se tornou sócio. */
  desde:  number;
  /** Suplentes aparecem separados dos efetivos. */
  suplente?: boolean;
}

export interface Orgao {
  id:        string;
  nome:      string;
  sigla?:    string;
  descricao: string;
  membros:   Membro[];
}

/**
 * O número de sócio é um dado interno do clube e não acrescenta nada
 * a quem visita o site. Fica guardado, mas não é mostrado. Mudar para
 * `true` se a Direção quiser o cartaz replicado tal e qual.
 */
export const MOSTRAR_NUMERO_SOCIO = false;

export const MANDATO = "Lista A";

export const ORGAOS: Orgao[] = [
  {
    id: "direcao",
    nome: "Direção",
    descricao:
      "Gere o dia a dia do clube — modalidades, instalações, sócios e contas. É quem assina os comunicados oficiais.",
    membros: [
      { cargo: "Presidente",      nome: "Luís Santos",         numero: 130, desde: 2024 },
      { cargo: "Vice-Presidente", nome: "João Miranda",        numero: 169, desde: 2025 },
      { cargo: "Tesoureiro",      nome: "Dina Faustino",       numero: 150, desde: 2025 },
      { cargo: "1.º Secretário",  nome: "Diana Figueira",      numero: 147, desde: 2025 },
      { cargo: "2.º Secretário",  nome: "Gonçalo Figueira",    numero: 132, desde: 2024 },
      { cargo: "1.º Vogal",       nome: "Jorge Nascimento",    numero: 152, desde: 2025 },
      { cargo: "2.º Vogal",       nome: "Guilherme Rosa",      numero: 151, desde: 2025 },
      { cargo: "3.º Vogal",       nome: "Carlos Sacramento",   numero: 109, desde: 2023 },
      { cargo: "4.º Vogal",       nome: "Luísa Sacramento",    numero: 110, desde: 2023 },
      { cargo: "1.º Suplente",    nome: "Mário Sérgio Barata", numero: 100, desde: 2019, suplente: true },
      { cargo: "2.º Suplente",    nome: "Teresa Santos",       numero: 167, desde: 2025, suplente: true },
      { cargo: "3.º Suplente",    nome: "Fernando Dias",       numero: 2,   desde: 1981, suplente: true },
    ],
  },
  {
    id: "conselho-fiscal",
    nome: "Conselho Fiscal",
    descricao:
      "Fiscaliza as contas do clube e dá parecer sobre elas à Assembleia Geral.",
    membros: [
      { cargo: "Presidente",   nome: "Camilo Alves",     numero: 11,  desde: 1982 },
      { cargo: "Relator",      nome: "Américo Canceiro", numero: 86,  desde: 2016 },
      { cargo: "Secretário",   nome: "Carlos Patrício",  numero: 61,  desde: 2009 },
      { cargo: "1.º Suplente", nome: "José Romão",       numero: 15,  desde: 1985, suplente: true },
      { cargo: "2.º Suplente", nome: "José Santos",      numero: 101, desde: 2019, suplente: true },
    ],
  },
  {
    id: "mesa-assembleia-geral",
    nome: "Mesa da Assembleia Geral",
    sigla: "MAG",
    descricao:
      "Convoca e conduz as Assembleias Gerais, onde os sócios decidem o rumo do clube.",
    membros: [
      { cargo: "Presidente",      nome: "Helena Barbosa",   numero: 226, desde: 2025 },
      { cargo: "Vice-Presidente", nome: "Fernando Grandão", numero: 10,  desde: 1982 },
      { cargo: "1.º Secretário",  nome: "Manuel Firmino",   numero: 7,   desde: 1981 },
    ],
  },
];

/** Anos completos de sócio, à data de hoje. */
export function anosDeSocio(desde: number): number {
  return new Date().getFullYear() - desde;
}

