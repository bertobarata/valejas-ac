import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * ENCOMENDA DA LOJA
 * ─────────────────────────────────────────────────────────────────
 * Criada pela API quando alguém encomenda no site. Ninguém a escreve
 * à mão no Studio — o que se faz aqui (e em /direcao/encomendas) é
 * mover o estado e marcar o pagamento.
 *
 * Guarda o mínimo para o clube trabalhar: quem, o quê, quanto, e em
 * que ponto está. Sem dados de cartão, sem documentos de identificação.
 * ─────────────────────────────────────────────────────────────────
 */
export const encomenda = defineType({
  name: "encomenda",
  title: "Encomenda da Loja",
  type: "document",
  groups: [
    { name: "estado",   title: "Estado" },
    { name: "quem",     title: "Quem encomendou" },
    { name: "conteudo", title: "O que encomendou" },
  ],
  fields: [
    defineField({
      name: "numero",
      title: "Número",
      type: "string",
      group: "estado",
      readOnly: true,
      validation: (R) => R.required(),
    }),
    defineField({
      name: "data",
      title: "Data",
      type: "datetime",
      group: "estado",
      readOnly: true,
    }),
    defineField({
      name: "estado",
      title: "Estado",
      type: "string",
      group: "estado",
      initialValue: "recebida",
      options: {
        list: [
          { title: "Recebida — entrou pelo site",            value: "recebida" },
          { title: "Encomendada — pedida ao fornecedor",     value: "encomendada" },
          { title: "Pronta — na sede, pode ser levantada",   value: "pronta" },
          { title: "Levantada — entregue e fechada",         value: "levantada" },
          { title: "Cancelada",                              value: "cancelada" },
        ],
        layout: "radio",
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: "pago",
      title: "Pagamento recebido",
      description:
        "Marca quando o dinheiro entrou. Se pagou só o sinal, o resto cobra-se no levantamento.",
      type: "boolean",
      group: "estado",
      initialValue: false,
    }),
    defineField({
      name: "momento",
      title: "Escolheu pagar",
      type: "string",
      group: "estado",
      readOnly: true,
      options: {
        list: [
          { title: "Sinal agora, resto no levantamento", value: "sinal" },
          { title: "Tudo agora",                         value: "total" },
        ],
      },
    }),
    defineField({ name: "total",       title: "Total da encomenda (€)", type: "number", group: "estado", readOnly: true }),
    defineField({ name: "aPagarAgora", title: "A pagar agora (€)",     type: "number", group: "estado", readOnly: true }),

    defineField({ name: "nome",      title: "Nome",             type: "string", group: "quem", readOnly: true }),
    defineField({ name: "email",     title: "Email",            type: "string", group: "quem", readOnly: true }),
    defineField({ name: "telemovel", title: "Telemóvel",        type: "string", group: "quem", readOnly: true }),
    defineField({ name: "socio",     title: "Número de sócio",  type: "string", group: "quem", readOnly: true }),
    defineField({ name: "atleta",    title: "Para que atleta",  type: "string", group: "quem", readOnly: true }),
    defineField({ name: "notas",     title: "Notas de quem encomendou", type: "text", rows: 3, group: "quem", readOnly: true }),

    defineField({
      name: "linhas",
      title: "Peças",
      type: "array",
      group: "conteudo",
      readOnly: true,
      of: [
        defineArrayMember({
          type: "object",
          name: "linha",
          fields: [
            defineField({ name: "slug",       title: "Referência",       type: "string" }),
            defineField({ name: "nome",       title: "Peça",             type: "string" }),
            defineField({ name: "tamanho",    title: "Tamanho",          type: "string" }),
            defineField({ name: "quantidade", title: "Quantidade",       type: "number" }),
            defineField({ name: "preco",      title: "Preço unitário (€)", type: "number" }),
            defineField({
              name: "emStock",
              title: "Estava na sede",
              description: "Falso = tem de ser pedido ao fornecedor.",
              type: "boolean",
            }),
            defineField({
              name: "personalizacao",
              title: "Personalização",
              type: "object",
              fields: [
                defineField({ name: "nome",   title: "Nome nas costas", type: "string" }),
                defineField({ name: "numero", title: "Número",          type: "string" }),
              ],
            }),
          ],
          preview: {
            select: { nome: "nome", tamanho: "tamanho", quantidade: "quantidade" },
            prepare: ({ nome, tamanho, quantidade }) => ({
              title: `${quantidade ?? 1}× ${nome ?? "Peça"}`,
              subtitle: tamanho ? `Tamanho ${tamanho}` : undefined,
            }),
          },
        }),
      ],
    }),

    defineField({
      name: "notasInternas",
      title: "Notas da Direção",
      description: "Só para uso interno. Quem encomendou não vê isto.",
      type: "text",
      rows: 3,
      group: "estado",
    }),
  ],

  orderings: [
    { name: "recentes", title: "Mais recentes", by: [{ field: "data", direction: "desc" }] },
  ],

  preview: {
    select: { numero: "numero", nome: "nome", estado: "estado", total: "total" },
    prepare: ({ numero, nome, estado, total }) => ({
      title: `${numero} · ${nome ?? ""}`,
      subtitle: `${estado ?? "recebida"} — ${typeof total === "number" ? `${total} €` : ""}`,
    }),
  },
});
