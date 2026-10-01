/**
 * CAMADA DE DADOS — DOCUMENTOS PARA DESCARREGAR
 * ─────────────────────────────────────────────────────────────────
 * Papéis que a pessoa tem de imprimir, tratar fora do site e entregar
 * na sede. O site não os recebe preenchidos — nem devia: o exame
 * médico é assinado por um médico e leva dados de saúde.
 *
 * Ficheiros em /public/documentos/. O texto (nome, descrição, como
 * usar) está em messages/<lingua>/inscricoes.json → documentos.<chave>.
 * ─────────────────────────────────────────────────────────────────
 */

export interface Documento {
  /** Chave das traduções: documentos.<chave>.{nome,descricao,comoUsar}. */
  chave:     string;
  ficheiro:  string;
  /** Quem o emitiu, quando não é o clube. Nome próprio — não se traduz. */
  origem?:   string;
}

export const EXAME_MEDICO: Documento = {
  chave: "exameMedico",
  ficheiro: "/documentos/exame-medico-desportivo.pdf",
  origem: "Instituto Português do Desporto e Juventude",
};

export const DOCUMENTOS: Documento[] = [EXAME_MEDICO];
