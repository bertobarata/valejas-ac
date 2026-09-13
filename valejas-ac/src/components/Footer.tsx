import Link from "next/link";
import Image from "next/image";
import NewsletterForm from "@/components/NewsletterForm";
import { STORE_URL } from "@/components/Navbar";
import { CONTACTO } from "@/lib/data/socios";
import { MODALIDADES } from "@/lib/data/modalidades";
import { InstagramIcon, FacebookIcon, YouTubeIcon } from "@/components/BrandIcons";

const LINKS = {
  navegação: [
    { label: "Início",       href: "/" },
    { label: "Comunicados",  href: "/comunicados" },
    { label: "Jogos",        href: "/jogos" },
    { label: "O Clube",      href: "/clube" },
    { label: "Academia Sénior", href: "/academia-senior" },
    { label: "Órgãos Sociais", href: "/orgaos-sociais" },
    { label: "Loja Oficial", href: STORE_URL, external: true },
    { label: "Sócios",       href: "/socios-contacto" },
    { label: "Fazer Sócio",  href: "/socios/inscricao" },
  ],
  modalidades: MODALIDADES.map((m) => ({
    label: m.nome,
    href:  `/modalidades#${m.slug}`,
  })),
  legal: [
    { label: "Política de Privacidade", href: "/privacidade" },
    { label: "Contactos",               href: "/contactos" },
  ],
};

const SOCIALS = [
  { label: "Instagram", href: CONTACTO.redesSociais.instagram,            Icon: InstagramIcon, hover: "hover:bg-[#E4405F]" },
  { label: "Facebook",  href: CONTACTO.redesSociais.facebook,             Icon: FacebookIcon,  hover: "hover:bg-[#1877F2]" },
  { label: "YouTube",   href: CONTACTO.redesSociais.youtube,              Icon: YouTubeIcon,   hover: "hover:bg-[#FF0000]" },
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
              <Image
                src="/brand/crest.png"
                alt="Emblema do Valejas Atlético Clube"
                width={44}
                height={44}
                className="w-11 h-11 object-contain"
              />
              <div>
                <p className="font-headline font-black text-base uppercase text-on-surface leading-none">Valejas</p>
                <p className="font-body text-xs text-on-surface-muted uppercase tracking-widest">Atlético Clube</p>
              </div>
            </div>
            <p className="font-body text-sm text-on-surface-muted leading-relaxed max-w-xs">
              O clube da nossa terra desde 1966. Futsal, atletismo e comunidade,
              no coração de Valejas.
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
                  className={`w-9 h-9 bg-surface-high flex items-center justify-center text-on-surface hover:text-white transition-all duration-200 ${s.hover}`}
                >
                  <s.Icon size={16} />
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
                    {"external" in item && item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-body text-sm text-on-surface-muted hover:text-on-surface transition-colors duration-200"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="font-body text-sm text-on-surface-muted hover:text-on-surface transition-colors duration-200"
                      >
                        {item.label}
                      </Link>
                    )}
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
                Junta-te ao <span className="text-yellow">clube</span>
              </h4>
              <p className="font-body text-sm text-on-surface-muted mt-1">
                Notícias exclusivas, bilhetes antecipados e bastidores direto para ti.
              </p>
            </div>
            <NewsletterForm variant="default" cta="Subscrever" />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-on-surface/10">
        <div className="section-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-body text-xs text-on-surface-muted">
            © {new Date().getFullYear()} Valejas Atlético Clube. O clube da nossa terra.
          </p>
          <p className="font-body text-xs text-on-surface-muted">
            Fundado em 1966 · AF Lisboa · Barcarena, Oeiras
          </p>
        </div>
      </div>
    </footer>
  );
}
