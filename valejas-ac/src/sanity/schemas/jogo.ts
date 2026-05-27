import { defineField, defineType } from "sanity";

export const jogo = defineType({
  name: "jogo",
  title: "Jogo",
  type: "document",
  groups: [
    { name: "info",      title: "Informação" },
    { name: "resultado", title: "Resultado" },
  ],
  fields: [
    defineField({
      name: "adversario",
      title: "Adversário",
      type: "string",
      group: "info",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "data",
      title: "Data e hora",
      type: "datetime",
      group: "info",
      options: { dateFormat: "DD/MM/YYYY", timeFormat: "HH:mm", timeStep: 15 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "local",
      title: "Local / Pavilhão",
      type: "string",
      group: "info",
    }),
    defineField({
      name: "competicao",
      title: "Competição",
      type: "string",
      group: "info",
      options: {
        list: [
          { title: "Liga Principal",         value: "Liga Principal" },
          { title: "Taça de Portugal",        value: "Taça de Portugal" },
          { title: "Supertaça",              value: "Supertaça" },
          { title: "Campeonato Distrital",   value: "Campeonato Distrital" },
          { title: "Taça Distrital",         value: "Taça Distrital" },
          { title: "Particular",             value: "Particular" },
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "ehEmCasa",
      title: "Jogo em casa (Casa)",
      description: "Ativar se o Valejas AC joga no seu pavilhão.",
      type: "boolean",
      group: "info",
      initialValue: true,
    }),
    defineField({
      name: "jogado",
      title: "Jogo já realizado",
      description: "Ativar após o jogo terminar para registar o resultado.",
      type: "boolean",
      group: "resultado",
      initialValue: false,
    }),
    defineField({
      name: "golosNossos",
      title: "Golos Valejas AC",
      type: "number",
      group: "resultado",
      hidden: ({ document }) => !document?.jogado,
      initialValue: 0,
    }),
    defineField({
      name: "golosAdversario",
      title: "Golos Adversário",
      type: "number",
      group: "resultado",
      hidden: ({ document }) => !document?.jogado,
      initialValue: 0,
    }),
    defineField({
      name: "marcadores",
      title: "Marcadores do Valejas AC",
      type: "array",
      group: "resultado",
      hidden: ({ document }) => !document?.jogado,
      of: [{ type: "string" }],
    }),
    defineField({
      name: "linkBilhetes",
      title: "Link de bilhetes",
      type: "url",
      group: "info",
    }),
  ],
  preview: {
    select: {
      adversario: "adversario",
      data:       "data",
      jogado:     "jogado",
      nossos:     "golosNossos",
      adversario2: "golosAdversario",
    },
    prepare: ({ adversario, data, jogado, nossos, adversario2 }) => {
      const dataStr = data
        ? new Date(data).toLocaleDateString("pt-PT", { day: "2-digit", month: "2-digit", year: "2-digit" })
        : "";
      const resultado = jogado ? `${nossos ?? 0}–${adversario2 ?? 0}` : "Por jogar";
      return {
        title:    `vs ${adversario}`,
        subtitle: `${dataStr} · ${resultado}`,
      };
    },
  },
  orderings: [
    { title: "Data (mais recente)", name: "dataDesc", by: [{ field: "data", direction: "desc" }] },
    { title: "Data (próximos)",     name: "dataAsc",  by: [{ field: "data", direction: "asc"  }] },
  ],
});
