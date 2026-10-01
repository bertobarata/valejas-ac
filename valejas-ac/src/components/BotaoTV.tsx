"use client";

/**
 * BOTÃO TV
 * ─────────────────────────────────────────────────────────────────
 * Com direto a decorrer: leva diretamente ao vídeo, e leva um ponto
 * vermelho a piscar para se ver de longe que há jogo.
 * Sem direto: abre um aviso pequeno a dizer que não estamos em live,
 * com o canal ao lado para quem quiser ver os vídeos antigos.
 *
 * O estado vem de /api/tv, que pergunta ao YouTube de 2 em 2 minutos.
 * Enquanto não responde, o botão comporta-se como "sem direto" — é
 * o que acontece na grande maioria das vezes.
 * ─────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from "react";
import { Tv } from "lucide-react";
import clsx from "clsx";
import type { EstadoTV } from "@/lib/tv";
import { useTranslations } from "next-intl";

export default function BotaoTV({ className, grande = false }: { className?: string; grande?: boolean }) {
  const t = useTranslations("comum.tv");
  const [estado, setEstado] = useState<EstadoTV | null>(null);
  const [avisoAberto, setAvisoAberto] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelado = false;
    fetch("/api/tv")
      .then((r) => (r.ok ? r.json() : null))
      .then((dados: EstadoTV | null) => { if (!cancelado && dados) setEstado(dados); })
      .catch(() => {});
    return () => { cancelado = true; };
  }, []);

  // O aviso fecha ao tocar fora ou com Escape, como o submenu do clube.
  useEffect(() => {
    if (!avisoAberto) return;
    const fora = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setAvisoAberto(false);
    };
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape") setAvisoAberto(false); };
    document.addEventListener("pointerdown", fora);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", fora);
      document.removeEventListener("keydown", escape);
    };
  }, [avisoAberto]);

  const tamanho = grande ? 18 : 14;
  const classes = clsx(
    "btn-barra",
    grande ? "w-full justify-center !text-base !py-3" : undefined
  );

  if (estado?.live) {
    return (
      <a
        href={estado.url}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(classes, className)}
        aria-label={t("verDireto")}
      >
        <span className="w-2 h-2 rounded-full bg-red animate-pulse-live" aria-hidden />
        <Tv size={tamanho} aria-hidden />
        TV
      </a>
    );
  }

  return (
    <div ref={ref} className={clsx("relative", grande && "w-full", className)}>
      <button
        type="button"
        onClick={() => setAvisoAberto((a) => !a)}
        aria-expanded={avisoAberto}
        aria-controls="aviso-tv"
        className={classes}
      >
        <Tv size={tamanho} aria-hidden />
        TV
      </button>

      <div
        id="aviso-tv"
        role="status"
        className={clsx(
          "absolute right-0 top-full mt-3 w-64 bg-surface border border-on-surface/10 shadow-ambient p-4 z-50",
          "transition-all duration-200",
          grande && "left-0 right-0 w-auto bottom-full top-auto mb-3 mt-0",
          avisoAberto
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-1 pointer-events-none"
        )}
      >
        <p className="font-headline font-black uppercase tracking-tight text-on-surface">
          {t("semDireto")}
        </p>
        <p className="font-body text-sm text-on-surface-muted mt-1">
          {t("explicacao")}
        </p>
        <a
          href={estado?.url ?? "https://youtube.com/@valejastv"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-body text-sm font-semibold text-yellow mt-3 hover:underline"
        >
          {t("verCanal")} →
        </a>
      </div>
    </div>
  );
}
