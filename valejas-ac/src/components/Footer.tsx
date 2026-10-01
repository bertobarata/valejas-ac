import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { STORE_URL } from "@/lib/paginas";
import { CONTACTO } from "@/lib/data/socios";
import { MOTE } from "@/lib/data/clube";
import { MODALIDADES } from "@/lib/data/modalidades";
import { InstagramIcon, FacebookIcon, YouTubeIcon } from "@/components/BrandIcons";
import { Mail as MailIcon } from "lucide-react";
import { useTranslations } from "next-intl";

/*
 * Treze links numa coluna faziam do rodapé a parte mais alta da página.
 * Partidos pelo que a pessoa vem fazer: conhecer o clube, ou participar.
 * «Início» sai — o emblema lá em cima já leva à inicial.
 *
 * Os `label` são chaves em comum.rodape (as das modalidades em comum.nav).
 */
const LINKS = {
  clube: [
    { label: "oClube",         href: "/clube" },
    { label: "emblema",       href: "/clube/emblema" },
    { label: "instalacoes",     href: "/instalacoes" },
    { label: "orgaosSociais",  href: "/orgaos-sociais" },
    { label: "patrocinadores",  href: "/patrocinadores" },
    { label: "academiaSenior", href: "/academia-senior" },
  ],
  participar: [
    { label: "comunicados",  href: "/comunicados" },
    { label: "jogos",        href: "/jogos" },
    { label: "inscricoes",   href: "/inscricoes" },
    { label: "socios",       href: "/socios-contacto" },
    { label: "fazerSocio",  href: "/socios/inscricao" },
    { label: "lojaOficial", href: STORE_URL },
  ],
  modalidades: MODALIDADES.map((m) => ({
    label: `modalidade.${m.slug}`,
    href:  `/modalidades#${m.slug}`,
  })),
  legal: [
    { label: "privacidade",        href: "/privacidade" },
    { label: "termos", href: "/termos" },
    { label: "cookies",            href: "/cookies" },
    { label: "contactos",          href: "/contactos" },
  ],
};

const SOCIALS = [
  { label: "Email", href: `mailto:${CONTACTO.email}`, Icon: MailIcon, hover: "hover:bg-yellow hover:text-blue-deep" },
  { label: "Instagram", href: CONTACTO.redesSociais.instagram,            Icon: InstagramIcon, hover: "hover:bg-[#E4405F]" },
  { label: "Facebook",  href: CONTACTO.redesSociais.facebook,             Icon: FacebookIcon,  hover: "hover:bg-[#1877F2]" },
  { label: "YouTube",   href: CONTACTO.redesSociais.youtube,              Icon: YouTubeIcon,   hover: "hover:bg-[#FF0000]" },
];

export default function Footer() {
  const t = useTranslations("comum.rodape");
  const tNav = useTranslations("comum.nav");
  /** As modalidades partilham os nomes com o menu do topo. */
  const nome = (chave: string) => (chave.startsWith("modalidade.") ? tNav(chave) : t(chave));

  return (
    <footer className="bg-surface-low border-t border-on-surface/10">
      {/* Top section */}
      <div className="section-container py-12">
        {/*
          Duas colunas já no telemóvel. Com alvos de 44px, uma coluna só
          dava um rodapé de mais de mil pixels — a dois fica mais curto do
          que era antes, e com os links finalmente acertáveis. No
          computador o rato não precisa de 44px: as linhas encolhem.
        */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-x-6 gap-y-10">

          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/brand/crest.png"
                alt={t("emblemaAlt")}
                width={44}
                height={44}
                className="w-11 h-11 object-contain"
              />
              <div>
                <p className="font-headline font-black text-base uppercase text-on-surface leading-none">Valejas</p>
                <p className="font-body text-xs text-on-surface-muted uppercase tracking-widest">Atlético Clube</p>
              </div>
            </div>
            <p className="font-headline font-black uppercase text-lg text-yellow tracking-tight mt-1">
              {MOTE.texto}
            </p>
            <p className="font-body text-sm text-on-surface-muted leading-relaxed max-w-xs mt-3">
              {t("descricao")}
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
                  className={`w-11 h-11 bg-surface-high flex items-center justify-center text-on-surface hover:text-white transition-all duration-200 ${s.hover}`}
                >
                  <s.Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section}>
              <h2 className="font-body font-semibold text-xs uppercase tracking-widest text-yellow mb-3">
                {t(`seccao.${section}`)}
              </h2>
              <ul className="-my-1">
                {items.map((item) => (
                  <li key={item.href}>
                    {"external" in item && item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="alvo-toque lg:min-h-8 font-body text-sm text-on-surface-muted hover:text-on-surface transition-colors duration-200"
                      >
                        {nome(item.label)}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="alvo-toque lg:min-h-8 font-body text-sm text-on-surface-muted hover:text-on-surface transition-colors duration-200"
                      >
                        {nome(item.label)}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-on-surface/10">
        <div className="section-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-body text-xs text-on-surface-muted">
            © {new Date().getFullYear()} Valejas Atlético Clube. {t("direitos")}
          </p>
          <p className="font-body text-xs text-on-surface-muted">
            {t("fundado")}
          </p>
        </div>
      </div>
    </footer>
  );
}
