import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { FORNECEDOR, PRAZO_ENCOMENDA_SEMANAS, SINAL_PERCENTAGEM } from "@/lib/data/loja";
import { LOCALIZACAO } from "@/lib/data/historia";

export const metadata: Metadata = {
  title: "Condições da loja",
  description:
    "Como funcionam as encomendas na loja do Valejas Atlético Clube: pagamento, prazos, levantamento na sede, trocas e devoluções.",
};

/**
 * CONDIÇÕES DA LOJA
 * ─────────────────────────────────────────────────────────────────
 * Uma loja online em Portugal tem de dizer isto em sítio visível:
 * quem vende, como se paga, em quanto tempo chega, o que acontece se
 * a peça não servir, e onde se reclama.
 *
 * ⚠️ Escrito a partir do regime geral (DL 24/2014 para vendas à
 * distância). A Direção tem de confirmar os pontos que dependem de
 * decisão do clube — estão assinalados no TODO.md.
 * ─────────────────────────────────────────────────────────────────
 */
export default function CondicoesLojaPage() {
  return (
    <div className="bg-surface">
      <section className="bg-surface-low bg-texture border-b border-on-surface/10">
        <div className="section-container py-14 md:py-20">
          <Link
            href="/loja"
            className="inline-flex items-center gap-2 font-body text-sm text-on-surface-muted hover:text-on-surface transition-colors mb-4"
          >
            <ArrowLeft size={16} aria-hidden />
            Voltar à loja
          </Link>
          <h1 className="section-title text-4xl md:text-6xl">
            Condições da <span>loja</span>
          </h1>
          <p className="font-body text-lg text-on-surface-muted mt-5 max-w-2xl leading-relaxed">
            A loja é do clube e serve os sócios e os atletas. Não é uma loja
            online no sentido comum: não há envios, e o que se encomenda
            levanta-se na sede.
          </p>
        </div>
      </section>

      <div className="section-container py-14 md:py-20 max-w-3xl texto-legal">
        <h2>Quem vende</h2>
        <p>
          Valejas Atlético Clube, com sede em {LOCALIZACAO.morada},{" "}
          {LOCALIZACAO.codigoPostal} {LOCALIZACAO.localidade}. O equipamento é
          produzido pela {FORNECEDOR.nome}, que fornece o clube.
        </p>

        <h2>Como se encomenda</h2>
        <p>
          Escolhes as peças e os tamanhos no site e deixas os teus contactos. A
          encomenda fica registada com um número — é por ele que te
          identificamos. Recebes um email com o resumo.
        </p>
        <p>
          Os artigos marcados como <strong>sob consulta</strong> não têm preço
          fechado e não se encomendam pelo site: fala com o clube e dizemos
          quanto fica.
        </p>

        <h2>Quando fica pronta</h2>
        <p>
          O que estiver na sede separa-se de imediato. O que faltar é pedido ao
          fornecedor e demora até {PRAZO_ENCOMENDA_SEMANAS} semanas. A encomenda
          fica completa quando chegar a última peça — avisamos-te por email.
        </p>

        <h2>Pagamento</h2>
        <p>
          Podes pagar tudo no momento da encomenda, ou apenas um sinal de{" "}
          {SINAL_PERCENTAGEM}% para a reservar, acertando o resto quando a vieres
          levantar. Os dados de pagamento seguem no email da encomenda.
        </p>

        <h2>Levantamento</h2>
        <p>
          <strong>Sempre na sede do clube.</strong> Não enviamos para casa de
          ninguém e não há portes a pagar. Leva o número da encomenda.
        </p>

        <h2 id="trocas-e-devolucoes" className="scroll-mt-32">Trocas e devoluções</h2>
        <p>
          Se o tamanho não servir, troca-se — desde que a peça esteja por usar,
          com etiquetas, e dentro de 14 dias a contar do levantamento. A troca
          faz-se na sede.
        </p>
        <p>
          As peças <strong>personalizadas</strong> — com nome, número ou
          fotografia — não se trocam nem se devolvem, por serem feitas de
          propósito para quem as encomendou. Confirma o tamanho antes de
          encomendar; na sede há peças para experimentar.
        </p>

        <h2>Direito de livre resolução</h2>
        <p>
          Nas compras feitas à distância tens 14 dias para desistir da compra,
          sem ter de justificar, contados a partir do levantamento. Para o fazer,
          basta dizer-nos por email ou na sede.
        </p>
        <p>
          A lei exclui deste direito os bens feitos por medida ou personalizados
          — é o caso de tudo o que leve nome, número ou fotografia.
        </p>

        <h2>Se alguma coisa correr mal</h2>
        <p>
          Fala connosco primeiro: quase tudo se resolve na sede. Se não ficares
          satisfeito, tens o Livro de Reclamações eletrónico à tua disposição.
        </p>
        <p>
          <a
            href="https://www.livroreclamacoes.pt/inicio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2"
          >
            Livro de Reclamações <ExternalLink size={14} />
          </a>
        </p>

        <h2>Dados pessoais</h2>
        <p>
          Os dados da encomenda servem só para a preparar e para te avisar. Como
          tratamos os dados está na{" "}
          <Link href="/privacidade">política de privacidade</Link>.
        </p>
      </div>
    </div>
  );
}
