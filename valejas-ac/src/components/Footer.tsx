import Link from "next/link";

const LINKS = {
  navegação: [
    { label: "Início",          href: "/" },
    { label: "O Nosso Emblema", href: "/clube" },
    { label: "Futsal",          href: "/modalidades/futsal" },
    { label: "Resultados",      href: "/jogos" },
    { label: "Bilhetes",        href: "/jogos" },
  ],
  modalidades: [
    { label: "Ciclismo",      href: "/modalidades/ciclismo" },
    { label: "Cicloturismo",  href: "/modalidades/cicloturismo" },
    { label: "Kung Fu",       href: "/modalidades/kung-fu" },
    { label: "Dança",         href: "/modalidades/danca" },
    { label: "Yoga",          href: "/modalidades/yoga" },
  ],
  legal: [
    { label: "Política de Privacidade", href: "/privacidade" },
    { label: "Termos de Serviço",       href: "/termos" },
    { label: "Contactos",               href: "/socios-contacto" },
    { label: "Patrocínios",             href: "/socios-contacto#patrocinios" },
  ],
};

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com", icon: "IG" },
  { label: "YouTube",   href: "https://youtube.com",   icon: "YT" },
  { label: "TikTok",    href: "https://tiktok.com",    icon: "TK" },
  { label: "Discord",   href: "https://discord.com",   icon: "DC" },
];

export default function Footer() {
  return (
    <footer className="bg-surface-low border-t border-on-surface/10">
      {/* Top section */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow flex items-center justify-center font-headline font-black text-black text-lg">
                V
              </div>
              <div>
                <p className="font-headline font-black text-base uppercase text-on-surface leading-none">Valejas</p>
                <p className="font-body text-xs text-on-surface-muted uppercase tracking-widest">Atlético Clube</p>
              </div>
            </div>
            <p className="font-body text-sm text-on-surface-muted leading-relaxed max-w-xs">
              Elevando o desporto nacional com atitude, inovação e a força
              imparável da Vanguarda. Vive aqui, no coração de Valejas.
            </p>

            {/* Social links */}
            <div className="flex gap-3 mt-6">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 bg-surface-high flex items-center justify-center font-headline font-black text-xs text-on-surface hover:bg-yellow hover:text-black transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section}>
              <h4 className="font-body font-semibold text-xs uppercase tracking-widest text-yellow mb-4">
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="font-body text-sm text-on-surface-muted hover:text-on-surface transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-10 border-t border-on-surface/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h4 className="font-headline font-black text-lg uppercase text-on-surface">
                Junta-te à <span className="text-yellow">Vanguarda</span>
              </h4>
              <p className="font-body text-sm text-on-surface-muted mt-1">
                Notícias exclusivas, bilhetes antecipados e bastidores direto para ti.
              </p>
            </div>
            <form className="flex gap-0 w-full md:w-auto">
              <input
                type="email"
                placeholder="O teu email"
                className="input-field flex-1 md:w-72 px-4 bg-surface-high border border-on-surface/20 border-r-0 focus:border-yellow"
              />
              <button type="submit" className="btn-primary rounded-none px-5 py-3 text-xs">
                Subscrever
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-on-surface/10">
        <div className="section-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-body text-xs text-on-surface-muted">
            © {new Date().getFullYear()} Valejas Atlético Clube. A Vanguarda do Estádio.
          </p>
          <p className="font-body text-xs text-on-surface-muted">
            Fundado em 1944 · Valejas, Portugal
          </p>
        </div>
      </div>
    </footer>
  );
}
