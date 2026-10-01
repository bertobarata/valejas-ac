"use client";

/**
 * COMUNICADOS PUBLICADOS — Área da Direção
 * ─────────────────────────────────────────────────────────────────
 * Lista o que está no site e deixa apagar. Apagar tira o comunicado
 * do site; as publicações no Facebook e no Instagram ficam, e o aviso
 * diz isso antes de confirmar.
 * ─────────────────────────────────────────────────────────────────
 */

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";

interface Item {
  _id:    string;
  titulo: string;
  data:   string;
  canais?: string[];
  slug?:  string;
}

const dataLegivel = (iso: string) =>
  new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "long", timeZone: "Europe/Lisbon",
  }).format(new Date(iso));

export default function GestorComunicados() {
  const [itens, setItens]         = useState<Item[] | null>(null);
  const [erro, setErro]           = useState<string | null>(null);
  const [aConfirmar, setAConfirmar] = useState<string | null>(null);
  const [aApagar, setAApagar]     = useState(false);

  const carregar = useCallback(async () => {
    try {
      const res  = await fetch("/api/direcao/comunicados", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErro(json.erro ?? "Não foi possível ler os comunicados.");
        return;
      }
      setErro(null);
      setItens(json.comunicados);
    } catch {
      setErro("Falha de ligação. Tente outra vez.");
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  async function apagar(id: string) {
    setAApagar(true);
    setErro(null);
    try {
      const res  = await fetch(`/api/direcao/comunicados?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErro(json.erro ?? "Não foi possível apagar.");
        return;
      }
      setAConfirmar(null);
      await carregar();
    } catch {
      setErro("Falha de ligação. Tente outra vez.");
    } finally {
      setAApagar(false);
    }
  }

  return (
    <section aria-labelledby="titulo-publicados" className="bg-surface-high p-8 md:p-10 space-y-6">
      <h2
        id="titulo-publicados"
        className="font-headline font-black uppercase text-lg tracking-tight text-on-surface"
      >
        Comunicados no site
      </h2>

      {erro && <p className="font-body text-base text-red-500" role="alert">{erro}</p>}

      {itens === null && !erro && (
        <p className="font-body text-sm text-on-surface-muted flex items-center gap-2">
          <Loader2 size={16} className="animate-spin" /> A carregar…
        </p>
      )}

      {itens?.length === 0 && (
        <p className="font-body text-sm text-on-surface-muted">Ainda não há comunicados.</p>
      )}

      <ul className="space-y-3">
        {itens?.map((c) => (
          <li key={c._id} className="border border-on-surface/15 p-4 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-headline font-black uppercase text-base text-on-surface leading-tight break-words">
                  {c.titulo}
                </p>
                <p className="font-body text-sm text-on-surface-muted mt-1">
                  {dataLegivel(c.data)}
                  {c.canais?.some((x) => x !== "site") &&
                    ` · também em ${c.canais
                      .filter((x) => x !== "site")
                      .map((x) => (x === "facebook" ? "Facebook" : "Instagram"))
                      .join(" e ")}`}
                </p>
              </div>
              <button
                onClick={() => setAConfirmar(c._id)}
                disabled={aApagar}
                aria-label={`Apagar o comunicado ${c.titulo}`}
                className="btn-ghost text-sm shrink-0"
              >
                <Trash2 size={16} /> Apagar
              </button>
            </div>

            {aConfirmar === c._id && (
              <div role="alertdialog" className="border-2 border-yellow bg-yellow/10 p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={18} className="text-on-surface shrink-0 mt-0.5" aria-hidden />
                  <p className="font-body text-base text-on-surface-muted leading-relaxed">
                    <strong className="text-on-surface">Apagar do site?</strong> Isto
                    não se desfaz. As publicações no Facebook e no Instagram, se
                    existirem, <strong className="text-on-surface">não são apagadas</strong>:
                    é preciso ir às redes e apagar à mão.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => apagar(c._id)}
                    disabled={aApagar}
                    className="btn-primary text-base py-3 px-6 disabled:opacity-50"
                  >
                    {aApagar
                      ? <><Loader2 size={16} className="animate-spin" /> A apagar…</>
                      : <><Trash2 size={16} /> Sim, apagar</>}
                  </button>
                  <button
                    onClick={() => setAConfirmar(null)}
                    disabled={aApagar}
                    className="btn-ghost text-base py-3 px-6"
                  >
                    <X size={16} /> Voltar atrás
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
