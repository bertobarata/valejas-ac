"use client";

/**
 * FORMULÁRIO — PROPOSTA DE SÓCIO
 * ─────────────────────────────────────────────────────────────────
 * Espelha a ficha de papel do clube, em passos para caber no telemóvel.
 * Valida do lado do cliente para dar resposta imediata; a API revalida
 * tudo antes de enviar seja o que for.
 * ─────────────────────────────────────────────────────────────────
 */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ArrowLeft, ArrowRight, Check, Loader2, Send, Upload, X } from "lucide-react";
import {
  ESTADOS_CIVIS, SEXOS, PARENTESCOS, type PropostaSocio,
} from "@/lib/data/inscricao";
import {
  PERIODICIDADES, QUOTA_MENSAL, METODOS_PAGAMENTO, DADOS_BANCARIOS,
  metodosAtivos, valorPorCobranca, taxaDoMetodo, temTaxa, totalAPagar,
  formatEuros, type Periodicidade,
} from "@/lib/data/quota";
import {
  validarNIF, validarCC, validarCodigoPostal, validarTelemovel,
  validarTelefoneFixo, validarEmail, validarDataNascimento,
  validarValidadeCC, validarNomeCompleto, eMenor, calcularIdade,
} from "@/lib/validacao";

type Campos = Record<keyof PropostaSocio, string>;

interface ReferenciaMB {
  entidade:   string;
  referencia: string;
  valor:      number;
  expiraEm:   string;
  orderId:    string;
}

type EstadoPag =
  | "inativo"        // ainda não tentou pagar
  | "aguarda"        // pedido enviado, à espera da app
  | "pago"
  | "recusado"
  | "expirado"
  | "indisponivel"   // gateway não configurado — cai para manual
  | "erro";

const VAZIO: Campos = {
  nome: "", dataNascimento: "", sexo: "", estadoCivil: "", naturalidade: "",
  nacionalidade: "Portuguesa", nomePai: "", nomeMae: "", morada: "",
  codigoPostal: "", localidade: "", email: "", telemovel: "", telefoneFixo: "",
  cc: "", ccValidade: "", nif: "", profissao: "", proponente: "",
  periodicidade: "anual", metodoPagamento: "", iban: "", ibanTitular: "",
  eeNome: "", eeParentesco: "", eeCC: "", eeTelemovel: "", eeEmail: "",
};

/** Regras por campo. Devolve mensagem de erro ou null. */
function erroDoCampo(campo: keyof PropostaSocio, v: string, menor: boolean): string | null {
  const vazio = !v.trim();
  const obrigatorio = (msg = "Campo obrigatório.") => (vazio ? msg : null);

  switch (campo) {
    case "nome":
      return obrigatorio() ?? (validarNomeCompleto(v) ? null : "Escreve o nome completo.");
    case "dataNascimento":
      return obrigatorio() ?? (validarDataNascimento(v) ? null : "Data inválida.");
    case "sexo":
    case "estadoCivil":
    case "naturalidade":
    case "nacionalidade":
    case "nomePai":
    case "nomeMae":
    case "morada":
    case "localidade":
      return obrigatorio();
    case "codigoPostal":
      return obrigatorio() ?? (validarCodigoPostal(v) ? null : "Formato 0000-000.");
    case "email":
      return obrigatorio() ?? (validarEmail(v) ? null : "Email inválido.");
    case "telemovel":
      return obrigatorio() ?? (validarTelemovel(v) ? null : "Telemóvel português inválido.");
    case "telefoneFixo":
      return validarTelefoneFixo(v) ? null : "Telefone fixo inválido.";
    case "cc":
      return obrigatorio() ?? (validarCC(v) ? null : "Número de CC inválido (8 dígitos + dígito + 2 letras + dígito).");
    case "ccValidade":
      return obrigatorio() ?? (validarValidadeCC(v) ? null : "Cartão fora de validade.");
    case "nif":
      return obrigatorio() ?? (validarNIF(v) ? null : "NIF inválido.");
    case "metodoPagamento":
      return obrigatorio("Escolhe um método.");
    case "iban":
      return /^PT50\d{21}$/.test(v.replace(/\s/g, "").toUpperCase()) ? null : "IBAN português inválido.";
    case "ibanTitular":
      return obrigatorio();
    case "eeNome":
      return menor ? obrigatorio() : null;
    case "eeParentesco":
      return menor ? obrigatorio() : null;
    case "eeCC":
      return menor ? (obrigatorio() ?? (validarCC(v) ? null : "Número de CC inválido.")) : null;
    case "eeTelemovel":
      return menor ? (obrigatorio() ?? (validarTelemovel(v) ? null : "Telemóvel inválido.")) : null;
    case "eeEmail":
      return menor ? (obrigatorio() ?? (validarEmail(v) ? null : "Email inválido.")) : null;
    default:
      return null;
  }
}

const PASSOS = ["Identificação", "Contactos", "Documentos", "Quota", "Pagamento"] as const;

export default function PropostaSocioForm() {
  const [passo, setPasso]       = useState(0);
  const [campos, setCampos]     = useState<Campos>(VAZIO);
  const [tocados, setTocados]   = useState<Partial<Record<keyof PropostaSocio, boolean>>>({});
  const [foto, setFoto]         = useState<File | null>(null);
  const [rgpd, setRgpd]         = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado]   = useState(false);
  const [erros, setErros]       = useState<string[]>([]);

  // Pagamento MB WAY com confirmação automática
  const [estadoPag, setEstadoPag] = useState<EstadoPag>("inativo");
  const [pagoPor, setPagoPor]     = useState<"mbway" | "manual" | null>(null);
  const [refMB, setRefMB]         = useState<ReferenciaMB | null>(null);
  const [refErro, setRefErro]     = useState<string | null>(null);

  const menor  = useMemo(() => eMenor(campos.dataNascimento), [campos.dataNascimento]);
  const idade  = useMemo(() => calcularIdade(campos.dataNascimento), [campos.dataNascimento]);
  const metodos = useMemo(() => metodosAtivos(), []);
  const precisaIban = campos.metodoPagamento === "debito-direto";

  // A referência Multibanco é gerada quando o sócio chega ao pagamento.
  useEffect(() => {
    if (passo !== 4 || campos.metodoPagamento !== "referencia" || refMB) return;

    let cancelado = false;
    setRefErro(null);

    (async () => {
      try {
        const res = await fetch("/api/pagamento/referencia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ periodicidade: campos.periodicidade, metodo: "referencia" }),
        });
        const json = await res.json();
        if (cancelado) return;
        if (!res.ok || !json.ok) {
          setRefErro(
            res.status === 503
              ? "A referência automática ainda não está ativa. O clube envia-ta por email."
              : json.erro ?? "Não foi possível gerar a referência."
          );
          return;
        }
        setRefMB(json as ReferenciaMB);
      } catch {
        if (!cancelado) setRefErro("Falha de ligação ao gerar a referência.");
      }
    })();

    return () => { cancelado = true; };
  }, [passo, campos.metodoPagamento, campos.periodicidade, refMB]);

  function set(campo: keyof PropostaSocio, valor: string) {
    setCampos((c) => ({ ...c, [campo]: valor }));
  }

  function marcar(campo: keyof PropostaSocio) {
    setTocados((t) => ({ ...t, [campo]: true }));
  }

  function erro(campo: keyof PropostaSocio): string | null {
    if (!tocados[campo]) return null;
    return erroDoCampo(campo, campos[campo], menor);
  }

  /** Campos de cada passo — usado para bloquear o avanço. */
  const camposDoPasso: (keyof PropostaSocio)[][] = [
    ["nome", "dataNascimento", "sexo", "estadoCivil", "naturalidade", "nacionalidade", "nomePai", "nomeMae"],
    ["morada", "codigoPostal", "localidade", "email", "telemovel", "telefoneFixo"],
    ["cc", "ccValidade", "nif"],
    precisaIban
      ? ["metodoPagamento", "iban", "ibanTitular"]
      : ["metodoPagamento"],
    [], // Pagamento — sem campos, só ações
  ];

  const camposEE: (keyof PropostaSocio)[] = ["eeNome", "eeParentesco", "eeCC", "eeTelemovel", "eeEmail"];

  function passoValido(n: number): boolean {
    const lista = [...camposDoPasso[n]];
    if (n === 2 && menor) lista.push(...camposEE);
    return lista.every((c) => !erroDoCampo(c, campos[c], menor));
  }

  function avancar() {
    const lista = [...camposDoPasso[passo]];
    if (passo === 2 && menor) lista.push(...camposEE);
    setTocados((t) => ({ ...t, ...Object.fromEntries(lista.map((c) => [c, true])) }));

    if (passo === 3 && !rgpd) {
      setErros(["É preciso autorizar o tratamento dos dados para continuar."]);
      return;
    }
    setErros([]);

    if (passoValido(passo)) {
      setPasso((p) => Math.min(p + 1, PASSOS.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function recuar() {
    setPasso((p) => Math.max(p - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /** Envia a ficha para o clube. Só corre depois de resolvido o pagamento. */
  async function finalizar(estadoPagamento: string, orderId?: string) {
    setErros([]);
    setEnviando(true);
    try {
      const fd = new FormData();
      Object.entries(campos).forEach(([k, v]) => fd.append(k, v));
      fd.append("rgpd", "on");
      fd.append("estadoPagamento", estadoPagamento);
      if (orderId) fd.append("orderId", orderId);
      if (foto) fd.append("fotografia", foto);

      const res = await fetch("/api/inscricao", { method: "POST", body: fd });
      const json = await res.json();

      if (!res.ok || !json.ok) {
        setErros(json.erros ?? ["Não foi possível enviar. Tenta novamente."]);
        return;
      }
      setEnviado(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErros(["Falha de ligação. Verifica a internet e tenta novamente."]);
    } finally {
      setEnviando(false);
    }
  }

  /**
   * Pede o pagamento MB WAY e fica a perguntar o estado ao gateway até
   * o sócio confirmar na app. Se o gateway não estiver ligado, cai para
   * pagamento manual em vez de rebentar.
   */
  async function pagarComMBWay() {
    setErros([]);
    setEstadoPag("aguarda");

    let requestId = "";
    let orderId = "";
    try {
      const res = await fetch("/api/pagamento/mbway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          telemovel: campos.telemovel,
          email: menor ? campos.eeEmail : campos.email,
          periodicidade: campos.periodicidade,
          metodo: "mbway",
        }),
      });
      const json = await res.json();

      if (res.status === 503) {
        setEstadoPag("indisponivel");
        return;
      }
      if (!res.ok || !json.ok) {
        setEstadoPag("erro");
        setErros([json.erro ?? "Não foi possível iniciar o pagamento."]);
        return;
      }
      requestId = json.requestId;
      orderId = json.orderId;
    } catch {
      setEstadoPag("erro");
      setErros(["Falha de ligação ao serviço de pagamento."]);
      return;
    }

    // O sócio tem até 4 minutos para confirmar na app.
    const limite = Date.now() + 4 * 60 * 1000;
    while (Date.now() < limite) {
      await new Promise((r) => setTimeout(r, 3000));
      try {
        const r = await fetch(`/api/pagamento/mbway?requestId=${encodeURIComponent(requestId)}`);
        const j = await r.json();
        if (j?.estado === "pago") {
          setEstadoPag("pago");
          setPagoPor("mbway");
          await finalizar("pago", orderId);
          return;
        }
        if (j?.estado === "recusado" || j?.estado === "expirado") {
          setEstadoPag(j.estado === "expirado" ? "expirado" : "recusado");
          return;
        }
      } catch {
        // Falha pontual de rede não interrompe a espera.
      }
    }
    setEstadoPag("expirado");
  }

  if (enviado) {
    return (
      <InscricaoConcluida
        nome={campos.nome}
        periodicidade={campos.periodicidade as Periodicidade}
        metodo={campos.metodoPagamento}
        pago={pagoPor === "mbway"}
      />
    );
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-10" noValidate>
      <Passos atual={passo} />

      {/* ── Passo 1 — Identificação ── */}
      {passo === 0 && (
        <Bloco titulo="Quem és">
          <Campo label="Nome completo" campo="nome" valor={campos.nome} erro={erro("nome")}
                 set={set} marcar={marcar} autoComplete="name" larga />
          <Campo label="Data de nascimento" campo="dataNascimento" tipo="date"
                 valor={campos.dataNascimento} erro={erro("dataNascimento")} set={set} marcar={marcar} />
          <Seletor label="Sexo" campo="sexo" valor={campos.sexo} erro={erro("sexo")} set={set} marcar={marcar}
                   opcoes={SEXOS.map((s) => ({ valor: s.valor, label: `${s.valor} — ${s.label}` }))} />
          <Seletor label="Estado civil" campo="estadoCivil" valor={campos.estadoCivil} erro={erro("estadoCivil")}
                   set={set} marcar={marcar} opcoes={ESTADOS_CIVIS.map((e) => ({ valor: e, label: e }))} />
          <Campo label="Naturalidade" campo="naturalidade" valor={campos.naturalidade} erro={erro("naturalidade")}
                 set={set} marcar={marcar} dica="Concelho onde nasceste" />
          <Campo label="Nacionalidade" campo="nacionalidade" valor={campos.nacionalidade}
                 erro={erro("nacionalidade")} set={set} marcar={marcar} />
          <Campo label="Nome do pai" campo="nomePai" valor={campos.nomePai} erro={erro("nomePai")}
                 set={set} marcar={marcar} larga />
          <Campo label="Nome da mãe" campo="nomeMae" valor={campos.nomeMae} erro={erro("nomeMae")}
                 set={set} marcar={marcar} larga />
        </Bloco>
      )}

      {/* ── Passo 2 — Contactos ── */}
      {passo === 1 && (
        <Bloco titulo="Onde te encontramos">
          <Campo label="Morada" campo="morada" valor={campos.morada} erro={erro("morada")}
                 set={set} marcar={marcar} autoComplete="street-address" larga />
          <Campo label="Código postal" campo="codigoPostal" valor={campos.codigoPostal}
                 erro={erro("codigoPostal")} set={set} marcar={marcar} placeholder="0000-000" />
          <Campo label="Localidade" campo="localidade" valor={campos.localidade} erro={erro("localidade")}
                 set={set} marcar={marcar} />
          <Campo label="Email" campo="email" tipo="email" valor={campos.email} erro={erro("email")}
                 set={set} marcar={marcar} autoComplete="email" larga
                 dica="É por aqui que o clube confirma a proposta" />
          <Campo label="Telemóvel" campo="telemovel" tipo="tel" valor={campos.telemovel}
                 erro={erro("telemovel")} set={set} marcar={marcar} placeholder="9xx xxx xxx" />
          <Campo label="Telefone fixo" campo="telefoneFixo" tipo="tel" valor={campos.telefoneFixo}
                 erro={erro("telefoneFixo")} set={set} marcar={marcar} opcional />
        </Bloco>
      )}

      {/* ── Passo 3 — Documentos ── */}
      {passo === 2 && (
        <>
          <Bloco titulo="Documentos">
            <Campo label="Nº Cartão de Cidadão" campo="cc" valor={campos.cc} erro={erro("cc")}
                   set={set} marcar={marcar} placeholder="12345678 9 ZZ4" />
            <Campo label="Validade do Cartão de Cidadão" campo="ccValidade" tipo="date"
                   valor={campos.ccValidade} erro={erro("ccValidade")} set={set} marcar={marcar} />
            <Campo label="Nº de contribuinte (NIF)" campo="nif" valor={campos.nif} erro={erro("nif")}
                   set={set} marcar={marcar} placeholder="000000000" />
            <Campo label="Profissão" campo="profissao" valor={campos.profissao} erro={null}
                   set={set} marcar={marcar} opcional />
            <FotoUpload foto={foto} setFoto={setFoto} />
          </Bloco>

          {menor && (
            <Bloco
              titulo="Encarregado de Educação"
              nota={`O candidato tem ${idade} anos. Por lei, quem autoriza o tratamento dos dados é o responsável legal.`}
            >
              <Campo label="Nome completo" campo="eeNome" valor={campos.eeNome} erro={erro("eeNome")}
                     set={set} marcar={marcar} larga />
              <Seletor label="Parentesco" campo="eeParentesco" valor={campos.eeParentesco}
                       erro={erro("eeParentesco")} set={set} marcar={marcar}
                       opcoes={PARENTESCOS.map((p) => ({ valor: p, label: p }))} />
              <Campo label="Nº Cartão de Cidadão" campo="eeCC" valor={campos.eeCC} erro={erro("eeCC")}
                     set={set} marcar={marcar} />
              <Campo label="Telemóvel" campo="eeTelemovel" tipo="tel" valor={campos.eeTelemovel}
                     erro={erro("eeTelemovel")} set={set} marcar={marcar} />
              <Campo label="Email" campo="eeEmail" tipo="email" valor={campos.eeEmail} erro={erro("eeEmail")}
                     set={set} marcar={marcar} larga />
            </Bloco>
          )}
        </>
      )}

      {/* ── Passo 4 — Quota e pagamento ── */}
      {passo === 3 && (
        <>
          <Bloco titulo="Quota" nota={`A quota do clube é de ${formatEuros(QUOTA_MENSAL)} por mês, igual para todos os sócios.`}>
            <fieldset className="sm:col-span-2">
              <legend className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">
                De quanto em quanto tempo queres pagar?
              </legend>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {PERIODICIDADES.map((p) => {
                  const ativo = campos.periodicidade === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => set("periodicidade", p.id)}
                      aria-pressed={ativo}
                      className={clsx(
                        "text-left p-4 border transition-colors duration-200",
                        ativo
                          ? "border-yellow bg-yellow/10"
                          : "border-on-surface/15 hover:border-on-surface/40"
                      )}
                    >
                      <span className="block font-headline font-black uppercase text-sm text-on-surface">
                        {p.nome}
                      </span>
                      <span className="block font-headline font-black text-2xl text-yellow mt-1">
                        {formatEuros(valorPorCobranca(p.id))}
                      </span>
                      <span className="block font-body text-xs text-on-surface-muted mt-1">
                        {p.nota}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </Bloco>

          <Bloco titulo="Como queres pagar">
            <fieldset className="sm:col-span-2 space-y-3">
              {metodos.map((m) => {
                const ativo = campos.metodoPagamento === m.id;
                return (
                  <label
                    key={m.id}
                    className={clsx(
                      "flex items-start gap-3 p-4 border cursor-pointer transition-colors duration-200",
                      ativo ? "border-yellow bg-yellow/10" : "border-on-surface/15 hover:border-on-surface/40"
                    )}
                  >
                    <input
                      type="radio"
                      name="metodoPagamento"
                      value={m.id}
                      checked={ativo}
                      onChange={() => { set("metodoPagamento", m.id); marcar("metodoPagamento"); }}
                      className="mt-1 w-4 h-4 accent-yellow flex-shrink-0"
                    />
                    <span>
                      <span className="block font-headline font-black uppercase text-sm text-on-surface">
                        {m.nome}
                      </span>
                      <span className="block font-body text-sm text-on-surface-muted mt-0.5">
                        {m.descricao}
                      </span>
                      {temTaxa(m.id) && (
                        <span className="block font-body text-xs text-on-surface-muted mt-1.5">
                          Acresce {formatEuros(taxaDoMetodo(m.id, valorPorCobranca(campos.periodicidade as Periodicidade)))} de
                          taxa de pagamento online.
                        </span>
                      )}
                    </span>
                  </label>
                );
              })}
              {erro("metodoPagamento") && (
                <p className="font-body text-sm text-red-500">{erro("metodoPagamento")}</p>
              )}
            </fieldset>

            {precisaIban && (
              <>
                <Campo label="IBAN" campo="iban" valor={campos.iban} erro={erro("iban")}
                       set={set} marcar={marcar} placeholder="PT50 0000 0000 0000 0000 0000 0" larga />
                <Campo label="Titular da conta" campo="ibanTitular" valor={campos.ibanTitular}
                       erro={erro("ibanTitular")} set={set} marcar={marcar} larga />
              </>
            )}

            <Campo label="Proposto por" campo="proponente" valor={campos.proponente} erro={null}
                   set={set} marcar={marcar} opcional larga
                   dica="Nome de um sócio que te apresenta ao clube, se houver" />
          </Bloco>

          {/* Consentimento */}
          <div className="bg-surface-high p-6 space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={rgpd}
                onChange={(e) => setRgpd(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-yellow flex-shrink-0"
              />
              <span className="font-body text-sm text-on-surface-muted leading-relaxed">
                {menor
                  ? "Enquanto Encarregado de Educação, autorizo o tratamento dos dados acima para efeitos de inscrição como sócio do Valejas Atlético Clube."
                  : "Autorizo o tratamento dos meus dados para efeitos de inscrição como sócio do Valejas Atlético Clube."}{" "}
                Os dados seguem por email para o clube e são usados para preencher a ficha de sócio e emitir o cartão.{" "}
                <Link href="/privacidade" className="text-yellow underline">
                  Política de Privacidade
                </Link>
                .
              </span>
            </label>

            <p className="font-body text-xs text-on-surface-muted leading-relaxed bg-surface p-4">
              Esta é uma <strong>proposta</strong>, não uma admissão. A Direção analisa-a em reunião
              e entra em contacto contigo. Só depois disso é que há pagamento a fazer.
            </p>
          </div>
        </>
      )}

      {/* ── Passo 5 — Pagamento ── */}
      {passo === 4 && (
        <PassoPagamento
          metodo={campos.metodoPagamento}
          periodicidade={campos.periodicidade as Periodicidade}
          nome={campos.nome}
          estado={estadoPag}
          enviando={enviando}
          onPagarMBWay={pagarComMBWay}
          onPagamentoManual={() => { setPagoPor("manual"); finalizar("pendente", refMB?.orderId); }}
          referencia={refMB}
          referenciaErro={refErro}
        />
      )}

      {/* Erros de submissão */}
      {erros.length > 0 && (
        <div role="alert" className="border border-red-500/50 bg-red-500/5 p-4 space-y-1">
          {erros.map((e) => (
            <p key={e} className="font-body text-sm text-red-500">{e}</p>
          ))}
        </div>
      )}

      {/* Navegação */}
      <div className="flex items-center justify-between gap-4 pt-2">
        {passo > 0 ? (
          <button type="button" onClick={recuar} className="btn-ghost text-sm">
            <ArrowLeft size={14} /> Voltar
          </button>
        ) : <span />}

        {passo < PASSOS.length - 1 && (
          <button type="button" onClick={avancar} className="btn-primary text-sm">
            {passo === 3 ? "Ir para pagamento" : "Continuar"} <ArrowRight size={14} />
          </button>
        )}
      </div>
    </form>
  );
}

/* ── Sub-componentes ─────────────────────────────────────────── */

function Passos({ atual }: { atual: number }) {
  return (
    <ol className="flex items-center gap-2" aria-label="Progresso">
      {PASSOS.map((nome, i) => (
        <li key={nome} className="flex-1">
          <div
            className={clsx(
              "h-1 transition-colors duration-300",
              i <= atual ? "bg-yellow" : "bg-on-surface/15"
            )}
          />
          <span
            className={clsx(
              "block mt-2 font-body text-[0.7rem] uppercase tracking-widest",
              i === atual ? "text-yellow font-semibold" : "text-on-surface-muted"
            )}
          >
            {nome}
          </span>
        </li>
      ))}
    </ol>
  );
}

function Bloco({ titulo, nota, children }: { titulo: string; nota?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-headline font-black text-2xl md:text-3xl uppercase tracking-tighter text-on-surface">
          {titulo}
        </h2>
        {nota && (
          <p className="font-body text-sm text-on-surface-muted mt-2 max-w-xl leading-relaxed">{nota}</p>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{children}</div>
    </section>
  );
}

interface CampoProps {
  label: string;
  campo: keyof PropostaSocio;
  valor: string;
  erro: string | null;
  set: (c: keyof PropostaSocio, v: string) => void;
  marcar: (c: keyof PropostaSocio) => void;
  tipo?: string;
  placeholder?: string;
  dica?: string;
  opcional?: boolean;
  larga?: boolean;
  autoComplete?: string;
}

function Campo({
  label, campo, valor, erro, set, marcar,
  tipo = "text", placeholder, dica, opcional, larga, autoComplete,
}: CampoProps) {
  const id = `campo-${campo}`;
  return (
    <div className={clsx(larga && "sm:col-span-2")}>
      <label htmlFor={id} className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block mb-2">
        {label} {opcional ? <span className="normal-case tracking-normal opacity-60">(opcional)</span> : "*"}
      </label>
      <input
        id={id}
        name={campo}
        type={tipo}
        value={valor}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(erro)}
        aria-describedby={erro ? `${id}-erro` : dica ? `${id}-dica` : undefined}
        onChange={(e) => set(campo, e.target.value)}
        onBlur={() => marcar(campo)}
        className={clsx(
          "input-field px-4 border w-full",
          erro ? "border-red-500 focus:border-red-500" : "border-on-surface/15 focus:border-yellow"
        )}
      />
      {erro ? (
        <p id={`${id}-erro`} className="font-body text-xs text-red-500 mt-1.5">{erro}</p>
      ) : dica ? (
        <p id={`${id}-dica`} className="font-body text-xs text-on-surface-muted mt-1.5">{dica}</p>
      ) : null}
    </div>
  );
}

function Seletor({
  label, campo, valor, erro, set, marcar, opcoes,
}: Omit<CampoProps, "tipo" | "placeholder" | "dica" | "opcional" | "larga" | "autoComplete"> & {
  opcoes: { valor: string; label: string }[];
}) {
  const id = `campo-${campo}`;
  return (
    <div>
      <label htmlFor={id} className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block mb-2">
        {label} *
      </label>
      <select
        id={id}
        name={campo}
        value={valor}
        aria-invalid={Boolean(erro)}
        onChange={(e) => { set(campo, e.target.value); marcar(campo); }}
        onBlur={() => marcar(campo)}
        className={clsx(
          "input-field px-4 border w-full bg-surface-high text-on-surface",
          erro ? "border-red-500" : "border-on-surface/15 focus:border-yellow"
        )}
      >
        <option value="">Seleciona…</option>
        {opcoes.map((o) => (
          <option key={o.valor} value={o.valor}>{o.label}</option>
        ))}
      </select>
      {erro && <p className="font-body text-xs text-red-500 mt-1.5">{erro}</p>}
    </div>
  );
}

function FotoUpload({ foto, setFoto }: { foto: File | null; setFoto: (f: File | null) => void }) {
  const [erro, setErro] = useState<string | null>(null);

  function escolher(f: File | null) {
    setErro(null);
    if (!f) { setFoto(null); return; }
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
      setErro("Tem de ser JPG, PNG ou WEBP.");
      return;
    }
    if (f.size > 4 * 1024 * 1024) {
      setErro("Máximo 4 MB.");
      return;
    }
    setFoto(f);
  }

  return (
    <div className="sm:col-span-2">
      <span className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block mb-2">
        Fotografia <span className="normal-case tracking-normal opacity-60">(opcional)</span>
      </span>

      {foto ? (
        <div className="flex items-center justify-between gap-4 border border-on-surface/15 px-4 py-3">
          <span className="font-body text-sm text-on-surface truncate">{foto.name}</span>
          <button
            type="button"
            onClick={() => setFoto(null)}
            className="text-on-surface-muted hover:text-red-500 transition-colors flex-shrink-0"
            aria-label="Remover fotografia"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <label className="flex items-center gap-3 border border-dashed border-on-surface/25 px-4 py-6 cursor-pointer hover:border-yellow transition-colors">
          <Upload size={18} className="text-on-surface-muted flex-shrink-0" />
          <span className="font-body text-sm text-on-surface-muted">
            Escolher ficheiro — JPG, PNG ou WEBP, até 4 MB
          </span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => escolher(e.target.files?.[0] ?? null)}
          />
        </label>
      )}

      <p className="font-body text-xs text-on-surface-muted mt-1.5">
        Serve para o cartão de sócio. Foto tipo passe, de frente, fundo claro.
      </p>
      {erro && <p className="font-body text-xs text-red-500 mt-1.5">{erro}</p>}
    </div>
  );
}

function InscricaoConcluida({
  nome, periodicidade, metodo, pago,
}: {
  nome: string;
  periodicidade: Periodicidade;
  metodo: string;
  pago: boolean;
}) {
  const primeiro = nome.trim().split(/\s+/)[0];
  const base  = valorPorCobranca(periodicidade);
  const taxa  = taxaDoMetodo(metodo, base);
  const valor = totalAPagar(periodicidade, metodo);
  const opcao = METODOS_PAGAMENTO.find((m) => m.id === metodo);
  const referencia = nome.trim().toUpperCase();

  return (
    <div className="py-12 space-y-10">
      <div className="text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-yellow/15 flex items-center justify-center mx-auto">
          <Check size={32} className="text-yellow" />
        </div>
        <h2 className="font-headline font-black text-4xl md:text-5xl uppercase tracking-tighter text-on-surface">
          Bem-vindo ao clube
        </h2>
        <p className="font-body text-base text-on-surface-muted max-w-md mx-auto leading-relaxed">
          {pago
            ? `Pagamento confirmado, ${primeiro}. Estás inscrito e a tua ficha já seguiu para a Direção.`
            : `A tua ficha chegou à Direção, ${primeiro}. Falta confirmar o pagamento da quota para o cartão ser emitido.`}
        </p>
      </div>

      {/* Pagamento — só se ainda faltar pagar */}
      {!pago && (
      <div className="bg-surface-high p-8 space-y-6">
        <div className="pb-5 border-b border-on-surface/10 space-y-2">
          {taxa > 0 && (
            <>
              <Linha rotulo="Quota" valor={formatEuros(base)} />
              <Linha rotulo="Taxa de pagamento online" valor={formatEuros(taxa)} />
            </>
          )}
          <div className="flex items-baseline justify-between gap-4 pt-2">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted">
              A pagar agora
            </span>
            <span className="font-headline font-black text-4xl text-yellow leading-none">
              {formatEuros(valor)}
            </span>
          </div>
        </div>

        {metodo === "transferencia" && (
          <div className="space-y-4">
            <p className="font-body text-sm text-on-surface-muted leading-relaxed">
              Transfere para o IBAN do clube e usa o teu nome como descrição,
              para a Direção saber de quem vem.
            </p>
            <Dado rotulo="IBAN" valor={DADOS_BANCARIOS.iban || "(a Direção envia por email)"} />
            <Dado rotulo="Titular" valor={DADOS_BANCARIOS.titular} />
            <Dado rotulo="Descrição" valor={referencia} />
          </div>
        )}

        {metodo === "debito-direto" && (
          <p className="font-body text-sm text-on-surface-muted leading-relaxed">
            Registámos o teu IBAN. O clube envia-te o mandato de débito direto
            para assinares — a partir daí a quota sai automaticamente e não
            tens de te preocupar mais com isso.
          </p>
        )}

        {metodo === "mbway" && (
          <div className="space-y-4">
            <p className="font-body text-sm text-on-surface-muted leading-relaxed">
              Abre a app MB WAY, envia o valor para o número do clube e escreve
              o teu nome na mensagem.
            </p>
            <Dado rotulo="MB WAY" valor={DADOS_BANCARIOS.mbway || "(a Direção envia por email)"} />
            <Dado rotulo="Nome a indicar" valor={referencia} />
          </div>
        )}

        {metodo === "referencia" && (
          <p className="font-body text-sm text-on-surface-muted leading-relaxed">
            Escolheste {opcao?.nome}. O clube envia-te a entidade e a referência
            por email.
          </p>
        )}
      </div>
      )}

      <div className="text-center space-y-4">
        <p className="font-body text-sm text-on-surface-muted max-w-md mx-auto leading-relaxed">
          Depois de confirmado o pagamento, o Presidente emite o teu número de
          sócio e o cartão, que levantas na sede do clube. Se te queres
          inscrever numa modalidade, aproveita a ida — a inscrição desportiva
          é tratada lá.
        </p>
        <Link href="/" className="btn-ghost text-sm">Voltar ao início</Link>
      </div>
    </div>
  );
}

function Dado({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-on-surface/10 pb-3">
      <span className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted">
        {rotulo}
      </span>
      <span className="font-headline font-black text-base text-on-surface break-all">
        {valor}
      </span>
    </div>
  );
}


/* ── Passo de pagamento ──────────────────────────────────────── */

interface PassoPagamentoProps {
  metodo:            string;
  periodicidade:     Periodicidade;
  nome:              string;
  estado:            EstadoPag;
  enviando:          boolean;
  onPagarMBWay:      () => void;
  onPagamentoManual: () => void;
  referencia:        ReferenciaMB | null;
  referenciaErro:    string | null;
}

function PassoPagamento({
  metodo, periodicidade, nome, estado, enviando, onPagarMBWay, onPagamentoManual,
  referencia: refMB, referenciaErro,
}: PassoPagamentoProps) {
  const base  = valorPorCobranca(periodicidade);
  const taxa  = taxaDoMetodo(metodo, base);
  const valor = totalAPagar(periodicidade, metodo);
  const opcao = METODOS_PAGAMENTO.find((m) => m.id === metodo);
  const referencia = nome.trim().toUpperCase();
  const automatico = metodo === "mbway" && estado !== "indisponivel";

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-headline font-black text-2xl md:text-3xl uppercase tracking-tighter text-on-surface">
          Pagamento
        </h2>
        <p className="font-body text-sm text-on-surface-muted mt-2">
          {opcao?.nome} — a tua ficha só segue para o clube depois deste passo.
        </p>
      </div>

      <div className="bg-surface-high p-8 space-y-6">
        <div className="pb-5 border-b border-on-surface/10 space-y-2">
          {taxa > 0 && (
            <>
              <Linha rotulo="Quota" valor={formatEuros(base)} />
              <Linha rotulo="Taxa de pagamento online" valor={formatEuros(taxa)} />
            </>
          )}
          <div className="flex items-baseline justify-between gap-4 pt-2">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted">
              A pagar
            </span>
            <span className="font-headline font-black text-4xl text-yellow leading-none">
              {formatEuros(valor)}
            </span>
          </div>
        </div>

        {/* ── MB WAY com confirmação automática ── */}
        {automatico && (
          <div className="space-y-5">
            {estado === "inativo" && (
              <>
                <p className="font-body text-sm text-on-surface-muted leading-relaxed">
                  Vais receber um pedido de pagamento na app MB WAY. Confirma lá e
                  esta página atualiza-se sozinha — não tens de avisar ninguém.
                </p>
                <button type="button" onClick={onPagarMBWay} className="btn-primary w-full justify-center text-sm py-4">
                  Pagar {formatEuros(valor)} com MB WAY
                </button>
              </>
            )}

            {estado === "aguarda" && (
              <div className="flex items-start gap-4 py-4" role="status" aria-live="polite">
                <Loader2 size={22} className="text-yellow animate-spin flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-headline font-black uppercase text-sm text-on-surface">
                    À espera da tua confirmação
                  </p>
                  <p className="font-body text-sm text-on-surface-muted mt-1 leading-relaxed">
                    Abre a app MB WAY e aceita o pedido. Tens 4 minutos. Não feches
                    esta página.
                  </p>
                </div>
              </div>
            )}

            {(estado === "recusado" || estado === "expirado" || estado === "erro") && (
              <div className="space-y-4">
                <p className="font-body text-sm text-red-500 leading-relaxed">
                  {estado === "expirado"
                    ? "O pedido expirou sem confirmação."
                    : estado === "recusado"
                    ? "O pagamento foi recusado na app."
                    : "Houve um problema a falar com o serviço de pagamento."}
                </p>
                <button type="button" onClick={onPagarMBWay} className="btn-primary w-full justify-center text-sm py-4">
                  Tentar outra vez
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── MB WAY manual (gateway desligado) ── */}
        {metodo === "mbway" && estado === "indisponivel" && (
          <div className="space-y-4">
            <p className="font-body text-sm text-on-surface-muted leading-relaxed">
              O pagamento automático não está disponível de momento. Envia o valor
              pela app MB WAY para o número do clube, com o teu nome na mensagem.
            </p>
            <Dado rotulo="MB WAY" valor={DADOS_BANCARIOS.mbway || "(a Direção envia por email)"} />
            <Dado rotulo="Nome a indicar" valor={referencia} />
          </div>
        )}

        {/* ── Transferência bancária ── */}
        {metodo === "transferencia" && (
          <div className="space-y-4">
            <p className="font-body text-sm text-on-surface-muted leading-relaxed">
              Transfere para o IBAN do clube e escreve o teu nome na descrição.
            </p>
            <Dado rotulo="IBAN" valor={DADOS_BANCARIOS.iban || "(a Direção envia por email)"} />
            <Dado rotulo="Titular" valor={DADOS_BANCARIOS.titular} />
            <Dado rotulo="Descrição" valor={referencia} />
          </div>
        )}

        {/* ── Entidade e referência ── */}
        {metodo === "referencia" && (
          <div className="space-y-4">
            {refMB ? (
              <>
                <p className="font-body text-sm text-on-surface-muted leading-relaxed">
                  Paga no Multibanco ou no homebanking com estes dados. A referência
                  é válida durante 24 horas.
                </p>
                <Dado rotulo="Entidade"   valor={refMB.entidade} />
                <Dado rotulo="Referência" valor={refMB.referencia} />
                <Dado rotulo="Valor"      valor={formatEuros(refMB.valor)} />
                <Dado rotulo="Válida até" valor={formatarPrazo(refMB.expiraEm)} />
                <p className="font-body text-xs text-on-surface-muted leading-relaxed">
                  Guarda estes dados. Depois de pagares, o clube recebe a confirmação
                  automaticamente — não precisas de avisar ninguém.
                </p>
              </>
            ) : referenciaErro ? (
              <p className="font-body text-sm text-on-surface-muted leading-relaxed">
                {referenciaErro}
              </p>
            ) : (
              <div className="flex items-center gap-3 py-3" role="status" aria-live="polite">
                <Loader2 size={18} className="text-yellow animate-spin flex-shrink-0" />
                <span className="font-body text-sm text-on-surface-muted">
                  A gerar a referência…
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── Débito direto ── */}
        {metodo === "debito-direto" && (
          <p className="font-body text-sm text-on-surface-muted leading-relaxed">
            O clube envia-te o mandato de débito direto para assinares. A partir daí
            a quota sai automaticamente da tua conta.
          </p>
        )}
      </div>

      {/* Conclusão manual — para tudo o que não confirma sozinho */}
      {!automatico && (
        <button
          type="button"
          onClick={onPagamentoManual}
          disabled={enviando}
          className="btn-primary w-full justify-center text-sm py-4 disabled:opacity-60"
        >
          {enviando ? (
            <><Loader2 size={14} className="animate-spin" /> A enviar…</>
          ) : (
            <><Send size={14} /> Concluir inscrição</>
          )}
        </button>
      )}
    </section>
  );
}


/** "Válida até" em português corrido, no fuso de Lisboa. */
function formatarPrazo(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
    timeZone: "Europe/Lisbon",
  }).format(d);
}


/** Linha de detalhe do valor — quota, taxa, e por aí. */
function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="font-body text-sm text-on-surface-muted">{rotulo}</span>
      <span className="font-body text-sm text-on-surface">{valor}</span>
    </div>
  );
}
