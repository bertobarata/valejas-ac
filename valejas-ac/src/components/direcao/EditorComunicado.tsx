"use client";

/**
 * EDITOR DE COMUNICADOS — Área da Direção
 * ─────────────────────────────────────────────────────────────────
 * Feito para quem não é técnico: título, texto, escolher onde sai,
 * ver como fica, publicar. Sem jargão e sem passos escondidos.
 * ─────────────────────────────────────────────────────────────────
 */

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check, Eye, Loader2, LogOut, Send, X } from "lucide-react";
import clsx from "clsx";

interface Resultado {
  canal:   "facebook" | "instagram";
  ok:      boolean;
  dryRun:  boolean;
  detalhe: string;
}

interface Resposta {
  dryRun:     boolean;
  urlSite:    string;
  imagemUrl:  string;
  resultados: Resultado[];
  avisos:     string[];
}

export default function EditorComunicado() {
  const [titulo, setTitulo]   = useState("");
  const [texto, setTexto]     = useState("");
  const [facebook, setFacebook]   = useState(true);
  const [instagram, setInstagram] = useState(true);

  const [aPublicar, setAPublicar] = useState(false);
  const [erro, setErro]           = useState<string | null>(null);
  const [resposta, setResposta]   = useState<Resposta | null>(null);

  /**
   * O título só chega à pré-visualização meio segundo depois de se
   * parar de escrever. Sem isto, cada tecla pedia uma imagem nova ao
   * servidor, e cada imagem obriga a ir buscar dois ficheiros de
   * tipografia — um título de trinta letras dava trinta renders.
   */
  const [tituloEstavel, setTituloEstavel] = useState("");
  useEffect(() => {
    const t = window.setTimeout(() => setTituloEstavel(titulo), 500);
    return () => window.clearTimeout(t);
  }, [titulo]);

  /** Cartão que vai sair nas redes — leva só o título. */
  const previewUrl = useMemo(() => {
    const t = tituloEstavel.trim() || "Comunicado Oficial";
    // A data fica com o dia, não com o instante: o URL deixa de mudar
    // a cada render e o browser pode aproveitar a imagem em cache.
    const hoje = new Date().toISOString().slice(0, 10);
    return `/api/comunicado-imagem?titulo=${encodeURIComponent(t)}` +
           `&data=${encodeURIComponent(hoje)}`;
  }, [tituloEstavel]);

  const podePublicar = titulo.trim().length >= 5 && texto.trim().length >= 20;

  async function publicar() {
    setErro(null);
    setAPublicar(true);
    try {
      const canais = [
        ...(facebook  ? ["facebook"]  : []),
        ...(instagram ? ["instagram"] : []),
      ];
      const res = await fetch("/api/direcao/publicar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, texto, canais }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErro(json.erro ?? "Não foi possível publicar.");
        return;
      }
      setResposta(json);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErro("Falha de ligação. Tente outra vez.");
    } finally {
      setAPublicar(false);
    }
  }

  async function sair() {
    await fetch("/api/direcao/entrar", { method: "DELETE" });
    window.location.reload();
  }

  function novoComunicado() {
    setTitulo("");
    setTexto("");
    setResposta(null);
    setErro(null);
  }

  /* ── Depois de publicar ── */
  if (resposta) {
    return (
      <div className="space-y-8">
        <div className="bg-surface-high p-8 md:p-10 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow/15 flex items-center justify-center flex-shrink-0">
              <Check size={26} className="text-yellow" />
            </div>
            <h2 className="font-headline font-black text-3xl uppercase tracking-tighter text-on-surface">
              Comunicado publicado
            </h2>
          </div>

          {resposta.dryRun && (
            <div className="flex items-start gap-3 bg-yellow/15 p-4">
              <AlertTriangle size={18} className="text-on-surface flex-shrink-0 mt-0.5" />
              <p className="font-body text-sm text-on-surface-muted leading-relaxed">
                Modo de demonstração: o Facebook e o Instagram ainda não estão
                ligados, por isso nada saiu nas redes. No site ficou guardado.
              </p>
            </div>
          )}

          <ul className="space-y-2">
            <li className="flex items-center gap-2 font-body text-base text-on-surface">
              <Check size={16} className="text-on-surface shrink-0" aria-hidden />
              <span>Site:{" "}
              <a href={resposta.urlSite} className="underline text-on-surface-muted hover:text-yellow">
                ver comunicado
              </a></span>
            </li>
            {resposta.resultados.map((r) => (
              <li key={r.canal} className="flex items-start gap-2 font-body text-base text-on-surface">
                {r.ok
                  ? <Check size={16} className="text-on-surface shrink-0 mt-1" aria-hidden />
                  : <X size={16} className="text-red-500 shrink-0 mt-1" aria-hidden />}
                <span>
                  <span className="capitalize">{r.canal}</span>:{" "}
                  <span className="text-on-surface-muted">{r.detalhe}</span>
                </span>
              </li>
            ))}
          </ul>

          {resposta.avisos.map((a) => (
            <p key={a} className="font-body text-sm text-red-500 leading-relaxed">{a}</p>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <button onClick={novoComunicado} className="btn-primary text-base py-4 px-8">
            Escrever outro
          </button>
          <button onClick={sair} className="btn-ghost text-base py-4 px-8">
            <LogOut size={16} /> Sair
          </button>
        </div>
      </div>
    );
  }

  /* ── Escrever ── */
  return (
    <div className="space-y-8">
      <div className="bg-surface-high p-8 md:p-10 space-y-8">
        <div>
          <label htmlFor="titulo" className="font-body text-sm font-semibold uppercase tracking-widest text-on-surface-muted block mb-3">
            Título
          </label>
          <input
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            maxLength={120}
            autoComplete="off"
            autoCorrect="off"
            spellCheck
            data-1p-ignore
            data-lpignore="true"
            placeholder="Ex.: Assembleia Geral Ordinária"
            className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full text-xl"
          />
          <p className="font-body text-sm text-on-surface-muted mt-2">
            Curto e direto. {120 - titulo.length} caracteres disponíveis.
          </p>
        </div>

        <div>
          <label htmlFor="texto" className="font-body text-sm font-semibold uppercase tracking-widest text-on-surface-muted block mb-3">
            Texto do comunicado
          </label>
          <textarea
            id="texto"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={10}
            autoComplete="off"
            autoCorrect="off"
            spellCheck
            data-1p-ignore
            data-lpignore="true"
            placeholder="Escreva aqui o comunicado. Deixe uma linha em branco para mudar de parágrafo."
            className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full text-lg resize-y leading-relaxed"
          />
          <p className="font-body text-sm text-on-surface-muted mt-2">
            O texto completo fica no site. Nas redes sociais vai na legenda da
            publicação, por baixo da imagem, até 2200 caracteres.
          </p>
        </div>

        <fieldset>
          <legend className="font-body text-sm font-semibold uppercase tracking-widest text-on-surface-muted mb-3">
            Onde vai sair
          </legend>
          <div className="space-y-3">
            <Canal nome="Site do clube" descricao="Sai sempre." fixo />
            <Canal
              nome="Facebook"
              descricao="Na página do clube."
              ativo={facebook}
              onChange={setFacebook}
            />
            <Canal
              nome="Instagram"
              descricao="Com a imagem do emblema — o Instagram não aceita publicações sem imagem."
              ativo={instagram}
              onChange={setInstagram}
            />
          </div>
        </fieldset>
      </div>

      {/* Pré-visualização */}
      <div className="bg-surface-high p-8 md:p-10 space-y-5">
        <div className="flex items-center gap-3">
          <Eye size={18} className="text-yellow" />
          <h2 className="font-headline font-black uppercase text-lg tracking-tight text-on-surface">
            Como vai aparecer nas redes
          </h2>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={previewUrl}
          alt="Pré-visualização da imagem do comunicado"
          className={clsx(
            "w-full max-w-md mx-auto border border-on-surface/10 transition-opacity duration-200",
            tituloEstavel !== titulo && "opacity-50"
          )}
          width={1080}
          height={1080}
        />
        <p className="font-body text-sm text-on-surface-muted text-center">
          A imagem leva só o título. O texto do comunicado sai na legenda,
          por baixo da imagem.
        </p>
      </div>

      {erro && (
        <p className="font-body text-base text-red-500" role="alert">{erro}</p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={publicar}
          disabled={!podePublicar || aPublicar}
          className="btn-primary text-lg py-5 px-10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {aPublicar ? (
            <><Loader2 size={18} className="animate-spin" /> A publicar…</>
          ) : (
            <><Send size={18} /> Publicar</>
          )}
        </button>
        <button onClick={sair} className="btn-ghost text-base py-4 px-8">
          <LogOut size={16} /> Sair
        </button>
      </div>

      {!podePublicar && (
        <p className="font-body text-sm text-on-surface-muted">
          Escreva o título e o texto para poder publicar.
        </p>
      )}
    </div>
  );
}

function Canal({
  nome, descricao, ativo, onChange, fixo,
}: {
  nome: string;
  descricao: string;
  ativo?: boolean;
  onChange?: (v: boolean) => void;
  fixo?: boolean;
}) {
  return (
    <label
      className={clsx(
        "flex items-start gap-3 p-4 border transition-colors duration-200",
        fixo ? "border-on-surface/10 opacity-70" : "cursor-pointer",
        !fixo && ativo ? "border-yellow bg-yellow/10" : !fixo && "border-on-surface/15 hover:border-on-surface/40"
      )}
    >
      <input
        type="checkbox"
        checked={fixo ? true : Boolean(ativo)}
        disabled={fixo}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 w-5 h-5 accent-yellow flex-shrink-0"
      />
      <span>
        <span className="block font-headline font-black uppercase text-base text-on-surface">{nome}</span>
        <span className="block font-body text-sm text-on-surface-muted mt-0.5 leading-relaxed">{descricao}</span>
      </span>
    </label>
  );
}
