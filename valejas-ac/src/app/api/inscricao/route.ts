/**
 * API — PROPOSTA DE SÓCIO
 * ─────────────────────────────────────────────────────────────────
 * Recebe a proposta, revalida tudo do lado do servidor e envia por
 * email para o clube. NÃO GUARDA NADA: nem base de dados, nem ficheiro
 * em disco, nem log dos campos. Os dados existem em memória durante o
 * pedido e seguem para a caixa de correio do clube.
 *
 * O corpo do email sai pela ordem impressa da ficha de papel, para o
 * Presidente transcrever para o Softgab de cima a baixo.
 * ─────────────────────────────────────────────────────────────────
 */

import { NextResponse } from "next/server";
import {
  CAMPOS_FICHA,
  CAMPOS_OBRIGATORIOS,
  CAMPOS_OBRIGATORIOS_MENOR,
  ESTADOS_CIVIS,
  SEXOS,
  type PropostaSocio,
} from "@/lib/data/inscricao";
import {
  PERIODICIDADES,
  METODOS_PAGAMENTO,
  getPeriodicidade,
  valorPorCobranca,
  taxaDoMetodo,
  totalAPagar,
  formatEuros,
  type Periodicidade,
} from "@/lib/data/quota";
import {
  validarNIF, validarCC, validarCodigoPostal, validarTelemovel,
  validarTelefoneFixo, validarEmail, validarDataNascimento,
  validarValidadeCC, validarNomeCompleto, eMenor, formatar,
} from "@/lib/validacao";
import { enviarEmail, emailDoClube, emailConfigurado } from "@/lib/email";

export const runtime = "nodejs";

const MAX_FOTO_BYTES = 4 * 1024 * 1024; // 4 MB — limite de pedido da Vercel é 4,5 MB
const TIPOS_FOTO = ["image/jpeg", "image/png", "image/webp"];

/** Valores legíveis para o email — o Presidente lê texto, não ids. */
function valorLegivel(campo: keyof PropostaSocio, p: PropostaSocio): string {
  const v = (p[campo] ?? "").toString().trim();
  if (!v) return "—";

  switch (campo) {
    case "dataNascimento":
    case "ccValidade":
      return formatar.data(v);
    case "sexo":
      return `${v} (${SEXOS.find((s) => s.valor === v)?.label ?? ""})`;
    case "periodicidade":
      return getPeriodicidade(v)?.nome ?? v;
    case "metodoPagamento":
      return METODOS_PAGAMENTO.find((m) => m.id === v)?.nome ?? v;
    default:
      return v;
  }
}

function validar(p: PropostaSocio): string[] {
  const erros: string[] = [];
  const menor = eMenor(p.dataNascimento);

  const obrigatorios = menor
    ? [...CAMPOS_OBRIGATORIOS, ...CAMPOS_OBRIGATORIOS_MENOR]
    : CAMPOS_OBRIGATORIOS;

  for (const campo of obrigatorios) {
    if (!(p[campo] ?? "").toString().trim()) {
      erros.push(`Campo obrigatório em falta: ${campo}`);
    }
  }
  if (erros.length) return erros;

  if (!validarNomeCompleto(p.nome))          erros.push("Nome completo inválido.");
  if (!validarDataNascimento(p.dataNascimento)) erros.push("Data de nascimento inválida.");
  if (!SEXOS.some((s) => s.valor === p.sexo))   erros.push("Sexo inválido.");
  if (!ESTADOS_CIVIS.includes(p.estadoCivil as never)) erros.push("Estado civil inválido.");
  if (!validarCodigoPostal(p.codigoPostal))  erros.push("Código postal inválido (formato 0000-000).");
  if (!validarEmail(p.email))                erros.push("Email inválido.");
  if (!validarTelemovel(p.telemovel))        erros.push("Telemóvel inválido.");
  if (!validarTelefoneFixo(p.telefoneFixo))  erros.push("Telefone fixo inválido.");
  if (!validarCC(p.cc))                      erros.push("Número de Cartão de Cidadão inválido.");
  if (!validarValidadeCC(p.ccValidade))      erros.push("Validade do Cartão de Cidadão expirada ou inválida.");
  if (!validarNIF(p.nif))                    erros.push("NIF inválido.");

  if (!PERIODICIDADES.some((x) => x.id === p.periodicidade)) erros.push("Periodicidade inválida.");
  if (!METODOS_PAGAMENTO.some((m) => m.id === p.metodoPagamento)) erros.push("Método de pagamento inválido.");

  if (p.metodoPagamento === "debito-direto") {
    if (!p.iban?.trim())        erros.push("IBAN obrigatório para débito direto.");
    if (!p.ibanTitular?.trim()) erros.push("Titular da conta obrigatório para débito direto.");
    if (p.iban && !/^PT50\d{21}$/.test(p.iban.replace(/\s/g, "").toUpperCase())) {
      erros.push("IBAN português inválido (formato PT50 + 21 dígitos).");
    }
  }

  if (menor) {
    if (!validarTelemovel(p.eeTelemovel)) erros.push("Telemóvel do encarregado de educação inválido.");
    if (!validarEmail(p.eeEmail))         erros.push("Email do encarregado de educação inválido.");
    if (!validarCC(p.eeCC))               erros.push("Cartão de Cidadão do encarregado de educação inválido.");
  }

  return erros;
}

function construirTexto(
  p: PropostaSocio,
  menor: boolean,
  pagamento: { estado: string; orderId: string }
): string {
  const linhas: string[] = [
    "INSCRIÇÃO DE SÓCIO — recebida pelo site",
    "",
    "Campos pela ordem da ficha de papel, para transcrição no Softgab.",
    "Linhas com «(a preencher pela Direção)» não vêm do formulário.",
    "",
    "─────────────────────────────────────────────",
  ];

  const largura = Math.max(...CAMPOS_FICHA.map((c) => c.label.length));
  for (const { label, chave } of CAMPOS_FICHA) {
    const rotulo = label.padEnd(largura, " ");
    linhas.push(`${rotulo} : ${chave ? valorLegivel(chave, p) : "(a preencher pela Direção)"}`);
  }

  const periodo = getPeriodicidade(p.periodicidade);
  linhas.push("─────────────────────────────────────────────", "");
  linhas.push("PAGAMENTO");
  linhas.push(`Quota            : ${formatEuros(1)} por mês`);
  linhas.push(`Periodicidade    : ${periodo?.nome ?? p.periodicidade} (${periodo?.meses ?? "?"} meses)`);
  const base = valorPorCobranca(p.periodicidade as Periodicidade);
  const taxa = taxaDoMetodo(p.metodoPagamento, base);
  linhas.push(`Valor da quota   : ${formatEuros(base)}`);
  if (taxa > 0) {
    linhas.push(`Taxa online      : ${formatEuros(taxa)}`);
  }
  linhas.push(`Total cobrado    : ${formatEuros(totalAPagar(p.periodicidade as Periodicidade, p.metodoPagamento))}`);
  if (p.metodoPagamento === "debito-direto") {
    linhas.push(`IBAN             : ${p.iban}`);
    linhas.push(`Titular da conta : ${p.ibanTitular}`);
  }
  linhas.push(
    `Estado           : ${
      pagamento.estado === "pago"
        ? "PAGO — confirmado pelo gateway"
        : "POR CONFIRMAR — o sócio disse que ia pagar"
    }`
  );
  if (pagamento.orderId) linhas.push(`Identificador    : ${pagamento.orderId}`);

  if (menor) {
    linhas.push("", "─────────────────────────────────────────────", "");
    linhas.push("CANDIDATO É MENOR DE IDADE — dados do Encarregado de Educação");
    linhas.push(`Nome        : ${p.eeNome}`);
    linhas.push(`Parentesco  : ${p.eeParentesco}`);
    linhas.push(`Cartão Cidadão: ${p.eeCC}`);
    linhas.push(`Telemóvel   : ${p.eeTelemovel}`);
    linhas.push(`Email       : ${p.eeEmail}`);
    linhas.push("");
    linhas.push("O consentimento para tratamento de dados foi dado pelo");
    linhas.push("Encarregado de Educação acima identificado.");
  }

  linhas.push("", "─────────────────────────────────────────────", "");
  if (pagamento.estado === "pago") {
    linhas.push("Quota paga. Falta atribuir o número de sócio no Softgab e");
    linhas.push("emitir o cartão.");
  } else {
    linhas.push("Inscrição feita pelo site. Falta confirmar a entrada do pagamento");
    linhas.push("e atribuir o número de sócio no Softgab.");
  }

  return linhas.join("\n");
}

/** CSV de uma linha, para quem preferir colar numa folha de cálculo. */
function construirCSV(p: PropostaSocio): string {
  const escapar = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const cabecalho = CAMPOS_FICHA.map((c) => escapar(c.label)).join(";");
  const valores = CAMPOS_FICHA
    .map((c) => escapar(c.chave ? valorLegivel(c.chave, p).replace(/^—$/, "") : ""))
    .join(";");
  // BOM para o Excel português abrir com acentos corretos.
  return "\uFEFF" + cabecalho + "\n" + valores + "\n";
}

function nomeFicheiro(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  const base = [partes[partes.length - 1], partes[0]]
    .join("_")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9_]/g, "");
  return base || "Socio";
}

export async function POST(req: Request) {
  try {
    const fd = await req.formData();

    // Honeypot — bots preenchem, humanos não veem o campo.
    if ((fd.get("_website") ?? "").toString().trim()) {
      return NextResponse.json({ ok: true });
    }

    const texto = (k: string) => (fd.get(k) ?? "").toString().trim();
    const proposta: PropostaSocio = {
      nome:            texto("nome"),
      dataNascimento:  texto("dataNascimento"),
      sexo:            texto("sexo") as PropostaSocio["sexo"],
      estadoCivil:     texto("estadoCivil"),
      naturalidade:    texto("naturalidade"),
      nacionalidade:   texto("nacionalidade"),
      nomePai:         texto("nomePai"),
      nomeMae:         texto("nomeMae"),
      morada:          texto("morada"),
      codigoPostal:    texto("codigoPostal"),
      localidade:      texto("localidade"),
      email:           texto("email"),
      telemovel:       formatar.telemovel(texto("telemovel")),
      telefoneFixo:    texto("telefoneFixo"),
      cc:              formatar.cc(texto("cc")),
      ccValidade:      texto("ccValidade"),
      nif:             formatar.nif(texto("nif")),
      profissao:       texto("profissao"),
      proponente:      texto("proponente"),
      periodicidade:   texto("periodicidade"),
      metodoPagamento: texto("metodoPagamento"),
      iban:            texto("iban").replace(/\s/g, "").toUpperCase(),
      ibanTitular:     texto("ibanTitular"),
      eeNome:          texto("eeNome"),
      eeParentesco:    texto("eeParentesco"),
      eeCC:            formatar.cc(texto("eeCC")),
      eeTelemovel:     formatar.telemovel(texto("eeTelemovel")),
      eeEmail:         texto("eeEmail"),
    };

    if (texto("rgpd") !== "on" && texto("rgpd") !== "true") {
      return NextResponse.json(
        { ok: false, erros: ["É preciso autorizar o tratamento dos dados."] },
        { status: 400 }
      );
    }

    const erros = validar(proposta);
    if (erros.length) {
      return NextResponse.json({ ok: false, erros }, { status: 400 });
    }

    // ── Fotografia (opcional) ──
    const anexos = [];
    const foto = fd.get("fotografia");
    if (foto instanceof File && foto.size > 0) {
      if (!TIPOS_FOTO.includes(foto.type)) {
        return NextResponse.json(
          { ok: false, erros: ["Fotografia tem de ser JPG, PNG ou WEBP."] },
          { status: 400 }
        );
      }
      if (foto.size > MAX_FOTO_BYTES) {
        return NextResponse.json(
          { ok: false, erros: ["Fotografia demasiado grande (máximo 4 MB)."] },
          { status: 400 }
        );
      }
      const ext = foto.type.split("/")[1].replace("jpeg", "jpg");
      anexos.push({
        filename: `${nomeFicheiro(proposta.nome)}.${ext}`,
        content:  Buffer.from(await foto.arrayBuffer()).toString("base64"),
      });
    }

    anexos.push({
      filename: `Proposta_${nomeFicheiro(proposta.nome)}.csv`,
      content:  Buffer.from(construirCSV(proposta), "utf-8").toString("base64"),
    });

    const estadoPagamento = texto("estadoPagamento") === "pago" ? "pago" : "pendente";
    const orderId = texto("orderId");

    const menor = eMenor(proposta.dataNascimento);
    const destino = emailDoClube();
    if (!emailConfigurado() && process.env.EMAIL_PROVIDER !== "log") {
      return NextResponse.json(
        { ok: false, erros: ["Envio de email ainda não configurado no servidor."] },
        { status: 503 }
      );
    }

    await enviarEmail({
      para:      destino || "log@localhost",
      assunto:   `Novo Sócio — ${proposta.nome}${menor ? " (menor)" : ""}${
        estadoPagamento === "pago" ? " [PAGO]" : ""
      }`,
      texto:     construirTexto(proposta, menor, { estado: estadoPagamento, orderId }),
      responder: menor ? proposta.eeEmail : proposta.email,
      anexos,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    // Mensagem genérica para fora; detalhe só no servidor, sem dados pessoais.
    console.error("Erro na proposta de sócio:", err instanceof Error ? err.message : err);
    return NextResponse.json(
      { ok: false, erros: ["Não foi possível enviar a proposta. Tenta novamente."] },
      { status: 500 }
    );
  }
}
