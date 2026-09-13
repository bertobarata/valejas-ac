/**
 * CAMADA DE DADOS — PROPOSTA DE SÓCIO
 * ─────────────────────────────────────────────────────────────────
 * Espelha a ficha de papel "Proposta de Sócio" do Valejas AC.
 *
 * Diferenças deliberadas face ao papel:
 *  - Removidos (obsoletos): "B.I. Emitido em", "B.I. Emitido por".
 *  - Acrescentados: Email e Código Postal — o papel não os tem, mas
 *    sem eles o clube não confirma a proposta nem envia o cartão.
 *  - Preenchidos só pela Direção, logo fora deste formulário:
 *    Nº de Sócio, Data de Admissão, Deliberação, Reunião em.
 *
 * A ordem de CAMPOS_FICHA é a ordem impressa no papel — é por ela que
 * o email sai, para o Presidente transcrever para o Softgab de cima
 * a baixo sem andar à procura.
 * ─────────────────────────────────────────────────────────────────
 */

export const ESTADOS_CIVIS = [
  "Solteiro(a)",
  "Casado(a)",
  "União de facto",
  "Divorciado(a)",
  "Separado(a)",
  "Viúvo(a)",
] as const;

export type EstadoCivil = (typeof ESTADOS_CIVIS)[number];

/** Ficha de papel usa M / F. "I" acrescentado por pedido da Direção. */
export const SEXOS = [
  { valor: "M", label: "Masculino"   },
  { valor: "F", label: "Feminino"    },
  { valor: "I", label: "Indefinido"  },
] as const;

export type Sexo = (typeof SEXOS)[number]["valor"];

export interface PropostaSocio {
  // ── Identificação ──
  nome:           string;
  dataNascimento: string;   // yyyy-mm-dd
  sexo:           Sexo;
  estadoCivil:    string;
  naturalidade:   string;
  nacionalidade:  string;

  // ── Filiação (ficha de papel) ──
  nomePai:        string;
  nomeMae:        string;

  // ── Morada e contactos ──
  morada:         string;
  codigoPostal:   string;   // 0000-000
  localidade:     string;
  email:          string;
  telemovel:      string;
  telefoneFixo:   string;   // opcional

  // ── Documentos ──
  cc:             string;   // nº cartão de cidadão
  ccValidade:     string;   // yyyy-mm-dd
  nif:            string;
  profissao:      string;   // opcional

  // ── Adesão ──
  proponente:     string;   // opcional — sócio que propõe

  // ── Pagamento ──
  periodicidade:  string;   // id de PERIODICIDADES
  metodoPagamento: string;  // id de METODOS_PAGAMENTO
  iban:           string;   // só para débito direto
  ibanTitular:    string;   // só para débito direto

  // ── Encarregado de educação (só se menor) ──
  eeNome:         string;
  eeParentesco:   string;
  eeCC:           string;
  eeTelemovel:    string;
  eeEmail:        string;
}

/**
 * Ordem exata da ficha de papel. `chave` null = campo preenchido
 * pela Direção no Softgab, aparece no email como linha em branco
 * para o Presidente não perder o fio.
 */
export const CAMPOS_FICHA: { label: string; chave: keyof PropostaSocio | null }[] = [
  { label: "Data Admissão",     chave: null            },
  { label: "Categoria",         chave: null            },
  { label: "Nº Sócio",          chave: null            },
  { label: "Nome do Sócio",     chave: "nome"          },
  { label: "Morada",            chave: "morada"        },
  { label: "Código Postal",     chave: "codigoPostal"  },
  { label: "Localidade",        chave: "localidade"    },
  { label: "Data Nascimento",   chave: "dataNascimento"},
  { label: "Naturalidade",      chave: "naturalidade"  },
  { label: "Nacionalidade",     chave: "nacionalidade" },
  { label: "Estado Civil",      chave: "estadoCivil"   },
  { label: "Sexo",              chave: "sexo"          },
  { label: "C.C. Nº",           chave: "cc"            },
  { label: "Validade C.C.",     chave: "ccValidade"    },
  { label: "Nº Contribuinte",   chave: "nif"           },
  { label: "Profissão",         chave: "profissao"     },
  { label: "Email",             chave: "email"         },
  { label: "Telefone de Casa",  chave: "telefoneFixo"  },
  { label: "Telemóvel",         chave: "telemovel"     },
  { label: "Nome do Pai",       chave: "nomePai"       },
  { label: "Nome de Mãe",       chave: "nomeMae"       },
  { label: "Proposto por",      chave: "proponente"    },
  { label: "Periodicidade",     chave: "periodicidade" },
  { label: "Método pagamento",  chave: "metodoPagamento" },
  { label: "IBAN (déb. direto)", chave: "iban"         },
];

export const CAMPOS_OBRIGATORIOS: (keyof PropostaSocio)[] = [
  "nome", "dataNascimento", "sexo", "estadoCivil", "naturalidade",
  "nacionalidade", "nomePai", "nomeMae", "morada", "codigoPostal",
  "localidade", "email", "telemovel", "cc", "ccValidade", "nif",
  "periodicidade", "metodoPagamento",
];

/** Campos extra exigidos quando o candidato é menor de idade. */
export const CAMPOS_OBRIGATORIOS_MENOR: (keyof PropostaSocio)[] = [
  "eeNome", "eeParentesco", "eeCC", "eeTelemovel", "eeEmail",
];

export const PARENTESCOS = [
  "Mãe", "Pai", "Avó", "Avô", "Tutor(a) legal", "Outro",
] as const;
