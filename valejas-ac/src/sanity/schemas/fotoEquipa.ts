import { defineField, defineType } from "sanity";

/**
 * FOTOGRAFIA DA EQUIPA — documento único (`_id: "fotoEquipa"`)
 * ─────────────────────────────────────────────────────────────────
 * A imagem grande no topo de /equipas. Muda-se em /direcao/plantel.
 * Sem fotografia, o topo mostra o emblema do clube.
 * ─────────────────────────────────────────────────────────────────
 */
export const fotoEquipa = defineType({
  name: "fotoEquipa",
  title: "Fotografia da equipa",
  type: "document",
  fields: [
    defineField({
      name: "fotografia",
      title: "Fotografia",
      description: "Vertical (4:5) fica melhor. Arrasta o círculo sobre o que tem de ficar sempre visível.",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: { prepare: () => ({ title: "Fotografia da equipa" }) },
});
