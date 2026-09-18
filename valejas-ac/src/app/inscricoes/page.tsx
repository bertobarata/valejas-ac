import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardCheck, Download, FileText, MessageSquare, UserPlus } from "lucide-react";
import { MODALIDADES, VAGAS } from "@/lib/data/modalidades";
import { QUOTA_MENSAL, formatEuros } from "@/lib/data/quota";
import { DOCUMENTOS } from "@/lib/data/documentos";
import PedidoInscricao from "@/components/inscricoes/PedidoInscricao";

export const metadata: Metadata = {
  title: "Inscrições",
  description:
    "Como começar a praticar no Valejas Atlético Clube: fazer-se sócio, pedir vaga na modalidade e fechar a inscrição na sede.",
};

/**
 * INSCRIÇÕES
 * ─────────────────────────────────────────────────────────────────
 * Quem quer praticar no clube tropeça sempre na mesma ordem: primeiro
 * sócio, depois vaga, depois a sede. Esta página existe para dizer
 * isso por ordem, em vez de a pessoa descobrir pelo caminho.
 * ─────────────────────────────────────────────────────────────────
 */
export default function InscricoesPage() {
  const passos = [
    {
      Icon: UserPlus,
      titulo: "Primeiro, ser sócio",
      texto:
        `Não se pratica no clube sem ser sócio — vale para todas as ` +
        `modalidades e para todas as idades. A quota é de ${formatEuros(QUOTA_MENSAL)} por mês, ` +
        `igual para toda a gente.`,
      accao: { label: "Fazer-me sócio", href: "/socios/inscricao" },
    },
    {
      Icon: MessageSquare,
      titulo: "Depois, a inscrição",
      texto:
        "Preenche o formulário aqui em baixo, com a autorização de direitos " +
        "de imagem que o clube pede a todos os atletas. Cada modalidade tem " +
        "poucos lugares — confirmamos a vaga e respondemos.",
    },
    {
      Icon: ClipboardCheck,
      titulo: "Por fim, na sede",
      texto:
        "Havendo vaga, a inscrição fecha-se na sede: assina-se a ficha da " +
        "federação e entrega-se o exame médico, que se descarrega aqui em " +
        "baixo. É também aí que se escolhe o horário e se trata do equipamento.",
    },
  ];

  return (
    <div className="bg-surface">
      {/* Cabeçalho */}
      <section className="bg-surface-low bg-texture border-b border-on-surface/10">
        <div className="section-container py-16 md:py-20">
          <p className="font-body text-xs font-bold uppercase tracking-[0.35em] text-yellow mb-3">
            Começar a praticar
          </p>
          <h1 className="section-title text-4xl md:text-6xl">
            <span>Inscrições</span>
          </h1>
          <p className="font-body text-lg md:text-xl text-on-surface-muted mt-5 max-w-2xl leading-relaxed">
            {MODALIDADES.length} modalidades, dos petizes aos seniores. Começa-se
            sempre da mesma maneira — e são três passos.
          </p>
        </div>
      </section>

      {/* Os três passos */}
      <section className="section-container py-14 md:py-20">
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-px bg-on-surface/10">
          {passos.map(({ Icon, titulo, texto, accao }, i) => (
            <li key={titulo} className="bg-surface-high p-7 md:p-8 flex flex-col">
              <span
                aria-hidden
                className="font-headline font-black text-5xl text-yellow/30 leading-none"
              >
                0{i + 1}
              </span>
              <Icon size={22} className="text-yellow mt-5" aria-hidden />
              <h2 className="font-headline font-black uppercase text-xl text-on-surface mt-4">
                {titulo}
              </h2>
              <p className="font-body text-on-surface-muted leading-relaxed mt-2 flex-1">
                {texto}
              </p>
              {accao && (
                <Link href={accao.href} className="btn-primary text-sm mt-6 self-start">
                  {accao.label} <ArrowRight size={14} />
                </Link>
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* Formulário */}
      <section
        id="enviar"
        className="section-container py-14 md:py-20 border-t border-on-surface/10 scroll-mt-32"
      >
        <div className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-10 lg:gap-16">
          {/* A coluna só se divide em dois a partir de `lg`. Abaixo disso é a
              largura toda, e num iPad vertical isso dava linhas de 95
              caracteres. O limite de leitura não pode depender da grelha. */}
          <div className="max-w-prose">
            <h2 className="font-headline font-black uppercase text-3xl md:text-4xl tracking-tighter text-on-surface">
              Enviar inscrição
            </h2>
            <p className="font-body text-lg text-on-surface-muted leading-relaxed mt-4">
              {VAGAS.texto}
            </p>
            <p className="font-body text-on-surface-muted leading-relaxed mt-4">
              A inscrição fecha-se na sede, com a ficha da federação e o
              exame médico — isto é o que se adianta daqui. Nada fica
              guardado neste site: segue por email para o clube e desaparece.
            </p>
            <p className="font-body text-on-surface-muted leading-relaxed mt-4">
              Inclui a autorização de{" "}
              <Link href="/inscricoes/direitos-de-imagem" className="text-yellow underline">
                direitos de imagem
              </Link>
              , obrigatória para todos os atletas.
            </p>
          </div>

          <PedidoInscricao />
        </div>
      </section>

      {/* O que é preciso levar à sede */}
      <section className="section-container py-14 md:py-20 border-t border-on-surface/10">
        <div className="max-w-2xl mb-8">
          <h2 className="font-headline font-black uppercase text-3xl md:text-4xl tracking-tighter text-on-surface">
            O que levar à sede
          </h2>
          <p className="font-body text-lg text-on-surface-muted leading-relaxed mt-3">
            A inscrição só fica fechada com estes papéis entregues. Descarrega,
            trata deles, e traz-nos.
          </p>
        </div>

        <div className="grid gap-px bg-on-surface/10 sm:grid-cols-2">
          {DOCUMENTOS.map((doc) => (
            <article key={doc.ficheiro} className="bg-surface-high p-7 md:p-8 flex flex-col">
              <FileText size={22} className="text-yellow" aria-hidden />
              <h3 className="font-headline font-black uppercase text-xl text-on-surface mt-4">
                {doc.nome}
              </h3>
              <p className="font-body text-on-surface-muted leading-relaxed mt-2">
                {doc.descricao}
              </p>
              <p className="font-body text-sm text-on-surface-muted leading-relaxed mt-3">
                {doc.comoUsar}
              </p>
              {doc.origem && (
                <p className="font-body text-xs text-on-surface-muted mt-3">
                  Formulário oficial do {doc.origem}.
                </p>
              )}
              <a
                href={doc.ficheiro}
                download
                className="btn-primary text-sm mt-6 self-start"
              >
                <Download size={16} /> Descarregar PDF
              </a>
            </article>
          ))}

          {/* Os outros papéis não são ficheiros: são coisas para trazer. */}
          <article className="bg-surface-high p-7 md:p-8 flex flex-col">
            <ClipboardCheck size={22} className="text-yellow" aria-hidden />
            <h3 className="font-headline font-black uppercase text-xl text-on-surface mt-4">
              E mais isto
            </h3>
            <ul className="mt-3 space-y-2">
              {[
                "Cartão de Cidadão do atleta",
                "Cartão de Cidadão do encarregado de educação, se o atleta for menor",
                "Uma fotografia tipo passe",
                "A ficha da federação, que se assina lá",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-yellow shrink-0 mt-2.5" />
                  <span className="font-body text-on-surface-muted leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <p className="font-body text-sm text-on-surface-muted leading-relaxed mt-5">
              A sede está aberta de segunda a sexta, das 09h30 às 17h00, e nos
              dias de jogo.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
