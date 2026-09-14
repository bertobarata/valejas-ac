import type { Metadata } from "next";
import ContactoSection from "@/components/socios/ContactoSection";

export const metadata: Metadata = {
  title: "Contactos",
  description:
    "Fala com o Valejas Atlético Clube — email, telefone, morada e localização. Estamos em Valejas, Oeiras.",
};

export default function ContactosPage() {
  return (
    <>
      {/* Hero band — clears fixed navbar */}
      <section className="section-dark relative bg-blue-deep pt-36 pb-16 md:pt-44 md:pb-20 overflow-hidden">
        {/* Diagonal red sash — crest motif */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "linear-gradient(135deg, transparent 45%, #D4150C 45%, #D4150C 48%, transparent 48%)",
          }}
          aria-hidden
        />
        <div className="section-container relative z-10">
          <p className="font-body font-semibold text-xs uppercase tracking-[0.35em] text-yellow mb-4">
            Estamos aqui para ti
          </p>
          <h1 className="font-headline font-black text-6xl md:text-8xl uppercase leading-none tracking-tighter text-white">
            Contactos
          </h1>
          <p className="font-body text-lg text-white/80 max-w-xl leading-relaxed mt-6">
            Dúvidas, parcerias, imprensa ou inscrições — fala connosco por email,
            telefone ou passa pela sede do clube.
          </p>
        </div>
      </section>

      <ContactoSection /></>
  );
}
