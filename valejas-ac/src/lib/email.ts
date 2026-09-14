/**
 * ENVIO DE EMAIL — adaptador trocável.
 * ─────────────────────────────────────────────────────────────────
 * O clube ainda não decidiu se o email institucional fica em Gmail
 * ou em domínio próprio. Este módulo isola essa decisão: muda-se a
 * variável de ambiente, não o código.
 *
 * Configuração (.env.local):
 *   EMAIL_PROVIDER=resend            # resend | log
 *   RESEND_API_KEY=re_xxxxxxxx
 *   EMAIL_REMETENTE="Valejas AC <inscricoes@valejasac.pt>"
 *   EMAIL_CLUBE=geral@valejasac.pt   # destino das propostas
 *
 * Com EMAIL_PROVIDER=log (ou sem chave) nada é enviado — a mensagem
 * é escrita no terminal. Serve para desenvolver sem conta criada.
 *
 * Usa a REST API do Resend por fetch, sem SDK, para não acrescentar
 * dependências ao projeto.
 * ─────────────────────────────────────────────────────────────────
 */

export interface Anexo {
  filename: string;
  /** Conteúdo em base64, sem prefixo data: */
  content:  string;
}

export interface Mensagem {
  para:     string;
  assunto:  string;
  texto:    string;
  html?:    string;
  responder?: string;
  anexos?:  Anexo[];
}

export function emailConfigurado(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_CLUBE);
}

export function emailDoClube(): string {
  return process.env.EMAIL_CLUBE ?? "";
}

/**
 * Para onde vai cada coisa.
 *
 * O clube tem cinco caixas e nem tudo é para a mesma pessoa: as fichas
 * de sócio são transcritas pelo Presidente, as encomendas são separadas
 * por quem trata da loja, os pedidos de inscrição são respondidos por
 * quem coordena as modalidades.
 *
 * Cada um tem a sua variável; faltando, cai na caixa geral. Assim
 * começa-se com uma caixa só e separa-se depois, sem tocar em código.
 *
 *   EMAIL_SOCIOS=direcao@valejasac.pt
 *   EMAIL_INSCRICOES=coordenacao@valejasac.pt
 *   EMAIL_LOJA=geral@valejasac.pt
 *   EMAIL_PAGAMENTOS=direcao@valejasac.pt
 */
export type Assunto = "socios" | "inscricoes" | "loja" | "pagamentos";

const VARIAVEL: Record<Assunto, string> = {
  socios:     "EMAIL_SOCIOS",
  inscricoes: "EMAIL_INSCRICOES",
  loja:       "EMAIL_LOJA",
  pagamentos: "EMAIL_PAGAMENTOS",
};

export function emailPara(assunto: Assunto): string {
  return process.env[VARIAVEL[assunto]]?.trim() || emailDoClube();
}

export async function enviarEmail(msg: Mensagem): Promise<void> {
  const provider = process.env.EMAIL_PROVIDER ?? (process.env.RESEND_API_KEY ? "resend" : "log");

  if (provider === "log") {
    // Modo desenvolvimento — nada sai da máquina.
    console.log("─── EMAIL (modo log, não enviado) ───");
    console.log("Para:", msg.para);
    console.log("Assunto:", msg.assunto);
    console.log(msg.texto);
    console.log("Anexos:", msg.anexos?.map((a) => a.filename).join(", ") || "nenhum");
    return;
  }

  const chave = process.env.RESEND_API_KEY;
  if (!chave) throw new Error("RESEND_API_KEY não definida.");

  const remetente = process.env.EMAIL_REMETENTE ?? "Valejas AC <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${chave}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from:     remetente,
      to:       [msg.para],
      subject:  msg.assunto,
      text:     msg.texto,
      html:     msg.html,
      reply_to: msg.responder,
      attachments: msg.anexos?.map((a) => ({
        filename: a.filename,
        content:  a.content,
      })),
    }),
  });

  if (!res.ok) {
    const detalhe = await res.text().catch(() => "");
    // Nunca incluir o corpo da mensagem no erro — leva dados pessoais.
    throw new Error(`Falha no envio do email (${res.status}). ${detalhe.slice(0, 200)}`);
  }
}
