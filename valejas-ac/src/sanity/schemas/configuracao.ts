import { defineField, defineType } from "sanity";

/**
 * Documento singleton — só existe um registo "configuracao".
 * Usado para dados globais: contactos, redes sociais, slogan, etc.
 */
export const configuracao = defineType({
  name: "configuracao",
  title: "Configurações do Clube",
  type: "document",
  // Prevenir múltiplos documentos deste tipo na structure
  __experimental_actions: ["update", "publish"],
  groups: [
    { name: "contacto",  title: "Contacto" },
    { name: "social",    title: "Redes Sociais" },
    { name: "conteudo",  title: "Conteúdo global" },
  ],
  fields: [
    // ── Contacto ────────────────────────────────────────────────────
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      group: "contacto",
    }),
    defineField({
      name: "telefone",
      title: "Telefone",
      type: "string",
      group: "contacto",
    }),
    defineField({
      name: "morada",
      title: "Morada",
      type: "string",
      group: "contacto",
    }),
    defineField({
      name: "codigoPostal",
      title: "Código Postal",
      type: "string",
      group: "contacto",
    }),
    defineField({
      name: "concelho",
      title: "Concelho",
      type: "string",
      group: "contacto",
    }),
    // ── Redes sociais ────────────────────────────────────────────────
    defineField({
      name: "instagram",
      title: "Instagram (URL completo)",
      type: "url",
      group: "social",
    }),
    defineField({
      name: "facebook",
      title: "Facebook (URL completo)",
      type: "url",
      group: "social",
    }),
    defineField({
      name: "youtube",
      title: "YouTube (URL completo)",
      type: "url",
      group: "social",
    }),
    defineField({
      name: "tiktok",
      title: "TikTok (URL completo)",
      type: "url",
      group: "social",
    }),
    // ── Conteúdo global ──────────────────────────────────────────────
    defineField({
      name: "totalSocios",
      title: "Total de sócios (número)",
      type: "number",
      group: "conteudo",
      description: "Aparece no hero da página de sócios e nos contadores da Home.",
      initialValue: 850,
    }),
    defineField({
      name: "sloganHero",
      title: "Slogan / subtítulo do Hero",
      type: "string",
      group: "conteudo",
      initialValue: "A Vanguarda de Valejas",
    }),
    defineField({
      name: "proximoJogo",
      title: "Próximo jogo em destaque",
      description: "Seleciona o jogo a mostrar no banner da Home.",
      type: "reference",
      group: "conteudo",
      to: [{ type: "jogo" }],
    }),
    defineField({
      name: "ultimoResultado",
      title: "Último resultado em destaque",
      description: "Jogo já realizado a mostrar no banner da Home.",
      type: "reference",
      group: "conteudo",
      to: [{ type: "jogo" }],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Configurações do Clube" }),
  },
});
