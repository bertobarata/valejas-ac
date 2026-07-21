"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────────────────────────
   Three.js particle field — stadium lights / goal net effect
   ────────────────────────────────────────────────────────────────── */
function initThreeParticles(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100);
  camera.position.z = 4;

  // Particle system
  const count    = 1800;
  const positions = new Float32Array(count * 3);
  const colors    = new Float32Array(count * 3);

  const yellow = new THREE.Color("#FADB09");
  const blue   = new THREE.Color("#1554BB");
  const white  = new THREE.Color("#DCE2F5");

  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 6;

    // Mix of yellow, blue and white particles
    const c = Math.random() < 0.15 ? yellow : Math.random() < 0.30 ? blue : white;
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color",    new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size:         0.035,
    vertexColors: true,
    transparent:  true,
    opacity:      0.7,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Mouse parallax
  let mouseX = 0, mouseY = 0;
  const handleMouse = (e: MouseEvent) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener("mousemove", handleMouse);

  // Resize
  const handleResize = () => {
    camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
  };
  window.addEventListener("resize", handleResize);

  // Animate
  let frame: number;
  const tick = (time: number) => {
    frame = requestAnimationFrame(tick);
    particles.rotation.y  = time * 0.00006 + mouseX * 0.08;
    particles.rotation.x  = time * 0.00003 - mouseY * 0.04;
    renderer.render(scene, camera);
  };
  frame = requestAnimationFrame(tick);

  // Return cleanup
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("mousemove", handleMouse);
    window.removeEventListener("resize", handleResize);
    renderer.dispose();
    geometry.dispose();
    material.dispose();
  };
}

/* ──────────────────────────────────────────────────────────────────
   Hero Section Component
   ────────────────────────────────────────────────────────────────── */
export type HeroDestaque = { tipo: string; titulo: string; href: string };

export default function HeroSection({
  destaques = [],
}: {
  destaques?: HeroDestaque[];
}) {
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
    const cleanup = initThreeParticles(canvasRef.current);
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

      {/* Background photo with dark overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-futsal.jpg')" }}
        aria-hidden
      >
        {/* Dark mode: darker overlay; light mode: lighter overlay */}
        <div className="absolute inset-0 bg-hero-dark dark:bg-hero-dark" />
        {/* Red diagonal accent — crest sash */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              "linear-gradient(135deg, transparent 40%, #D4150C 40%, #D4150C 45%, transparent 45%)",
          }}
          aria-hidden
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

          {/* Main headline — overlapping editorial style */}
          <h1
            ref={headlineRef}
            className="font-headline font-black text-6xl md:text-8xl lg:text-[9rem] uppercase leading-none tracking-tighter text-white mb-6"
          >
            Somos Todos{" "}
            <span className="text-yellow block md:inline on-dark">Valejas</span>
          </h1>

          {/* Sub */}
          <p
            ref={subRef}
            className="font-body text-lg text-white/80 max-w-md leading-relaxed mb-10"
          >
            Desde 1966, o clube da nossa terra. Do futebol ao futsal, dos mais
            novos aos veteranos.
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

          {/* Destaques — comunicado + notícia mais recentes, já no hero */}
          {destaques.length > 0 && (
            <div className="mt-12 flex flex-col gap-px bg-white/10 max-w-2xl">
              {destaques.map((d) => (
                <Link
                  key={d.href + d.titulo}
                  href={d.href}
                  className="group flex items-center gap-4 bg-black/40 hover:bg-black/60 px-5 py-4 transition-colors"
                >
                  <span className="font-body text-[10px] font-bold uppercase tracking-widest text-yellow shrink-0 w-24">
                    {d.tipo}
                  </span>
                  <span className="font-body text-sm text-white/90 group-hover:text-white truncate flex-1">
                    {d.titulo}
                  </span>
                  <span className="text-yellow shrink-0 transition-transform group-hover:translate-x-1" aria-hidden>→</span>
                </Link>
              ))}
            </div>
          )}
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/70"
        aria-hidden
      >
        <span className="font-body text-xs uppercase tracking-widest">Explorar</span>
        <ChevronDown size={18} className="motion-safe:animate-[nudge_2s_ease-in-out_infinite] motion-reduce:animate-none" />
      </div>
    </section>
  );
}
