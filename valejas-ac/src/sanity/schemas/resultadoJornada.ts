import { defineField, defineType } from "sanity";

/**
 * RESULTADO DE UMA JORNADA
 * ─────────────────────────────────────────────────────────────────
 * Um jogo da prova, de qualquer equipa — não só do Valejas. Lança-se
 * em /direcao/jogos, oito de cada vez, e a classificação recalcula-se
 * a partir daqui. O calendário do Valejas recebe os seus resultados
 * por esta via.
 * ─────────────────────────────────────────────────────────────────
 */
export const resultadoJornada = defineType({
  name: "resultadoJornada",
  title: "Resultado de jornada",
  type: "document",
  fields: [
    defineField({ name: "jornada", title: "Jornada", type: "number", validation: (R) => R.required().min(1).max(30) }),
    defineField({ name: "casa", title: "Equipa da casa", type: "string", validation: (R) => R.required() }),
    defineField({ name: "fora", title: "Equipa visitante", type: "string", validation: (R) => R.required() }),
    defineField({ name: "golosCasa", title: "Golos da casa", type: "number", validation: (R) => R.required().min(0) }),
    defineField({ name: "golosFora", title: "Golos do visitante", type: "number", validation: (R) => R.required().min(0) }),
  ],
  preview: {
    select: { j: "jornada", c: "casa", f: "fora", gc: "golosCasa", gf: "golosFora" },
    prepare: ({ j, c, f, gc, gf }) => ({ title: `${c} ${gc}–${gf} ${f}`, subtitle: `Jornada ${j}` }),
  },
});
