"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, ShoppingBag, UserPlus } from "lucide-react";
import { CONTACTO, EMAILS } from "@/lib/data/socios";
import { QUOTA_MENSAL, formatEuros } from "@/lib/data/quota";
import { InstagramIcon, FacebookIcon, YouTubeIcon } from "@/components/BrandIcons";

const REDES = [
  { nome: "Instagram", href: CONTACTO.redesSociais.instagram, Icon: InstagramIcon },
  { nome: "Facebook",  href: CONTACTO.redesSociais.facebook,  Icon: FacebookIcon },
  { nome: "YouTube",   href: CONTACTO.redesSociais.youtube,   Icon: YouTubeIcon },
  // Nem toda a gente quer falar com o clube numa rede social. O email
  // fica ao lado, e vai para a caixa geral.
  { nome: "Escrever ao clube", href: `mailto:${EMAILS.geral}`, Icon: Mail },
];

gsap.registerPlugin(ScrollTrigger);

/**
 * FECHO DE TODAS AS PÁGINAS
 * ─────────────────────────────────────────────────────────────────
 * Quem chega ao fim de uma página leu o que lá estava e é aí que
 * decide. O fecho diz de quem é o clube e abre as quatro portas:
 * sócio, loja, contactos e redes.
 *
 * A segunda linha está na primeira pessoa de propósito — «é meu», não
 * «é teu». Não é o clube a convidar de fora: é a frase que quem se faz
 * sócio passa a poder dizer.
 * ─────────────────────────────────────────────────────────────────
 */
export default function SociosCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { scale: 0.94, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-dark relative overflow-hidden bg-blue py-24 md:py-32"
    >
      {/* Background watermark text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        aria-hidden
      >
        <span className="font-headline font-black text-[20vw] uppercase text-white/5 leading-none whitespace-nowrap select-none">
          VALEJAS
        </span>
      </div>

      {/* Diagonal accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.15) 50%)",
        }}
      />

      <div className="section-container relative z-10">
        <div ref={textRef} className="text-center max-w-3xl mx-auto">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.35em] text-yellow/80 mb-4">
            Faz parte
          </p>
          <h2 className="font-headline font-black text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] uppercase leading-[0.95] tracking-tighter text-white mb-5 text-balance">
            O Valejas é de nós todos
            <span className="block text-yellow">e agora também é meu</span>
          </h2>
          <p className="font-body text-base md:text-lg text-white/85 leading-relaxed mb-10">
            Faz-te sócio por {formatEuros(QUOTA_MENSAL)} por mês, veste as cores,
            vem ao pavilhão. O clube é de quem cá está.
          </p>

          {/* Os quatro sítios para onde se sai daqui */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            <Link href="/socios/inscricao" className="btn-primary text-sm">
              <UserPlus size={16} /> Fazer-me sócio
            </Link>
            <Link
              href="/loja"
              className="btn-ghost text-white border-white/30 text-sm hover:border-yellow hover:text-yellow"
            >
              <ShoppingBag size={16} /> Loja do clube
            </Link>
            <Link
              href="/contactos"
              className="btn-ghost text-white border-white/30 text-sm hover:border-yellow hover:text-yellow"
            >
              <Mail size={16} /> Contactos
            </Link>
          </div>

          {/* Redes sociais: ícone só, que os nomes já se reconhecem */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {REDES.map(({ nome, href, Icon }) => (
              <a
                key={nome}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={nome}
                className="w-11 h-11 flex items-center justify-center border border-white/25 text-white/85 hover:border-yellow hover:text-yellow transition-colors duration-200"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
