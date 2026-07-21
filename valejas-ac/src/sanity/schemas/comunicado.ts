import { defineField, defineType } from "sanity";

/**
 * COMUNICADO OFICIAL
 * ─────────────────────────────────────────────────────────────────
 * Surface de publicação da Direção/Presidente.
 * Ao publicar, um webhook do Sanity chama /api/comunicado-publish,
 * que faz fan-out para os canais escolhidos (site + Facebook + Instagram).
 * Os campos "estado de publicação" são preenchidos pela API (read-only).
 * ─────────────────────────────────────────────────────────────────
 */
export const comunicado = defineType({
  name: "comunicado",
  title: "Comunicado Oficial",
  type: "document",
  groups: [
    { name: "conteudo", title: "Conteúdo" },
    { name: "canais",   title: "Canais" },
    { name: "estado",   title: "Estado de publicação" },
  ],
  fields: [
    defineField({
      name: "titulo",
      title: "Título",
      type: "string",
      group: "conteudo",
      validation: (R) => R.required().max(120).error("Máximo 120 caracteres"),
    }),
    defineField({
      name: "slug",
      title: "URL amigável",
      type: "slug",
      group: "conteudo",
      options: { source: "titulo", maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "data",
      title: "Data",
      type: "datetime",
      group: "conteudo",
      initialValue: () => new Date().toISOString(),
      validation: (R) => R.required(),
    }),
    defineField({
      name: "autor",
      title: "Assinado por",
      type: "string",
      group: "conteudo",
      initialValue: "A Direção",
    }),
    defineField({
      name: "imagem",
      title: "Imagem (opcional)",
      description:
        "Recomendada para Instagram — o IG exige imagem. Sem imagem, o comunicado sai só no site e no Facebook.",
      type: "image",
      group: "conteudo",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Descrição (acessibilidade)", type: "string" }),
      ],
    }),
    defineField({
      name: "corpo",
      title: "Texto do comunicado",
      type: "array",
      group: "conteudo",
      of: [
        {
          type: "block",
          styles: [
            { title: "Parágrafo", value: "normal" },
            { title: "Título",    value: "h3" },
            { title: "Citação",   value: "blockquote" },
          ],
          marks: { decorators: [
            { title: "Negrito", value: "strong" },
            { title: "Itálico", value: "em" },
          ] },
        },
      ],
      validation: (R) => R.required(),
    }),
    defineField({
      name: "resumoRedes",
      title: "Legenda para redes sociais",
      description:
        "Texto curto publicado no Facebook/Instagram (o corpo completo fica no site). Máximo 2200 caracteres (limite do Instagram).",
      type: "text",
      group: "canais",
      rows: 4,
      validation: (R) => R.max(2200),
    }),
    defineField({
      name: "canais",
      title: "Publicar em",
      type: "array",
      group: "canais",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Site (sempre)", value: "site" },
          { title: "Facebook",      value: "facebook" },
          { title: "Instagram",     value: "instagram" },
        ],
      },
      initialValue: ["site"],
    }),
    // ── Estado de publicação (preenchido pela API, não editar à mão) ──
    defineField({
      name: "publicado",
      title: "Publicado",
      type: "boolean",
      group: "estado",
      initialValue: false,
      readOnly: true,
    }),
    defineField({
      name: "estadoFacebook",
      title: "Facebook",
      type: "string",
      group: "estado",
      readOnly: true,
      description: "Preenchido automaticamente após publicação.",
    }),
    defineField({
      name: "estadoInstagram",
      title: "Instagram",
      type: "string",
      group: "estado",
      readOnly: true,
      description: "Preenchido automaticamente após publicação.",
    }),
  ],
  preview: {
    select: { title: "titulo", subtitle: "data", media: "imagem" },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle: subtitle ? new Date(subtitle).toLocaleDateString("pt-PT") : "Sem data",
    }),
  },
  orderings: [
    { title: "Data (mais recente)", name: "dataDesc", by: [{ field: "data", direction: "desc" }] },
  ],
});
