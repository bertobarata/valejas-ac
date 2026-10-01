import { defineField, defineType } from "sanity";

/**
 * MEMBRO DA EQUIPA TÉCNICA
 * ─────────────────────────────────────────────────────────────────
 * Quem treina e está no banco. Escreve-se em /direcao/plantel, ao
 * lado dos jogadores — esta é a forma como fica guardado.
 * ─────────────────────────────────────────────────────────────────
 */
export const membroTecnico = defineType({
  name: "membroTecnico",
  title: "Equipa técnica",
  type: "document",
  fields: [
    defineField({
      name: "nome",
      title: "Nome",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "cargo",
      title: "Cargo",
      description: "Ex.: Treinador principal, Treinador de guarda-redes, Treinador sub-13.",
      type: "string",
      validation: (R) => R.required(),
    }),
    defineField({
      name: "fotografia",
      title: "Fotografia",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "ordem",
      title: "Ordem",
      description: "Menor aparece primeiro.",
      type: "number",
      initialValue: 10,
    }),
    defineField({
      name: "ativo",
      title: "Na equipa técnica",
      description: "Desligar em vez de apagar, para quem saiu a meio da época.",
      type: "boolean",
      initialValue: true,
    }),
  ],
  orderings: [
    { name: "ordem", title: "Por ordem", by: [{ field: "ordem", direction: "asc" }] },
  ],
  preview: {
    select: { nome: "nome", cargo: "cargo", media: "fotografia" },
    prepare: ({ nome, cargo, media }) => ({ title: nome, subtitle: cargo, media }),
  },
});
