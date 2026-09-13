"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { STORE_URL } from "@/components/Navbar";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function EmblemCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".emblem-cta-content",
        { scale: 0.93, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-48 flex items-center justify-center overflow-hidden bg-surface"
    >
      {/* Noise texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <div className="section-container relative z-10 text-center emblem-cta-content">
        <h2 className="font-headline font-black text-6xl md:text-8xl uppercase tracking-tighter leading-none mb-12 text-on-surface">
          Veste o{" "}
          <span
            className="text-yellow block"
            style={{ filter: "drop-shadow(0 0 20px rgba(250,219,9,0.35))" }}
          >
            Orgulho.
          </span>
        </h2>

        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <a
            href={STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-base px-10 py-5"
          >
            Visitar a Loja
          </a>
          <Link href="/socios/inscricao" className="btn-ghost text-base px-10 py-5">
            Tornar-se Sócio
          </Link>
        </div>
      </div>
    </section>
  );
}
