"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { CONTACTO } from "@/lib/data/socios";

gsap.registerPlugin(ScrollTrigger);

export default function ContactoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contacto-block",
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setEnviado(true);
  }

  return (
    <section ref={sectionRef} id="contacto" className="bg-surface py-20 md:py-28">
      <div className="section-container">

        <div className="mb-14">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.35em] text-yellow mb-3">
            Fala Connosco
          </p>
          <h2 className="font-headline font-black italic text-5xl md:text-6xl uppercase leading-none tracking-tighter text-on-surface">
            Contacto &{" "}
            <span className="text-yellow">Localização</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left — info blocks */}
          <div className="lg:col-span-4 space-y-4">

            {/* Email */}
            <div className="contacto-block bg-surface-high p-6 flex items-start gap-4 border-l-4 border-yellow">
              <Mail size={18} className="text-yellow flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-body text-[10px] font-bold uppercase tracking-widest text-on-surface-muted mb-1">Email</p>
                <a
                  href={`mailto:${CONTACTO.email}`}
                  className="font-body text-sm text-on-surface hover:text-yellow transition-colors duration-200"
                >
                  {CONTACTO.email}
                </a>
              </div>
            </div>

            {/* Telefone */}
            <div className="contacto-block bg-surface-high p-6 flex items-start gap-4 border-l-4 border-blue">
              <Phone size={18} className="text-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-body text-[10px] font-bold uppercase tracking-widest text-on-surface-muted mb-1">Telefone</p>
                <a
                  href={`tel:${CONTACTO.telefone}`}
                  className="font-body text-sm text-on-surface hover:text-yellow transition-colors duration-200"
                >
                  {CONTACTO.telefone}
                </a>
              </div>
            </div>

            {/* Morada */}
            <div className="contacto-block bg-surface-high p-6 flex items-start gap-4 border-l-4 border-red">
              <MapPin size={18} className="text-red flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-body text-[10px] font-bold uppercase tracking-widest text-on-surface-muted mb-1">Morada</p>
                <p className="font-body text-sm text-on-surface leading-relaxed">
                  {CONTACTO.morada}<br />
                  {CONTACTO.codigoPostal}<br />
                  {CONTACTO.concelho}, {CONTACTO.pais}
                </p>
              </div>
            </div>

            {/* Horário */}
            <div className="contacto-block bg-surface-high p-6 flex items-start gap-4">
              <Clock size={18} className="text-on-surface-muted flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-body text-[10px] font-bold uppercase tracking-widest text-on-surface-muted mb-3">Horário</p>
                <div className="space-y-2">
                  {CONTACTO.horario.map((h) => (
                    <div key={h.dias} className="flex justify-between gap-6">
                      <span className="font-body text-xs text-on-surface-muted">{h.dias}</span>
                      <span className={`font-body text-xs font-semibold ${h.horas === "Fechado" ? "text-red" : "text-on-surface"}`}>
                        {h.horas}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right — contact form */}
          <div className="lg:col-span-5 contacto-block">
            <div className="bg-surface-high p-8">
              <h3 className="font-headline font-black italic text-2xl uppercase tracking-tighter text-on-surface mb-6">
                Envia-nos uma Mensagem
              </h3>

              {enviado ? (
                <div className="flex flex-col items-center justify-center py-14 text-center gap-4">
                  <CheckCircle size={40} className="text-yellow" />
                  <h4 className="font-headline font-black italic text-2xl uppercase text-on-surface">
                    Mensagem enviada!
                  </h4>
                  <p className="font-body text-sm text-on-surface-muted">
                    Responderemos em breve. Obrigado pelo contacto.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-body text-[10px] font-bold uppercase tracking-widest text-on-surface-muted block mb-1.5">
                        Nome *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="O teu nome"
                        className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
                      />
                    </div>
                    <div>
                      <label className="font-body text-[10px] font-bold uppercase tracking-widest text-on-surface-muted block mb-1.5">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="email@exemplo.pt"
                        className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-body text-[10px] font-bold uppercase tracking-widest text-on-surface-muted block mb-1.5">
                      Assunto *
                    </label>
                    <select
                      required
                      className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full bg-surface-high text-on-surface"
                    >
                      <option value="">Seleciona o assunto</option>
                      <option>Questão sobre sócios</option>
                      <option>Patrocínios e parcerias</option>
                      <option>Imprensa e media</option>
                      <option>Inscrições nas modalidades</option>
                      <option>Instalações e infraestrutura</option>
                      <option>Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-body text-[10px] font-bold uppercase tracking-widest text-on-surface-muted block mb-1.5">
                      Mensagem *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="A tua mensagem…"
                      className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center text-sm py-4 disabled:opacity-60"
                  >
                    {loading ? "A enviar…" : <><Send size={14} /> Enviar Mensagem</>}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Map placeholder */}
          <div className="lg:col-span-3 contacto-block">
            <div className="h-full min-h-[300px] bg-surface-high relative overflow-hidden flex flex-col">
              {/* OpenStreetMap embed — replace src with real coordinates */}
              <iframe
                title="Localização Valejas AC"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-9.3200%2C38.8700%2C-9.2800%2C38.9000&layer=mapnik&marker=38.8850%2C-9.3000"
                className="flex-1 w-full border-0 grayscale contrast-125 dark:invert dark:hue-rotate-180 min-h-[300px]"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              {/* Address overlay */}
              <div className="bg-surface-highest px-5 py-4 border-t border-on-surface/10">
                <p className="font-body font-semibold text-xs text-on-surface">
                  {CONTACTO.morada}
                </p>
                <p className="font-body text-xs text-on-surface-muted">
                  {CONTACTO.codigoPostal} · {CONTACTO.concelho}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
