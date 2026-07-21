import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AcademiaCTA() {
  return (
    <section className="bg-surface py-0">
      <div className="section-container pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-on-surface/10">

          {/* Image side */}
          <div className="relative min-h-[300px] bg-surface-highest overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-surface-mid to-surface" />
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <span className="font-headline font-black text-[12rem] text-yellow italic leading-none">V</span>
            </div>
          </div>

          {/* Text side */}
          <div className="bg-surface-high p-10 md:p-14 flex flex-col justify-center">
            <p className="font-body text-xs font-bold uppercase tracking-[0.3em] text-yellow mb-4">
              O Futuro Começa Aqui
            </p>
            <h2 className="font-headline font-black italic text-5xl md:text-6xl uppercase leading-none tracking-tighter text-on-surface mb-6">
              Formação <span className="text-yellow">Valejas</span>
            </h2>
            <p className="font-body text-base text-on-surface-muted leading-relaxed mb-8">
              O futuro do Valejas Atlético Clube começa aqui. Conheça as
              nossas camadas jovens e o processo de formação de elite.
            </p>
            <Link
              href="/modalidades"
              className="inline-flex items-center gap-2 font-headline font-black text-sm uppercase tracking-widest text-on-surface border-b border-yellow pb-1 hover:text-yellow transition-colors duration-200 w-fit"
            >
              Ver Plantel de Formação <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
