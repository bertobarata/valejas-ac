"use client";

/**
 * INSCRIÇÃO NUMA MODALIDADE
 * ─────────────────────────────────────────────────────────────────
 * O formulário mais curto que consegue ser útil: modalidade, quem é,
 * que idade tem e por onde se responde. Tudo o resto — ficha da
 * federação, exame médico, escalão — trata-se na sede, com a pessoa à
 * frente.
 *
 * O campo do encarregado de educação aparece sozinho quando a data de
 * nascimento diz que o atleta é menor. Perguntar antes disso era pedir
 * a metade das pessoas uma coisa que não lhes diz respeito.
 * ─────────────────────────────────────────────────────────────────
 */

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import clsx from "clsx";
import { Check, Download, ExternalLink, Loader2, Send } from "lucide-react";
import { MODALIDADES } from "@/lib/data/modalidades";
import { EXAME_MEDICO } from "@/lib/data/documentos";
import { QUOTA_MENSAL, formatEuros } from "@/lib/data/quota";
import { calcularIdade, eMenor } from "@/lib/validacao";

export default function PedidoInscricao() {
  const t      = useTranslations("inscricoes.pedido");
  const td     = useTranslations("inscricoes.direitosImagem");
  const tm     = useTranslations("modalidades.itens");
  const lingua = useLocale();
  const quota  = formatEuros(QUOTA_MENSAL, lingua);

  const [modalidade, setModalidade]         = useState("");
  const [nome, setNome]                     = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [telemovel, setTelemovel]           = useState("");
  const [email, setEmail]                   = useState("");
  const [eeNome, setEeNome]                 = useState("");
  const [jaSocio, setJaSocio]               = useState(false);
  const [numeroSocio, setNumeroSocio]       = useState("");
  const [notas, setNotas]                   = useState("");
  const [consentimento, setConsentimento]   = useState(false);

  const [aEnviar, setAEnviar] = useState(false);
  const [erros, setErros]     = useState<string[]>([]);
  const [feito, setFeito]     = useState<{ modalidade: string; jaSocio: boolean } | null>(null);

  const idade = useMemo(
    () => (dataNascimento ? calcularIdade(dataNascimento) : null),
    [dataNascimento]
  );
  const menor = useMemo(
    () => (dataNascimento ? eMenor(dataNascimento) : false),
    [dataNascimento]
  );

  const escolhida = MODALIDADES.find((m) => m.slug === modalidade);
  /** Nome da modalidade na língua da página (o valor enviado é o slug). */
  const nomeDe = (slug: string) => tm(`${slug}.nome`);

  async function submeter(e: React.FormEvent) {
    e.preventDefault();
    setAEnviar(true);
    setErros([]);
    try {
      const res = await fetch("/api/inscricoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modalidade, nome, dataNascimento, telemovel, email,
          eeNome, jaSocio, numeroSocio, notas, consentimento,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        // As mensagens do servidor vêm em português (ver relatório i18n).
        setErros(json.erros ?? [t("erroEnvio")]);
        return;
      }
      // Guarda-se o slug, não o nome que a API devolve (que vem em PT).
      setFeito({ modalidade, jaSocio: json.jaSocio });
    } catch {
      setErros([t("erroLigacao")]);
    } finally {
      setAEnviar(false);
    }
  }

  if (feito) {
    return (
      <div className="bg-surface-high p-8 md:p-10 space-y-5">
        <div className="w-14 h-14 rounded-full bg-yellow/15 flex items-center justify-center">
          <Check size={28} className="text-yellow" />
        </div>
        <h2 className="font-headline font-black uppercase text-2xl md:text-3xl tracking-tighter text-on-surface">
          {t("feito.titulo")}
        </h2>
        <p className="font-body text-on-surface-muted leading-relaxed max-w-xl">
          {t("feito.texto", { modalidade: nomeDe(feito.modalidade) })}
        </p>
        {/*
          O momento em que a pessoa está mais disponível para tratar do
          papel é este: acabou de se inscrever e está à espera de saber o
          que falta. É aqui que o exame médico tem de aparecer.
        */}
        {/* Fundo próprio em vez de barra lateral amarela: a DESIGN.md tirou
            seis dessas do site e estas duas tinham voltado a entrar. */}
        <div className="bg-surface-high border border-on-surface/10 p-5">
          <p className="font-body text-xs font-bold uppercase tracking-widest text-on-surface-muted mb-2">
            {t("feito.faltaFazer")}
          </p>
          <p className="font-body text-on-surface leading-relaxed">
            {t.rich("feito.exame", { forte: (c) => <strong>{c}</strong> })}
          </p>
          <a href={EXAME_MEDICO.ficheiro} download className="btn-ghost text-sm mt-4">
            <Download size={16} /> {t("feito.descarregarExame")}
          </a>
        </div>

        {!feito.jaSocio && (
          <div className="bg-surface-high border border-on-surface/10 p-5">
            <p className="font-body text-xs font-bold uppercase tracking-widest text-on-surface-muted mb-2">
              {t("feito.faltaFazer")}
            </p>
            <p className="font-body text-on-surface leading-relaxed">
              {t.rich("feito.socio", { forte: (c) => <strong>{c}</strong>, quota })}
            </p>
            <Link href="/socios/inscricao" className="btn-primary text-sm mt-4">
              {t("feito.fazerSocio")}
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={submeter} className="space-y-6" noValidate>
      {/* Modalidade */}
      <div>
        <label htmlFor="modalidade" className="rotulo">
          {t("modalidade")}
        </label>
        <select
          id="modalidade"
          value={modalidade}
          onChange={(e) => setModalidade(e.target.value)}
          required
          className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full cursor-pointer"
        >
          <option value="">{t("escolherModalidade")}</option>
          {MODALIDADES.map((m) => (
            <option key={m.slug} value={m.slug}>{nomeDe(m.slug)}</option>
          ))}
        </select>
        {escolhida?.parceria && (
          <p className="font-body text-sm text-on-surface-muted mt-2">
            {t("parceria", {
              modalidade: nomeDe(escolhida.slug).toLowerCase(),
              parceiro: escolhida.parceria.nome,
            })}
          </p>
        )}
        {escolhida?.apenasFormacao && (
          <p className="font-body text-sm text-on-surface-muted mt-1">
            {t("apenasFormacao", { modalidade: nomeDe(escolhida.slug).toLowerCase() })}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label htmlFor="nome" className="rotulo">{t("nome")}</label>
          <input
            id="nome" value={nome} onChange={(e) => setNome(e.target.value)}
            autoComplete="name" required
            className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
          />
        </div>

        <div>
          <label htmlFor="nascimento" className="rotulo">{t("dataNascimento")}</label>
          <input
            id="nascimento" type="date" value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)} required
            className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
          />
          {idade !== null && (
            <p className="font-body text-sm text-on-surface-muted mt-1.5">
              {t("idade", { idade })}{menor ? t("menorDeIdade") : ""}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="telemovel" className="rotulo">{t("telemovel")}</label>
          <input
            id="telemovel" type="tel" value={telemovel}
            onChange={(e) => setTelemovel(e.target.value)}
            autoComplete="tel" required
            className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="email" className="rotulo">{t("email")}</label>
          <input
            id="email" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email" required
            className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
          />
        </div>

        {/* Só aparece quando a data diz que é preciso */}
        {menor && (
          <div className="sm:col-span-2">
            <label htmlFor="ee" className="rotulo">
              {t("encarregado")}
            </label>
            <input
              id="ee" value={eeNome} onChange={(e) => setEeNome(e.target.value)}
              required
              className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
            />
            <p className="font-body text-sm text-on-surface-muted mt-1.5">
              {t("encarregadoAjuda")}
            </p>
          </div>
        )}
      </div>

      {/* Sócio */}
      <div className="bg-surface-high p-5 space-y-4">
        <label className="flex items-start gap-3 cursor-pointer py-2.5">
          <input
            type="checkbox" checked={jaSocio}
            onChange={(e) => setJaSocio(e.target.checked)}
            className="w-6 h-6 accent-yellow shrink-0"
          />
          <span className="font-body text-on-surface leading-relaxed">
            {t("jaSocio")}
          </span>
        </label>

        {jaSocio ? (
          <div className="max-w-xs">
            <label htmlFor="num-socio" className="rotulo">
              {t("numeroSocio")}
            </label>
            <input
              id="num-socio" value={numeroSocio}
              onChange={(e) => setNumeroSocio(e.target.value)}
              required
              className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
            />
            <p className="font-body text-sm text-on-surface-muted mt-1.5">
              {t("numeroSocioAjuda")}
            </p>
          </div>
        ) : (
          <p className="font-body text-sm text-on-surface-muted leading-relaxed">
            {t("naoSocio", { quota })}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="notas" className="rotulo">
          {t("notas")}{" "}
          <span className="normal-case tracking-normal opacity-60">{t("opcional")}</span>
        </label>
        <textarea
          id="notas" value={notas} onChange={(e) => setNotas(e.target.value)}
          rows={3}
          className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full resize-y"
        />
      </div>

      {/* Honeypot */}
      <input
        type="text" name="_website" tabIndex={-1} autoComplete="off"
        aria-hidden className="hidden"
        onChange={() => {}}
      />

      {erros.length > 0 && (
        <div role="alert" className="space-y-1">
          {erros.map((e) => (
            <p key={e} className="font-body text-sm text-red-500">{e}</p>
          ))}
        </div>
      )}

      {/*
        Direitos de imagem. O clube pede isto a todos os atletas, e o
        RGPD exige que seja livre, informado e explícito — por isso a
        caixa nasce vazia, o texto está a um clique e a declaração muda
        conforme quem consente.
      */}
      <div className="border border-on-surface/15 p-5 md:p-6 space-y-4">
        <h3 className="font-headline font-black uppercase text-base text-on-surface">
          {t("direitosTitulo")}
        </h3>
        <p className="font-body text-sm text-on-surface-muted leading-relaxed max-w-[65ch]">
          {t("direitosTexto")}
        </p>

        <label className="flex items-start gap-3 cursor-pointer py-2.5">
          <input
            type="checkbox"
            checked={consentimento}
            onChange={(e) => setConsentimento(e.target.checked)}
            required
            className="w-6 h-6 accent-yellow shrink-0"
          />
          <span className="font-body text-on-surface leading-relaxed">
            {td(menor ? "declaracao.menor" : "declaracao.maior")}
          </span>
        </label>

        <Link
          href="/inscricoes/direitos-de-imagem"
          target="_blank"
          className="inline-flex items-center gap-2 min-h-11 font-body text-sm text-yellow underline underline-offset-4"
        >
          {t("lerTermo")} <ExternalLink size={13} aria-hidden />
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit" disabled={aEnviar}
          className={clsx("btn-primary text-sm", aEnviar && "opacity-60")}
        >
          {aEnviar ? (
            <><Loader2 size={16} className="animate-spin" /> {t("aEnviar")}</>
          ) : (
            <><Send size={16} /> {t("enviar")}</>
          )}
        </button>
      </div>
    </form>
  );
}
