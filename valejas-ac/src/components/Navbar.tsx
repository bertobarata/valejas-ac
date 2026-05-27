"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon, Ticket, Instagram, Youtube } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";

gsap.registerPlugin(ScrollTrigger);

const NAV_ITEMS = [
  { label: "Início",          href: "/" },
  { label: "O Nosso Emblema", href: "/clube" },
  { label: "Equipas",         href: "/equipas" },
  { label: "Centro de Jogos", href: "/jogos" },
  { label: "Notícias",        href: "/noticias" },
  { label: "Sócios",          href: "/socios-contacto" },
];

export default function Navbar() {
  const pathname = usePathname();
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

    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );

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

  return (
    <header
      ref={navRef}
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled || menuOpen
          ? "bg-surface/95 backdrop-blur-xl shadow-ambient"
          : "bg-transparent"
      )}
    >
      {/* Live match ticker — vermelho = urgência */}
      <div className="bg-red text-white text-xs font-body font-semibold uppercase tracking-widest py-1.5 text-center hidden md:block">
        <span className="inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-live inline-block" />
          Liga Placard • Jornada 32 — Valejas AC vs FC Porto — Sábado 5 Jul, 19:00
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-live inline-block" />
        </span>
      </div>

      <nav className="section-container">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group z-50">
            <div className="w-9 h-9 bg-yellow rounded-none flex items-center justify-center font-headline font-black text-black text-base leading-none group-hover:glow-yellow transition-all duration-300">
              V
            </div>
            <div className="hidden sm:block">
              <p className="font-headline font-black text-sm uppercase leading-none text-on-surface">
                Valejas
              </p>
              <p className="font-body text-xs text-on-surface-muted uppercase tracking-widest leading-none">
                Atlético Clube
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    "nav-link",
                    pathname === item.href && "active"
                  )}
                >
                  {item.label}
                </Link>
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
                className="w-9 h-9 flex items-center justify-center text-on-surface-muted hover:text-yellow transition-colors duration-200"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            {/* Bilhetes CTA — vermelho = urgência */}
            <Link href="/jogos" className="btn-danger hidden sm:inline-flex text-xs py-2 px-4">
              <Ticket size={14} />
              Bilhetes
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => (menuOpen ? closeMenu() : openMenu())}
              aria-label="Toggle menu"
              className="lg:hidden w-9 h-9 flex items-center justify-center text-on-surface"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
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
            <span className="font-headline font-black italic text-[22rem] text-on-surface/[0.02] leading-none select-none">
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
            {NAV_ITEMS.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={clsx(
                  "mobile-nav-item block py-2 font-headline font-black italic uppercase leading-[0.9] tracking-tighter transition-colors duration-200",
                  "text-5xl sm:text-6xl md:text-7xl",
                  pathname === item.href
                    ? "text-yellow"
                    : "text-on-surface hover:text-yellow"
                )}
              >
                <span className="font-body text-xs font-semibold tracking-[0.3em] text-on-surface-muted block mb-0.5 not-italic normal-case">
                  0{i + 1}
                </span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Bottom bar — social + CTA */}
          <div className="px-8 sm:px-12 pb-10 flex flex-col gap-5">
            {/* Ticket CTA */}
            <Link
              href="/jogos"
              onClick={closeMenu}
              className="mobile-bottom btn-danger w-full justify-center text-base py-4"
            >
              <Ticket size={18} />
              Comprar Bilhetes
            </Link>

            {/* Social + theme */}
            <div className="mobile-bottom flex items-center justify-between">
              <div className="flex items-center gap-4">
                <a href="#" className="text-on-surface-muted hover:text-yellow transition-colors" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-on-surface-muted hover:text-yellow transition-colors" aria-label="YouTube">
                  <Youtube size={20} />
                </a>
              </div>
              <span className="font-body text-[10px] text-on-surface-muted uppercase tracking-widest">
                A Vanguarda de Valejas
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
