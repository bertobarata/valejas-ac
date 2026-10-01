/**
 * API — QUERO SER PATROCINADOR
 * ─────────────────────────────────────────────────────────────────
 * Dois emails por pedido:
 *
 *   1. a quem pediu, com a apresentação de parcerias em anexo — chega
 *      na hora, sem ninguém do clube ter de se lembrar de a mandar;
 *   2. à comunicação do clube, que é quem trata das parcerias (decisão
 *      da Direção, 14/09/2026), com tudo o que a pessoa escreveu e com
 *      `reply-to` para ela: responder na caixa chega-lhe direto.
 *
 * Como os outros formulários, NÃO GUARDA NADA. O pedido segue por
 * email e desaparece daqui.
 *
 * O PDF vive em `privado/`, fora de `public/`, e é lido do disco. Para
 * a Vercel o levar para a função, está declarado em
 * `outputFileTracingIncludes` no next.config.mjs — sem isso o build
 * passa e o ficheiro não existe em produção.
 * ─────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { EMAILS } from "@/lib/data/socios";
import {
  APRESENTACAO, getFormaDeApoio, lerPedido, type PedidoPatrocinio,
} from "@/lib/data/patrocinio";
import { enviarEmail } from "@/lib/email";

export const runtime = "nodejs";

/*
 * Travão contra abuso. Esta é a única rota do site que manda email a
 * um endereço escrito por quem está do outro lado — e manda 5 MB. Sem
 * limite, servia para encher a caixa de alguém em nome do clube, e é
 * o domínio do clube que fica com má fama nos filtros de spam.
 *
 * Fica em memória: numa função serverless cada instância tem a sua
 * contagem, por isso é um travão e não uma muralha. Chega para quem
 * carrega no botão vinte vezes; um ataque a sério trava-se na firewall
 * da Vercel, não aqui.
 */
const JANELA_MS = 60 * 60 * 1000;   // uma hora
const MAX_POR_IP = 5;
const MAX_POR_EMAIL = 2;
const pedidos = new Map<string, number[]>();

function excedeu(chave: string, maximo: number): boolean {
  const agora = Date.now();
  const recentes = (pedidos.get(chave) ?? []).filter((t) => agora - t < JANELA_MS);
  if (recentes.length >= maximo) {
    pedidos.set(chave, recentes);
    return true;
  }
  recentes.push(agora);
  pedidos.set(chave, recentes);
  // Arrumação: o mapa não pode crescer para sempre numa instância longa.
  if (pedidos.size > 5000) {
    pedidos.forEach((ts, k) => {
      if (ts.every((t) => agora - t >= JANELA_MS)) pedidos.delete(k);
    });
  }
  return false;
}

/** Lido uma vez por instância; são 5 MB que não mudam. */
let pdfEmCache: string | null = null;
async function apresentacaoBase64(): Promise<string> {
  if (!pdfEmCache) {
    const buf = await readFile(join(process.cwd(), APRESENTACAO.caminho));
    pdfEmCache = buf.toString("base64");
  }
  return pdfEmCache;
}

function textoParaOClube(p: PedidoPatrocinio, apresentacaoSeguiu: boolean): string {
  const linhas = [
    "PEDIDO DE PATROCÍNIO — recebido pelo site",
    "",
    `Empresa/entidade : ${p.entidade || "— (a título individual)"}`,
    `Contacto         : ${p.nome}`,
    `Email            : ${p.email}`,
    `Telefone         : ${p.telefone || "—"}`,
    "",
    "Interessa-lhe:",
    ...p.tipos.map((t) => `  • ${getFormaDeApoio(t)?.nome ?? t}`),
  ];

  if (p.mensagem) {
    linhas.push("", "─────────────────────────────────────────────", "", p.mensagem);
  }

  linhas.push("", "─────────────────────────────────────────────", "");
  linhas.push(
    apresentacaoSeguiu
      ? "A apresentação de parcerias já lhe foi enviada automaticamente."
      : "ATENÇÃO: a apresentação NÃO seguiu (o envio falhou) — mandar à mão."
  );
  linhas.push("Responder a este email chega diretamente a quem pediu.");
  return linhas.join("\n");
}

function textoParaQuemPediu(p: PedidoPatrocinio): string {
  const primeiroNome = p.nome.split(/\s+/)[0];
  return [
    `Olá ${primeiroNome},`,
    "",
    "Obrigado pelo interesse em apoiar o Valejas Atlético Clube.",
    "",
    "Segue em anexo a nossa apresentação de parcerias e patrocínios: quem",
    "somos, as modalidades, e as várias formas de associar a sua marca ao",
    "clube — do equipamento às lonas do pavilhão, do digital ao mecenato",
    "desportivo — com os respetivos valores.",
    "",
    "A comunicação do clube já recebeu o seu pedido e vai entrar em",
    "contacto consigo. Se quiser adiantar alguma coisa, basta responder a",
    "este email.",
    "",
    "A união faz a força.",
    "",
    "Valejas Atlético Clube",
    "Estrada das Palmeiras, 1A · 2730-132 Valejas",
    "valejasac.pt",
  ].join("\n");
}

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b || typeof b !== "object") {
    return NextResponse.json({ ok: false, erros: ["Pedido inválido."] }, { status: 400 });
  }

  // Honeypot — os bots preenchem, as pessoas não veem o campo.
  if (String(b._website ?? "").trim()) return NextResponse.json({ ok: true });

  const { pedido, erros } = lerPedido(b);
  const lista = Object.values(erros);
  if (lista.length) {
    return NextResponse.json({ ok: false, erros: lista, campos: erros }, { status: 400 });
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "local";
  if (excedeu(`ip:${ip}`, MAX_POR_IP) || excedeu(`email:${pedido.email.toLowerCase()}`, MAX_POR_EMAIL)) {
    return NextResponse.json(
      {
        ok: false,
        erros: [
          "Já recebemos pedidos seus há pouco. Se a apresentação não chegou, " +
          `veja a pasta de spam ou escreva para ${EMAILS.comunicacao}.`,
        ],
      },
      { status: 429 }
    );
  }

  const quem = pedido.entidade || pedido.nome;

  /*
   * Primeiro a apresentação, depois o aviso ao clube — o aviso diz se a
   * apresentação seguiu. Se falhar (endereço que não existe, PDF em
   * falta), o pedido não se perde: o clube recebe-o na mesma e sabe que
   * tem de a mandar à mão.
   */
  let apresentacaoSeguiu = false;
  try {
    await enviarEmail({
      para:      pedido.email,
      assunto:   "Parcerias e patrocínios — Valejas AC",
      texto:     textoParaQuemPediu(pedido),
      responder: EMAILS.comunicacao,
      anexos:    [{ filename: APRESENTACAO.ficheiro, content: await apresentacaoBase64() }],
    });
    apresentacaoSeguiu = true;
  } catch (err) {
    // Sem dados pessoais no registo: só o motivo.
    console.error("Patrocínio: a apresentação não seguiu:", err instanceof Error ? err.message : err);
  }

  let clubeAvisado = false;
  try {
    await enviarEmail({
      para:      EMAILS.comunicacao,
      assunto:   `Quero ser patrocinador — ${quem}`,
      texto:     textoParaOClube(pedido, apresentacaoSeguiu),
      responder: pedido.email,
    });
    clubeAvisado = true;
  } catch (err) {
    console.error("Patrocínio: falha no aviso ao clube:", err instanceof Error ? err.message : err);
  }

  if (!apresentacaoSeguiu && !clubeAvisado) {
    return NextResponse.json(
      {
        ok: false,
        erros: [
          "Não conseguimos enviar o pedido agora. Tente outra vez, ou escreva " +
          `para ${EMAILS.comunicacao}.`,
        ],
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, apresentacao: apresentacaoSeguiu });
}
