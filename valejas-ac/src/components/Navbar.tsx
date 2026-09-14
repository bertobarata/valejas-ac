"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon, UserPlus } from "lucide-react";
import { InstagramIcon, FacebookIcon, YouTubeIcon } from "@/components/BrandIcons";
import { CONTACTO } from "@/lib/data/socios";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";
import { PAGINAS_COM_HERO } from "@/lib/paginas";

gsap.registerPlugin(ScrollTrigger);

/**
 * A loja passou a ser do clube: vive em /loja, com levantamento na sede.
 * O link externo para a plataforma CTT (Zemig Sportswear) deixou de ser o
 * destino — a Zemig continua a ser o fornecedor e está nos patrocinadores.
 */
export const STORE_URL = "/loja";

const NAV_ITEMS: { label: string; href: string; external?: boolean }[] = [
  { label: "Início",      href: "/" },
  { label: "Comunicados", href: "/comunicados" },
  { label: "Jogos",       href: "/jogos" },
  { label: "Modalidades", href: "/modalidades" },
  { label: "Academia",    href: "/academia-senior" },
  { label: "Loja",        href: STORE_URL },
  { label: "Sócios",      href: "/socios-contacto" },
  { label: "Contactos",   href: "/contactos" },
];

export default function Navbar() {
  const pathname = usePathname();

  /** Páginas que abrem com o emblema em grande; só nelas o logo da barra espera. */
  const temEmblemaNoTopo = PAGINAS_COM_HERO.includes(pathname);
  const { setTheme, resolvedTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted]   = useState(false);
  const navRef  = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const trigger = ScrollTrigger.create({
      start: "top -60px",
      onEnter:     () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
    });

    return () => trigger.kill();
  }, []);

  // ── Animate mobile overlay open/close ──
  const animateMenuOpen = useCallback(() => {
    if (!overlayRef.current || !linksRef.current) return;

    const tl = gsap.timeline();

    // Overlay fade in
    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: "power2.out" }
    );

    // Links stagger from bottom
    tl.fromTo(
      linksRef.current.querySelectorAll(".mobile-nav-item"),
      { y: 60, opacity: 0, rotateX: -15 },
      {
        y: 0, opacity: 1, rotateX: 0,
        duration: 0.5, stagger: 0.06,
        ease: "power3.out",
      },
      "-=0.15"
    );

    // Bottom elements
    tl.fromTo(
      overlayRef.current.querySelectorAll(".mobile-bottom"),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: "power2.out" },
      "-=0.3"
    );
  }, []);

  const animateMenuClose = useCallback((onComplete: () => void) => {
    if (!overlayRef.current) {
      onComplete();
      return;
    }

    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
      onComplete,
    });
  }, []);

  const openMenu = useCallback(() => {
    setMenuOpen(true);
    // Wait for render, then animate
    requestAnimationFrame(() => animateMenuOpen());
  }, [animateMenuOpen]);

  const closeMenu = useCallback(() => {
    animateMenuClose(() => setMenuOpen(false));
  }, [animateMenuClose]);

  // Lock body scroll when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const isDark = resolvedTheme === "dark";
  const isHome = pathname === "/";
  // Sólida quando scrollada, com menu aberto, ou fora da home.
  // Transparente só na home ao topo (sobre o hero azul) → texto claro (dark).
  const solid = scrolled || menuOpen || !isHome;

  return (
    <header
      ref={navRef}
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 entrada-barra",
        "transition-[background-color,box-shadow,backdrop-filter] duration-500",
        solid
          ? "bg-surface/95 backdrop-blur-xl shadow-ambient"
          : "bg-transparent dark section-dark"
      )}
    >
      {/* Live match ticker — vermelho = urgência */}
      <div className="bg-red text-white text-xs font-body font-semibold uppercase tracking-widest py-1.5 text-center hidden md:block">
        <span className="inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-live inline-block" />
          Valejas Atlético Clube • O clube da nossa terra desde 1966
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-live inline-block" />
        </span>
      </div>

      <nav className="section-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/*
            Logo na barra.

            Só se esconde no topo das páginas que já mostram o emblema em
            grande logo a abrir — a home e a página do emblema. Aí o efeito
            é intencional: o emblema do hero "aterra" na barra ao rolar.

            Nas restantes não há emblema nenhum à vista no topo, e escondê-lo
            deixava a barra sem marca durante o primeiro ecrã inteiro. Nessas,
            aparece de imediato.
          */}
          <div className={clsx(
            // Maior que a barra: transborda ligeiramente para baixo (emblema pendurado).
            "transition-all duration-300 z-50 -mb-6",
            (scrolled || !temEmblemaNoTopo)
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-1 pointer-events-none"
          )}>
            <Logo size={96} />
          </div>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nav-link"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={clsx(
                      "nav-link",
                      pathname === item.href && "active"
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-3 z-50">
            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                aria-label="Toggle theme"
                className="w-11 h-11 flex items-center justify-center text-on-surface-muted hover:text-yellow transition-colors duration-200"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            {/* Sócios CTA — ação principal do site */}
            <Link href="/socios/inscricao" className="btn-primary hidden sm:inline-flex text-xs min-h-11 py-2.5 px-5">
              <UserPlus size={14} />
              Fazer Sócio
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => (menuOpen ? closeMenu() : openMenu())}
              aria-label="Toggle menu"
              className="lg:hidden w-11 h-11 flex items-center justify-center text-on-surface"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════
         MOBILE MENU — FULL-SCREEN OVERLAY
         ═══════════════════════════════════════════════════════════════ */}
      {menuOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-40 bg-surface/[0.98] backdrop-blur-2xl lg:hidden flex flex-col"
          style={{ opacity: 0 }}
        >
          {/* Crest watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="font-headline font-black text-[22rem] text-on-surface/[0.02] leading-none select-none">
              V
            </span>
          </div>

          {/* Diagonal red sash accent — brand motif */}
          <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-red via-red/50 to-transparent" />

          {/* Nav links — centered, huge typography */}
          <div
            ref={linksRef}
            className="flex-1 flex flex-col items-start justify-center px-8 sm:px-12 gap-1"
          >
            {NAV_ITEMS.map((item, i) => {
              const itemClass = clsx(
                "mobile-nav-item block py-2 font-headline font-black uppercase leading-[0.9] tracking-tighter transition-colors duration-200",
                "text-5xl sm:text-6xl md:text-7xl",
                !item.external && pathname === item.href
                  ? "text-yellow"
                  : "text-on-surface hover:text-yellow"
              );
              const numberLabel = (
                <span className="font-body text-xs font-semibold tracking-[0.3em] text-on-surface-muted block mb-0.5 not-italic normal-case">
                  0{i + 1}
                </span>
              );
              return item.external ? (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className={itemClass}
                >
                  {numberLabel}
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={itemClass}
                >
                  {numberLabel}
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Bottom bar — social + CTA */}
          <div className="px-8 sm:px-12 pb-10 flex flex-col gap-5">
            {/* Sócios CTA */}
            <Link
              href="/socios/inscricao"
              onClick={closeMenu}
              className="mobile-bottom btn-primary w-full justify-center text-base py-4"
            >
              <UserPlus size={18} />
              Fazer Sócio
            </Link>

            {/* Social + theme */}
            <div className="mobile-bottom flex items-center justify-between">
              <div className="flex items-center gap-4">
                <a href={CONTACTO.redesSociais.instagram} target="_blank" rel="noopener noreferrer" className="text-on-surface-muted hover:text-[#E4405F] transition-colors" aria-label="Instagram">
                  <InstagramIcon size={20} />
                </a>
                <a href={CONTACTO.redesSociais.facebook} target="_blank" rel="noopener noreferrer" className="text-on-surface-muted hover:text-[#1877F2] transition-colors" aria-label="Facebook">
                  <FacebookIcon size={20} />
                </a>
                <a href={CONTACTO.redesSociais.youtube} target="_blank" rel="noopener noreferrer" className="text-on-surface-muted hover:text-[#FF0000] transition-colors" aria-label="YouTube">
                  <YouTubeIcon size={20} />
                </a>
              </div>
              <span className="font-body text-xs text-on-surface-muted uppercase tracking-widest">
                A casa do clube
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
