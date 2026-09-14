/**
 * CAMADA DE DADOS — QUOTA E PAGAMENTO
 * ─────────────────────────────────────────────────────────────────
 * Decisão da Direção: quota única de 1€/mês por pessoa.
 * Sem categorias, sem jóia. O campo "Categoria" da ficha de papel
 * passa a ser preenchido pela Direção no Softgab, se ainda fizer
 * sentido para eles.
 *
 * O sócio escolhe de quanto em quanto tempo paga — o valor é sempre
 * o mesmo por mês, só muda o número de meses cobrados de cada vez.
 * ─────────────────────────────────────────────────────────────────
 */

/** ⚠️ Confirmar com a Direção antes de produção. */
export const QUOTA_MENSAL = 1; // €/mês por sócio
export const JOIA = 0;         // sem valor de entrada

export type Periodicidade = "mensal" | "trimestral" | "semestral" | "anual";

export interface OpcaoPeriodicidade {
  id:      Periodicidade;
  nome:    string;
  meses:   number;
  /** Texto curto para o cartão de escolha. */
  nota:    string;
  destaque: boolean;
}

export const PERIODICIDADES: OpcaoPeriodicidade[] = [
  { id: "mensal",     nome: "Mensal",     meses: 1,  nota: "Todos os meses",        destaque: false },
  { id: "trimestral", nome: "Trimestral", meses: 3,  nota: "De três em três meses",  destaque: false },
  { id: "semestral",  nome: "Semestral",  meses: 6,  nota: "Duas vezes por ano",    destaque: false },
  { id: "anual",      nome: "Anual",      meses: 12, nota: "Uma vez por ano",       destaque: true  },
];

export function getPeriodicidade(id: string): OpcaoPeriodicidade | undefined {
  return PERIODICIDADES.find((p) => p.id === id);
}

/** Valor cobrado de cada vez, para a periodicidade escolhida. */
export function valorPorCobranca(id: Periodicidade): number {
  const p = getPeriodicidade(id);
  return p ? QUOTA_MENSAL * p.meses : QUOTA_MENSAL;
}

/* ────────────────────────────────────────────────────────────────
 * TAXA DE PAGAMENTO ONLINE
 * Custo que o gateway cobra ao clube e que a Direção decidiu
 * repassar ao sócio. Por método, porque MB WAY e referência não
 * custam o mesmo; transferência e débito direto não passam por
 * gateway, logo não têm taxa.
 *
 * Cada método tem uma parte fixa (€) e uma percentagem do valor.
 * Tudo por variável de ambiente — a zero, a taxa desaparece do site.
 *
 *   NEXT_PUBLIC_TAXA_MBWAY_FIXA=0.20
 *   NEXT_PUBLIC_TAXA_MBWAY_PCT=1.5
 *   NEXT_PUBLIC_TAXA_REFERENCIA_FIXA=0.20
 *   NEXT_PUBLIC_TAXA_REFERENCIA_PCT=0
 *
 * ⚠️ Ver nota legal: o DL 3/2010 e a PSD2 restringem a cobrança de
 * encargos ao consumidor pelo uso de instrumentos de pagamento.
 * ──────────────────────────────────────────────────────────────── */

export interface Taxa {
  fixa:        number;   // € por cobrança
  percentagem: number;   // % sobre o valor
}

function num(v: string | undefined): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export const TAXAS: Record<MetodoPagamento, Taxa> = {
  mbway: {
    fixa:        num(process.env.NEXT_PUBLIC_TAXA_MBWAY_FIXA),
    percentagem: num(process.env.NEXT_PUBLIC_TAXA_MBWAY_PCT),
  },
  referencia: {
    fixa:        num(process.env.NEXT_PUBLIC_TAXA_REFERENCIA_FIXA),
    percentagem: num(process.env.NEXT_PUBLIC_TAXA_REFERENCIA_PCT),
  },
  // Não passam por gateway — sem custo a repassar.
  "debito-direto": { fixa: 0, percentagem: 0 },
  transferencia:   { fixa: 0, percentagem: 0 },
};

/** Taxa a cobrar, arredondada ao cêntimo acima para o clube não perder. */
export function taxaDoMetodo(metodo: string, valorBase: number): number {
  const t = TAXAS[metodo as MetodoPagamento];
  if (!t) return 0;
  const bruto = t.fixa + (valorBase * t.percentagem) / 100;
  return Math.ceil(bruto * 100) / 100;
}

export function temTaxa(metodo: string): boolean {
  const t = TAXAS[metodo as MetodoPagamento];
  return Boolean(t && (t.fixa > 0 || t.percentagem > 0));
}

/** Quota + taxa — o que o sócio paga de facto. */
export function totalAPagar(periodicidade: Periodicidade, metodo: string): number {
  const base = valorPorCobranca(periodicidade);
  return Math.round((base + taxaDoMetodo(metodo, base)) * 100) / 100;
}

export function formatEuros(v: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: v % 1 === 0 ? 0 : 2,
  }).format(v);
}

/* ────────────────────────────────────────────────────────────────
 * MÉTODOS DE PAGAMENTO
 * A Direção quer os quatro. Três dependem de contratos que o clube
 * ainda não tem — cada um é ligado por variável de ambiente, e só
 * aparece ao sócio quando estiver mesmo a funcionar.
 * ──────────────────────────────────────────────────────────────── */

export type MetodoPagamento = "mbway" | "referencia" | "debito-direto" | "transferencia";

export interface OpcaoPagamento {
  id:          MetodoPagamento;
  nome:        string;
  descricao:   string;
  /** Dados extra que o sócio tem de dar no formulário. */
  pedeIban:    boolean;
  /** Requisito que o clube tem de cumprir para isto funcionar. */
  requisito:   string;
  /**
   * Marca oficial do método, para quem reconhece o logótipo antes de ler
   * o nome. Só existe onde há marca: uma transferência bancária não tem
   * logótipo nenhum, e inventar um seria pior que não ter.
   * Ficheiros em /public/pagamentos, tal como vêm de mbway.pt e
   * multibanco.pt — marcas registadas da SIBS, usadas só para indicar
   * que o clube aceita estes meios de pagamento.
   */
  logo?: { src: string; alt: string; largura: number; altura: number };
}

export const METODOS_PAGAMENTO: OpcaoPagamento[] = [
  {
    id:        "mbway",
    nome:      "MB WAY",
    descricao: "Envias o valor para o número do clube pela app MB WAY.",
    pedeIban:  false,
    requisito: "Nenhum — o clube confirma na app",
    logo: { src: "/pagamentos/mbway.png", alt: "MB WAY", largura: 292, altura: 143 },
  },
  {
    id:        "referencia",
    nome:      "Entidade e Referência",
    descricao: "Recebes entidade e referência para pagar no Multibanco ou no homebanking. Válida 24 horas.",
    pedeIban:  false,
    requisito: "Contrato com gateway (Ifthenpay ou Easypay)",
    logo: { src: "/pagamentos/multibanco.svg", alt: "Multibanco", largura: 742, altura: 189 },
  },
  {
    id:        "debito-direto",
    nome:      "Débito Direto",
    descricao: "A quota é debitada automaticamente na tua conta. Nunca te esqueces.",
    pedeIban:  true,
    requisito: "Mandato SEPA assinado + contrato de cobrança com o banco do clube",
  },
  {
    id:        "transferencia",
    nome:      "Transferência Bancária",
    descricao: "Transferes para o IBAN do clube com o teu nome como referência.",
    pedeIban:  false,
    requisito: "Nenhum — só o IBAN do clube",
  },
];

/**
 * Liga/desliga métodos sem mexer em código.
 * Ex.: NEXT_PUBLIC_PAGAMENTOS_ATIVOS="mbway,transferencia,referencia"
 * Sem a variável, aparecem MB WAY e transferência — os dois que não
 * dependem de contratos. Entidade/Referência e Débito Direto só depois
 * de o clube ter gateway e mandato SEPA.
 */
export function metodosAtivos(): OpcaoPagamento[] {
  const env = process.env.NEXT_PUBLIC_PAGAMENTOS_ATIVOS;
  const ativos = env ? env.split(",").map((s) => s.trim()) : ["mbway", "transferencia"];
  return METODOS_PAGAMENTO.filter((m) => ativos.includes(m.id));
}

/**
 * Dados de pagamento do clube — todos por variável de ambiente.
 * Se o clube mudar de conta ou de número MB WAY, muda-se a variável na
 * Vercel e no .env.local; não se toca em código nem se faz deploy novo
 * de raiz. Nada aqui está escrito à mão de propósito.
 *
 *   NEXT_PUBLIC_CLUBE_IBAN=PT50 ...
 *   NEXT_PUBLIC_CLUBE_MBWAY=9xx xxx xxx
 *   NEXT_PUBLIC_CLUBE_TITULAR=Valejas Atlético Clube
 *   NEXT_PUBLIC_CLUBE_ENTIDADE=00000     (só se houver gateway)
 *
 * Em falta, o site não inventa dados: diz ao sócio que o clube envia
 * por email.
 */
export const DADOS_BANCARIOS = {
  iban:     process.env.NEXT_PUBLIC_CLUBE_IBAN     ?? "",
  mbway:    process.env.NEXT_PUBLIC_CLUBE_MBWAY    ?? "",
  titular:  process.env.NEXT_PUBLIC_CLUBE_TITULAR  ?? "Valejas Atlético Clube",
  entidade: process.env.NEXT_PUBLIC_CLUBE_ENTIDADE ?? "",
};
