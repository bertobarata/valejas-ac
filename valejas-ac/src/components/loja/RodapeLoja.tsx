import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ExternalLink } from "lucide-react";
import { FORNECEDOR } from "@/lib/data/loja";

/**
 * RODAPÉ DA LOJA
 * ─────────────────────────────────────────────────────────────────
 * O que uma loja em Portugal tem de ter à mão: condições, política de
 * privacidade e o Livro de Reclamações eletrónico. Fica no fim das
 * páginas da loja, não no rodapé geral do site — é lá que se procura.
 * ─────────────────────────────────────────────────────────────────
 */
export default function RodapeLoja() {
  const t = useTranslations("loja.rodape");

  return (
    <section className="section-container pt-10 pb-16 border-t border-on-surface/10 mt-14">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
        <Link href="/loja/condicoes" className="alvo-toque font-body text-sm text-on-surface hover:text-yellow transition-colors">
          {t("condicoes")}
        </Link>
        <Link href="/loja/condicoes#trocas-e-devolucoes" className="alvo-toque font-body text-sm text-on-surface hover:text-yellow transition-colors">
          {t("trocas")}
        </Link>
        <Link href="/privacidade" className="alvo-toque font-body text-sm text-on-surface hover:text-yellow transition-colors">
          {t("privacidade")}
        </Link>
        <Link href="/termos" className="alvo-toque font-body text-sm text-on-surface hover:text-yellow transition-colors">
          {t("termos")}
        </Link>
        <a
          href="https://www.livroreclamacoes.pt/inicio"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 min-h-11 font-body text-sm text-on-surface hover:text-yellow transition-colors"
        >
          {t("livroReclamacoes")} <ExternalLink size={13} aria-hidden />
        </a>
        <Link href="/contactos" className="alvo-toque font-body text-sm text-on-surface hover:text-yellow transition-colors">
          {t("contactos")}
        </Link>
      </div>

      <p className="font-body text-xs text-on-surface-muted mt-5 max-w-2xl leading-relaxed">
        {t("nota", { fornecedor: FORNECEDOR.nome })}
      </p>
    </section>
  );
}
