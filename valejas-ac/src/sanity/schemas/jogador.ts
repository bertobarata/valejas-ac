import { defineField, defineType } from "sanity";

/**
 * JOGADOR
 * ─────────────────────────────────────────────────────────────────
 * O plantel escreve-se em /direcao/plantel, não aqui — esta é a
 * forma como fica guardado.
 *
 * Sem estatísticas: a Direção pediu um plantel, não uma ficha de
 * scouting. Golos, assistências e ratings saíram do modelo em vez de
 * ficarem a zero para sempre.
 * ─────────────────────────────────────────────────────────────────
 */
export const jogador = defineType({
  name: "jogador",
  title: "Jogador",
  type: "document",
  fields: [
    defineField({
      name: "nome",
      title: "Nome",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "numero",
      title: "Número de camisola",
      type: "number",
      validation: (R) => R.required().min(1).max(99),
    }),
    defineField({
      name: "posicao",
      title: "Posição",
      type: "string",
      options: {
        list: [
          { title: "Guarda-Redes", value: "Guarda-Redes" },
          { title: "Fixo",         value: "Fixo" },
          { title: "Ala",          value: "Ala" },
          { title: "Pivot",        value: "Pivot" },
          { title: "Universal",    value: "Universal" },
        ],
        layout: "radio",
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "equipa",
      title: "Equipa",
      description: "«a» e «b» para os seniores; os escalões em minúsculas.",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "capitao",
      title: "Capitão",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "ativo",
      title: "No plantel",
      description: "Desligar em vez de apagar, para quem saiu a meio da época.",
      type: "boolean",
      initialValue: true,
    }),
  ],

  orderings: [
    { name: "numero", title: "Por número", by: [{ field: "numero", direction: "asc" }] },
  ],

  preview: {
    select: { nome: "nome", numero: "numero", posicao: "posicao", equipa: "equipa" },
    prepare: ({ nome, numero, posicao, equipa }) => ({
      title: `${numero ?? "?"} · ${nome}`,
      subtitle: [posicao, equipa].filter(Boolean).join(" — "),
    }),
  },
});
