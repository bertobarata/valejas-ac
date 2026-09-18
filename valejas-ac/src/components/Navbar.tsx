"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Logo from "@/components/Logo";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, X, Sun, Moon, UserPlus, ShoppingBag, ChevronDown, Mail } from "lucide-react";
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

/**
 * Cinco destinos na barra, e duas ações à direita. Eram nove links a
 * competir uns com os outros — a partir de certa largura já nem cabiam
 * numa linha. A loja e o cartão de sócio saem da lista e passam a
 * botões, porque não são sítios para visitar: são coisas para fazer.
 *
 * O que saiu daqui não desapareceu do site — os jogos e o clube estão
 * na página inicial e no rodapé.
 */
interface ItemNav {
  label:     string;
  href:      string;
  external?: boolean;
  /** Quando existe, o item abre um submenu em vez de ser só um destino. */
  submenu?:  { label: string; href: string }[];
}

/** Liga o botão da seta à lista que ele abre, para os leitores de ecrã. */
function submenuId(href: string): string {
  return "submenu-" + href.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
}

const NAV_ITEMS: ItemNav[] = [
  { label: "Início",      href: "/" },
  { label: "Comunicados", href: "/comunicados" },
  { label: "Modalidades", href: "/modalidades" },
  { label: "Sénior",      href: "/academia-senior" },
  {
    label: "Clube",
    href:  "/clube",
    // Cinco páginas sobre o clube que não cabem na barra uma a uma.
    submenu: [
      { label: "História",        href: "/clube" },
      { label: "O Emblema",       href: "/clube/emblema" },
      { label: "Instalações",     href: "/instalacoes" },
      { label: "Órgãos Sociais",  href: "/orgaos-sociais" },
      { label: "Patrocinadores",  href: "/patrocinadores" },
    ],
  },
  { label: "Inscrições",  href: "/inscricoes" },
  { label: "Contactos",   href: "/contactos" },
];

/** As duas ações da barra. No telemóvel aparecem no fim do menu. */
const ACOES = [
  { label: "Loja",        href: STORE_URL, Icon: ShoppingBag },
  { label: "Fazer Sócio", href: "/socios/inscricao", Icon: UserPlus },
];

export default function Navbar() {
  const pathname = usePathname();

  /** Páginas que abrem com o emblema em grande; só nelas o logo da barra espera. */
  const temEmblemaNoTopo = PAGINAS_COM_HERO.includes(pathname);
  const { setTheme, resolvedTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted]   = useState(false);
  /** href do item cujo submenu está aberto. Um de cada vez. */
  const [submenuAberto, setSubmenuAberto] = useState<string | null>(null);
  const navRef  = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);

    const trigger = ScrollTrigger.create({
      start: "top -60px",
      onEnter:     () => setScrolled(true),
      onLeaveBack: () => setScrolled(false),
    });

    return () => trigger.kill();
  }, []);

  /*
    O menu abre e fecha sem animação nenhuma.
    Havia uma: os itens entravam de baixo com `rotateX`, em escada. Num
    telemóvel isso lê-se como a lista a dançar enquanto se tenta acertar
    num link — e o fecho dependia de um `onComplete` do GSAP, portanto se a
    animação não corresse o menu não fechava. Um menu de navegação está lá
    ou não está.
  */
  const openMenu  = useCallback(() => setMenuOpen(true), []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  /**
   * Um menu que abre por toque tem de fechar por toque. Sem isto ficava
   * aberto até alguém carregar noutro sítio da barra — e num telemóvel ou
   * tablet não há rato para "sair de cima".
   */
  useEffect(() => {
    if (!submenuAberto) return;

    const aoTocarFora = (e: PointerEvent) => {
      // `navRef` é o <header> inteiro: a barra toda conta como dentro.
      if (!navRef.current?.contains(e.target as Node)) setSubmenuAberto(null);
    };
    const aoEscapar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSubmenuAberto(null);
    };

    document.addEventListener("pointerdown", aoTocarFora);
    document.addEventListener("keydown", aoEscapar);
    return () => {
      document.removeEventListener("pointerdown", aoTocarFora);
      document.removeEventListener("keydown", aoEscapar);
    };
  }, [submenuAberto]);

  /** Mudar de página fecha o submenu: senão fica aberto sobre a página nova. */
  useEffect(() => { setSubmenuAberto(null); }, [pathname]);

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
        "fixed top-0 left-0 right-0 z-50",
        /* A barra só desliza para dentro nas páginas que abrem com o
           emblema em grande. Nas outras tem de estar lá desde o primeiro
           pixel — é o único sítio onde o clube se identifica. */
        temEmblemaNoTopo && "entrada-barra",
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
            /*
              O emblema é maior que a barra e desce abaixo dela — o emblema
              pendurado. Mas tem de descer só para baixo.

              Estava centrado na linha, e uma peça de 96px centrada numa
              barra de 64 sobra 16px para cada lado: os de cima caíam fora
              do ecrã e cortavam a cabeça da águia. `self-start` encosta-o
              ao topo da barra, e a partir daí só transborda por baixo.
            */
            "self-start transition-all duration-300 z-50",
            (scrolled || !temEmblemaNoTopo)
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-1 pointer-events-none"
          )}>
            {/*
              Só o emblema, sem o nome ao lado.

              Com sete destinos e dois botões, a barra não tem largura para
              o nome: partia-se em três linhas por cima dos links. E não faz
              falta — o nome do clube está na faixa vermelha logo por cima,
              no título da página e no rodapé.
            */}
            <Logo size={96} withWordmark={false} />
          </div>

          {/* Desktop nav */}
          <ul className="hidden lg:flex items-center gap-3 xl:gap-5 whitespace-nowrap">
            {NAV_ITEMS.map((item) => (
              <li
                key={item.href}
                className={item.submenu ? "relative" : undefined}
                onMouseEnter={item.submenu ? () => setSubmenuAberto(item.href) : undefined}
                onMouseLeave={item.submenu ? () => setSubmenuAberto(null) : undefined}
              >
                {item.submenu ? (
                  <>
                    {/*
                      O pai é um destino e um menu ao mesmo tempo, e isso
                      exige duas coisas separadas: o nome leva à história do
                      clube, a seta abre as cinco páginas.
                      Já foram uma só, e num iPad deitado — que recebe esta
                      barra, não a de telemóvel — tocar no nome navegava e o
                      submenu nunca abria. Quatro páginas só se alcançavam
                      pelo rodapé. Com um botão à parte, o rato continua a
                      abrir por cima e o dedo passa a ter onde carregar.
                    */}
                    <span className="inline-flex items-center">
                      <Link
                        href={item.href}
                        className={clsx(
                          "nav-link",
                          pathname.startsWith(item.href) && "active"
                        )}
                      >
                        {item.label}
                      </Link>

                      <button
                        type="button"
                        aria-haspopup="true"
                        aria-expanded={submenuAberto === item.href}
                        aria-controls={submenuId(item.href)}
                        aria-label={
                          submenuAberto === item.href
                            ? `Fechar as páginas de ${item.label}`
                            : `Ver as páginas de ${item.label}`
                        }
                        onClick={() =>
                          setSubmenuAberto((atual) =>
                            atual === item.href ? null : item.href
                          )
                        }
                        className="w-11 h-11 -ml-1 flex items-center justify-center text-on-surface-muted hover:text-on-surface transition-colors duration-200"
                      >
                        <ChevronDown
                          size={14}
                          aria-hidden
                          className={clsx(
                            "transition-transform duration-200",
                            submenuAberto === item.href && "rotate-180"
                          )}
                        />
                      </button>
                    </span>

                    <ul
                      id={submenuId(item.href)}
                      className={clsx(
                        "absolute left-1/2 -translate-x-1/2 top-full pt-3 min-w-[13rem] transition-all duration-200",
                        submenuAberto === item.href
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible -translate-y-1 pointer-events-none"
                      )}
                    >
                      <div className="bg-surface border border-on-surface/10 shadow-ambient py-2">
                        {item.submenu.map((sub) => (
                          <li key={sub.href + sub.label}>
                            <Link
                              href={sub.href}
                              onClick={() => setSubmenuAberto(null)}
                              className={clsx(
                                "block px-5 py-2.5 font-body text-sm transition-colors duration-200",
                                pathname === sub.href
                                  ? "text-yellow"
                                  : "text-on-surface hover:text-yellow"
                              )}
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </div>
                    </ul>
                  </>
                ) : item.external ? (
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

            {/* Loja e cartão de sócio: as duas coisas que se fazem aqui */}
            <Link
              href={STORE_URL}
              className="btn-ghost hidden sm:inline-flex text-xs min-h-11 py-2.5 px-4 whitespace-nowrap"
            >
              <ShoppingBag size={14} />
              Loja
            </Link>
            <Link
              href="/socios/inscricao"
              className="btn-primary hidden sm:inline-flex text-xs min-h-11 py-2.5 px-4 whitespace-nowrap"
            >
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
         Vai para o <body> por portal, e isso não é preciosismo: o <header>
         leva um `transform` da animação de entrada, e um antepassado com
         transform passa a ser a referência do `position: fixed`. Dentro do
         header, este `inset-0` media 386×64 — a barra, não o ecrã — e o
         menu aparecia recortado com a página a ver-se por baixo.
         ═══════════════════════════════════════════════════════════════ */}
      {menuOpen && mounted && createPortal(
        (<div
          /*
            Opaco e sem animação nenhuma no fundo. Esteve em `opacity: 0`
            à espera do GSAP, com o fundo a 98%: via-se a página através do
            menu e os dois textos sobrepunham-se, ilegíveis.
            Trocar isso por uma animação CSS não resolvia — o estado de
            partida continuava a ser invisível, e num separador em segundo
            plano a linha temporal congela e a animação nunca termina.
            Um fundo de menu não se anima: ou está lá, ou o menu não serve.
            Quem anima são os links, por dentro, e isso pode falhar sem
            consequências.
          */
          className="fixed inset-0 z-[45] bg-surface lg:hidden flex flex-col pt-24"
        >
          {/*
            Um menu de telemóvel normal: uma lista que se percorre de cima
            para baixo, com uma linha por destino.
            Já foi tipografia gigante centrada num contentor que rolava, com
            os itens a entrar em rotação — não se lia nem se acertava nele.
            O topo fica livre porque a barra continua por cima, com o
            emblema e o botão de fechar. São 96px e não os 64 da barra,
            porque o emblema desce abaixo dela e chega exatamente aos 96.
          */}
          <nav className="flex-1 overflow-y-auto overscroll-contain">
            <ul>
              {NAV_ITEMS.map((item) => {
                const ativo = !item.external && (
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
                );
                const linha = clsx(
                  "flex items-center justify-center min-h-14 px-5 text-center",
                  "font-headline font-black uppercase text-xl tracking-tight",
                  "border-b border-on-surface/10 transition-colors duration-200",
                  ativo ? "text-yellow" : "text-on-surface"
                );

                return (
                  <li key={item.href}>
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={closeMenu}
                        className={linha}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link href={item.href} onClick={closeMenu} className={linha}>
                        {item.label}
                      </Link>
                    )}

                    {/* As páginas do clube ficam listadas por baixo, mais
                        pequenas: num telemóvel não há sítio para um submenu
                        que abre de lado. */}
                    {item.submenu && (
                      <ul className="border-b border-on-surface/10 bg-surface-low">
                        {item.submenu.map((sub) => (
                          <li key={sub.href + sub.label}>
                            <Link
                              href={sub.href}
                              onClick={closeMenu}
                              className={clsx(
                                "flex items-center justify-center min-h-11 px-5 text-center",
                                "font-body text-sm transition-colors duration-200",
                                pathname === sub.href ? "text-yellow" : "text-on-surface-muted"
                              )}
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* As duas ações e as redes, sempre à vista no fundo */}
          <div className="shrink-0 border-t border-on-surface/10 px-5 py-5 flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              {ACOES.map(({ label, href, Icon }, i) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  className={clsx(
                    "w-full justify-center text-base py-4",
                    i === ACOES.length - 1 ? "btn-primary" : "btn-ghost"
                  )}
                >
                  <Icon size={18} />
                  {label}
                </Link>
              ))}
            </div>

            <div className="flex items-center justify-center gap-5">
              <a href={CONTACTO.redesSociais.instagram} target="_blank" rel="noopener noreferrer" className="w-11 h-11 flex items-center justify-center text-on-surface-muted hover:text-[#E4405F] transition-colors" aria-label="Instagram">
                <InstagramIcon size={20} />
              </a>
              <a href={CONTACTO.redesSociais.facebook} target="_blank" rel="noopener noreferrer" className="w-11 h-11 flex items-center justify-center text-on-surface-muted hover:text-[#1877F2] transition-colors" aria-label="Facebook">
                <FacebookIcon size={20} />
              </a>
              <a href={CONTACTO.redesSociais.youtube} target="_blank" rel="noopener noreferrer" className="w-11 h-11 flex items-center justify-center text-on-surface-muted hover:text-[#FF0000] transition-colors" aria-label="YouTube">
                <YouTubeIcon size={20} />
              </a>
              <a href={`mailto:${CONTACTO.email}`} className="w-11 h-11 flex items-center justify-center text-on-surface-muted hover:text-yellow transition-colors" aria-label="Escrever ao clube">
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>),
        document.body
      )}
    </header>
  );
}
