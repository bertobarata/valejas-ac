/**
 * ENCOMENDAS — LEITURA E ESCRITA EM BASE DE DADOS
 * ─────────────────────────────────────────────────────────────────
 * A encomenda entra pelo site, o clube trabalha-a em /direcao/encomendas
 * e fecha-se quando alguém a levanta na sede.
 *
 * O que se guarda é o mínimo para isso acontecer: quem, o quê, quanto,
 * e em que ponto está. Sem dados de pagamento, sem documentos de
 * identificação. As peças ficam em JSON porque são uma fotografia do
 * carrinho no momento da compra — os preços mudam, a encomenda não.
 *
 * A tabela cria-se sozinha à primeira utilização. Um clube não tem
 * quem corra migrações à mão, e `create table if not exists` custa
 * uma ida ao servidor por arranque.
 * ─────────────────────────────────────────────────────────────────
 */

import type postgres from "postgres";

import { bd, bdConfigurada } from "./cliente";
import {
  gerarNumero, PRAZO_CONSERVACAO_DIAS,
  type Encomenda,
  type EstadoEncomenda,
  type LinhaEncomenda,
  type MomentoPagamento,
} from "@/lib/data/encomendas";

export { bdConfigurada };

/** Como a encomenda sai da base de dados: com a chave por onde se altera. */
export interface EncomendaGuardada extends Encomenda {
  id: string;
  notasInternas?: string;
}

/** Corre uma vez por instância, não uma vez por pedido. */
let tabelaPronta: Promise<void> | null = null;

async function garantirTabela(): Promise<void> {
  if (!tabelaPronta) {
    tabelaPronta = (async () => {
      const sql = bd();
      await sql`
        create table if not exists encomendas (
          id             bigint generated always as identity primary key,
          numero         text        not null unique,
          criada_em      timestamptz not null default now(),
          nome           text        not null,
          email          text        not null,
          telemovel      text        not null,
          socio          text,
          atleta         text,
          notas          text,
          linhas         jsonb       not null,
          total          numeric(10,2) not null,
          momento        text        not null,
          a_pagar_agora  numeric(10,2) not null,
          estado         text        not null default 'recebida',
          pago           boolean     not null default false,
          notas_internas text
        )
      `;
      await sql`
        create index if not exists encomendas_criada_em_idx
          on encomendas (criada_em desc)
      `;
    })().catch((err) => {
      // Se falhou, a próxima tentativa que volte a tentar em vez de
      // ficar presa a uma promessa rejeitada para sempre.
      tabelaPronta = null;
      throw err;
    });
  }
  return tabelaPronta;
}

/** O `numeric` do Postgres chega como texto, para não perder casas decimais. */
function euros(valor: unknown): number {
  const n = Number(valor);
  return Number.isFinite(n) ? n : 0;
}

interface Linha {
  id:             string;
  numero:         string;
  criada_em:      Date;
  nome:           string;
  email:          string;
  telemovel:      string;
  socio:          string | null;
  atleta:         string | null;
  notas:          string | null;
  linhas:         LinhaEncomenda[];
  total:          string;
  momento:        string;
  a_pagar_agora:  string;
  estado:         string;
  pago:           boolean;
  notas_internas: string | null;
}

function paraEncomenda(l: Linha): EncomendaGuardada {
  return {
    id:          String(l.id),
    numero:      l.numero,
    data:        l.criada_em.toISOString(),
    nome:        l.nome,
    email:       l.email,
    telemovel:   l.telemovel,
    ...(l.socio  ? { socio:  l.socio  } : {}),
    ...(l.atleta ? { atleta: l.atleta } : {}),
    ...(l.notas  ? { notas:  l.notas  } : {}),
    linhas:      Array.isArray(l.linhas) ? l.linhas : [],
    total:       euros(l.total),
    momento:     l.momento as MomentoPagamento,
    aPagarAgora: euros(l.a_pagar_agora),
    estado:      l.estado as EstadoEncomenda,
    pago:        l.pago,
    ...(l.notas_internas ? { notasInternas: l.notas_internas } : {}),
  };
}

/** Tudo o que a encomenda traz de fora. O número e a data nascem aqui. */
export type EncomendaNova = Omit<Encomenda, "numero" | "data" | "estado" | "pago">;

/**
 * Grava a encomenda e devolve-a com número atribuído.
 *
 * O número é curto de propósito (VAC-260913-4F2A) para se dizer ao
 * telefone, e curto quer dizer que pode repetir-se. Daí as tentativas:
 * é a base de dados que garante a unicidade, não o acaso.
 */
export async function guardarEncomenda(nova: EncomendaNova): Promise<EncomendaGuardada> {
  await garantirTabela();
  const sql = bd();

  for (let tentativa = 0; tentativa < 5; tentativa++) {
    const numero = gerarNumero();
    try {
      const [linha] = await sql<Linha[]>`
        insert into encomendas
          (numero, nome, email, telemovel, socio, atleta, notas,
           linhas, total, momento, a_pagar_agora)
        values
          (${numero}, ${nova.nome}, ${nova.email}, ${nova.telemovel},
           ${nova.socio ?? null}, ${nova.atleta ?? null}, ${nova.notas ?? null},
           ${sql.json(nova.linhas as unknown as postgres.JSONValue)}, ${nova.total},
           ${nova.momento}, ${nova.aPagarAgora})
        returning *
      `;
      return paraEncomenda(linha);
    } catch (err) {
      // 23505 = unique_violation. Só o número pode colidir; repete-se.
      const codigo = (err as { code?: string })?.code;
      if (codigo !== "23505" || tentativa === 4) throw err;
    }
  }

  throw new Error("Não foi possível atribuir um número à encomenda.");
}

export async function listarEncomendas(limite = 200): Promise<EncomendaGuardada[]> {
  await garantirTabela();
  const sql = bd();
  const linhas = await sql<Linha[]>`
    select * from encomendas
    order by criada_em desc
    limit ${limite}
  `;
  return linhas.map(paraEncomenda);
}

/** O que a Direção pode mexer. O resto da encomenda é história e fica. */
export interface Alteracoes {
  estado?:        EstadoEncomenda;
  pago?:          boolean;
  notasInternas?: string;
}

export async function atualizarEncomenda(id: string, a: Alteracoes): Promise<boolean> {
  await garantirTabela();
  const sql = bd();

  // `coalesce` deixa passar só o que veio: o que for `null` fica como está.
  // Os casts existem porque o Postgres não adivinha o tipo de um `null`.
  const [linha] = await sql<{ id: string }[]>`
    update encomendas set
      estado         = coalesce(${a.estado ?? null}::text, estado),
      pago           = coalesce(${a.pago ?? null}::boolean, pago),
      notas_internas = coalesce(${a.notasInternas ?? null}::text, notas_internas)
    where id = ${Number(id)}
    returning id
  `;
  return Boolean(linha);
}

/**
 * Apaga as encomendas que passaram do prazo de conservação.
 *
 * Corre uma vez por dia, chamada pelo cron da Vercel. Devolve quantas
 * apagou, para ficar registo de que a limpeza aconteceu.
 */
export async function apagarEncomendasAntigas(
  dias = PRAZO_CONSERVACAO_DIAS
): Promise<number> {
  await garantirTabela();
  const sql = bd();
  const apagadas = await sql<{ id: string }[]>`
    delete from encomendas
    where criada_em < now() - make_interval(days => ${dias})
    returning id
  `;
  return apagadas.length;
}
