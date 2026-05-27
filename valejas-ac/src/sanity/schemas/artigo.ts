import { defineField, defineType } from "sanity";

export const artigo = defineType({
  name: "artigo",
  title: "Notícia / Comunicado",
  type: "document",
  groups: [
    { name: "conteudo", title: "Conteúdo" },
    { name: "meta",     title: "Metadados" },
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
      group: "meta",
      options: { source: "titulo", maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "categoria",
      title: "Categoria",
      type: "string",
      group: "meta",
      options: {
        list: [
          { title: "Resultados",  value: "Resultados" },
          { title: "Mercado",     value: "Mercado" },
          { title: "Clube",       value: "Clube" },
          { title: "Entrevista",  value: "Entrevista" },
          { title: "Comunicado",  value: "Comunicado" },
        ],
        layout: "radio",
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "destaque",
      title: "Artigo em destaque",
      description: "Aparece em tamanho grande no topo da página de notícias e nos cards da Home.",
      type: "boolean",
      group: "meta",
      initialValue: false,
    }),
    defineField({
      name: "data",
      title: "Data de publicação",
      type: "date",
      group: "meta",
      options: { dateFormat: "DD/MM/YYYY" },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "autor",
      title: "Autor",
      type: "string",
      group: "meta",
      initialValue: "Redação Valejas AC",
    }),
    defineField({
      name: "imagem",
      title: "Imagem principal",
      description: "Não necessário em Comunicados Oficiais.",
      type: "image",
      group: "conteudo",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Descrição da imagem (acessibilidade)",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "excerto",
      title: "Excerto",
      description: "Resumo curto — aparece nas listagens e nos cards. Máximo 200 caracteres.",
      type: "text",
      group: "conteudo",
      rows: 3,
      validation: (R) => R.required().max(200),
    }),
    defineField({
      name: "conteudo",
      title: "Conteúdo do artigo",
      type: "array",
      group: "conteudo",
      of: [
        {
          type: "block",
          styles: [
            { title: "Parágrafo",   value: "normal" },
            { title: "Título H2",   value: "h2" },
            { title: "Título H3",   value: "h3" },
            { title: "Citação",     value: "blockquote" },
          ],
          marks: {
            decorators: [
              { title: "Negrito",   value: "strong" },
              { title: "Itálico",   value: "em" },
            ],
          },
        },
        { type: "image", options: { hotspot: true } },
      ],
    }),
  ],
  preview: {
    select: { title: "titulo", subtitle: "categoria", media: "imagem" },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle: subtitle ?? "Sem categoria",
    }),
  },
  orderings: [
    { title: "Data (mais recente)", name: "dataDesc", by: [{ field: "data", direction: "desc" }] },
  ],
});
