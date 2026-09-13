/**
 * VALIDAÇÃO — regras portuguesas, partilhadas entre cliente e servidor.
 * O formulário valida ao sair de cada campo; a API revalida tudo antes
 * de enviar o email (nunca confiar só no browser).
 */

/** Remove espaços, pontos e traços. */
export function limpar(v: string): string {
  return (v || "").replace(/[\s.\-]/g, "");
}

/** NIF português — 9 dígitos com dígito de controlo módulo 11. */
export function validarNIF(valor: string): boolean {
  const nif = limpar(valor);
  if (!/^\d{9}$/.test(nif)) return false;

  const prefixosValidos = ["1", "2", "3", "5", "6", "8", "9"];
  const prefixos2 = ["45", "70", "71", "72", "74", "75", "77", "79", "90", "91", "98", "99"];
  if (!prefixosValidos.includes(nif[0]) && !prefixos2.includes(nif.slice(0, 2))) {
    return false;
  }

  let soma = 0;
  for (let i = 0; i < 8; i++) soma += Number(nif[i]) * (9 - i);
  const resto = soma % 11;
  const controlo = resto < 2 ? 0 : 11 - resto;
  return controlo === Number(nif[8]);
}

/**
 * Nº de documento do Cartão de Cidadão — 12 caracteres:
 * 8 dígitos + 1 dígito de controlo + 2 letras + 1 dígito de controlo.
 * Ex.: 12345678 9 ZZ4  → "123456789ZZ4"
 * Verificação: soma tipo Luhn em base 36, da direita para a esquerda.
 */
export function validarCC(valor: string): boolean {
  const cc = limpar(valor).toUpperCase();
  if (!/^\d{9}[A-Z0-9]{2}\d$/.test(cc)) return false;

  let soma = 0;
  let duplicar = false;
  for (let i = cc.length - 1; i >= 0; i--) {
    const c = cc[i];
    let v = c >= "0" && c <= "9" ? Number(c) : c.charCodeAt(0) - 55; // A=10 … Z=35
    if (duplicar) {
      v *= 2;
      if (v > 9) v -= 9;
    }
    soma += v;
    duplicar = !duplicar;
  }
  return soma % 10 === 0;
}

/** Código postal português: 0000-000 */
export function validarCodigoPostal(valor: string): boolean {
  return /^\d{4}-\d{3}$/.test((valor || "").trim());
}

/** Telemóvel português: 9 dígitos começados por 91/92/93/96. Aceita +351. */
export function validarTelemovel(valor: string): boolean {
  const t = limpar(valor).replace(/^(\+?351)/, "");
  return /^9[1236]\d{7}$/.test(t);
}

/** Telefone fixo português: 9 dígitos começados por 2. Campo opcional. */
export function validarTelefoneFixo(valor: string): boolean {
  if (!valor?.trim()) return true;
  const t = limpar(valor).replace(/^(\+?351)/, "");
  return /^2\d{8}$/.test(t);
}

export function validarEmail(valor: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((valor || "").trim());
}

/** Idade em anos completos à data de hoje. */
export function calcularIdade(dataNascimento: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dataNascimento)) return null;
  const nasc = new Date(dataNascimento + "T00:00:00");
  if (Number.isNaN(nasc.getTime())) return null;

  const hoje = new Date();
  let idade = hoje.getFullYear() - nasc.getFullYear();
  const m = hoje.getMonth() - nasc.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
  return idade;
}

export function eMenor(dataNascimento: string): boolean {
  const idade = calcularIdade(dataNascimento);
  return idade !== null && idade < 18;
}

/** Data de nascimento plausível: no passado e menos de 120 anos. */
export function validarDataNascimento(valor: string): boolean {
  const idade = calcularIdade(valor);
  return idade !== null && idade >= 0 && idade <= 120;
}

/** Validade do CC tem de estar no futuro. */
export function validarValidadeCC(valor: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const d = new Date(valor + "T00:00:00");
  if (Number.isNaN(d.getTime())) return false;
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return d >= hoje;
}

/** Nome com pelo menos dois componentes (próprio + apelido). */
export function validarNomeCompleto(valor: string): boolean {
  const partes = (valor || "").trim().split(/\s+/).filter(Boolean);
  return partes.length >= 2 && partes.every((p) => p.length >= 2);
}

/** Normaliza para o formato que o Presidente vai transcrever. */
export const formatar = {
  nif:        (v: string) => limpar(v),
  cc:         (v: string) => limpar(v).toUpperCase(),
  telemovel:  (v: string) => limpar(v).replace(/^(\+?351)/, ""),
  data:       (v: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    const [a, m, d] = v.split("-");
    return `${d}/${m}/${a}`;
  },
};
