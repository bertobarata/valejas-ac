/**
 * CAMADA DE DADOS — DOCUMENTOS PARA DESCARREGAR
 * ─────────────────────────────────────────────────────────────────
 * Papéis que a pessoa tem de imprimir, tratar fora do site e entregar
 * na sede. O site não os recebe preenchidos — nem devia: o exame
 * médico é assinado por um médico e leva dados de saúde.
 *
 * Ficheiros em /public/documentos/.
 * ─────────────────────────────────────────────────────────────────
 */

export interface Documento {
  nome:      string;
  ficheiro:  string;
  descricao: string;
  /** O que a pessoa tem de fazer com ele antes de o entregar. */
  comoUsar:  string;
  /** Quem o emitiu, quando não é o clube. */
  origem?:   string;
}

export const EXAME_MEDICO: Documento = {
  nome: "Exame médico desportivo",
  ficheiro: "/documentos/exame-medico-desportivo.pdf",
  descricao:
    "O formulário oficial que atesta que estás apto para a prática desportiva. É obrigatório para competir e para treinar no clube.",
  comoUsar:
    "Imprime, leva ao teu médico ou a um centro de medicina desportiva, e entrega o original na sede. O clube não o recebe pelo site.",
  origem: "Instituto Português do Desporto e Juventude",
};

export const DOCUMENTOS: Documento[] = [EXAME_MEDICO];
