import { describe, it, expect } from "vitest";
import {
  PRODUTOS, KIT_ATLETA, getProduto, sinalDe, stockDe, temPrecoFechado,
  SINAL_PERCENTAGEM, PECAS_DO_KIT,
} from "@/lib/data/loja";
import { gerarNumero } from "@/lib/data/encomendas";
import {
  validarNIF, validarCC, validarTelemovel, validarEmail,
  validarCodigoPostal, eMenor, validarNomeCompleto,
} from "@/lib/validacao";
import { MODALIDADES } from "@/lib/data/modalidades";
import { CALENDARIO, CLUBE, ehValejas, proximoJogo } from "@/lib/data/jogos";
import { EQUIPAS, ORDEM_POSICOES, doSanity } from "@/lib/data/plantel";

/*
 * As regras que, se partirem, custam dinheiro ao clube ou expõem
 * alguém. Cada teste aqui nasceu de uma decisão real — não de uma
 * função à espera de cobertura.
 */

describe("loja — os preços nunca vêm do browser", () => {
  it("o preço de cada peça vem do catálogo do servidor", () => {
    const p = getProduto("equipamento-principal");
    expect(p?.preco).toBe(27.68);
  });

  it("uma referência inventada não existe", () => {
    expect(getProduto("camisola-do-benfica")).toBeUndefined();
  });

  it("o kit custa a soma das peças que o compõem, não um número à mão", () => {
    const soma = PECAS_DO_KIT
      .map((slug) => getProduto(slug)?.preco ?? 0)
      .reduce((a, b) => a + b, 0);
    expect(KIT_ATLETA.preco).toBeCloseTo(soma, 2);
  });

  it("os artigos sob consulta não têm preço para cobrar", () => {
    for (const p of PRODUTOS.filter((x) => x.sobConsulta)) {
      expect(temPrecoFechado(p)).toBe(false);
      expect(p.preco).toBe(0);
    }
  });

  it("o sinal é a percentagem combinada, aos cêntimos", () => {
    expect(sinalDe(68.89)).toBe(20.67);
    expect(sinalDe(100)).toBe(SINAL_PERCENTAGEM);
  });

  it("um tamanho que o produto não tem dá stock zero, nunca undefined", () => {
    const p = getProduto("meias-azuis")!;
    expect(p).toBeDefined();
    expect(stockDe(p, "tamanho-inventado")).toBe(0);
  });

  it("cada número de encomenda tem a forma que o clube diz ao telefone", () => {
    expect(gerarNumero()).toMatch(/^VAC-\d{6}-[A-Z0-9]{4}$/);
  });
});

describe("validação — o que o formulário de sócio deixa passar", () => {
  it("aceita um NIF com dígito de controlo certo e recusa o errado", () => {
    expect(validarNIF("123456789")).toBe(true);
    expect(validarNIF("123456788")).toBe(false);
    expect(validarNIF("12345678")).toBe(false);
  });

  it("aceita um Cartão de Cidadão válido e recusa um com um dígito trocado", () => {
    expect(validarCC("123456789ZZ1")).toBe(true);
    expect(validarCC("123456789ZZ2")).toBe(false);
  });

  it("só aceita telemóveis portugueses", () => {
    expect(validarTelemovel("932642894")).toBe(true);
    expect(validarTelemovel("+351 932 642 894")).toBe(true);
    expect(validarTelemovel("214365104")).toBe(false);  // fixo
    expect(validarTelemovel("12345")).toBe(false);
  });

  it("o código postal tem de ter os dois blocos", () => {
    expect(validarCodigoPostal("2730-132")).toBe(true);
    expect(validarCodigoPostal("2730")).toBe(false);
  });

  it("um nome sozinho não é nome completo", () => {
    expect(validarNomeCompleto("Ana Maria Silva")).toBe(true);
    expect(validarNomeCompleto("Ana")).toBe(false);
  });

  it("recusa emails sem forma de email", () => {
    expect(validarEmail("ana@exemplo.pt")).toBe(true);
    expect(validarEmail("ana@")).toBe(false);
  });

  it("quem nasceu há menos de 18 anos é menor — e isso decide o encarregado de educação", () => {
    const hoje = new Date();
    const ha10anos = new Date(hoje.getFullYear() - 10, hoje.getMonth(), hoje.getDate());
    const ha30anos = new Date(hoje.getFullYear() - 30, hoje.getMonth(), hoje.getDate());
    expect(eMenor(ha10anos.toISOString().slice(0, 10))).toBe(true);
    expect(eMenor(ha30anos.toISOString().slice(0, 10))).toBe(false);
  });
});

describe("conteúdo — o que a Direção fixou não pode mudar sem se dar por isso", () => {
  it("são sete modalidades, e não as que o site tinha em maio", () => {
    const nomes = MODALIDADES.map((m) => m.slug);
    expect(nomes).toHaveLength(7);
    expect(nomes).toContain("futsal");
    expect(nomes).not.toContain("kung-fu");
    expect(nomes).not.toContain("yoga");
    expect(nomes).not.toContain("futebol-11");
  });

  it("o judo é só formação e em parceria", () => {
    const judo = MODALIDADES.find((m) => m.slug === "judo")!;
    expect(judo.apenasFormacao).toBe(true);
    expect(judo.parceria?.nome).toBeTruthy();
  });

  it("o futsal tem os sete escalões e duas equipas seniores", () => {
    const futsal = MODALIDADES.find((m) => m.slug === "futsal")!;
    expect(futsal.escaloes).toHaveLength(7);
    expect(futsal.equipas).toHaveLength(2);
  });
});

describe("calendário — o oficial da AF Lisboa", () => {
  it("tem as trinta jornadas, sem repetições", () => {
    expect(CALENDARIO).toHaveLength(30);
    const jornadas = CALENDARIO.map((j) => j.jornada);
    expect(new Set(jornadas).size).toBe(30);
  });

  it("o Valejas joga em todos os jogos, metade em casa", () => {
    const emCasa = CALENDARIO.filter((j) => ehValejas(j.casa));
    expect(emCasa).toHaveLength(15);
    for (const j of CALENDARIO) {
      expect(ehValejas(j.casa) || ehValejas(j.fora)).toBe(true);
    }
  });

  it("está por ordem de data", () => {
    const datas = CALENDARIO.map((j) => new Date(j.data).getTime());
    expect([...datas].sort((a, b) => a - b)).toEqual(datas);
  });

  it("o próximo jogo é o primeiro que ainda não aconteceu", () => {
    const antes = new Date("2026-09-01T00:00:00Z");
    expect(proximoJogo(antes)?.jornada).toBe(1);
    const depoisDeTudo = new Date("2030-01-01T00:00:00Z");
    expect(proximoJogo(depoisDeTudo)).toBeNull();
  });

  it(`o clube chama-se ${CLUBE} em todo o lado`, () => {
    expect(CALENDARIO.some((j) => j.casa === CLUBE || j.fora === CLUBE)).toBe(true);
  });
});

describe("plantel — o que vem do CMS", () => {
  it("as equipas são as duas seniores mais os sete escalões", () => {
    expect(EQUIPAS).toHaveLength(9);
    expect(EQUIPAS[0].id).toBe("a");
  });

  it("uma posição desconhecida cai em Universal em vez de rebentar", () => {
    const j = doSanity({
      _id: "x", nome: "Alguém", numero: 7,
      posicao: "Extremo-esquerdo", equipa: "a",
    });
    expect(ORDEM_POSICOES).toContain(j.posicao);
    expect(j.posicao).toBe("Universal");
  });

  it("o capitão só existe quando está marcado", () => {
    const semCapitao = doSanity({ _id: "x", nome: "A B", numero: 1, posicao: "Ala", equipa: "a" });
    const comCapitao = doSanity({ _id: "y", nome: "C D", numero: 2, posicao: "Ala", equipa: "a", capitao: true });
    expect(semCapitao.capitao).toBeUndefined();
    expect(comCapitao.capitao).toBe(true);
  });
});
