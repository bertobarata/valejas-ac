import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  CLUBE_DOCUMENTO, DIREITOS_IMAGEM_PARAGRAFOS, DIRETOS_IMAGEM_TITULO, declaracao,
} from "@/lib/data/direitosImagem";

export const metadata: Metadata = {
  title: "Direitos de imagem",
  description:
    "Termo de consentimento para captação e utilização de imagens do Valejas Atlético Clube, nos termos do RGPD.",
};

/**
 * DIREITOS DE IMAGEM
 * ─────────────────────────────────────────────────────────────────
 * O mesmo texto que se assina em papel na sede, à vista de quem o
 * aceita no formulário de inscrição. Aceitar sem poder ler não é
 * consentimento informado — e é isso que o RGPD exige.
 * ─────────────────────────────────────────────────────────────────
 */
export default function DireitosDeImagemPage() {
  return (
    <div className="bg-surface">
      <section className="bg-surface-low bg-texture border-b border-on-surface/10">
        <div className="section-container py-14 md:py-20">
          <Link
            href="/inscricoes"
            className="inline-flex items-center gap-2 font-body text-sm text-on-surface-muted hover:text-on-surface transition-colors mb-4"
          >
            <ArrowLeft size={16} aria-hidden />
            Voltar às inscrições
          </Link>
          <h1 className="section-title text-3xl md:text-5xl">
            Direitos de <span>imagem</span>
          </h1>
          <p className="font-body text-lg text-on-surface-muted mt-5 max-w-2xl leading-relaxed">
            {DIRETOS_IMAGEM_TITULO}
          </p>
        </div>
      </section>

      <div className="section-container py-14 md:py-20 max-w-3xl">
        <div className="space-y-6">
          {DIREITOS_IMAGEM_PARAGRAFOS.map((p) => (
            <p key={p.slice(0, 40)} className="font-body text-on-surface-muted leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        <div className="bg-surface-high p-7 md:p-8 mt-10 space-y-4">
          <h2 className="font-headline font-black uppercase text-lg tracking-tight text-on-surface">
            O que se aceita
          </h2>
          <p className="font-body text-on-surface leading-relaxed">
            {declaracao(false)}
          </p>
          <p className="font-body text-on-surface-muted leading-relaxed">
            Quando o atleta é menor de idade, quem aceita é o encarregado de
            educação, e a declaração passa a ser esta:
          </p>
          <p className="font-body text-on-surface leading-relaxed">
            {declaracao(true)}
          </p>
        </div>

        <div className="mt-10 pt-8 border-t border-on-surface/15">
          <p className="font-body text-sm text-on-surface-muted leading-relaxed">
            <strong className="text-on-surface">{CLUBE_DOCUMENTO.nome}</strong> ·
            fundado em {CLUBE_DOCUMENTO.fundado} · {CLUBE_DOCUMENTO.estatuto} ·
            contribuinte n.º {CLUBE_DOCUMENTO.contribuinte}
            <br />
            {CLUBE_DOCUMENTO.morada} · telefone {CLUBE_DOCUMENTO.telefone}
            <br />
            Para questões de proteção de dados:{" "}
            <a href={`mailto:${CLUBE_DOCUMENTO.emailDados}`} className="text-yellow underline">
              {CLUBE_DOCUMENTO.emailDados}
            </a>
          </p>
        </div>

        <div className="mt-10">
          <Link href="/inscricoes#enviar" className="btn-primary text-sm">
            Voltar à inscrição
          </Link>
        </div>
      </div>
    </div>
  );
}
