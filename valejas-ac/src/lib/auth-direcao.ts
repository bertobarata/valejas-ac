/**
 * AUTENTICAÇÃO — ÁREA DA DIREÇÃO
 * ─────────────────────────────────────────────────────────────────
 * Uma palavra-passe partilhada, guardada em variável de ambiente.
 * Chega para o que isto é: um utilizador, um clube, uma máquina.
 *
 * A sessão é um cookie assinado com HMAC — o browser não consegue
 * forjar uma sessão válida sem conhecer o segredo do servidor.
 *
 * Configuração:
 *   DIRECAO_PASSWORD=<palavra-passe que o Presidente escreve>
 *   DIRECAO_SECRET=<string longa e aleatória, só do servidor>
 *
 * Sem estas variáveis a área fica fechada a toda a gente.
 * ─────────────────────────────────────────────────────────────────
 */

import { createHmac, timingSafeEqual } from "crypto";

export const COOKIE_SESSAO = "vac_direcao";
const DURACAO_HORAS = 12;

function segredo(): string | null {
  return process.env.DIRECAO_SECRET ?? null;
}

export function authConfigurada(): boolean {
  return Boolean(process.env.DIRECAO_PASSWORD && process.env.DIRECAO_SECRET);
}

/** Compara sem revelar, pelo tempo de resposta, quantos caracteres acertou. */
export function palavraPasseCorreta(tentativa: string): boolean {
  const real = process.env.DIRECAO_PASSWORD;
  if (!real) return false;

  const a = Buffer.from(tentativa);
  const b = Buffer.from(real);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function assinar(valor: string): string {
  const s = segredo();
  if (!s) throw new Error("DIRECAO_SECRET não definida.");
  return createHmac("sha256", s).update(valor).digest("hex");
}

/** Cria o valor do cookie: instante de expiração + assinatura. */
export function criarSessao(): string {
  const expira = Date.now() + DURACAO_HORAS * 3600 * 1000;
  return `${expira}.${assinar(String(expira))}`;
}

export function sessaoValida(cookie: string | undefined): boolean {
  if (!cookie || !segredo()) return false;

  const [expiraStr, assinatura] = cookie.split(".");
  if (!expiraStr || !assinatura) return false;

  const expira = Number(expiraStr);
  if (!Number.isFinite(expira) || Date.now() > expira) return false;

  try {
    const esperada = Buffer.from(assinar(expiraStr));
    const recebida = Buffer.from(assinatura);
    if (esperada.length !== recebida.length) return false;
    return timingSafeEqual(esperada, recebida);
  } catch {
    return false;
  }
}

export const DURACAO_COOKIE_SEGUNDOS = DURACAO_HORAS * 3600;
