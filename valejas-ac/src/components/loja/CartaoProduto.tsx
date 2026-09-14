"use client";

/**
 * CARTÃO DE PRODUTO
 * ─────────────────────────────────────────────────────────────────
 * Escolher tamanho e juntar ao carrinho, sem sair da página. Uma loja
 * com sete produtos não precisa de página de detalhe por peça — era
 * um clique a mais para ver o que já está à vista.
 * ─────────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Check, Mail, Plus } from "lucide-react";
import {
  PRAZO_ENCOMENDA_SEMANAS, formatEuros, stockDe, type Produto,
} from "@/lib/data/loja";
import { useCarrinho } from "@/lib/loja/carrinho";

export default function CartaoProduto({
  produto, destaque,
}: {
  produto: Produto;
  destaque?: boolean;
}) {
  const { juntar } = useCarrinho();
  const [tamanho, setTamanho] = useState("");
  const [nome, setNome] = useState("");
  const [numero, setNumero] = useState("");
  const [juntou, setJuntou] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const stock = tamanho ? stockDe(produto, tamanho) : 0;
  const porEncomenda = Boolean(tamanho) && stock === 0;

  function adicionar() {
    if (!tamanho) {
      setErro("Escolhe o tamanho.");
      return;
    }
    if (produto.personalizavel && nome.trim() && !numero.trim()) {
      setErro("Falta o número.");
      return;
    }
    setErro(null);
    juntar({
      slug: produto.slug,
      tamanho,
      quantidade: 1,
      personalizacao:
        produto.personalizavel && nome.trim()
          ? { nome: nome.trim(), numero: numero.trim() }
          : undefined,
    });
    setJuntou(true);
    window.setTimeout(() => setJuntou(false), 2200);
  }

  return (
    <article className="bg-surface-high flex flex-col">
      {/* A fotografia do fornecedor é uma maqueta sobre fundo cinzento —
          por isso vive dentro de uma moldura própria, sem se fingir de
          fotografia de estúdio do clube. */}
      {produto.imagem && (
        <div className={clsx("relative bg-white", destaque ? "aspect-[2/1]" : "aspect-[3/2]")}>
          <Image
            src={produto.imagem}
            alt={produto.nome}
            fill
            sizes={destaque ? "(max-width: 1024px) 100vw, 60vw" : "(max-width: 640px) 100vw, 33vw"}
            className="object-contain"
          />
        </div>
      )}

      <div className={clsx("flex flex-col flex-1", destaque ? "p-7 md:p-10" : "p-6")}>
      <div className="flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3
            className={clsx(
              "font-headline font-black uppercase text-on-surface leading-tight",
              destaque ? "text-3xl md:text-4xl tracking-tighter" : "text-xl"
            )}
          >
            {produto.nome}
          </h3>
          <p
            className={clsx(
              "font-headline font-black text-yellow leading-none",
              produto.sobConsulta
                ? "text-sm uppercase tracking-widest"
                : destaque ? "text-4xl" : "text-2xl"
            )}
          >
            {produto.sobConsulta ? "Sob consulta" : formatEuros(produto.preco)}
          </p>
        </div>

        <p className="font-body text-on-surface-muted leading-relaxed mt-3">
          {produto.descricao}
        </p>

        <p className="font-body text-xs text-on-surface-muted mt-2">
          Referência {produto.referencia}
        </p>

        {produto.inclui && (
          <ul className="mt-5 space-y-2">
            {produto.inclui.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <Check size={16} className="text-yellow shrink-0 mt-1" aria-hidden />
                <span className="font-body text-on-surface-muted leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/*
        Sem preço fechado não há botão de encomendar: cobrar um valor que
        ninguém sabe qual é seria pior do que mandar falar com o clube.
      */}
      {produto.sobConsulta ? (
        <div className="mt-6">
          <p className="font-body text-sm text-on-surface-muted leading-relaxed">
            Este artigo não tem preço fechado — depende do que se
            personalizar e da quantidade. Fala com o clube e dizemos quanto é.
          </p>
          <Link href="/contactos" className="btn-ghost text-sm mt-4">
            <Mail size={16} /> Pedir orçamento
          </Link>
        </div>
      ) : (
      <>
      {/* Tamanhos */}
      <fieldset className="mt-6">
        <legend className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">
          Tamanho
        </legend>
        <div className="flex flex-wrap gap-2">
          {produto.variantes.map((v) => {
            const ativo = tamanho === v.tamanho;
            return (
              <button
                key={v.tamanho}
                type="button"
                onClick={() => { setTamanho(v.tamanho); setErro(null); }}
                aria-pressed={ativo}
                className={clsx(
                  "font-body text-sm px-4 py-2.5 border transition-colors duration-200",
                  ativo
                    ? "border-yellow bg-yellow/15 text-on-surface"
                    : "border-on-surface/20 text-on-surface-muted hover:border-on-surface/50 hover:text-on-surface"
                )}
              >
                {v.tamanho}
                {v.stock === 0 && (
                  <span className="block font-body text-[0.7rem] text-on-surface-muted">
                    por encomenda
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Disponibilidade do tamanho escolhido */}
      {tamanho && (
        <p className="font-body text-sm text-on-surface-muted mt-3">
          {porEncomenda
            ? `Não está na sede. Encomenda-se ao fornecedor, até ${PRAZO_ENCOMENDA_SEMANAS} semanas.`
            : `Disponível na sede${stock <= 2 ? ` — resta${stock === 1 ? "" : "m"} ${stock}` : ""}.`}
        </p>
      )}

      {/* Gravação */}
      {produto.personalizavel && (
        <div className="grid grid-cols-[1fr_6rem] gap-3 mt-5">
          <label className="block">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block mb-2">
              Nome nas costas <span className="normal-case tracking-normal opacity-60">(opcional)</span>
            </span>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              maxLength={12}
              autoComplete="off"
              className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
            />
          </label>
          <label className="block">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block mb-2">
              Número
            </span>
            <input
              value={numero}
              onChange={(e) => setNumero(e.target.value.replace(/\D/g, "").slice(0, 2))}
              inputMode="numeric"
              autoComplete="off"
              className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
            />
          </label>
        </div>
      )}

      {erro && (
        <p role="alert" className="font-body text-sm text-red-500 mt-3">{erro}</p>
      )}

      <button
        type="button"
        onClick={adicionar}
        className={clsx(
          "mt-6 justify-center",
          juntou ? "btn-ghost" : "btn-primary",
          destaque ? "text-base py-4" : "text-sm"
        )}
      >
        {juntou ? (
          <><Check size={16} /> Juntou ao carrinho</>
        ) : (
          <><Plus size={16} /> Juntar ao carrinho</>
        )}
      </button>
      </>
      )}
      </div>
    </article>
  );
}
