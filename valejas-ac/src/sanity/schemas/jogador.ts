import { defineField, defineType } from "sanity";

export const jogador = defineType({
  name: "jogador",
  title: "Jogador",
  type: "document",
  groups: [
    { name: "perfil",      title: "Perfil" },
    { name: "estatisticas", title: "Estatísticas" },
  ],
  fields: [
    defineField({
      name: "nome",
      title: "Nome do jogador",
      type: "string",
      group: "perfil",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "numero",
      title: "Número de camisola",
      type: "number",
      group: "perfil",
      validation: (R) => R.required().min(1).max(99),
    }),
    defineField({
      name: "posicao",
      title: "Posição",
      type: "string",
      group: "perfil",
      options: {
        list: [
          { title: "Guarda-redes", value: "Guarda-redes" },
          { title: "Universal",    value: "Universal" },
          { title: "Ala",          value: "Ala" },
          { title: "Pivot",        value: "Pivot" },
        ],
        layout: "radio",
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "equipa",
      title: "Equipa",
      type: "string",
      group: "perfil",
      options: {
        list: [
          { title: "Seniores Masculinos",  value: "Masculinos" },
          { title: "Seniores Femininos",   value: "Femininos" },
          { title: "Sub-19",               value: "Sub-19" },
          { title: "Sub-17",               value: "Sub-17" },
          { title: "Sub-15",               value: "Sub-15" },
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "ativo",
      title: "Ativo no plantel",
      description: "Desativar para jogadores que saíram mas devem constar no histórico.",
      type: "boolean",
      group: "perfil",
      initialValue: true,
    }),
    defineField({
      name: "foto",
      title: "Fotografia",
      type: "image",
      group: "perfil",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Descrição da imagem",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "nacionalidade",
      title: "Nacionalidade",
      type: "string",
      group: "perfil",
      initialValue: "Portuguesa",
    }),
    defineField({
      name: "golos",
      title: "Golos na época",
      type: "number",
      group: "estatisticas",
      initialValue: 0,
    }),
    defineField({
      name: "assistencias",
      title: "Assistências na época",
      type: "number",
      group: "estatisticas",
      initialValue: 0,
    }),
    defineField({
      name: "rating",
      title: "Rating (0–10)",
      type: "number",
      group: "estatisticas",
      validation: (R) => R.min(0).max(10),
      initialValue: 0,
    }),
    defineField({
      name: "epoca",
      title: "Época",
      description: "Ex: 2024/25",
      type: "string",
      group: "estatisticas",
      initialValue: "2024/25",
    }),
  ],
  preview: {
    select: {
      title:    "nome",
      subtitle: "posicao",
      media:    "foto",
      numero:   "numero",
    },
    prepare: ({ title, subtitle, media, numero }) => ({
      title: `${numero ? `#${numero} ` : ""}${title}`,
      subtitle,
      media,
    }),
  },
  orderings: [
    { title: "Número de camisola", name: "numeroAsc", by: [{ field: "numero", direction: "asc" }] },
    { title: "Nome (A–Z)",         name: "nomeAsc",   by: [{ field: "nome",   direction: "asc" }] },
  ],
});
