"use client";

/**
 * RESULTADOS POR JORNADA — departamento de comunicação
 * ─────────────────────────────────────────────────────────────────
 * Escolhe-se a jornada, lançam-se os oito jogos e guarda-se. A
 * classificação recalcula-se sozinha, e aqui vê-se já como fica antes
 * de guardar. O jogo do Valejas vem preenchido com o calendário.
 *
 * Uma jornada que a tabela de base já conta (ver «Classificação»,
 * mais abaixo) pode ser lançada na mesma, para o calendário mostrar
 * o resultado, mas não mexe na tabela — era somar duas vezes.
 * ─────────────────────────────────────────────────────────────────
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { Check, Loader2, Save, Trash2, X } from "lucide-react";
import { CALENDARIO, CLUBE, CLUBES_DA_PROVA, ehValejas, type LinhaClassificacao } from "@/lib/data/jogos";
import { jogoDoClubeNaJornada, recalcular, type ResultadoJornada } from "@/lib/classificacao";

interface Linha { casa: string; fora: string; golosCasa: string; golosFora: string }

const VAZIA: Linha = { casa: "", fora: "", golosCasa: "", golosFora: "" };
const JOGOS_POR_JORNADA = 8;

function linhasDa(jornada: number, guardados: ResultadoJornada[]): Linha[] {
  const daJornada = guardados
    .filter((r) => r.jornada === jornada)
    .map((r) => ({
      casa: r.casa, fora: r.fora,
      golosCasa: String(r.golosCasa), golosFora: String(r.golosFora),
    }));

  // Sem nada guardado, o jogo do Valejas vem do calendário.
  if (daJornada.length === 0) {
    const nosso = jogoDoClubeNaJornada(CALENDARIO, jornada);
    if (nosso) daJornada.push({ casa: nosso.casa, fora: nosso.fora, golosCasa: "", golosFora: "" });
  }
  while (daJornada.length < JOGOS_POR_JORNADA) daJornada.push({ ...VAZIA });
  return daJornada;
}

const completa = (l: Linha) => l.casa && l.fora && l.golosCasa !== "" && l.golosFora !== "";
const vazia    = (l: Linha) => !l.casa && !l.fora && l.golosCasa === "" && l.golosFora === "";

export default function GestorJornadas() {
  const [guardados, setGuardados] = useState<ResultadoJornada[]>([]);
  const [base, setBase]           = useState<LinhaClassificacao[]>([]);
  const [ateJornada, setAteJornada] = useState(0);
  const [jornada, setJornada]     = useState(1);
  const [linhas, setLinhas]       = useState<Linha[]>([]);
  const [aCarregar, setACarregar] = useState(true);
  const [aGuardar, setAGuardar]   = useState(false);
  const [aConfirmarApagar, setAConfirmarApagar] = useState(false);
  const [erro, setErro]           = useState("");
  const [aviso, setAviso]         = useState("");

  const carregar = useCallback(async (escolher?: number) => {
    try {
      const res = await fetch("/api/direcao/jornadas", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok || !json.ok) { setErro(json.erro ?? "Não foi possível ler os resultados."); return; }
      const rs: ResultadoJornada[] = json.resultados ?? [];
      setGuardados(rs);
      setBase(json.linhas ?? []);
      setAteJornada(json.ateJornada ?? 0);
      setErro("");

      // A jornada a mostrar: a que se pediu, ou a primeira depois da base que ainda não está completa.
      const alvo = escolher ?? (() => {
        for (let j = (json.ateJornada ?? 0) + 1; j <= 30; j++) {
          if (rs.filter((r) => r.jornada === j).length < JOGOS_POR_JORNADA) return j;
        }
        return 30;
      })();
      setJornada(alvo);
      setLinhas(linhasDa(alvo, rs));
    } catch {
      setErro("Falha de ligação.");
    } finally {
      setACarregar(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  function mudarJornada(n: number) {
    setJornada(n);
    setLinhas(linhasDa(n, guardados));
    setErro(""); setAviso(""); setAConfirmarApagar(false);
  }

  function mexer(i: number, campo: keyof Linha, valor: string) {
    setLinhas((ls) => ls.map((l, k) => (k === i ? { ...l, [campo]: valor } : l)));
    setAviso("");
  }

  const jogosValidos: ResultadoJornada[] = useMemo(
    () => linhas.filter(completa).map((l) => ({
      jornada, casa: l.casa, fora: l.fora,
      golosCasa: Number(l.golosCasa), golosFora: Number(l.golosFora),
    })),
    [linhas, jornada]
  );

  // Como fica a tabela com o que está no formulário (as outras jornadas guardadas contam).
  const previsao = useMemo(() => {
    const outras = guardados.filter((r) => r.jornada !== jornada);
    return recalcular(base, [...outras, ...jogosValidos], ateJornada);
  }, [base, guardados, jogosValidos, jornada, ateJornada]);

  const jaNaBase = jornada <= ateJornada;
  const usadas = new Set(linhas.flatMap((l) => [l.casa, l.fora]).filter(Boolean));

  async function guardar() {
    setErro(""); setAviso("");
    const meiasLinhas = linhas.filter((l) => !vazia(l) && !completa(l));
    if (meiasLinhas.length) {
      setErro("Há jogos por acabar: cada um precisa das duas equipas e dos dois resultados. Preenche-os ou limpa a linha.");
      return;
    }
    setAGuardar(true);
    try {
      const res = await fetch("/api/direcao/jornadas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jornada, jogos: jogosValidos }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) { setErro(json.erro ?? "Não foi possível guardar."); return; }
      setAviso(`Jornada ${jornada} guardada — ${json.guardados} jogos. A tabela no site já foi atualizada.`);
      await carregar(jornada);
    } catch {
      setErro("Falha de ligação.");
    } finally {
      setAGuardar(false);
    }
  }

  async function apagar() {
    setErro(""); setAviso("");
    try {
      const res = await fetch(`/api/direcao/jornadas?jornada=${jornada}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.ok) { setErro(json.erro ?? "Não foi possível apagar."); return; }
      setAConfirmarApagar(false);
      setAviso(`Resultados da jornada ${jornada} apagados.`);
      await carregar(jornada);
    } catch {
      setErro("Falha de ligação.");
    }
  }

  if (aCarregar) {
    return (
      <p className="flex items-center gap-3 font-body text-on-surface-muted py-6">
        <Loader2 size={18} className="animate-spin text-yellow" /> A carregar…
      </p>
    );
  }

  const nGuardados = guardados.filter((r) => r.jornada === jornada).length;

  return (
    <section aria-labelledby="titulo-jornadas" className="bg-surface-high p-6 md:p-8 space-y-6">
      <header>
        <h2 id="titulo-jornadas" className="font-headline font-black uppercase text-2xl tracking-tight text-on-surface">
          Resultados da <span className="text-yellow">jornada</span>
        </h2>
        <p className="font-body text-on-surface-muted leading-relaxed mt-2 max-w-2xl">
          Lança os jogos da jornada e a classificação recalcula-se sozinha. O jogo do
          Valejas vem do calendário; junta os outros jogos escolhendo as equipas.
        </p>
      </header>

      <div className="flex flex-wrap items-end gap-4">
        <label className="block">
          <span className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block mb-2">Jornada</span>
          <select
            value={jornada}
            onChange={(e) => mudarJornada(Number(e.target.value))}
            className="input-field px-4 border border-on-surface/15 focus:border-yellow appearance-none cursor-pointer"
          >
            {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => {
              const feitos = guardados.filter((r) => r.jornada === n).length;
              return (
                <option key={n} value={n}>
                  Jornada {n}{feitos ? ` · ${feitos} jogos` : ""}
                </option>
              );
            })}
          </select>
        </label>
        <p className="font-body text-sm text-on-surface-muted pb-3">
          {nGuardados ? `${nGuardados} jogos guardados.` : "Nada guardado nesta jornada."}
        </p>
      </div>

      {jaNaBase && (
        <p className="font-body text-sm text-on-surface bg-yellow/15 px-4 py-3 leading-relaxed">
          A tabela de base já conta até à jornada {ateJornada}. Os resultados desta jornada ficam
          registados e aparecem no calendário, mas <strong>não alteram a classificação</strong>.
        </p>
      )}

      <div className="space-y-3">
        {linhas.map((l, i) => {
          const nosso = ehValejas(l.casa) || ehValejas(l.fora);
          return (
            <div
              key={i}
              className={clsx(
                "grid grid-cols-[minmax(0,1fr)_3.5rem_1.5rem_3.5rem_minmax(0,1fr)_2.5rem] items-center gap-2",
                nosso && "bg-yellow/10 -mx-2 px-2 py-1"
              )}
            >
              <ClubeSelect valor={l.casa} usadas={usadas} rotulo={`Jogo ${i + 1}, equipa da casa`} onChange={(v) => mexer(i, "casa", v)} />
              <Golos valor={l.golosCasa} rotulo={`Jogo ${i + 1}, golos da casa`} onChange={(v) => mexer(i, "golosCasa", v)} />
              <span className="text-center text-on-surface-muted" aria-hidden>–</span>
              <Golos valor={l.golosFora} rotulo={`Jogo ${i + 1}, golos do visitante`} onChange={(v) => mexer(i, "golosFora", v)} />
              <ClubeSelect valor={l.fora} usadas={usadas} rotulo={`Jogo ${i + 1}, equipa visitante`} onChange={(v) => mexer(i, "fora", v)} />
              <button
                type="button"
                onClick={() => setLinhas((ls) => ls.map((x, k) => (k === i ? { ...VAZIA } : x)))}
                aria-label={`Limpar o jogo ${i + 1}`}
                className="w-10 h-10 flex items-center justify-center text-on-surface-muted hover:text-red-500"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>

      {erro && <p role="alert" className="font-body text-base text-red-500 border border-red-500/40 bg-red-500/5 p-4">{erro}</p>}
      {aviso && !erro && (
        <p className="flex items-center gap-3 font-body text-base text-on-surface bg-yellow/15 px-4 py-3">
          <Check size={18} className="flex-shrink-0" aria-hidden /> {aviso}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={guardar} disabled={aGuardar} className="btn-primary text-sm disabled:opacity-60">
          {aGuardar ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Guardar jornada {jornada}
        </button>
        {nGuardados > 0 && (
          <button type="button" onClick={() => setAConfirmarApagar(true)} className="btn-ghost text-sm hover:border-red-500 hover:text-red-500">
            <Trash2 size={14} /> Apagar a jornada
          </button>
        )}
      </div>

      {aConfirmarApagar && (
        <div role="alertdialog" className="border-2 border-yellow bg-yellow/10 p-4 flex flex-wrap items-center gap-4">
          <p className="font-body text-sm text-on-surface flex-1 min-w-[12rem]">
            Apagar os {nGuardados} resultados da jornada {jornada}? A classificação volta a ser recalculada sem eles.
          </p>
          <button type="button" onClick={apagar} className="btn-primary text-sm"><Trash2 size={14} /> Sim, apagar</button>
          <button type="button" onClick={() => setAConfirmarApagar(false)} className="btn-ghost text-sm"><X size={14} /> Voltar</button>
        </div>
      )}

      {/* Pré-visualização da tabela */}
      <div className="pt-4">
        <h3 className="font-headline font-black uppercase text-lg tracking-tight text-on-surface mb-1">
          Como fica a classificação
        </h3>
        <p className="font-body text-xs text-on-surface-muted mb-3">
          A pontos iguais, mantém-se a ordem da última tabela oficial. Se um empate novo sair diferente
          da AF Lisboa (confronto direto), corrige à mão em «Classificação», mais abaixo.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-on-surface/20">
                {["#", "Equipa", "J", "V", "E", "D", "GM–GS", "P"].map((h) => (
                  <th key={h} className="th-tabela text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {previsao.map((l) => (
                <tr key={l.equipa} className={clsx("border-b border-on-surface/10", l.equipa === CLUBE && "bg-yellow/15")}>
                  <td className="td-tabela text-on-surface-muted">{l.posicao}</td>
                  <td className="td-tabela font-headline font-black uppercase text-sm">{l.equipa}</td>
                  <td className="td-tabela">{l.jogos}</td>
                  <td className="td-tabela">{l.vitorias}</td>
                  <td className="td-tabela">{l.empates}</td>
                  <td className="td-tabela">{l.derrotas}</td>
                  <td className="td-tabela tabular-nums">{l.golosMarcados}–{l.golosSofridos}</td>
                  <td className="td-tabela font-headline font-black">{l.pontos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function ClubeSelect({
  valor, usadas, rotulo, onChange,
}: { valor: string; usadas: Set<string>; rotulo: string; onChange: (v: string) => void }) {
  return (
    <select
      value={valor}
      aria-label={rotulo}
      onChange={(e) => onChange(e.target.value)}
      className="input-field px-2 border border-on-surface/15 focus:border-yellow w-full min-w-0 text-sm appearance-none cursor-pointer"
    >
      <option value="">—</option>
      {CLUBES_DA_PROVA.map((c) => (
        // Uma equipa só joga uma vez por jornada: as já escolhidas ficam desativadas.
        <option key={c} value={c} disabled={usadas.has(c) && c !== valor}>{c}</option>
      ))}
    </select>
  );
}

function Golos({ valor, rotulo, onChange }: { valor: string; rotulo: string; onChange: (v: string) => void }) {
  return (
    <input
      value={valor}
      aria-label={rotulo}
      inputMode="numeric"
      onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 2))}
      className="input-field px-1 border border-on-surface/15 focus:border-yellow w-full text-center tabular-nums"
    />
  );
}
