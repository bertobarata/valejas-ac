/**
 * AUTENTICAÇÃO — ÁREA DA DIREÇÃO
 * ─────────────────────────────────────────────────────────────────
 * Cada pessoa entra com a sua palavra-passe, e a sessão guarda quem é.
 * Antes era uma só para toda a gente: não se sabia quem tinha
 * publicado o quê, e tirar o acesso a alguém obrigava a mudar a
 * palavra-passe de todos.
 *
 * A sessão é um cookie assinado com HMAC — o browser não consegue
 * forjar uma sessão válida, nem trocar o nome que lá está, sem
 * conhecer o segredo do servidor.
 *
 * Configuração:
 *
 *   DIRECAO_SECRET=<string longa e aleatória, só do servidor>
 *
 *   DIRECAO_UTILIZADORES=presidente:palavra-passe-1,comunicacao:palavra-passe-2
 *     Pares nome:palavra-passe, separados por vírgulas. O nome aparece
 *     nos registos e nas publicações; a palavra-passe é o que a pessoa
 *     escreve.
 *
 *   DIRECAO_PASSWORD=<palavra-passe única>   (legado)
 *     Se existir e não houver utilizadores, continua a funcionar como
 *     antes, com o nome «Direção». Serve para não partir nada enquanto
 *     as contas não estiverem criadas.
 *
 * Sem estas variáveis a área fica fechada a toda a gente.
 * ─────────────────────────────────────────────────────────────────
 */

import { createHmac, timingSafeEqual } from "crypto";

export const COOKIE_SESSAO = "vac_direcao";
const DURACAO_HORAS = 12;

export interface Utilizador {
  /** Nome curto, o que a pessoa escreve para entrar e o que fica no registo. */
  nome: string;
  palavraPasse: string;
}

function segredo(): string | null {
  return process.env.DIRECAO_SECRET ?? null;
}

/** Lê as contas da variável de ambiente. Vazio se não houver nenhuma. */
export function utilizadores(): Utilizador[] {
  const bruto = process.env.DIRECAO_UTILIZADORES?.trim();
  if (bruto) {
    return bruto
      .split(",")
      .map((par) => par.trim())
      .filter(Boolean)
      .map((par) => {
        const i = par.indexOf(":");
        if (i < 1) return null;
        return {
          nome: par.slice(0, i).trim(),
          palavraPasse: par.slice(i + 1).trim(),
        };
      })
      .filter((u): u is Utilizador => Boolean(u && u.nome && u.palavraPasse));
  }

  // Legado: palavra-passe única, sem nome.
  const antiga = process.env.DIRECAO_PASSWORD;
  return antiga ? [{ nome: "Direção", palavraPasse: antiga }] : [];
}

export function authConfigurada(): boolean {
  return utilizadores().length > 0 && Boolean(segredo());
}

/** Há contas por pessoa, ou ainda é a palavra-passe única de todos? */
export function temContasPorPessoa(): boolean {
  return Boolean(process.env.DIRECAO_UTILIZADORES?.trim());
}

/** Compara sem revelar, pelo tempo de resposta, quantos caracteres acertou. */
function igual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  if (x.length !== y.length) return false;
  return timingSafeEqual(x, y);
}

/**
 * Quem é que esta palavra-passe abre. Devolve o nome, ou null.
 *
 * Percorre todas as contas mesmo depois de acertar, para o tempo de
 * resposta não denunciar a posição da conta na lista.
 */
export function autenticar(tentativa: string): string | null {
  let encontrado: string | null = null;
  for (const u of utilizadores()) {
    if (igual(tentativa, u.palavraPasse)) encontrado = u.nome;
  }
  return encontrado;
}

/** @deprecated Usar `autenticar`, que diz quem entrou. */
export function palavraPasseCorreta(tentativa: string): boolean {
  return autenticar(tentativa) !== null;
}

function assinar(valor: string): string {
  const s = segredo();
  if (!s) throw new Error("DIRECAO_SECRET não definida.");
  return createHmac("sha256", s).update(valor).digest("hex");
}

/** Cria o valor do cookie: quem, até quando, e a assinatura das duas coisas. */
export function criarSessao(nome: string): string {
  const expira = Date.now() + DURACAO_HORAS * 3600 * 1000;
  const corpo = `${expira}|${encodeURIComponent(nome)}`;
  return `${corpo}.${assinar(corpo)}`;
}

/** O nome de quem está na sessão, ou null se não houver sessão válida. */
export function quemEsta(cookie: string | undefined): string | null {
  if (!cookie || !segredo()) return null;

  const corte = cookie.lastIndexOf(".");
  if (corte < 1) return null;

  const corpo = cookie.slice(0, corte);
  const assinatura = cookie.slice(corte + 1);

  try {
    if (!igual(assinar(corpo), assinatura)) return null;
  } catch {
    return null;
  }

  const [expiraStr, nomeBruto] = corpo.split("|");
  const expira = Number(expiraStr);
  if (!Number.isFinite(expira) || Date.now() > expira) return null;

  // Sessões antigas não traziam nome; continuam válidas até expirarem.
  return nomeBruto ? decodeURIComponent(nomeBruto) : "Direção";
}

export function sessaoValida(cookie: string | undefined): boolean {
  return quemEsta(cookie) !== null;
}

export const DURACAO_COOKIE_SEGUNDOS = DURACAO_HORAS * 3600;
