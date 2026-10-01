/**
 * CAMADA DE DADOS — PEDIDOS DE PATROCÍNIO
 * ─────────────────────────────────────────────────────────────────
 * O que uma empresa (ou uma pessoa) pode fazer pelo clube, pela ordem
 * em que aparece na apresentação de parcerias que a Direção entregou
 * a 01/10/2026 — vestuário, lonas, vinil, caderneta, digital, mecenato.
 *
 * Os preços estão na apresentação e só lá: segue por email a quem a
 * pede, como anexo. No site não se publicam — mudam de época para
 * época e a conversa sobre valores é para ter com a comunicação, não
 * para ficar indexada no Google.
 *
 * Uma lista só, lida pela página, pelo formulário e pela API: o
 * servidor só aceita os ids que estão aqui.
 * ─────────────────────────────────────────────────────────────────
 */

import {
  validarEmail, validarNomeCompleto, validarTelemovel, validarTelefoneFixo,
} from "@/lib/validacao";

export type TipoPatrocinio =
  | "equipamentos"
  | "pavilhao"
  | "digital"
  | "caderneta"
  | "escalao"
  | "material"
  | "donativo"
  | "outro";

export interface FormaDeApoio {
  id:        TipoPatrocinio;
  /** O que aparece na caixa do formulário e no email ao clube. */
  nome:      string;
  /** Uma frase. Sem valores. */
  descricao: string;
}

export const FORMAS_DE_APOIO: FormaDeApoio[] = [
  {
    id: "equipamentos",
    nome: "Equipamentos e vestuário",
    descricao:
      "A marca no equipamento de jogo, no kit e no fato de treino, no conjunto de saída ou nos coletes.",
  },
  {
    id: "pavilhao",
    nome: "Lonas e vinil no pavilhão",
    descricao:
      "Publicidade fixa nas paredes e no piso, à vista de quem treina, de quem joga e de quem assiste.",
  },
  {
    id: "digital",
    nome: "Cartazes e conteúdo digital",
    descricao:
      "O logótipo nos cartazes dos jogos e nas publicações do clube nas redes sociais.",
  },
  {
    id: "caderneta",
    nome: "Caderneta de cromos",
    descricao: "Um lugar na caderneta do clube, que corre de mão em mão pela terra.",
  },
  {
    id: "escalao",
    nome: "Apoio a um escalão ou modalidade",
    descricao:
      "Dar a mão a uma equipa em concreto — os petizes do futsal, o atletismo, o karate.",
  },
  {
    id: "material",
    nome: "Material ou serviços",
    descricao:
      "Em vez de dinheiro, o que a sua casa faz: transporte, refeições, obras, impressão.",
  },
  {
    id: "donativo",
    nome: "Donativo (mecenato desportivo)",
    descricao:
      "Um donativo ao clube, que pode ter benefícios fiscais ao abrigo do mecenato desportivo.",
  },
  {
    id: "outro",
    nome: "Outra ideia",
    descricao: "Tem uma proposta que não cabe aqui? Conte-nos na mensagem.",
  },
];

export function getFormaDeApoio(id: string): FormaDeApoio | undefined {
  return FORMAS_DE_APOIO.find((f) => f.id === id);
}

/**
 * A apresentação vive em `privado/`, fora de `public/`: não tem
 * endereço próprio e não se descarrega do site. Só sai como anexo do
 * email, para quem deixou contacto — é isso que dá à comunicação do
 * clube a lista de quem a pediu.
 */
export const APRESENTACAO = {
  caminho:  "privado/parcerias-valejas-ac.pdf",
  /** O nome com que chega à caixa de quem a pediu. */
  ficheiro: "Valejas AC — Parcerias e Patrocínios.pdf",
};

/** Limites dos campos livres — iguais no formulário e no servidor. */
export const LIMITES = {
  entidade: 120,
  nome:     120,
  mensagem: 2000,
};

export interface PedidoPatrocinio {
  entidade: string;
  nome:     string;
  email:    string;
  telefone: string;
  tipos:    TipoPatrocinio[];
  mensagem: string;
  rgpd:     boolean;
}

export type ErrosPedido = Partial<Record<keyof PedidoPatrocinio, string>>;

/**
 * Lê o que veio do browser e devolve o pedido limpo mais os erros, em
 * português e por campo — o formulário mostra cada um junto do sítio
 * onde está o problema. Corre no servidor (que é quem manda) e no
 * browser (para avisar antes de enviar).
 *
 * Tipos que não estão na lista são descartados em silêncio: só os
 * escreveria quem mexeu no pedido à mão.
 */
export function lerPedido(b: Record<string, unknown>): {
  pedido: PedidoPatrocinio;
  erros:  ErrosPedido;
} {
  const texto = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
  const tipos = (Array.isArray(b.tipos) ? b.tipos : [])
    .map(String)
    .filter((t, i, todos): t is TipoPatrocinio =>
      Boolean(getFormaDeApoio(t)) && todos.indexOf(t) === i);

  const pedido: PedidoPatrocinio = {
    entidade: texto(b.entidade, LIMITES.entidade),
    nome:     texto(b.nome, LIMITES.nome),
    email:    texto(b.email, 200),
    telefone: texto(b.telefone, 30),
    tipos,
    mensagem: texto(b.mensagem, LIMITES.mensagem),
    rgpd:     b.rgpd === true || b.rgpd === "on" || b.rgpd === "true",
  };

  const erros: ErrosPedido = {};
  if (!validarNomeCompleto(pedido.nome)) {
    erros.nome = "Escreva o nome e o apelido de quem fala connosco.";
  }
  if (!validarEmail(pedido.email)) {
    erros.email = "Email inválido — é para lá que segue a apresentação.";
  }
  // Opcional, mas se vier tem de ser um número português que se marque.
  if (
    pedido.telefone &&
    !validarTelemovel(pedido.telefone) &&
    !validarTelefoneFixo(pedido.telefone)
  ) {
    erros.telefone = "Telefone português inválido (9 dígitos, começado por 9 ou 2).";
  }
  if (pedido.tipos.length === 0) {
    erros.tipos = "Escolha pelo menos uma forma de apoio — ou «Outra ideia».";
  }
  if (!pedido.rgpd) {
    erros.rgpd = "É preciso autorizar o tratamento dos dados para o clube responder.";
  }

  return { pedido, erros };
}
