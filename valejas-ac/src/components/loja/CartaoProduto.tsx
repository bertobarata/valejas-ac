"use client";

/**
 * CARTÃO DE PRODUTO
 * ─────────────────────────────────────────────────────────────────
 * Escolher tamanho e juntar ao carrinho, sem sair da página. Um
 * catálogo de vinte e três peças não precisa de página de detalhe por
 * peça — era um clique a mais para ver o que já está à vista.
 *
 * O cartão não fala de stock nem de prazos. Quase tudo é por encomenda,
 * e repetir isso em cada tamanho de cada peça era ruído: a regra está
 * dita uma vez, no cabeçalho da loja.
 * ─────────────────────────────────────────────────────────────────
 */

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { Check, ChevronDown, Mail, Plus } from "lucide-react";
import { formatEuros, type Produto } from "@/lib/data/loja";
import { useCarrinho } from "@/lib/loja/carrinho";

/**
 * "Do 4 anos ao 3XL". Diz a escala numa linha, em vez de despejar treze
 * botões antes de a pessoa saber sequer se o produto lhe interessa.
 */
function escalaDeTamanhos(produto: Produto): string {
  const tamanhos = produto.variantes.map((v) => v.tamanho);
  if (tamanhos.length === 0) return "Tamanho único";
  if (tamanhos.length === 1) return tamanhos[0];
  return `Do ${tamanhos[0]} ao ${tamanhos[tamanhos.length - 1]}`;
}

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

  const idTamanho = `tamanho-${produto.slug}`;

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
        <div
          className={clsx(
            "relative bg-white",
            // A imagem do kit é três maquetas lado a lado: numa moldura
            // quadrada ficaria minúscula ao centro.
            produto.kit ? "aspect-[16/4]" : destaque ? "aspect-[2/1]" : "aspect-[3/2]"
          )}
        >
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
      {/* Tamanhos — um botão que abre a lista, com a escala escrita em cima */}
      <div className="mt-6">
        <label
          htmlFor={idTamanho}
          className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block"
        >
          Tamanho
        </label>
        <p className="font-body text-sm text-on-surface-muted mt-1 mb-3">
          {escalaDeTamanhos(produto)}
        </p>

        <div className="relative">
          <select
            id={idTamanho}
            value={tamanho}
            onChange={(e) => { setTamanho(e.target.value); setErro(null); }}
            className={clsx(
              "appearance-none w-full font-body text-sm text-left",
              "px-4 py-3.5 pr-11 border transition-colors duration-200 cursor-pointer",
              "bg-transparent text-on-surface",
              tamanho
                ? "border-yellow bg-yellow/10"
                : "border-on-surface/20 hover:border-on-surface/50"
            )}
          >
            <option value="">Escolher tamanho</option>
            {produto.variantes.map((v) => (
              <option key={v.tamanho} value={v.tamanho}>
                {v.tamanho}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            aria-hidden
            className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-muted pointer-events-none"
          />
        </div>
      </div>

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
