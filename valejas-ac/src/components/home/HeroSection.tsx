"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────────────────────────
   Campo de partículas — canvas 2D
   ──────────────────────────────────────────────────────────────────
   Isto era three.js: um WebGLRenderer completo, 23 MB de dependência
   e ~60 kB de JavaScript enviados a cada visita, para desenhar pontos
   a flutuar. Num público que o PRODUCT.md descreve como
   "maioritariamente em telemóvel, dos 10 aos 60+", não se justifica.

   A projeção em perspetiva é feita à mão: cada ponto vive em 3D, roda
   em torno do eixo Y e do X, e divide-se pela profundidade. São seis
   linhas de matemática em vez de uma biblioteca inteira.

   Respeita `prefers-reduced-motion`: nesse caso desenha o campo uma
   vez, parado. O emblema e o fundo continuam lá; só o movimento sai.
   ────────────────────────────────────────────────────────────────── */
function initParticulas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  const CORES = ["#FADB09", "#1554BB", "#DCE2F5"] as const;
  const TOTAL = 1800;

  type Ponto = { x: number; y: number; z: number; cor: string };
  const pontos: Ponto[] = Array.from({ length: TOTAL }, () => ({
    x: (Math.random() - 0.5) * 12,
    y: (Math.random() - 0.5) * 8,
    z: (Math.random() - 0.5) * 6,
    // Mesma mistura de sempre: maioria clara, alguns amarelos e azuis.
    cor: Math.random() < 0.15 ? CORES[0] : Math.random() < 0.30 ? CORES[1] : CORES[2],
  }));

  let largura = 0;
  let altura = 0;
  let dpr = 1;

  const dimensionar = () => {
    dpr = Math.min(window.devicePixelRatio, 2);
    largura = canvas.offsetWidth;
    altura = canvas.offsetHeight;
    canvas.width = Math.round(largura * dpr);
    canvas.height = Math.round(altura * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  dimensionar();

  let ratoX = 0;
  let ratoY = 0;
  const aoMover = (e: MouseEvent) => {
    ratoX = (e.clientX / window.innerWidth - 0.5) * 2;
    ratoY = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  /** Distância focal equivalente a uma câmara de 60°, a 4 unidades. */
  const distanciaCamara = 4;
  const focal = () => altura / (2 * Math.tan((60 * Math.PI) / 180 / 2));

  const desenhar = (tempo: number) => {
    ctx.clearRect(0, 0, largura, altura);

    const rotY = tempo * 0.00006 + ratoX * 0.08;
    const rotX = tempo * 0.00003 - ratoY * 0.04;
    const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
    const f = focal();

    for (const p of pontos) {
      // Rodar em Y, depois em X.
      const x1 = p.x * cosY - p.z * sinY;
      const z1 = p.x * sinY + p.z * cosY;
      const y2 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;

      const profundidade = z2 + distanciaCamara;
      if (profundidade <= 0.1) continue; // atrás da câmara

      const escala = f / profundidade;
      const ecraX = largura / 2 + x1 * escala;
      const ecraY = altura / 2 - y2 * escala;
      if (ecraX < -8 || ecraX > largura + 8 || ecraY < -8 || ecraY > altura + 8) continue;

      // O tamanho diminui com a distância, como no sizeAttenuation.
      // O fator é menor que o do three.js porque um círculo preenchido
      // ocupa mais peso visual que o quadrado que o PointsMaterial desenha.
      const raio = Math.min(1.6, Math.max(0.35, 0.035 * escala * 0.3));

      ctx.globalAlpha = 0.55;
      ctx.fillStyle = p.cor;
      ctx.beginPath();
      ctx.arc(ecraX, ecraY, raio, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const aoRedimensionar = () => {
    dimensionar();
    if (reduzido) desenhar(0);
  };
  window.addEventListener("resize", aoRedimensionar);

  if (reduzido) {
    // Campo parado: vê-se, não se mexe.
    desenhar(0);
    return () => window.removeEventListener("resize", aoRedimensionar);
  }

  window.addEventListener("mousemove", aoMover);

  let frame = 0;
  const tick = (tempo: number) => {
    frame = requestAnimationFrame(tick);
    desenhar(tempo);
  };
  frame = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("mousemove", aoMover);
    window.removeEventListener("resize", aoRedimensionar);
  };
}


/* ──────────────────────────────────────────────────────────────────
   Hero Section Component
   ────────────────────────────────────────────────────────────────── */
export default function HeroSection() {
  const sectionRef  = useRef<HTMLElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);
  const crestRef    = useRef<HTMLDivElement>(null);

  // Three.js
  useEffect(() => {
    if (!canvasRef.current) return;
    const cleanup = initParticulas(canvasRef.current);
    return cleanup;
  }, []);

  // GSAP entrance + scroll parallax
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger entrance
      gsap.fromTo(
        [headlineRef.current, subRef.current, ctaRef.current],
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1.0,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.4,
        }
      );

      // Scroll-triggered parallax on the headline
      gsap.to(headlineRef.current, {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Scroll arrow fade
      gsap.to(scrollRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "30% top",
          scrub: true,
        },
      });

      // Emblema encolhe e sobe (rumo à navbar) ao fazer scroll — o logo
      // pequeno da navbar aparece em simultâneo, como se tivesse aterrado lá.
      gsap.to(crestRef.current, {
        scale: 0.14,
        yPercent: -60,
        opacity: 0,
        ease: "none",
        transformOrigin: "top center",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "55% top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-dark relative min-h-screen flex items-center overflow-hidden bg-blue-deep"
    >
      {/* Three.js canvas — particle field */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden
      />

      {/*
        Fundo.

        Havia aqui três coisas a disputar o mesmo espaço: uma fotografia
        de futsal esbatida, um véu escuro por cima dela e uma faixa
        vermelha na diagonal. Nenhuma se via bem e o conjunto lia-se como
        ruído por trás do mote.

        Fica o azul do clube, do fundo do emblema até quase preto, com um
        halo mais claro atrás do sítio onde o emblema está. O campo de
        partículas continua lá — é ele que dá vida ao fundo.
      */}
      <div className="absolute inset-0" aria-hidden>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 78% 42%, #1B4FA8 0%, #10306B 38%, #081A3D 72%, #050E22 100%)",
          }}
        />
        {/* Sombra em baixo, para o indicador de scroll e os botões assentarem. */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/3"
          style={{ background: "linear-gradient(to top, rgba(5,14,34,0.75), transparent)" }}
        />
      </div>

      {/* Content */}
      <div className="section-container relative z-10 pt-32 pb-20 w-full">
        <div className="grid lg:grid-cols-[1.25fr_0.85fr] gap-10 lg:gap-8 items-center">
        <div className="max-w-3xl">

          {/* Eyebrow */}
          <p className="font-body font-semibold text-xs uppercase tracking-[0.35em] text-yellow mb-6">
            Fundado em 1966 · Valejas, Oeiras
          </p>

          {/* Título — o mote do clube. A Direção pediu ênfase no mote, e
              não há sítio com mais ênfase do que a primeira coisa que se vê. */}
          <h1
            ref={headlineRef}
            className="font-headline font-black wdth-condensed text-5xl sm:text-6xl md:text-7xl lg:text-[7rem] uppercase leading-[0.85] tracking-tighter text-white mb-6"
          >
            A união faz a{" "}
            <span className="text-yellow block on-dark">força</span>
          </h1>

          {/* Sub */}
          <p
            ref={subRef}
            className="font-body text-lg text-white/80 max-w-md leading-relaxed mb-10"
          >
            Somos todos Valejas. Desde 1966, o clube da nossa terra — do futsal
            ao atletismo, dos mais novos aos veteranos.
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-wrap gap-4">
            <Link href="/clube" className="btn-primary text-sm">
              Conhecer o clube
            </Link>
            <Link href="/jogos" className="btn-ghost text-sm text-white border-white/30 hover:border-yellow hover:text-yellow">
              Últimos Jogos
            </Link>
          </div>
        </div>

          {/* Emblema gigante — preponderância do crest; encolhe p/ a navbar no scroll */}
          <div
            ref={crestRef}
            className="order-first lg:order-none flex justify-center items-center"
          >
            <Image
              src="/brand/crest.png"
              alt="Emblema do Valejas Atlético Clube"
              width={520}
              height={620}
              priority
              className="w-56 sm:w-72 lg:w-full lg:max-w-[400px] h-auto drop-shadow-[0_12px_45px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/85"
        aria-hidden
      >
        <span className="font-body text-xs uppercase tracking-widest">Explorar</span>
        <ChevronDown size={18} className="motion-safe:animate-[nudge_2s_ease-in-out_infinite] motion-reduce:animate-none" />
      </div>
    </section>
  );
}
