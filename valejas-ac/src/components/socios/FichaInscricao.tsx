"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Send, CheckCircle } from "lucide-react";
import { PLANOS } from "@/lib/data/socios";
import { submitToFormspree } from "@/lib/formspree";

gsap.registerPlugin(ScrollTrigger);

export default function FichaInscricao() {
  const sectionRef = useRef<HTMLElement>(null);
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    try {
      const fd = new FormData(e.currentTarget);
      fd.append("_subject", "Nova inscrição sócio — Valejas AC");
      await submitToFormspree(Object.fromEntries(fd));
      setEnviado(true);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao enviar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      ref={sectionRef}
      id="ficha-inscricao"
      className="bg-surface-low py-20 md:py-28 bg-texture"
    >
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left — text */}
          <div className="space-y-5">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.35em] text-yellow">
              Ficha de Inscrição
            </p>
            <h2 className="font-headline font-black italic text-5xl md:text-6xl uppercase leading-none tracking-tighter text-on-surface">
              Torna-te <span className="text-yellow">Sócio</span>
            </h2>
            <p className="font-body text-base text-on-surface-muted leading-relaxed max-w-sm">
              Preenche o formulário. A Direção entrará em contacto contigo em até
              48 horas úteis para confirmar a inscrição e indicar os detalhes de
              pagamento.
            </p>

            {/* Trust signals */}
            <ul className="space-y-3 pt-4">
              {[
                "Resposta garantida em 48h",
                "Dados protegidos — RGPD",
                "Cancela quando quiseres",
                "Cartão oficial enviado por correio",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 font-body text-sm text-on-surface-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — form */}
          <div className="bg-surface-high p-8 md:p-10">
            {enviado ? (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
                <CheckCircle size={48} className="text-yellow" />
                <h3 className="font-headline font-black italic text-3xl uppercase text-on-surface">
                  Inscrição recebida!
                </h3>
                <p className="font-body text-base text-on-surface-muted max-w-xs">
                  Entraremos em contacto contigo em breve. Bem-vindo ao clube.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nome completo */}
                <div>
                  <label className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    required
                    placeholder="O teu nome"
                    className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
                  />
                </div>

                {/* Email + Telefone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="email@exemplo.pt"
                      className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
                    />
                  </div>
                  <div>
                    <label className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      name="telefone"
                      placeholder="+351 9xx xxx xxx"
                      className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
                    />
                  </div>
                </div>

                {/* NIF */}
                <div>
                  <label className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block mb-2">
                    NIF (opcional)
                  </label>
                  <input
                    type="text"
                    name="nif"
                    placeholder="000 000 000"
                    maxLength={9}
                    className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
                  />
                </div>

                {/* Plano */}
                <div>
                  <label className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block mb-2">
                    Plano *
                  </label>
                  <select
                    name="plano"
                    required
                    className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full bg-surface-high text-on-surface"
                  >
                    <option value="">Seleciona um plano</option>
                    {PLANOS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome} — {p.preco}€/{p.periodo}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mensagem */}
                <div>
                  <label className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block mb-2">
                    Mensagem (opcional)
                  </label>
                  <textarea
                    name="mensagem"
                    rows={3}
                    placeholder="Alguma questão ou informação adicional?"
                    className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full resize-none"
                  />
                </div>

                {/* RGPD */}
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rgpd"
                    required
                    className="mt-0.5 w-4 h-4 accent-yellow flex-shrink-0"
                  />
                  <span className="font-body text-xs text-on-surface-muted leading-relaxed">
                    Autorizo o tratamento dos meus dados para efeitos de inscrição
                    como sócio, conforme a{" "}
                    <Link href="/privacidade" className="text-yellow underline">
                      Política de Privacidade
                    </Link>
                    .
                  </span>
                </label>

                {erro && (
                  <p className="font-body text-sm text-red-500" role="alert">
                    {erro}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center text-sm py-4 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    "A enviar…"
                  ) : (
                    <>
                      <Send size={14} /> Enviar Inscrição
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
