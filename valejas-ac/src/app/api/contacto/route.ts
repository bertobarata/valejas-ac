/**
 * API — FORMULÁRIO DE CONTACTO
 * ─────────────────────────────────────────────────────────────────
 * Vai para a caixa geral do clube, que é a porta de entrada.
 *
 * Estava na Formspree — um serviço terceiro, sem conta criada, o que
 * queria dizer que quem escrevesse pelo site não chegava a lado
 * nenhum. Agora que o clube tem caixas próprias, a mensagem vai
 * direta, sem intermediários.
 *
 * Não guarda nada: a mensagem segue por email e desaparece daqui.
 * ─────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { EMAILS } from "@/lib/data/socios";
import { validarEmail, validarNomeCompleto } from "@/lib/validacao";
import { enviarEmail, emailPara } from "@/lib/email";

export const runtime = "nodejs";

/** Assuntos possíveis, e para onde cada um vai. */
const DESTINOS: Record<string, { etiqueta: string; caixa: string }> = {
  geral:     { etiqueta: "Assunto geral",            caixa: EMAILS.geral },
  modalidades: { etiqueta: "Modalidades e treinos",  caixa: EMAILS.coordenacao },
  parceria:  { etiqueta: "Proposta de parceria",     caixa: EMAILS.comunicacao },
  imprensa:  { etiqueta: "Imprensa e comunicação",   caixa: EMAILS.comunicacao },
};

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b) {
    return NextResponse.json({ ok: false, erros: ["Pedido inválido."] }, { status: 400 });
  }

  // Honeypot — os bots preenchem, as pessoas não veem o campo.
  if (String(b._website ?? "").trim()) return NextResponse.json({ ok: true });

  const nome     = String(b.nome ?? "").trim();
  const email    = String(b.email ?? "").trim();
  const telefone = String(b.telefone ?? "").trim().slice(0, 30);
  const mensagem = String(b.mensagem ?? "").trim().slice(0, 4000);
  const assunto  = String(b.assunto ?? "geral");

  const erros: string[] = [];
  if (!validarNomeCompleto(nome)) erros.push("Escreve o nome completo.");
  if (!validarEmail(email))       erros.push("Email inválido.");
  if (mensagem.length < 10)       erros.push("Escreve a mensagem.");
  if (erros.length) {
    return NextResponse.json({ ok: false, erros }, { status: 400 });
  }

  const destino = DESTINOS[assunto] ?? DESTINOS.geral;

  const linhas = [
    `CONTACTO PELO SITE — ${destino.etiqueta}`,
    "",
    `Nome     : ${nome}`,
    `Email    : ${email}`,
    ...(telefone ? [`Telefone : ${telefone}`] : []),
    "",
    "─────────────────────────────────────────────",
    "",
    mensagem,
    "",
    "─────────────────────────────────────────────",
    "Responder a este email chega diretamente a quem escreveu.",
  ];

  try {
    await enviarEmail({
      // A caixa do assunto manda; a geral é o recurso quando não há.
      para: destino.caixa || emailPara("loja") || "log@localhost",
      assunto: `${destino.etiqueta} — ${nome}`,
      texto: linhas.join("\n"),
      responder: email,
    });
  } catch (err) {
    console.error("Contacto: falha no email:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      {
        ok: false,
        erros: ["Não conseguimos enviar a mensagem. Tenta outra vez, ou liga para a sede."],
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, para: destino.etiqueta });
}
