"use client";

/**
 * GESTOR DE JOGOS — departamento de comunicação
 * ─────────────────────────────────────────────────────────────────
 * Três blocos: agendar/editar jogos, registar resultados e atualizar
 * a classificação.
 *
 * A classificação tem 20 linhas. Escrever 20 linhas × 8 números à mão
 * todas as semanas seria insuportável, por isso o caminho principal é
 * colar a tabela da AF Lisboa e deixar o site interpretá-la. A edição
 * manual fica como rede de segurança.
 * ─────────────────────────────────────────────────────────────────
 */

import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import { Check, Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { PAVILHAO_CASA } from "@/lib/data/jogos";

interface Jogo {
  _id?:             string;
  adversario:       string;
  data:             string;
  local:            string;
  competicao:       string;
  ehEmCasa:         boolean;
  jogado:           boolean;
  golosNossos?:     number;
  golosAdversario?: number;
}

interface Linha {
  posicao: number;
  equipa: string;
  jogos: number;
  vitorias: number;
  empates: number;
  derrotas: number;
  golosMarcados: number;
  golosSofridos: number;
  pontos: number;
}

const COMPETICOES = [
  "Campeonato Distrital",
  "Taça Distrital",
  "Taça de Portugal",
  "Particular",
];

const JOGO_VAZIO: Jogo = {
  adversario: "",
  data: "",
  local: PAVILHAO_CASA,
  competicao: "Campeonato Distrital",
  ehEmCasa: true,
  jogado: false,
};

/**
 * Lê a tabela colada. Aceita linhas separadas por tabulações (cópia de
 * uma tabela) ou por espaços. A regra: o primeiro número é a posição,
 * os últimos sete são J V E D GM GS P, e o que sobra no meio é o nome.
 */
function lerTabelaColada(texto: string): Linha[] {
  const linhas: Linha[] = [];

  for (const bruta of texto.split("\n")) {
    const linha = bruta.trim();
    if (!linha) continue;

    const campos = linha.includes("\t")
      ? linha.split("\t").map((c) => c.trim()).filter(Boolean)
      : linha.split(/\s+/);

    const numeros = campos.filter((c) => /^-?\d+$/.test(c));
    if (numeros.length < 8) continue; // posição + 7 colunas

    const posicao = Number(numeros[0]);
    const [jogos, vitorias, empates, derrotas, golosMarcados, golosSofridos, pontos] =
      numeros.slice(-7).map(Number);

    // O nome é o que fica entre a posição e o primeiro número da cauda.
    const iniNome = campos.indexOf(numeros[0]) + 1;
    const fimNome = campos.length - 7;
    const equipa = campos.slice(iniNome, fimNome).join(" ").trim();
    if (!equipa) continue;

    linhas.push({
      posicao, equipa, jogos, vitorias, empates, derrotas,
      golosMarcados, golosSofridos, pontos,
    });
  }

  return linhas.sort((a, b) => a.posicao - b.posicao);
}

export default function GestorJogos() {
  const [jogos, setJogos]       = useState<Jogo[]>([]);
  const [linhas, setLinhas]     = useState<Linha[]>([]);
  const [edicao, setEdicao]     = useState<Jogo | null>(null);
  const [colagem, setColagem]   = useState("");
  const [aCarregar, setACarregar] = useState(true);
  const [aGuardar, setAGuardar] = useState(false);
  const [erro, setErro]         = useState<string | null>(null);
  const [aviso, setAviso]       = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setACarregar(true);
    setErro(null);
    try {
      const res = await fetch("/api/direcao/jogos");
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErro(json.erro ?? "Não foi possível ler os dados.");
        return;
      }
      setJogos(json.jogos ?? []);
      setLinhas(json.classificacao?.linhas ?? []);
    } catch {
      setErro("Falha de ligação.");
    } finally {
      setACarregar(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  async function guardarJogo(e: React.FormEvent) {
    e.preventDefault();
    if (!edicao) return;
    setErro(null);
    setAGuardar(true);
    try {
      const res = await fetch("/api/direcao/jogos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(edicao),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErro(json.erro ?? "Não foi possível guardar.");
        return;
      }
      setEdicao(null);
      setAviso("Jogo guardado.");
      await carregar();
    } catch {
      setErro("Falha de ligação.");
    } finally {
      setAGuardar(false);
    }
  }

  async function apagarJogo(id: string, adversario: string) {
    if (!window.confirm(`Apagar o jogo contra ${adversario}?`)) return;
    setErro(null);
    try {
      const res = await fetch(`/api/direcao/jogos?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErro(json.erro ?? "Não foi possível apagar.");
        return;
      }
      setAviso("Jogo apagado.");
      await carregar();
    } catch {
      setErro("Falha de ligação.");
    }
  }

  function interpretarColagem() {
    const lidas = lerTabelaColada(colagem);
    if (lidas.length === 0) {
      setErro("Não consegui ler nenhuma linha. Confirma que cada equipa está numa linha, com os números todos.");
      return;
    }
    setErro(null);
    setLinhas(lidas);
    setAviso(`${lidas.length} equipas lidas. Confere antes de guardar.`);
  }

  async function guardarClassificacao() {
    setErro(null);
    setAGuardar(true);
    try {
      const res = await fetch("/api/direcao/jogos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linhas }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErro(json.erro ?? "Não foi possível guardar.");
        return;
      }
      setAviso(`Classificação guardada — ${json.total} equipas.`);
      setColagem("");
    } catch {
      setErro("Falha de ligação.");
    } finally {
      setAGuardar(false);
    }
  }

  if (aCarregar) {
    return (
      <p className="flex items-center gap-3 font-body text-on-surface-muted py-12">
        <Loader2 size={18} className="animate-spin text-yellow" /> A carregar…
      </p>
    );
  }

  return (
    <div className="space-y-12">
      {/* Mensagens */}
      {erro && (
        <p role="alert" className="font-body text-base text-red-500 border border-red-500/40 bg-red-500/5 p-4">
          {erro}
        </p>
      )}
      {aviso && !erro && (
        <p className="flex items-center gap-3 font-body text-base text-on-surface bg-yellow/15 px-4 py-3">
          <Check size={18} className="text-on-surface flex-shrink-0" /> {aviso}
        </p>
      )}

      {/* ── Jogos ── */}
      <section className="bg-surface-high p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="font-headline font-black uppercase text-2xl tracking-tight text-on-surface">
            Jogos
          </h2>
          {!edicao && (
            <button onClick={() => setEdicao({ ...JOGO_VAZIO })} className="btn-primary text-sm">
              <Plus size={16} /> Novo jogo
            </button>
          )}
        </div>

        {edicao ? (
          <FormularioJogo
            jogo={edicao}
            setJogo={setEdicao}
            onSubmit={guardarJogo}
            aGuardar={aGuardar}
            onCancelar={() => setEdicao(null)}
          />
        ) : jogos.length === 0 ? (
          <p className="font-body text-on-surface-muted py-6">
            Ainda não há jogos. Carrega em “Novo jogo” para agendar o primeiro.
          </p>
        ) : (
          <ul className="divide-y divide-on-surface/10 border-y border-on-surface/10">
            {jogos.map((j) => (
              <li key={j._id} className="py-4 flex flex-wrap items-center gap-4 justify-between">
                <div className="min-w-0">
                  <p className="font-headline font-black uppercase text-base text-on-surface">
                    {j.ehEmCasa ? "Valejas AC" : j.adversario} vs{" "}
                    {j.ehEmCasa ? j.adversario : "Valejas AC"}
                    {j.jogado && (
                      <span className="ml-3 text-yellow">
                        {j.golosNossos}–{j.golosAdversario}
                      </span>
                    )}
                  </p>
                  <p className="font-body text-sm text-on-surface-muted mt-0.5">
                    {new Date(j.data).toLocaleString("pt-PT", {
                      day: "2-digit", month: "2-digit", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                    {j.local ? ` · ${j.local}` : ""}
                    {j.jogado ? "" : " · por jogar"}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setEdicao({ ...j, data: j.data.slice(0, 16) })}
                    className="btn-ghost text-sm"
                    aria-label={`Editar jogo contra ${j.adversario}`}
                  >
                    <Pencil size={14} /> Editar
                  </button>
                  <button
                    onClick={() => j._id && apagarJogo(j._id, j.adversario)}
                    className="btn-ghost text-sm hover:border-red-500 hover:text-red-500"
                    aria-label={`Apagar jogo contra ${j.adversario}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Classificação ── */}
      <section className="bg-surface-high p-6 md:p-8">
        <h2 className="font-headline font-black uppercase text-2xl tracking-tight text-on-surface mb-2">
          Classificação
        </h2>
        <p id="ajuda-colagem" className="font-body text-on-surface-muted leading-relaxed mb-6 max-w-2xl">
          Copia a tabela do site da AF Lisboa e cola aqui. Cada equipa numa linha,
          com a posição à frente e os números a seguir ao nome. O site lê o resto.
        </p>

        <label htmlFor="colagem-classificacao" className="sr-only">
          Tabela de classificação copiada do site da AF Lisboa
        </label>
        <textarea
          id="colagem-classificacao"
          aria-describedby="ajuda-colagem"
          value={colagem}
          onChange={(e) => setColagem(e.target.value)}
          rows={6}
          spellCheck={false}
          placeholder={"1\tNome da Equipa\t10\t8\t0\t2\t42\t14\t24\n2\tOutra Equipa\t10\t7\t1\t2\t38\t16\t22"}
          className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full font-mono text-sm resize-y"
        />

        <div className="flex flex-wrap gap-4 mt-4">
          <button onClick={interpretarColagem} disabled={!colagem.trim()} className="btn-ghost text-sm disabled:opacity-50">
            Ler tabela colada
          </button>
          <button
            onClick={guardarClassificacao}
            disabled={linhas.length === 0 || aGuardar}
            className="btn-primary text-sm disabled:opacity-50"
          >
            {aGuardar ? <><Loader2 size={14} className="animate-spin" /> A guardar…</> : <><Save size={14} /> Guardar classificação</>}
          </button>
        </div>

        {linhas.length > 0 && (
          <div className="mt-8 overflow-x-auto">
            <p className="font-body text-sm text-on-surface-muted mb-3">
              {linhas.length} equipas — confere antes de guardar.
            </p>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-on-surface/20">
                  {["#", "Equipa", "J", "V", "E", "D", "GM", "GS", "P"].map((h) => (
                    <th key={h} className="th-tabela text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {linhas.map((l) => (
                  <tr
                    key={l.posicao}
                    className={clsx(
                      "border-b border-on-surface/10",
                      l.equipa.toLowerCase().includes("valejas") && "bg-yellow/15"
                    )}
                  >
                    <td className="td-tabela text-on-surface-muted">{l.posicao}</td>
                    <td className="td-tabela font-headline font-black uppercase text-sm">{l.equipa}</td>
                    <td className="td-tabela">{l.jogos}</td>
                    <td className="td-tabela">{l.vitorias}</td>
                    <td className="td-tabela">{l.empates}</td>
                    <td className="td-tabela">{l.derrotas}</td>
                    <td className="td-tabela">{l.golosMarcados}</td>
                    <td className="td-tabela">{l.golosSofridos}</td>
                    <td className="td-tabela font-headline font-black">{l.pontos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function FormularioJogo({
  jogo, setJogo, onSubmit, aGuardar, onCancelar,
}: {
  jogo: Jogo;
  setJogo: (j: Jogo) => void;
  onSubmit: (e: React.FormEvent) => void;
  aGuardar: boolean;
  onCancelar: () => void;
}) {
  const set = (campo: keyof Jogo, valor: unknown) => setJogo({ ...jogo, [campo]: valor });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Campo label="Adversário">
          <input
            value={jogo.adversario}
            onChange={(e) => set("adversario", e.target.value)}
            required
            autoComplete="off"
            className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
          />
        </Campo>

        <Campo label="Data e hora">
          <input
            type="datetime-local"
            value={jogo.data}
            onChange={(e) => set("data", e.target.value)}
            required
            className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
          />
        </Campo>

        <Campo label="Local">
          <input
            value={jogo.local}
            onChange={(e) => set("local", e.target.value)}
            autoComplete="off"
            className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
          />
        </Campo>

        <Campo label="Competição">
          <select
            value={jogo.competicao}
            onChange={(e) => set("competicao", e.target.value)}
            className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full bg-surface-high text-on-surface"
          >
            {COMPETICOES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Campo>
      </div>

      <div className="flex flex-wrap gap-6">
        <Interruptor
          label="Jogo em casa"
          ativo={jogo.ehEmCasa}
          onChange={(v) => set("ehEmCasa", v)}
        />
        <Interruptor
          label="Já foi jogado"
          ativo={jogo.jogado}
          onChange={(v) => set("jogado", v)}
        />
      </div>

      {jogo.jogado && (
        <div className="grid grid-cols-2 gap-5 max-w-sm">
          <Campo label="Golos Valejas">
            <input
              type="number" min={0}
              value={jogo.golosNossos ?? 0}
              onChange={(e) => set("golosNossos", Number(e.target.value))}
              className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
            />
          </Campo>
          <Campo label="Golos adversário">
            <input
              type="number" min={0}
              value={jogo.golosAdversario ?? 0}
              onChange={(e) => set("golosAdversario", Number(e.target.value))}
              className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
            />
          </Campo>
        </div>
      )}

      <div className="flex flex-wrap gap-4 pt-2">
        <button type="submit" disabled={aGuardar} className="btn-primary text-sm disabled:opacity-60">
          {aGuardar ? <><Loader2 size={14} className="animate-spin" /> A guardar…</> : <><Save size={14} /> Guardar jogo</>}
        </button>
        <button type="button" onClick={onCancelar} className="btn-ghost text-sm">
          <X size={14} /> Cancelar
        </button>
      </div>
    </form>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}

function Interruptor({
  label, ativo, onChange,
}: {
  label: string;
  ativo: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={ativo}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 accent-yellow"
      />
      <span className="font-body text-base text-on-surface">{label}</span>
    </label>
  );
}
