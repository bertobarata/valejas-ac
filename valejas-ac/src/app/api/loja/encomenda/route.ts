/**
 * API — ENCOMENDA DA LOJA
 * ─────────────────────────────────────────────────────────────────
 * Recebe a encomenda, revalida tudo do lado do servidor, e faz duas
 * coisas independentes:
 *
 *   1. Email para o clube (e recibo para quem encomendou). Isto é o
 *      que garante que a encomenda não se perde — funciona mesmo sem
 *      CMS ligado.
 *   2. Documento no Sanity, quando há token de escrita, para a
 *      encomenda aparecer em /direcao/encomendas e poder mudar de
 *      estado.
 *
 * Os preços NUNCA vêm do cliente: chegam slugs, tamanhos e
 * quantidades, e o servidor vai buscar o preço ao catálogo. Se o
 * carrinho do browser for manipulado, o total continua a ser o nosso.
 *
 * Não guarda dados de pagamento. O pagamento trata-se fora daqui.
 * ─────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import {
  PRAZO_ENCOMENDA_SEMANAS, SINAL_PERCENTAGEM,
  formatEuros, getProduto, sinalDe, stockDe,
} from "@/lib/data/loja";
import {
  MOMENTOS_PAGAMENTO, gerarNumero,
  type Encomenda, type LinhaEncomenda, type MomentoPagamento,
} from "@/lib/data/encomendas";
import { validarEmail, validarNomeCompleto, validarTelemovel } from "@/lib/validacao";
import { enviarEmail, emailDoClube, emailPara, emailConfigurado } from "@/lib/email";
import { sanityClientLive, isSanityConfigured } from "@/sanity/client";

export const runtime = "nodejs";

/** Uma pessoa não encomenda 400 camisolas. Travão contra abuso do endpoint. */
const MAX_LINHAS = 20;
const MAX_POR_LINHA = 10;

interface LinhaRecebida {
  slug?: unknown;
  tamanho?: unknown;
  quantidade?: unknown;
  personalizacao?: { nome?: unknown; numero?: unknown };
}

/**
 * Converte o que veio do browser em linhas de confiança, com preço e
 * stock lidos do catálogo do servidor.
 */
function resolverLinhas(recebidas: LinhaRecebida[]): { linhas: LinhaEncomenda[]; erros: string[] } {
  const linhas: LinhaEncomenda[] = [];
  const erros: string[] = [];

  for (const bruta of recebidas) {
    const slug    = String(bruta.slug ?? "").trim();
    const tamanho = String(bruta.tamanho ?? "").trim();
    const produto = getProduto(slug);

    if (!produto) {
      erros.push(`Peça desconhecida: ${slug || "(sem referência)"}.`);
      continue;
    }
    // Sem preço fechado não há nada a cobrar: pede-se orçamento ao clube.
    // O site já não mostra botão, mas a regra tem de valer no servidor.
    if (produto.sobConsulta || produto.preco <= 0) {
      erros.push(`${produto.nome} é sob consulta — fala com o clube para encomendar.`);
      continue;
    }
    if (!produto.variantes.some((v) => v.tamanho === tamanho)) {
      erros.push(`Tamanho inválido para ${produto.nome}.`);
      continue;
    }

    const quantidade = Math.floor(Number(bruta.quantidade ?? 0));
    if (!Number.isFinite(quantidade) || quantidade < 1 || quantidade > MAX_POR_LINHA) {
      erros.push(`Quantidade inválida para ${produto.nome} (1 a ${MAX_POR_LINHA}).`);
      continue;
    }

    // A personalização só existe onde o produto a permite.
    let personalizacao: LinhaEncomenda["personalizacao"];
    if (produto.personalizavel && bruta.personalizacao) {
      const nome   = String(bruta.personalizacao.nome ?? "").trim().slice(0, 20);
      const numero = String(bruta.personalizacao.numero ?? "").trim().slice(0, 2);
      if (nome || numero) personalizacao = { nome, numero };
    }

    linhas.push({
      slug: produto.slug,
      nome: produto.nome,
      tamanho,
      quantidade,
      preco: produto.preco,
      emStock: stockDe(produto, tamanho) > 0,
      ...(personalizacao ? { personalizacao } : {}),
    });
  }

  return { linhas, erros };
}

function corpoParaOClube(e: Encomenda): string {
  const l: string[] = [
    `ENCOMENDA ${e.numero} — recebida pelo site`,
    "",
    `Data        : ${new Intl.DateTimeFormat("pt-PT", {
      dateStyle: "full", timeStyle: "short", timeZone: "Europe/Lisbon",
    }).format(new Date(e.data))}`,
    "",
    "─────────────────────────────────────────────",
    "QUEM ENCOMENDOU",
    `Nome        : ${e.nome}`,
    `Email       : ${e.email}`,
    `Telemóvel   : ${e.telemovel}`,
    `Sócio nº    : ${e.socio || "—"}`,
    `Para atleta : ${e.atleta || "(para o próprio)"}`,
  ];
  if (e.notas) l.push(`Notas       : ${e.notas}`);

  l.push("", "─────────────────────────────────────────────", "PEÇAS", "");
  for (const linha of e.linhas) {
    l.push(
      `${linha.quantidade}× ${linha.nome} — tamanho ${linha.tamanho} — ` +
      `${formatEuros(linha.preco * linha.quantidade)}`
    );
    if (linha.personalizacao) {
      l.push(`   Personalizar: ${linha.personalizacao.nome} ${linha.personalizacao.numero}`.trimEnd());
    }
    l.push(`   ${linha.emStock ? "Está na sede" : "NÃO ESTÁ NA SEDE — pedir ao fornecedor"}`);
  }

  const faltam = e.linhas.filter((x) => !x.emStock);
  l.push("", "─────────────────────────────────────────────", "VALORES");
  l.push(`Total da encomenda : ${formatEuros(e.total)}`);
  l.push(
    `Escolheu           : ${
      MOMENTOS_PAGAMENTO.find((m) => m.id === e.momento)?.nome ?? e.momento
    }`
  );
  l.push(`A pagar agora      : ${formatEuros(e.aPagarAgora)}`);
  if (e.momento === "sinal") {
    l.push(`A cobrar na sede   : ${formatEuros(e.total - e.aPagarAgora)}`);
  }

  l.push("", "─────────────────────────────────────────────", "O QUE FALTA FAZER");
  if (faltam.length) {
    l.push(
      `Pedir ao fornecedor ${faltam.length} ${faltam.length === 1 ? "peça" : "peças"}: ` +
      faltam.map((x) => `${x.quantidade}× ${x.nome} (${x.tamanho})`).join(", ") + "."
    );
    l.push(`Prazo combinado com quem encomendou: até ${PRAZO_ENCOMENDA_SEMANAS} semanas.`);
  } else {
    l.push("Está tudo na sede. Separar e avisar que pode levantar.");
  }
  l.push("Confirmar a entrada do pagamento e marcar em /direcao/encomendas.");

  return l.join("\n");
}

function corpoParaQuemEncomendou(e: Encomenda): string {
  const l: string[] = [
    `Olá ${e.nome.split(/\s+/)[0]},`,
    "",
    `A tua encomenda no Valejas Atlético Clube ficou registada com o número ${e.numero}.`,
    "Guarda este número — é por ele que te identificamos na sede.",
    "",
    "O QUE ENCOMENDASTE",
  ];
  for (const linha of e.linhas) {
    l.push(
      `· ${linha.quantidade}× ${linha.nome}, tamanho ${linha.tamanho}` +
      (linha.personalizacao
        ? ` (${linha.personalizacao.nome} ${linha.personalizacao.numero})`.replace(" )", ")")
        : "") +
      ` — ${formatEuros(linha.preco * linha.quantidade)}`
    );
  }

  l.push("", `Total: ${formatEuros(e.total)}`);
  l.push(`A pagar agora: ${formatEuros(e.aPagarAgora)}`);
  if (e.momento === "sinal") {
    l.push(`Ao levantar na sede: ${formatEuros(e.total - e.aPagarAgora)}`);
  }

  const faltam = e.linhas.filter((x) => !x.emStock);
  l.push("", "O QUE ACONTECE AGORA");
  if (faltam.length) {
    l.push(
      `Parte da tua encomenda tem de ser pedida ao fornecedor. Fica pronta ` +
      `até ${PRAZO_ENCOMENDA_SEMANAS} semanas e avisamos-te por email.`
    );
  } else {
    l.push("Está tudo na sede. Avisamos-te quando estiver separada para levantar.");
  }
  l.push("O levantamento é sempre na sede do clube. Não enviamos para casa.");
  l.push("", "Para pagar ou esclarecer qualquer coisa, responde a este email");
  l.push("ou passa pela sede.", "", "A UNIÃO FAZ A FORÇA", "Valejas Atlético Clube");

  return l.join("\n");
}

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b || typeof b !== "object") {
    return NextResponse.json({ ok: false, erros: ["Pedido inválido."] }, { status: 400 });
  }

  const nome      = String(b.nome ?? "").trim();
  const email     = String(b.email ?? "").trim();
  const telemovel = String(b.telemovel ?? "").trim();
  const socio     = String(b.socio ?? "").trim().slice(0, 20);
  const atleta    = String(b.atleta ?? "").trim().slice(0, 80);
  const notas     = String(b.notas ?? "").trim().slice(0, 500);
  const momento   = String(b.momento ?? "") as MomentoPagamento;

  const erros: string[] = [];
  if (!validarNomeCompleto(nome))  erros.push("Escreve o nome completo.");
  if (!validarEmail(email))        erros.push("Email inválido.");
  if (!validarTelemovel(telemovel)) erros.push("Telemóvel português inválido.");
  if (!MOMENTOS_PAGAMENTO.some((m) => m.id === momento)) {
    erros.push("Escolhe quando queres pagar.");
  }

  const recebidas: LinhaRecebida[] = Array.isArray(b.linhas) ? b.linhas : [];
  if (recebidas.length === 0)        erros.push("O carrinho está vazio.");
  if (recebidas.length > MAX_LINHAS) erros.push("Demasiadas peças numa só encomenda. Fala com a sede.");

  const { linhas, erros: errosLinhas } = resolverLinhas(recebidas.slice(0, MAX_LINHAS));
  erros.push(...errosLinhas);
  if (linhas.length === 0 && !erros.includes("O carrinho está vazio.")) {
    erros.push("Nenhuma das peças é válida.");
  }

  if (erros.length) {
    return NextResponse.json({ ok: false, erros }, { status: 400 });
  }

  const total = linhas.reduce((s, l) => s + l.preco * l.quantidade, 0);
  const encomenda: Encomenda = {
    numero: gerarNumero(),
    data: new Date().toISOString(),
    nome, email, telemovel,
    ...(socio  ? { socio }  : {}),
    ...(atleta ? { atleta } : {}),
    ...(notas  ? { notas }  : {}),
    linhas,
    total,
    momento,
    aPagarAgora: momento === "sinal" ? sinalDe(total) : total,
    estado: "recebida",
    pago: false,
  };

  // 1. Email — a via que não pode falhar. Se o clube não a receber, a
  //    encomenda não existe para ninguém.
  try {
    await enviarEmail({
      para: emailConfigurado() ? emailPara("loja") : "log@localhost",
      assunto: `Encomenda ${encomenda.numero} — ${nome}`,
      texto: corpoParaOClube(encomenda),
      responder: email,
    });
  } catch (err) {
    console.error("Encomenda: falha a enviar email ao clube:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      {
        ok: false,
        erros: [
          "Não conseguimos registar a encomenda agora. Tenta outra vez " +
          "ou liga para a sede.",
        ],
      },
      { status: 502 }
    );
  }

  // 2. Recibo para quem encomendou. Falhar aqui não invalida a encomenda.
  try {
    await enviarEmail({
      para: email,
      assunto: `A tua encomenda ${encomenda.numero} — Valejas AC`,
      texto: corpoParaQuemEncomendou(encomenda),
      ...(emailConfigurado() ? { responder: emailDoClube() } : {}),
    });
  } catch (err) {
    console.error("Encomenda: falha a enviar recibo:", err instanceof Error ? err.message : err);
  }

  // 3. CMS — para a Direção poder acompanhar o estado. Também não é
  //    crítico: o email já garantiu o registo.
  if (isSanityConfigured() && process.env.SANITY_API_TOKEN) {
    try {
      await sanityClientLive.create({
        _type: "encomenda",
        ...encomenda,
        linhas: encomenda.linhas.map((l) => ({ _type: "linha", ...l })),
      });
    } catch (err) {
      console.error("Encomenda: falha a guardar no CMS:", err instanceof Error ? err.message : err);
    }
  }

  return NextResponse.json({
    ok: true,
    numero: encomenda.numero,
    aPagarAgora: encomenda.aPagarAgora,
    sinalPercentagem: SINAL_PERCENTAGEM,
  });
}
