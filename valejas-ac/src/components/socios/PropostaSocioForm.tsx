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
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import clsx from "clsx";
import { ArrowLeft, ArrowRight, Check, Loader2, Send, Upload, X } from "lucide-react";
import {
  ESTADOS_CIVIS, SEXOS, PARENTESCOS, CHAVE_ESTADO_CIVIL, CHAVE_PARENTESCO,
  type PropostaSocio,
} from "@/lib/data/inscricao";
import {
  PERIODICIDADES, QUOTA_MENSAL, METODOS_PAGAMENTO, DADOS_BANCARIOS,
  metodosAtivos, valorPorCobranca, taxaDoMetodo, temTaxa, totalAPagar,
  formatEuros, localeIntl, type Periodicidade,
} from "@/lib/data/quota";
import {
  validarNIF, validarCC, validarCodigoPostal, validarTelemovel,
  validarTelefoneFixo, validarEmail, validarDataNascimento,
  validarValidadeCC, validarNomeCompleto, eMenor, calcularIdade,
} from "@/lib/validacao";
import { irParaOTopo } from "@/lib/scroll";
import LogoMetodo from "@/components/pagamento/LogoMetodo";

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

/**
 * Regras por campo. Devolve a chave da mensagem de erro (em
 * socios.formulario.erros) ou null — o texto sai na língua da página.
 */
function erroDoCampo(campo: keyof PropostaSocio, v: string, menor: boolean): string | null {
  const vazio = !v.trim();
  const obrigatorio = (msg = "obrigatorio") => (vazio ? msg : null);

  switch (campo) {
    case "nome":
      return obrigatorio() ?? (validarNomeCompleto(v) ? null : "nomeCompleto");
    case "dataNascimento":
      return obrigatorio() ?? (validarDataNascimento(v) ? null : "data");
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
      return obrigatorio() ?? (validarCodigoPostal(v) ? null : "codigoPostal");
    case "email":
      return obrigatorio() ?? (validarEmail(v) ? null : "email");
    case "telemovel":
      return obrigatorio() ?? (validarTelemovel(v) ? null : "telemovelPortugues");
    case "telefoneFixo":
      return validarTelefoneFixo(v) ? null : "telefoneFixo";
    case "cc":
      return obrigatorio() ?? (validarCC(v) ? null : "ccFormato");
    case "ccValidade":
      return obrigatorio() ?? (validarValidadeCC(v) ? null : "ccValidade");
    case "nif":
      return obrigatorio() ?? (validarNIF(v) ? null : "nif");
    case "metodoPagamento":
      return obrigatorio("metodo");
    case "iban":
      return /^PT50\d{21}$/.test(v.replace(/\s/g, "").toUpperCase()) ? null : "iban";
    case "ibanTitular":
      return obrigatorio();
    case "eeNome":
      return menor ? obrigatorio() : null;
    case "eeParentesco":
      return menor ? obrigatorio() : null;
    case "eeCC":
      return menor ? (obrigatorio() ?? (validarCC(v) ? null : "cc")) : null;
    case "eeTelemovel":
      return menor ? (obrigatorio() ?? (validarTelemovel(v) ? null : "telemovel")) : null;
    case "eeEmail":
      return menor ? (obrigatorio() ?? (validarEmail(v) ? null : "email")) : null;
    default:
      return null;
  }
}

/** Chaves dos passos — o nome de cada um está em socios.formulario.passos. */
const PASSOS = ["identificacao", "contactos", "documentos", "quota", "pagamento"] as const;

/** "debito-direto" → "debitoDireto", a chave em socios.metodos. */
function chaveMetodo(id: string): string {
  return id.replace(/-(\w)/g, (_, c: string) => c.toUpperCase());
}

export default function PropostaSocioForm() {
  const t      = useTranslations("socios.formulario");
  const ts     = useTranslations("socios");
  const lingua = useLocale();
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
              ? t("erros.referenciaInativa")
              : json.erro ?? t("erros.referenciaFalhou")   // json.erro vem do servidor, em PT
          );
          return;
        }
        setRefMB(json as ReferenciaMB);
      } catch {
        if (!cancelado) setRefErro(t("erros.referenciaLigacao"));
      }
    })();

    return () => { cancelado = true; };
  }, [passo, campos.metodoPagamento, campos.periodicidade, refMB, t]);

  function set(campo: keyof PropostaSocio, valor: string) {
    setCampos((c) => ({ ...c, [campo]: valor }));
  }

  function marcar(campo: keyof PropostaSocio) {
    setTocados((t) => ({ ...t, [campo]: true }));
  }

  function erro(campo: keyof PropostaSocio): string | null {
    if (!tocados[campo]) return null;
    const chave = erroDoCampo(campo, campos[campo], menor);
    return chave ? t(`erros.${chave}`) : null;
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
      setErros([t("erros.rgpd")]);
      return;
    }
    setErros([]);

    if (passoValido(passo)) {
      setPasso((p) => Math.min(p + 1, PASSOS.length - 1));
      irParaOTopo();
    }
  }

  function recuar() {
    setPasso((p) => Math.max(p - 1, 0));
    irParaOTopo();
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
        // As mensagens do servidor vêm em português (ver relatório i18n).
        setErros(json.erros ?? [t("erros.envio")]);
        return;
      }
      setEnviado(true);
      irParaOTopo();
    } catch {
      setErros([t("erros.ligacao")]);
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
        setErros([json.erro ?? t("erros.pagamentoIniciar")]);
        return;
      }
      requestId = json.requestId;
      orderId = json.orderId;
    } catch {
      setEstadoPag("erro");
      setErros([t("erros.pagamentoLigacao")]);
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
        <Bloco titulo={t("blocos.quemEs")}>
          <Campo label={t("campos.nomeCompleto")} campo="nome" valor={campos.nome} erro={erro("nome")}
                 set={set} marcar={marcar} autoComplete="name" larga />
          <Campo label={t("campos.dataNascimento")} campo="dataNascimento" tipo="date"
                 valor={campos.dataNascimento} erro={erro("dataNascimento")} set={set} marcar={marcar} />
          <Seletor label={t("campos.sexo")} campo="sexo" valor={campos.sexo} erro={erro("sexo")} set={set} marcar={marcar}
                   opcoes={SEXOS.map((s) => ({ valor: s.valor, label: `${s.valor} — ${t(`sexos.${s.valor}`)}` }))} />
          <Seletor label={t("campos.estadoCivil")} campo="estadoCivil" valor={campos.estadoCivil} erro={erro("estadoCivil")}
                   set={set} marcar={marcar}
                   opcoes={ESTADOS_CIVIS.map((e) => ({ valor: e, label: t(`estadosCivis.${CHAVE_ESTADO_CIVIL[e]}`) }))} />
          <Campo label={t("campos.naturalidade")} campo="naturalidade" valor={campos.naturalidade} erro={erro("naturalidade")}
                 set={set} marcar={marcar} dica={t("campos.naturalidadeDica")} />
          <Campo label={t("campos.nacionalidade")} campo="nacionalidade" valor={campos.nacionalidade}
                 erro={erro("nacionalidade")} set={set} marcar={marcar} />
          <Campo label={t("campos.nomePai")} campo="nomePai" valor={campos.nomePai} erro={erro("nomePai")}
                 set={set} marcar={marcar} larga />
          <Campo label={t("campos.nomeMae")} campo="nomeMae" valor={campos.nomeMae} erro={erro("nomeMae")}
                 set={set} marcar={marcar} larga />
        </Bloco>
      )}

      {/* ── Passo 2 — Contactos ── */}
      {passo === 1 && (
        <Bloco titulo={t("blocos.ondeTeEncontramos")}>
          <Campo label={t("campos.morada")} campo="morada" valor={campos.morada} erro={erro("morada")}
                 set={set} marcar={marcar} autoComplete="street-address" larga />
          <Campo label={t("campos.codigoPostal")} campo="codigoPostal" valor={campos.codigoPostal}
                 erro={erro("codigoPostal")} set={set} marcar={marcar} placeholder="0000-000" />
          <Campo label={t("campos.localidade")} campo="localidade" valor={campos.localidade} erro={erro("localidade")}
                 set={set} marcar={marcar} />
          <Campo label={t("campos.email")} campo="email" tipo="email" valor={campos.email} erro={erro("email")}
                 set={set} marcar={marcar} autoComplete="email" larga
                 dica={t("campos.emailDica")} />
          <Campo label={t("campos.telemovel")} campo="telemovel" tipo="tel" valor={campos.telemovel}
                 erro={erro("telemovel")} set={set} marcar={marcar} placeholder="9xx xxx xxx" />
          <Campo label={t("campos.telefoneFixo")} campo="telefoneFixo" tipo="tel" valor={campos.telefoneFixo}
                 erro={erro("telefoneFixo")} set={set} marcar={marcar} opcional />
        </Bloco>
      )}

      {/* ── Passo 3 — Documentos ── */}
      {passo === 2 && (
        <>
          <Bloco titulo={t("blocos.documentos")}>
            <Campo label={t("campos.cc")} campo="cc" valor={campos.cc} erro={erro("cc")}
                   set={set} marcar={marcar} placeholder="12345678 9 ZZ4" />
            <Campo label={t("campos.ccValidade")} campo="ccValidade" tipo="date"
                   valor={campos.ccValidade} erro={erro("ccValidade")} set={set} marcar={marcar} />
            <Campo label={t("campos.nif")} campo="nif" valor={campos.nif} erro={erro("nif")}
                   set={set} marcar={marcar} placeholder="000000000" />
            <Campo label={t("campos.profissao")} campo="profissao" valor={campos.profissao} erro={null}
                   set={set} marcar={marcar} opcional />
            <FotoUpload foto={foto} setFoto={setFoto} />
          </Bloco>

          {menor && (
            <Bloco
              titulo={t("blocos.encarregado")}
              nota={t("blocos.encarregadoNota", { idade: idade ?? 0 })}
            >
              <Campo label={t("campos.nomeCompleto")} campo="eeNome" valor={campos.eeNome} erro={erro("eeNome")}
                     set={set} marcar={marcar} larga />
              <Seletor label={t("campos.parentesco")} campo="eeParentesco" valor={campos.eeParentesco}
                       erro={erro("eeParentesco")} set={set} marcar={marcar}
                       opcoes={PARENTESCOS.map((p) => ({ valor: p, label: t(`parentescos.${CHAVE_PARENTESCO[p]}`) }))} />
              <Campo label={t("campos.cc")} campo="eeCC" valor={campos.eeCC} erro={erro("eeCC")}
                     set={set} marcar={marcar} />
              <Campo label={t("campos.telemovel")} campo="eeTelemovel" tipo="tel" valor={campos.eeTelemovel}
                     erro={erro("eeTelemovel")} set={set} marcar={marcar} />
              <Campo label={t("campos.email")} campo="eeEmail" tipo="email" valor={campos.eeEmail} erro={erro("eeEmail")}
                     set={set} marcar={marcar} larga />
            </Bloco>
          )}
        </>
      )}

      {/* ── Passo 4 — Quota e pagamento ── */}
      {passo === 3 && (
        <>
          <Bloco titulo={t("blocos.quota")} nota={t("blocos.quotaNota", { quota: formatEuros(QUOTA_MENSAL, lingua) })}>
            <fieldset className="sm:col-span-2">
              <legend className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted mb-3">
                {t("quota.pergunta")}
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
                        {ts(`periodicidades.${p.id}.nome`)}
                      </span>
                      <span className="block font-headline font-black text-2xl text-yellow mt-1">
                        {formatEuros(valorPorCobranca(p.id), lingua)}
                      </span>
                      <span className="block font-body text-xs text-on-surface-muted mt-1">
                        {ts(`periodicidades.${p.id}.nota`)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </Bloco>

          <Bloco titulo={t("blocos.comoPagar")}>
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
                    <span className="flex-1">
                      <span className="flex items-center justify-between gap-3">
                        <span className="font-headline font-black uppercase text-sm text-on-surface">
                          {ts(`metodos.${chaveMetodo(m.id)}.nome`)}
                        </span>
                        {m.logo && <LogoMetodo logo={m.logo} altura={20} />}
                      </span>
                      <span className="block font-body text-sm text-on-surface-muted mt-0.5">
                        {ts(`metodos.${chaveMetodo(m.id)}.descricao`)}
                      </span>
                      {temTaxa(m.id) && (
                        <span className="block font-body text-xs text-on-surface-muted mt-1.5">
                          {t("quota.taxa", {
                            valor: formatEuros(
                              taxaDoMetodo(m.id, valorPorCobranca(campos.periodicidade as Periodicidade)),
                              lingua,
                            ),
                          })}
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
                <Campo label={t("campos.iban")} campo="iban" valor={campos.iban} erro={erro("iban")}
                       set={set} marcar={marcar} placeholder="PT50 0000 0000 0000 0000 0000 0" larga />
                <Campo label={t("campos.ibanTitular")} campo="ibanTitular" valor={campos.ibanTitular}
                       erro={erro("ibanTitular")} set={set} marcar={marcar} larga />
              </>
            )}

            <Campo label={t("campos.proponente")} campo="proponente" valor={campos.proponente} erro={null}
                   set={set} marcar={marcar} opcional larga
                   dica={t("campos.proponenteDica")} />
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
                {t(menor ? "consentimento.menor" : "consentimento.maior")}{" "}
                {t("consentimento.uso")}{" "}
                <Link href="/privacidade" className="text-yellow underline">
                  {t("consentimento.politica")}
                </Link>
                .
              </span>
            </label>

            <p className="font-body text-xs text-on-surface-muted leading-relaxed bg-surface p-4">
              {t.rich("consentimento.proposta", { forte: (c) => <strong>{c}</strong> })}
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
            <ArrowLeft size={14} /> {t("navegacao.voltar")}
          </button>
        ) : <span />}

        {passo < PASSOS.length - 1 && (
          <button type="button" onClick={avancar} className="btn-primary text-sm">
            {passo === 3 ? t("navegacao.irParaPagamento") : t("navegacao.continuar")} <ArrowRight size={14} />
          </button>
        )}
      </div>
    </form>
  );
}

/* ── Sub-componentes ─────────────────────────────────────────── */

function Passos({ atual }: { atual: number }) {
  const t = useTranslations("socios.formulario");
  return (
    <div>
      {/* As barras cabem sempre: cinco divisões de largura igual. */}
      <ol className="flex items-center gap-2" aria-label={t("progresso")}>
        {PASSOS.map((chave, i) => (
          <li key={chave} className="flex-1 min-w-0">
            <div
              className={clsx(
                "h-1 transition-colors duration-300",
                i <= atual ? "bg-yellow" : "bg-on-surface/15"
              )}
            />
            {/*
              Os rótulos é que não cabem. A 375px, cinco palavras com
              `tracking-widest` empurravam a página 105px para fora e
              davam scroll horizontal na página mais importante do site.
              Em ecrã estreito só se mostra o passo atual, por baixo.
            */}
            <span
              className={clsx(
                "hidden sm:block mt-2 font-body text-xs uppercase tracking-widest truncate",
                i === atual ? "text-yellow font-semibold" : "text-on-surface-muted"
              )}
            >
              {t(`passos.${chave}`)}
            </span>
          </li>
        ))}
      </ol>

      <p className="sm:hidden mt-3 font-body text-xs uppercase tracking-widest text-on-surface-muted">
        {t("passoDe", { n: atual + 1, total: PASSOS.length })}
        <span className="text-yellow font-semibold"> · {t(`passos.${PASSOS[atual]}`)}</span>
      </p>
    </div>
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
  const t = useTranslations("socios.formulario.campos");
  const id = `campo-${campo}`;
  return (
    <div className={clsx(larga && "sm:col-span-2")}>
      <label htmlFor={id} className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block mb-2">
        {label} {opcional ? <span className="normal-case tracking-normal opacity-60">{t("opcional")}</span> : "*"}
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
  const t = useTranslations("socios.formulario.campos");
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
        <option value="">{t("seleciona")}</option>
        {opcoes.map((o) => (
          <option key={o.valor} value={o.valor}>{o.label}</option>
        ))}
      </select>
      {erro && <p className="font-body text-xs text-red-500 mt-1.5">{erro}</p>}
    </div>
  );
}

function FotoUpload({ foto, setFoto }: { foto: File | null; setFoto: (f: File | null) => void }) {
  const t = useTranslations("socios.formulario");
  const [erro, setErro] = useState<string | null>(null);

  function escolher(f: File | null) {
    setErro(null);
    if (!f) { setFoto(null); return; }
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
      setErro(t("erros.fotoTipo"));
      return;
    }
    if (f.size > 4 * 1024 * 1024) {
      setErro(t("erros.fotoTamanho"));
      return;
    }
    setFoto(f);
  }

  return (
    <div className="sm:col-span-2">
      <span className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted block mb-2">
        {t("foto.rotulo")} <span className="normal-case tracking-normal opacity-60">{t("campos.opcional")}</span>
      </span>

      {foto ? (
        <div className="flex items-center justify-between gap-4 border border-on-surface/15 px-4 py-3">
          <span className="font-body text-sm text-on-surface truncate">{foto.name}</span>
          <button
            type="button"
            onClick={() => setFoto(null)}
            className="text-on-surface-muted hover:text-red-500 transition-colors flex-shrink-0"
            aria-label={t("foto.remover")}
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <label className="flex items-center gap-3 border border-dashed border-on-surface/25 px-4 py-6 cursor-pointer hover:border-yellow transition-colors">
          <Upload size={18} className="text-on-surface-muted flex-shrink-0" />
          <span className="font-body text-sm text-on-surface-muted">
            {t("foto.escolher")}
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
        {t("foto.ajuda")}
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
  const t      = useTranslations("socios.formulario");
  const ts     = useTranslations("socios");
  const lingua = useLocale();
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
          {t("concluida.titulo")}
        </h2>
        <p className="font-body text-base text-on-surface-muted max-w-md mx-auto leading-relaxed">
          {t(pago ? "concluida.pago" : "concluida.pendente", { nome: primeiro })}
        </p>
      </div>

      {/* Pagamento — só se ainda faltar pagar */}
      {!pago && (
      <div className="bg-surface-high p-8 space-y-6">
        <div className="pb-5 border-b border-on-surface/10 space-y-2">
          {taxa > 0 && (
            <>
              <Linha rotulo={t("valor.quota")} valor={formatEuros(base, lingua)} />
              <Linha rotulo={t("valor.taxa")} valor={formatEuros(taxa, lingua)} />
            </>
          )}
          <div className="flex items-baseline justify-between gap-4 pt-2">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted">
              {t("valor.aPagarAgora")}
            </span>
            <span className="font-headline font-black text-4xl text-yellow leading-none">
              {formatEuros(valor, lingua)}
            </span>
          </div>
        </div>

        {metodo === "transferencia" && (
          <div className="space-y-4">
            <p className="font-body text-sm text-on-surface-muted leading-relaxed">
              {t("concluida.transferencia")}
            </p>
            <Dado rotulo={t("dados.iban")} valor={DADOS_BANCARIOS.iban || t("dados.direcaoEnvia")} />
            <Dado rotulo={t("dados.titular")} valor={DADOS_BANCARIOS.titular} />
            <Dado rotulo={t("dados.descricao")} valor={referencia} />
          </div>
        )}

        {metodo === "debito-direto" && (
          <p className="font-body text-sm text-on-surface-muted leading-relaxed">
            {t("concluida.debitoDireto")}
          </p>
        )}

        {metodo === "mbway" && (
          <div className="space-y-4">
            <p className="font-body text-sm text-on-surface-muted leading-relaxed">
              {t("concluida.mbway")}
            </p>
            <Dado rotulo={t("dados.mbway")} valor={DADOS_BANCARIOS.mbway || t("dados.direcaoEnvia")} />
            <Dado rotulo={t("dados.nomeAIndicar")} valor={referencia} />
          </div>
        )}

        {metodo === "referencia" && (
          <p className="font-body text-sm text-on-surface-muted leading-relaxed">
            {t("concluida.referencia", {
              metodo: opcao ? ts(`metodos.${chaveMetodo(opcao.id)}.nome`) : "",
            })}
          </p>
        )}
      </div>
      )}

      <div className="text-center space-y-4">
        <p className="font-body text-sm text-on-surface-muted max-w-md mx-auto leading-relaxed">
          {t("concluida.depois")}
        </p>
        <Link href="/" className="btn-ghost text-sm">{t("concluida.voltarInicio")}</Link>
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
  const t      = useTranslations("socios.formulario");
  const ts     = useTranslations("socios");
  const lingua = useLocale();
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
          {t("pagamento.titulo")}
        </h2>
        <div className="flex items-center gap-3 mt-2">
          {opcao?.logo && <LogoMetodo logo={opcao.logo} altura={24} />}
          <p className="font-body text-sm text-on-surface-muted">
            {t("pagamento.soDepois", {
              metodo: opcao ? ts(`metodos.${chaveMetodo(opcao.id)}.nome`) : "",
            })}
          </p>
        </div>
      </div>

      <div className="bg-surface-high p-8 space-y-6">
        <div className="pb-5 border-b border-on-surface/10 space-y-2">
          {taxa > 0 && (
            <>
              <Linha rotulo={t("valor.quota")} valor={formatEuros(base, lingua)} />
              <Linha rotulo={t("valor.taxa")} valor={formatEuros(taxa, lingua)} />
            </>
          )}
          <div className="flex items-baseline justify-between gap-4 pt-2">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-on-surface-muted">
              {t("valor.aPagar")}
            </span>
            <span className="font-headline font-black text-4xl text-yellow leading-none">
              {formatEuros(valor, lingua)}
            </span>
          </div>
        </div>

        {/* ── MB WAY com confirmação automática ── */}
        {automatico && (
          <div className="space-y-5">
            {estado === "inativo" && (
              <>
                <p className="font-body text-sm text-on-surface-muted leading-relaxed">
                  {t("pagamento.mbwayPedido")}
                </p>
                <button type="button" onClick={onPagarMBWay} className="btn-primary w-full justify-center text-sm py-4">
                  {t("pagamento.pagarMbway", { valor: formatEuros(valor, lingua) })}
                </button>
              </>
            )}

            {estado === "aguarda" && (
              <div className="flex items-start gap-4 py-4" role="status" aria-live="polite">
                <Loader2 size={22} className="text-yellow animate-spin flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-headline font-black uppercase text-sm text-on-surface">
                    {t("pagamento.aguarda")}
                  </p>
                  <p className="font-body text-sm text-on-surface-muted mt-1 leading-relaxed">
                    {t("pagamento.aguardaTexto")}
                  </p>
                </div>
              </div>
            )}

            {(estado === "recusado" || estado === "expirado" || estado === "erro") && (
              <div className="space-y-4">
                <p className="font-body text-sm text-red-500 leading-relaxed">
                  {estado === "expirado"
                    ? t("pagamento.expirado")
                    : estado === "recusado"
                    ? t("pagamento.recusado")
                    : t("pagamento.erro")}
                </p>
                <button type="button" onClick={onPagarMBWay} className="btn-primary w-full justify-center text-sm py-4">
                  {t("pagamento.tentarOutraVez")}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── MB WAY manual (gateway desligado) ── */}
        {metodo === "mbway" && estado === "indisponivel" && (
          <div className="space-y-4">
            <p className="font-body text-sm text-on-surface-muted leading-relaxed">
              {t("pagamento.mbwayManual")}
            </p>
            <Dado rotulo={t("dados.mbway")} valor={DADOS_BANCARIOS.mbway || t("dados.direcaoEnvia")} />
            <Dado rotulo={t("dados.nomeAIndicar")} valor={referencia} />
          </div>
        )}

        {/* ── Transferência bancária ── */}
        {metodo === "transferencia" && (
          <div className="space-y-4">
            <p className="font-body text-sm text-on-surface-muted leading-relaxed">
              {t("pagamento.transferencia")}
            </p>
            <Dado rotulo={t("dados.iban")} valor={DADOS_BANCARIOS.iban || t("dados.direcaoEnvia")} />
            <Dado rotulo={t("dados.titular")} valor={DADOS_BANCARIOS.titular} />
            <Dado rotulo={t("dados.descricao")} valor={referencia} />
          </div>
        )}

        {/* ── Entidade e referência ── */}
        {metodo === "referencia" && (
          <div className="space-y-4">
            {refMB ? (
              <>
                <p className="font-body text-sm text-on-surface-muted leading-relaxed">
                  {t("pagamento.referencia")}
                </p>
                <Dado rotulo={t("dados.entidade")}   valor={refMB.entidade} />
                <Dado rotulo={t("dados.referencia")} valor={refMB.referencia} />
                <Dado rotulo={t("dados.valor")}      valor={formatEuros(refMB.valor, lingua)} />
                <Dado rotulo={t("dados.validaAte")}  valor={formatarPrazo(refMB.expiraEm, lingua)} />
                <p className="font-body text-xs text-on-surface-muted leading-relaxed">
                  {t("pagamento.referenciaGuarda")}
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
                  {t("pagamento.aGerar")}
                </span>
              </div>
            )}
          </div>
        )}

        {/* ── Débito direto ── */}
        {metodo === "debito-direto" && (
          <p className="font-body text-sm text-on-surface-muted leading-relaxed">
            {t("pagamento.debitoDireto")}
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
            <><Loader2 size={14} className="animate-spin" /> {t("pagamento.aEnviar")}</>
          ) : (
            <><Send size={14} /> {t("pagamento.concluir")}</>
          )}
        </button>
      )}
    </section>
  );
}


/** "Válida até" na língua da página, sempre no fuso de Lisboa. */
function formatarPrazo(iso: string, lingua: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat(localeIntl(lingua), {
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
