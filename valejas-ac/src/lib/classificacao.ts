/**
 * CLASSIFICAÇÃO A PARTIR DOS RESULTADOS
 * ─────────────────────────────────────────────────────────────────
 * A tabela é uma fotografia (a «base», guardada à mão ou colada da
 * AF Lisboa) mais os resultados das jornadas seguintes. Um resultado
 * lançado por jornada — os oito jogos — mexe nas duas equipas.
 *
 * `ateJornada` diz até onde a base já conta. Resultados dessas
 * jornadas, ou anteriores, não se somam outra vez: era contá-los duas
 * vezes. Sem base, parte-se de zero.
 *
 * Desempate: pontos e, a pontos iguais, a ordem da última tabela
 * oficial. O regulamento desempata pelo confronto direto, e uma
 * diferença de golos não o reproduz (o cartaz da AF Lisboa pôs o SM 3
 * Agosto acima do Fonsecas Calçada com menos saldo). Só se mexe numa
 * posição quando os pontos mudam. Se um empate novo sair diferente da
 * oficial, a Direção corrige à mão — guardar a tabela à mão passa a ser
 * a nova base.
 *
 * Módulo sem dependências de servidor: corre também no browser, para
 * a pré-visualização do que a jornada vai fazer à tabela.
 * ─────────────────────────────────────────────────────────────────
 */

import { CLUBE, type Jogo, type LinhaClassificacao } from "@/lib/data/jogos";

export interface ResultadoJornada {
  jornada:   number;
  casa:      string;
  fora:      string;
  golosCasa: number;
  golosFora: number;
}

/** Soma os resultados posteriores à base e volta a ordenar. */
export function recalcular(
  base: LinhaClassificacao[],
  resultados: ResultadoJornada[],
  ateJornada: number
): LinhaClassificacao[] {
  const linhas = new Map<string, LinhaClassificacao>(
    base.map((l) => [l.equipa, { ...l }])
  );

  const da = (equipa: string): LinhaClassificacao => {
    let l = linhas.get(equipa);
    if (!l) {
      l = {
        posicao: 0, equipa, jogos: 0, vitorias: 0, empates: 0,
        derrotas: 0, golosMarcados: 0, golosSofridos: 0, pontos: 0,
      };
      linhas.set(equipa, l);
    }
    return l;
  };

  for (const r of resultados) {
    if (r.jornada <= ateJornada) continue;
    const casa = da(r.casa);
    const fora = da(r.fora);

    casa.jogos++; fora.jogos++;
    casa.golosMarcados += r.golosCasa; casa.golosSofridos += r.golosFora;
    fora.golosMarcados += r.golosFora; fora.golosSofridos += r.golosCasa;

    if (r.golosCasa > r.golosFora) {
      casa.vitorias++; casa.pontos += 3; fora.derrotas++;
    } else if (r.golosCasa < r.golosFora) {
      fora.vitorias++; fora.pontos += 3; casa.derrotas++;
    } else {
      casa.empates++; fora.empates++; casa.pontos++; fora.pontos++;
    }
  }

  // A ordem da base é o desempate. Quem não está na base fica no fim.
  const ordemBase = new Map(base.map((l, i) => [l.equipa, i]));
  const ondeEstava = (e: string) => ordemBase.get(e) ?? Number.MAX_SAFE_INTEGER;

  return Array.from(linhas.values())
    .sort((a, b) =>
      b.pontos - a.pontos ||
      ondeEstava(a.equipa) - ondeEstava(b.equipa) ||
      a.equipa.localeCompare(b.equipa, "pt")
    )
    .map((l, i) => ({ ...l, posicao: i + 1 }));
}

/**
 * Põe os resultados lançados no calendário. Um jogo do calendário
 * recebe o resultado da mesma jornada entre as mesmas duas equipas.
 */
export function sobreporResultados(
  calendario: Jogo[],
  resultados: ResultadoJornada[]
): Jogo[] {
  return calendario.map((j) => {
    const r = resultados.find(
      (x) => x.jornada === j.jornada && x.casa === j.casa && x.fora === j.fora
    );
    return r ? { ...j, golosCasa: r.golosCasa, golosFora: r.golosFora } : j;
  });
}

/** Os jogos do Valejas na jornada, para pré-preencher o formulário. */
export function jogoDoClubeNaJornada(calendario: Jogo[], jornada: number): Jogo | undefined {
  return calendario.find(
    (j) => j.jornada === jornada && (j.casa === CLUBE || j.fora === CLUBE)
  );
}
