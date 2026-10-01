/**
 * OS JOGOS TAL COMO O SITE OS MOSTRA
 * ─────────────────────────────────────────────────────────────────
 * O calendário oficial (30 jornadas) é a base e nunca desaparece.
 * Por cima entram os resultados lançados por jornada, e a classificação
 * recalcula-se a partir da base guardada mais esses resultados.
 *
 * Os jogos lançados em /direcao/jogos («Novo jogo») são os avulsos —
 * particulares, taças — e juntam-se ao calendário em vez de o
 * substituírem. Antes, um único jogo no CMS fazia sumir o calendário
 * e o «próximo jogo» da página.
 * ─────────────────────────────────────────────────────────────────
 */

import { fetchJogos, fetchClassificacao, fetchResultadosJornada } from "@/sanity/queries";
import {
  CALENDARIO, CLASSIFICACAO, doSanity, proximoDe, resultadosDe,
  type Jogo, type LinhaClassificacao,
} from "@/lib/data/jogos";
import { recalcular, sobreporResultados } from "@/lib/classificacao";

export interface JogosDoSite {
  calendario:    Jogo[];
  proximo:       Jogo | null;
  resultados:    Jogo[];
  classificacao: LinhaClassificacao[];
}

const dia = (iso: string) => iso.slice(0, 10);

export async function carregarJogos(): Promise<JogosDoSite> {
  const [avulsosCms, resultadosCms, base] = await Promise.all([
    fetchJogos(),
    fetchResultadosJornada(),
    fetchClassificacao(),
  ]);
  const rs = resultadosCms ?? [];

  const calendario = sobreporResultados(CALENDARIO, rs);

  const avulsos = (avulsosCms ?? [])
    .map(doSanity)
    .filter((a) => !calendario.some(
      (c) => c.casa === a.casa && c.fora === a.fora && dia(c.data) === dia(a.data)
    ));
  const todos = [...calendario, ...avulsos];

  return {
    calendario,
    proximo: proximoDe(todos),
    resultados: resultadosDe(todos),
    classificacao: recalcular(
      base?.linhas ?? CLASSIFICACAO,
      rs,
      base?.ateJornada ?? 0
    ),
  };
}
