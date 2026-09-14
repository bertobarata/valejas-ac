/**
 * LIGAÇÃO À BASE DE DADOS
 * ─────────────────────────────────────────────────────────────────
 * Postgres. As encomendas da loja vivem aqui e não no CMS, porque
 * levam nome, email e telemóvel de pessoas — e o CMS, no plano que o
 * clube usa, só permite datasets públicos. Público no Sanity quer
 * dizer legível por quem souber o id do projeto, que está escrito no
 * JavaScript do site. Dados pessoais não podem estar aí.
 *
 * Serve qualquer Postgres: Neon, Supabase, o que for. Só precisa de
 * `DATABASE_URL`. Sem ela o site continua a funcionar — as encomendas
 * chegam por email na mesma, só não há página para as acompanhar.
 * ─────────────────────────────────────────────────────────────────
 */

import postgres from "postgres";

/**
 * Em desenvolvimento o Next recarrega os módulos a cada alteração. Sem
 * isto, cada recarga abria uma ligação nova e deixava a anterior pendurada.
 */
const global_ = globalThis as unknown as { __bdValejas?: postgres.Sql };

export function bdConfigurada(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function bd(): postgres.Sql {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL não está definida.");
  }

  if (!global_.__bdValejas) {
    global_.__bdValejas = postgres(url, {
      // Uma ligação por instância: em serverless, muitas instâncias
      // pequenas valem mais que uma pool grande em cada uma.
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
      // Os pools de transação (o `-pooler` do Neon, o 6543 do Supabase)
      // não guardam statements preparados entre pedidos.
      prepare: false,
    });
  }
  return global_.__bdValejas;
}
