"use client";

/**
 * QUERO SER PATROCINADOR — formulário
 * ─────────────────────────────────────────────────────────────────
 * Quem chega aqui ainda não decidiu nada: quer saber o que o clube tem
 * para oferecer. Por isso o formulário é curto e a recompensa é
 * imediata — a apresentação chega ao email assim que se carrega no
 * botão. O resto da conversa é com a comunicação do clube.
 *
 * A empresa é opcional: há quem apoie a título pessoal (um antigo
 * atleta, um pai) e não tem de inventar uma entidade para o fazer.
 *
 * Os erros aparecem junto de cada campo quando se sai dele, e todos de
 * uma vez ao enviar — com o foco a saltar para o primeiro, para quem
 * navega por teclado ou leitor de ecrã não ficar sem saber o que falta.
 * ─────────────────────────────────────────────────────────────────
 */

import { useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import clsx from "clsx";
import { Check, Loader2, Mail, Send } from "lucide-react";
import {
  FORMAS_DE_APOIO, LIMITES, lerPedido,
  type ErrosPedido, type PedidoPatrocinio, type TipoPatrocinio,
} from "@/lib/data/patrocinio";
import { EMAILS } from "@/lib/data/socios";

type Campo = keyof PedidoPatrocinio;

/** Ordem em que o foco procura o primeiro erro. */
const ORDEM: Campo[] = ["nome", "email", "telefone", "tipos", "rgpd"];

const CLASSE_CAMPO = "input-field px-4 border w-full";

export default function PedidoPatrocinio() {
  const [valores, setValores] = useState({
    entidade: "", nome: "", email: "", telefone: "", mensagem: "",
  });
  const [tipos, setTipos]     = useState<TipoPatrocinio[]>([]);
  const [rgpd, setRgpd]       = useState(false);
  const [website, setWebsite] = useState("");

  const [tocados, setTocados] = useState<Partial<Record<Campo, boolean>>>({});
  const [aEnviar, setAEnviar] = useState(false);
  const [erroGeral, setErroGeral] = useState<string[]>([]);
  const [errosServidor, setErrosServidor] = useState<ErrosPedido>({});
  const [feito, setFeito] = useState<{ email: string; apresentacao: boolean } | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const tituloFeitoRef = useRef<HTMLHeadingElement>(null);

  const corpo = { ...valores, tipos, rgpd };
  const { erros } = lerPedido(corpo);

  /** Só se mostra o erro de um campo depois de a pessoa passar por ele. */
  const erroDe = (c: Campo) => (tocados[c] ? erros[c] ?? errosServidor[c] : undefined);
  const marcar = (c: Campo) => setTocados((t) => ({ ...t, [c]: true }));

  function set(c: keyof typeof valores, v: string) {
    setValores((x) => ({ ...x, [c]: v }));
    setErrosServidor((e) => ({ ...e, [c]: undefined }));
  }

  function alternarTipo(id: TipoPatrocinio) {
    setTipos((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));
    setErrosServidor((e) => ({ ...e, tipos: undefined }));
    marcar("tipos");
  }

  function focarPrimeiroErro(e: ErrosPedido) {
    const primeiro = ORDEM.find((c) => e[c]);
    if (!primeiro) return;
    const alvo = formRef.current?.querySelector<HTMLElement>(`[data-campo="${primeiro}"]`);
    alvo?.focus();
  }

  async function submeter(ev: React.FormEvent) {
    ev.preventDefault();
    setErroGeral([]);

    if (Object.keys(erros).length) {
      setTocados({ nome: true, email: true, telefone: true, tipos: true, rgpd: true });
      focarPrimeiroErro(erros);
      return;
    }

    setAEnviar(true);
    try {
      const res = await fetch("/api/patrocinio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...corpo, _website: website }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        if (json.campos) {
          setErrosServidor(json.campos);
          setTocados({ nome: true, email: true, telefone: true, tipos: true, rgpd: true });
          focarPrimeiroErro(json.campos);
        } else {
          setErroGeral(json.erros ?? ["Não foi possível enviar o pedido."]);
        }
        return;
      }
      setFeito({ email: valores.email.trim(), apresentacao: json.apresentacao !== false });
      // O formulário desaparece; o foco vai para a confirmação, senão
      // um leitor de ecrã fica a apontar para um botão que já não existe.
      requestAnimationFrame(() => tituloFeitoRef.current?.focus());
    } catch {
      setErroGeral(["Falha de ligação. Tente outra vez."]);
    } finally {
      setAEnviar(false);
    }
  }

  if (feito) {
    return (
      <div className="bg-surface-high p-8 md:p-10 space-y-5" role="status" aria-live="polite">
        <div className="w-14 h-14 rounded-full bg-yellow/15 flex items-center justify-center">
          <Check size={28} className="text-yellow" aria-hidden />
        </div>
        <h2
          ref={tituloFeitoRef}
          tabIndex={-1}
          className="font-headline font-black uppercase text-2xl md:text-3xl tracking-tighter text-on-surface"
        >
          Obrigado — pedido recebido
        </h2>
        {feito.apresentacao ? (
          <p className="font-body text-on-surface-muted leading-relaxed max-w-prose">
            A apresentação de parcerias segue para{" "}
            <strong className="text-on-surface break-all">{feito.email}</strong>.
            Deve chegar dentro de minutos — se não a vir, espreite a pasta de
            spam ou de promoções.
          </p>
        ) : (
          <p className="font-body text-on-surface-muted leading-relaxed max-w-prose">
            O pedido chegou ao clube, mas a apresentação não conseguiu seguir
            para <strong className="text-on-surface break-all">{feito.email}</strong>.
            A comunicação do clube manda-a à mão.
          </p>
        )}
        <p className="font-body text-on-surface-muted leading-relaxed max-w-prose">
          A comunicação do clube já sabe do seu interesse e vai entrar em
          contacto. Até lá, qualquer dúvida:{" "}
          <a href={`mailto:${EMAILS.comunicacao}`} className="text-yellow underline break-all">
            {EMAILS.comunicacao}
          </a>
          .
        </p>
      </div>
    );
  }

  const erroTipos = erroDe("tipos");
  const erroRgpd = erroDe("rgpd");

  return (
    <form ref={formRef} onSubmit={submeter} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label htmlFor="pat-entidade" className="rotulo">
            Empresa ou entidade{" "}
            <span className="normal-case tracking-normal opacity-60">(opcional)</span>
          </label>
          <input
            id="pat-entidade" value={valores.entidade}
            onChange={(e) => set("entidade", e.target.value)}
            autoComplete="organization" maxLength={LIMITES.entidade}
            aria-describedby="pat-entidade-dica"
            className={clsx(CLASSE_CAMPO, "border-on-surface/15 focus:border-yellow")}
          />
          <p id="pat-entidade-dica" className="font-body text-xs text-on-surface-muted mt-1.5">
            Se apoia a título pessoal, deixe em branco.
          </p>
        </div>

        <CampoTexto
          id="pat-nome" campo="nome" label="O seu nome"
          valor={valores.nome} erro={erroDe("nome")} autoComplete="name"
          onChange={(v) => set("nome", v)} onBlur={() => marcar("nome")}
          larga
        />

        <CampoTexto
          id="pat-email" campo="email" label="Email" tipo="email"
          valor={valores.email} erro={erroDe("email")} autoComplete="email"
          dica="É para aqui que enviamos a apresentação."
          onChange={(v) => set("email", v)} onBlur={() => marcar("email")}
        />

        <CampoTexto
          id="pat-telefone" campo="telefone" label="Telefone" tipo="tel" opcional
          valor={valores.telefone} erro={erroDe("telefone")} autoComplete="tel"
          onChange={(v) => set("telefone", v)} onBlur={() => marcar("telefone")}
        />
      </div>

      {/* Formas de apoio — um grupo, com legenda, para o leitor de ecrã
          anunciar a pergunta antes de cada opção. */}
      <fieldset aria-describedby={erroTipos ? "pat-tipos-erro" : undefined}>
        <legend className="rotulo">Como gostaria de apoiar *</legend>
        <p className="font-body text-sm text-on-surface-muted mb-3">
          Pode escolher mais do que uma. Os valores de cada uma estão na
          apresentação.
        </p>
        {/* `!justify-start text-left`: no telemóvel o site centra tudo,
            mas uma caixa de verificação centrada deixa as oito a
            saltar de sítio — é a exceção dos campos, na DESIGN.md. O `!`
            é preciso: a regra que centra está fora das camadas do
            Tailwind e ganha a qualquer utilitário. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-on-surface/10">
          {FORMAS_DE_APOIO.map((f, i) => {
            const ativo = tipos.includes(f.id);
            return (
              <label
                key={f.id}
                className={clsx(
                  "flex items-start gap-3 cursor-pointer p-4 min-h-11 !justify-start text-left transition-colors duration-200",
                  ativo ? "bg-surface-highest" : "bg-surface-high hover:bg-surface-highest"
                )}
              >
                <input
                  type="checkbox"
                  checked={ativo}
                  onChange={() => alternarTipo(f.id)}
                  // O primeiro recebe o foco quando falta escolher.
                  data-campo={i === 0 ? "tipos" : undefined}
                  className="w-5 h-5 mt-0.5 accent-yellow shrink-0"
                />
                <span className="font-body text-sm text-on-surface leading-snug">
                  {f.nome}
                </span>
              </label>
            );
          })}
        </div>
        {erroTipos && (
          <p id="pat-tipos-erro" className="font-body text-sm text-red-500 mt-2">{erroTipos}</p>
        )}
      </fieldset>

      <div>
        <label htmlFor="pat-mensagem" className="rotulo">
          Uma nota para o clube{" "}
          <span className="normal-case tracking-normal opacity-60">(opcional)</span>
        </label>
        <textarea
          id="pat-mensagem" value={valores.mensagem}
          onChange={(e) => set("mensagem", e.target.value)}
          rows={4} maxLength={LIMITES.mensagem}
          placeholder="O que tem em mente, que equipa gostava de apoiar, a melhor altura para falarmos…"
          className={clsx(CLASSE_CAMPO, "border-on-surface/15 focus:border-yellow resize-y")}
        />
      </div>

      {/* Honeypot — fora do ecrã e da ordem de tabulação. */}
      <input
        type="text" name="_website" tabIndex={-1} autoComplete="off"
        aria-hidden className="hidden"
        value={website} onChange={(e) => setWebsite(e.target.value)}
      />

      {/* Consentimento */}
      <div className="bg-surface-high p-5">
        <label className="flex items-start gap-3 cursor-pointer py-1 !justify-start text-left">
          <input
            type="checkbox"
            checked={rgpd}
            onChange={(e) => { setRgpd(e.target.checked); marcar("rgpd"); }}
            data-campo="rgpd"
            aria-invalid={Boolean(erroRgpd)}
            aria-describedby={erroRgpd ? "pat-rgpd-erro" : undefined}
            className="w-5 h-5 mt-0.5 accent-yellow shrink-0"
          />
          <span className="font-body text-sm text-on-surface-muted leading-relaxed">
            Autorizo o Valejas Atlético Clube a usar estes dados para me enviar
            a apresentação de parcerias e entrar em contacto sobre o apoio ao
            clube. Os dados seguem por email e não ficam guardados no site.{" "}
            <Link href="/privacidade" className="text-yellow underline">
              Política de Privacidade
            </Link>
            . *
          </span>
        </label>
        {erroRgpd && (
          <p id="pat-rgpd-erro" className="font-body text-sm text-red-500 mt-2">{erroRgpd}</p>
        )}
      </div>

      {erroGeral.length > 0 && (
        <div role="alert" className="space-y-1">
          {erroGeral.map((e) => (
            <p key={e} className="font-body text-sm text-red-500">{e}</p>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <button
          type="submit" disabled={aEnviar}
          className={clsx("btn-primary text-sm", aEnviar && "opacity-60")}
        >
          {aEnviar ? (
            <><Loader2 size={16} className="animate-spin" aria-hidden /> A enviar…</>
          ) : (
            <><Send size={16} aria-hidden /> Receber a apresentação</>
          )}
        </button>
        <p className="font-body text-sm text-on-surface-muted inline-flex items-center gap-2">
          <Mail size={14} aria-hidden /> PDF enviado para o seu email, na hora.
        </p>
      </div>
    </form>
  );
}

interface CampoTextoProps {
  id:     string;
  campo:  Campo;
  label:  string;
  valor:  string;
  erro?:  string;
  tipo?:  string;
  dica?:  string;
  opcional?: boolean;
  larga?: boolean;
  autoComplete?: string;
  onChange: (v: string) => void;
  onBlur:   () => void;
}

function CampoTexto({
  id, campo, label, valor, erro, tipo = "text", dica, opcional, larga,
  autoComplete, onChange, onBlur,
}: CampoTextoProps) {
  return (
    <div className={clsx(larga && "sm:col-span-2")}>
      <label htmlFor={id} className="rotulo">
        {label}{" "}
        {opcional ? <span className="normal-case tracking-normal opacity-60">(opcional)</span> : "*"}
      </label>
      <input
        id={id}
        type={tipo}
        value={valor}
        autoComplete={autoComplete}
        required={!opcional}
        data-campo={campo}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? `${id}-erro` : dica ? `${id}-dica` : undefined}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={clsx(
          CLASSE_CAMPO,
          erro ? "border-red-500 focus:border-red-500" : "border-on-surface/15 focus:border-yellow"
        )}
      />
      {erro ? (
        <p id={`${id}-erro`} className="font-body text-sm text-red-500 mt-1.5">{erro}</p>
      ) : dica ? (
        <p id={`${id}-dica`} className="font-body text-xs text-on-surface-muted mt-1.5">{dica}</p>
      ) : null}
    </div>
  );
}
