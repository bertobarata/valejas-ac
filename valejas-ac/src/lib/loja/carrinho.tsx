"use client";

/**
 * CARRINHO
 * ─────────────────────────────────────────────────────────────────
 * Vive no browser, em localStorage. Não há contas de utilizador nem
 * sessões: quem encomenda identifica-se no fim, uma vez.
 *
 * Uma linha é um produto num tamanho. O mesmo produto em dois tamanhos
 * são duas linhas, porque é assim que o clube vai ter de os pedir ao
 * fornecedor.
 * ─────────────────────────────────────────────────────────────────
 */

import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from "react";
import { getProduto, sinalDe } from "@/lib/data/loja";

const CHAVE = "vac_carrinho";

export interface LinhaCarrinho {
  slug:        string;
  tamanho:     string;
  quantidade:  number;
  /** Nome e número gravados, quando o produto o permite. */
  personalizacao?: { nome: string; numero: string };
}

interface Contexto {
  linhas:      LinhaCarrinho[];
  total:       number;
  sinal:       number;
  totalItens:  number;
  juntar:      (l: LinhaCarrinho) => void;
  alterar:     (i: number, quantidade: number) => void;
  remover:     (i: number) => void;
  esvaziar:    () => void;
  pronto:      boolean;
}

const CarrinhoContext = createContext<Contexto | null>(null);

export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  const [linhas, setLinhas] = useState<LinhaCarrinho[]>([]);
  // `pronto` evita mostrar "carrinho vazio" no primeiro render, antes
  // de o localStorage ser lido.
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CHAVE);
      if (guardado) setLinhas(JSON.parse(guardado));
    } catch {
      /* localStorage indisponível ou corrompido — começa vazio */
    }
    setPronto(true);
  }, []);

  useEffect(() => {
    if (!pronto) return;
    try {
      localStorage.setItem(CHAVE, JSON.stringify(linhas));
    } catch {
      /* modo privado em alguns browsers recusa escrever */
    }
  }, [linhas, pronto]);

  const juntar = useCallback((nova: LinhaCarrinho) => {
    setLinhas((atuais) => {
      // Mesma peça, mesmo tamanho, mesma gravação → soma quantidades.
      const i = atuais.findIndex(
        (l) =>
          l.slug === nova.slug &&
          l.tamanho === nova.tamanho &&
          JSON.stringify(l.personalizacao ?? null) ===
            JSON.stringify(nova.personalizacao ?? null)
      );
      if (i === -1) return [...atuais, nova];
      const copia = [...atuais];
      copia[i] = { ...copia[i], quantidade: copia[i].quantidade + nova.quantidade };
      return copia;
    });
  }, []);

  const alterar = useCallback((i: number, quantidade: number) => {
    setLinhas((atuais) =>
      quantidade <= 0
        ? atuais.filter((_, j) => j !== i)
        : atuais.map((l, j) => (j === i ? { ...l, quantidade } : l))
    );
  }, []);

  const remover = useCallback((i: number) => {
    setLinhas((atuais) => atuais.filter((_, j) => j !== i));
  }, []);

  const esvaziar = useCallback(() => setLinhas([]), []);

  const total = useMemo(
    () =>
      linhas.reduce((s, l) => {
        const p = getProduto(l.slug);
        return s + (p ? p.preco * l.quantidade : 0);
      }, 0),
    [linhas]
  );

  const totalItens = useMemo(
    () => linhas.reduce((s, l) => s + l.quantidade, 0),
    [linhas]
  );

  const valor = useMemo<Contexto>(
    () => ({
      linhas, total, sinal: sinalDe(total), totalItens,
      juntar, alterar, remover, esvaziar, pronto,
    }),
    [linhas, total, totalItens, juntar, alterar, remover, esvaziar, pronto]
  );

  return <CarrinhoContext.Provider value={valor}>{children}</CarrinhoContext.Provider>;
}

export function useCarrinho(): Contexto {
  const c = useContext(CarrinhoContext);
  if (!c) throw new Error("useCarrinho tem de ser usado dentro de CarrinhoProvider");
  return c;
}
