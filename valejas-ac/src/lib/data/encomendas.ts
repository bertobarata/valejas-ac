/**
 * CAMADA DE DADOS — ENCOMENDAS DA LOJA
 * ─────────────────────────────────────────────────────────────────
 * Uma encomenda nasce no site e vive até alguém a levantar na sede.
 * Os estados seguem o percurso real do clube, não um fluxo genérico
 * de e-commerce: não há expedição nem transportadora.
 * ─────────────────────────────────────────────────────────────────
 */

export type EstadoEncomenda =
  | "recebida"     // entrou pelo site, ninguém lhe tocou
  | "encomendada"  // o clube pediu ao fornecedor o que faltava
  | "pronta"       // está na sede, à espera de quem a vem buscar
  | "levantada"    // entregue e fechada
  | "cancelada";

export const ESTADOS: { id: EstadoEncomenda; nome: string; descricao: string }[] = [
  { id: "recebida",    nome: "Recebida",    descricao: "Entrou pelo site." },
  { id: "encomendada", nome: "Encomendada", descricao: "Pedida ao fornecedor." },
  { id: "pronta",      nome: "Pronta",      descricao: "Na sede, pode ser levantada." },
  { id: "levantada",   nome: "Levantada",   descricao: "Entregue. Fechada." },
  { id: "cancelada",   nome: "Cancelada",   descricao: "Não avança." },
];

/**
 * Quanto tempo a encomenda fica guardada, em dias.
 *
 * Um ano: o clube tem de saber quem encomendou o quê e quando — para
 * uma troca, uma reclamação, ou só para responder a quem liga. Passado
 * isso deixa de servir para alguma coisa, e o RGPD não deixa guardar
 * dados pessoais por guardar. A limpeza é automática.
 */
export const PRAZO_CONSERVACAO_DIAS = 365;

export type MomentoPagamento = "sinal" | "total";

export const MOMENTOS_PAGAMENTO: {
  id: MomentoPagamento;
  nome: string;
  descricao: string;
}[] = [
  {
    id: "sinal",
    nome: "Pagar um sinal agora",
    descricao:
      "Garantes a encomenda com uma parte do valor. O resto paga-se ao levantar na sede.",
  },
  {
    id: "total",
    nome: "Pagar tudo agora",
    descricao: "Fica tratado. Só tens de passar pela sede para levantar.",
  },
];

export interface LinhaEncomenda {
  slug:       string;
  nome:       string;
  tamanho:    string;
  quantidade: number;
  /** Preço unitário à data da encomenda — os preços podem mudar depois. */
  preco:      number;
  personalizacao?: { nome: string; numero: string };
  /** Estava na sede quando encomendou? Decide se é preciso pedir ao fornecedor. */
  emStock:    boolean;
}

export interface Encomenda {
  numero:     string;
  data:       string;
  nome:       string;
  email:      string;
  telemovel:  string;
  /** Número de sócio, se tiver. */
  socio?:     string;
  /** Para que atleta é, quando não é para o próprio. */
  atleta?:    string;
  notas?:     string;
  linhas:     LinhaEncomenda[];
  total:      number;
  momento:    MomentoPagamento;
  /** Valor efetivamente cobrado agora. */
  aPagarAgora: number;
  estado:     EstadoEncomenda;
  pago:       boolean;
}

/** VAC-260913-4F2A. Curto de dizer ao telefone, difícil de confundir. */
export function gerarNumero(): string {
  const d = new Date();
  const data = [
    String(d.getFullYear()).slice(2),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("");
  const aleatorio = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `VAC-${data}-${aleatorio}`;
}
