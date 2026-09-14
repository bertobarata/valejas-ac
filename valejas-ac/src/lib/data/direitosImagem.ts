/**
 * TERMO DE CONSENTIMENTO PARA CAPTAÇÃO E UTILIZAÇÃO DE IMAGENS — RGPD
 * ─────────────────────────────────────────────────────────────────
 * Transcrito do documento oficial do clube (fotografado a 14/09/2026),
 * o mesmo que se assina em papel na sede.
 *
 * O texto do clube fala de atletas menores, porque é aí que a lei
 * exige o consentimento de quem responde por eles. A Direção quer que
 * todos os atletas o aceitem — nos maiores de idade, quem consente é o
 * próprio. É por isso que o parágrafo do consentimento tem duas
 * versões e a página escolhe a que serve.
 *
 * ⚠️ Alterar isto é alterar um documento com valor legal. Se o clube
 * mudar o papel, muda-se aqui — e ao contrário também.
 * ─────────────────────────────────────────────────────────────────
 */

export const DIRETOS_IMAGEM_TITULO =
  "Termo de Consentimento para Captação e Utilização de Imagens — RGPD";

/** Dados do clube tal como constam no rodapé do documento. */
export const CLUBE_DOCUMENTO = {
  nome: "Valejas Atlético Clube",
  fundado: "1 de novembro de 1966",
  estatuto: "Instituição de Utilidade Pública nos termos do DEC. — Lei 460/77",
  contribuinte: "501 360 328",
  morada: "Estrada das Palmeiras, Edifício V.A.C., Valejas — 2730-132 Barcarena",
  telefone: "216 023 289",
  emailDados: "secretaria.valejasac@gmail.com",
};

export const DIREITOS_IMAGEM_PARAGRAFOS: string[] = [
  "Nos termos do Regulamento (UE) 2016/679 do Parlamento Europeu e do Conselho, conhecido como Regulamento Geral sobre a Proteção de Dados (RGPD), o Valejas Atlético Clube informa que, no âmbito da sua atividade desportiva e institucional, poderá proceder à captação, gravação e divulgação de imagens e vídeos dos seus atletas.",

  "A recolha e tratamento destes dados tem como finalidade a promoção das atividades do clube através de diversos canais de comunicação, incluindo, mas não se limitando a, redes sociais (Facebook, Instagram, YouTube), website oficial do clube, materiais promocionais e institucionais (como cartazes, brochuras e vídeos), comunicação interna e externa, bem como divulgação em órgãos de comunicação social.",

  "O tratamento dos dados pessoais inclui a captação de imagem (fotografias e vídeos) e som (voz), nomeadamente em entrevistas, vídeos institucionais, treinos ou eventos desportivos. Poderá ainda, mediante autorização, incluir o nome próprio do atleta e informação desportiva relevante, como o escalão ou a participação em competições. Os dados recolhidos poderão ser partilhados com plataformas digitais, órgãos de comunicação social e entidades oficiais do desporto (como associações e federações), sempre no estrito cumprimento da legislação aplicável e com o devido respeito pela privacidade dos atletas.",

  "Os dados recolhidos serão conservados por um período máximo de 10 anos, salvo pedido de eliminação antecipada por parte do titular dos dados ou do seu representante legal. O consentimento agora prestado pode ser revogado a qualquer momento, mediante comunicação escrita dirigida ao clube, sem prejuízo da legalidade do tratamento efetuado até essa data.",

  "Os titulares dos dados, ou os seus encarregados de educação, têm, nos termos do RGPD, o direito de solicitar o acesso aos dados pessoais, a sua retificação, apagamento, limitação ou oposição ao tratamento, bem como o direito à portabilidade dos dados. Poderão também apresentar reclamação junto da Comissão Nacional de Proteção de Dados (CNPD), enquanto autoridade nacional de controlo.",

  `Para qualquer questão relacionada com a proteção de dados, o clube poderá ser contactado através do email ${
    "secretaria.valejasac@gmail.com"
  } ou telefone 216 023 289.`,
];

/** A frase que se aceita. Muda conforme quem consente. */
export function declaracao(menor: boolean): string {
  return menor
    ? "Declaro que li, compreendi e autorizo a captação e utilização da imagem e do som do(a) menor acima identificado(a), nos termos acima descritos."
    : "Declaro que li, compreendi e autorizo a captação e utilização da minha imagem e do meu som, nos termos acima descritos.";
}
