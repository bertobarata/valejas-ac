import { defineField, defineType } from "sanity";

/**
 * CLASSIFICAÇÃO — documento único
 * ─────────────────────────────────────────────────────────────────
 * Só existe um. É atualizado pelo departamento de comunicação em
 * /direcao/jogos, normalmente colando a tabela da AF Lisboa.
 * ─────────────────────────────────────────────────────────────────
 */
export const classificacao = defineType({
  name: "classificacao",
  title: "Classificação",
  type: "document",
  fields: [
    defineField({
      name: "competicao",
      title: "Competição",
      type: "string",
      initialValue: "Distrital AF Lisboa",
    }),
    defineField({
      name: "atualizadoEm",
      title: "Atualizado em",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "linhas",
      title: "Classificados",
      type: "array",
      of: [
        {
          type: "object",
          name: "linha",
          fields: [
            { name: "posicao",       title: "Posição",        type: "number" },
            { name: "equipa",        title: "Equipa",         type: "string" },
            { name: "jogos",         title: "Jogos",          type: "number" },
            { name: "vitorias",      title: "Vitórias",       type: "number" },
            { name: "empates",       title: "Empates",        type: "number" },
            { name: "derrotas",      title: "Derrotas",       type: "number" },
            { name: "golosMarcados", title: "Golos marcados", type: "number" },
            { name: "golosSofridos", title: "Golos sofridos", type: "number" },
            { name: "pontos",        title: "Pontos",         type: "number" },
          ],
          preview: {
            select: { posicao: "posicao", equipa: "equipa", pontos: "pontos" },
            prepare: ({ posicao, equipa, pontos }) => ({
              title: `${posicao}. ${equipa}`,
              subtitle: `${pontos} pontos`,
            }),
          },
        },
      ],
    }),
  ],
  preview: {
    select: { competicao: "competicao", atualizadoEm: "atualizadoEm" },
    prepare: ({ competicao, atualizadoEm }) => ({
      title: competicao ?? "Classificação",
      subtitle: atualizadoEm
        ? `Atualizada a ${new Date(atualizadoEm).toLocaleDateString("pt-PT")}`
        : "Nunca atualizada",
    }),
  },
});
