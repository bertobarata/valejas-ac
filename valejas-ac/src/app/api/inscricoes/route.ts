/**
 * API — INSCRIÇÃO NUMA MODALIDADE
 * ─────────────────────────────────────────────────────────────────
 * A inscrição entra por aqui e fecha-se na sede, com a ficha da
 * federação e o exame médico. O consentimento de direitos de imagem é
 * aceite aqui e fica registado no email — é esse email que prova
 * quando, por quem e com que texto foi dado.
 *
 * Como a ficha de sócio, NÃO GUARDA NADA. O pedido segue por email
 * para o clube e desaparece daqui — não há base de dados, não fica em
 * disco, não vai para os registos do servidor.
 * ─────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import { MODALIDADES } from "@/lib/data/modalidades";
import {
  validarEmail, validarTelemovel, validarNomeCompleto,
  validarDataNascimento, calcularIdade, eMenor, formatar,
} from "@/lib/validacao";
import { enviarEmail, emailDoClube, emailConfigurado } from "@/lib/email";
import { declaracao } from "@/lib/data/direitosImagem";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  if (!b || typeof b !== "object") {
    return NextResponse.json({ ok: false, erros: ["Pedido inválido."] }, { status: 400 });
  }

  // Honeypot — os bots preenchem, as pessoas não veem o campo.
  if (String(b._website ?? "").trim()) {
    return NextResponse.json({ ok: true, jaSocio: false });
  }

  const modalidade     = String(b.modalidade ?? "").trim();
  const nome           = String(b.nome ?? "").trim();
  const dataNascimento = String(b.dataNascimento ?? "").trim();
  const telemovel      = String(b.telemovel ?? "").trim();
  const email          = String(b.email ?? "").trim();
  const eeNome         = String(b.eeNome ?? "").trim();
  const notas          = String(b.notas ?? "").trim().slice(0, 500);
  const jaSocio        = Boolean(b.jaSocio);
  const numeroSocio    = String(b.numeroSocio ?? "").trim().slice(0, 20);
  const consentimento  = Boolean(b.consentimento);

  const m = MODALIDADES.find((x) => x.slug === modalidade);

  const erros: string[] = [];
  if (!m)                                   erros.push("Escolhe uma modalidade.");
  if (!validarNomeCompleto(nome))           erros.push("Escreve o nome completo do atleta.");
  if (!validarDataNascimento(dataNascimento)) erros.push("Data de nascimento inválida.");
  if (!validarTelemovel(telemovel))         erros.push("Telemóvel português inválido.");
  if (!validarEmail(email))                 erros.push("Email inválido.");

  const menor = dataNascimento ? eMenor(dataNascimento) : false;
  if (menor && !validarNomeCompleto(eeNome)) {
    erros.push("O atleta é menor de idade — falta o nome do encarregado de educação.");
  }
  if (jaSocio && !numeroSocio) {
    erros.push("Já sendo sócio, falta o número de sócio.");
  }
  /*
   * Sem consentimento não há inscrição. É o clube que o exige a todos
   * os atletas, e o RGPD obriga a que seja explícito — uma caixa por
   * marcar não vale como aceitação tácita.
   */
  if (!consentimento) {
    erros.push("Falta autorizar a captação e utilização de imagem.");
  }

  if (erros.length) {
    return NextResponse.json({ ok: false, erros }, { status: 400 });
  }

  const idade = calcularIdade(dataNascimento);
  const linhas = [
    "PEDIDO DE INSCRIÇÃO — recebido pelo site",
    "",
    `Modalidade      : ${m!.nome}`,
    `Atleta          : ${nome}`,
    `Data nascimento : ${formatar.data(dataNascimento)}${idade !== null ? ` (${idade} anos)` : ""}`,
    `Telemóvel       : ${telemovel}`,
    `Email           : ${email}`,
  ];

  if (menor) {
    linhas.push(`Enc. de educação: ${eeNome}`);
    linhas.push("(O atleta é menor — o contacto acima é o de quem responde por ele.)");
  }

  linhas.push(
    `Já é sócio?     : ${jaSocio ? `Sim — nº ${numeroSocio}` : "Não"}`
  );
  if (notas) linhas.push(`Notas           : ${notas}`);

  linhas.push("", "─────────────────────────────────────────────", "");
  linhas.push("DIREITOS DE IMAGEM");
  linhas.push("Aceite no site, com a declaração:");
  linhas.push(`  «${declaracao(menor)}»`);
  linhas.push(`Por        : ${menor ? `${eeNome} (encarregado de educação)` : nome}`);
  linhas.push(
    `Em         : ${new Intl.DateTimeFormat("pt-PT", {
      dateStyle: "full", timeStyle: "short", timeZone: "Europe/Lisbon",
    }).format(new Date())}`
  );
  linhas.push("Guardar este email — é o registo do consentimento.");

  linhas.push("", "─────────────────────────────────────────────", "");
  if (m!.apenasFormacao) {
    linhas.push(`${m!.nome} é só formação — confirmar que a idade encaixa.`);
  }
  if (m!.parceria) {
    linhas.push(`${m!.nome} é entregue com a ${m!.parceria.nome} — falar com eles.`);
  }
  linhas.push("Confirmar se há vaga e responder. Se houver, a inscrição");
  linhas.push("desportiva fecha-se na sede, com ficha e exame médico.");
  if (!jaSocio) {
    linhas.push("");
    linhas.push("ATENÇÃO: ainda não é sócio. Tem de se inscrever como sócio");
    linhas.push("antes de poder praticar.");
  }

  try {
    await enviarEmail({
      para: emailConfigurado() ? emailDoClube() : "log@localhost",
      assunto: `Pedido de inscrição — ${m!.nome} — ${nome}`,
      texto: linhas.join("\n"),
      responder: email,
    });
  } catch (err) {
    console.error("Pedido de inscrição: falha no email:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      {
        ok: false,
        erros: [
          "Não conseguimos enviar o pedido agora. Tenta outra vez, ou " +
          "passa pela sede do clube.",
        ],
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, jaSocio, modalidade: m!.nome });
}
