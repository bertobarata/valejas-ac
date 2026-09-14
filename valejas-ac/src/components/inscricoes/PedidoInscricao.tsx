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
import Link from "next/link";
import clsx from "clsx";
import { Check, ExternalLink, Loader2, Send } from "lucide-react";
import { MODALIDADES, VAGAS } from "@/lib/data/modalidades";
import { declaracao } from "@/lib/data/direitosImagem";
import { calcularIdade, eMenor } from "@/lib/validacao";

export default function PedidoInscricao() {
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
        setErros(json.erros ?? ["Não foi possível enviar o pedido."]);
        return;
      }
      setFeito({ modalidade: json.modalidade, jaSocio: json.jaSocio });
    } catch {
      setErros(["Falha de ligação. Tenta outra vez."]);
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
          Inscrição enviada
        </h2>
        <p className="font-body text-on-surface-muted leading-relaxed max-w-xl">
          A inscrição em {feito.modalidade} chegou ao clube. Vamos confirmar
          que há vaga e responder ao contacto que deixaste. Depois é passar
          pela sede para fechar a ficha da federação e entregar o exame
          médico.
        </p>
        {!feito.jaSocio && (
          <div className="border-l-2 border-yellow pl-5">
            <p className="font-body text-on-surface leading-relaxed">
              Falta o primeiro passo: <strong>ser sócio</strong>. Sem isso não
              se pratica no clube — e são 1 € por mês.
            </p>
            <Link href="/socios/inscricao" className="btn-primary text-sm mt-4">
              Fazer-me sócio
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
          Que modalidade *
        </label>
        <select
          id="modalidade"
          value={modalidade}
          onChange={(e) => setModalidade(e.target.value)}
          required
          className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full cursor-pointer"
        >
          <option value="">Escolher modalidade</option>
          {MODALIDADES.map((m) => (
            <option key={m.slug} value={m.slug}>{m.nome}</option>
          ))}
        </select>
        {escolhida?.parceria && (
          <p className="font-body text-sm text-on-surface-muted mt-2">
            O {escolhida.nome.toLowerCase()} é dado em parceria com a{" "}
            {escolhida.parceria.nome}, nas instalações do clube.
          </p>
        )}
        {escolhida?.apenasFormacao && (
          <p className="font-body text-sm text-on-surface-muted mt-1">
            Só há {escolhida.nome.toLowerCase()} para os mais novos — não há
            vertente sénior.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label htmlFor="nome" className="rotulo">Nome do atleta *</label>
          <input
            id="nome" value={nome} onChange={(e) => setNome(e.target.value)}
            autoComplete="name" required
            className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
          />
        </div>

        <div>
          <label htmlFor="nascimento" className="rotulo">Data de nascimento *</label>
          <input
            id="nascimento" type="date" value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)} required
            className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
          />
          {idade !== null && (
            <p className="font-body text-sm text-on-surface-muted mt-1.5">
              {idade} anos{menor ? " — menor de idade" : ""}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="telemovel" className="rotulo">Telemóvel *</label>
          <input
            id="telemovel" type="tel" value={telemovel}
            onChange={(e) => setTelemovel(e.target.value)}
            autoComplete="tel" required
            className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="email" className="rotulo">Email *</label>
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
              Encarregado de educação *
            </label>
            <input
              id="ee" value={eeNome} onChange={(e) => setEeNome(e.target.value)}
              required
              className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
            />
            <p className="font-body text-sm text-on-surface-muted mt-1.5">
              O atleta é menor — o telemóvel e o email acima são os de quem
              responde por ele.
            </p>
          </div>
        )}
      </div>

      {/* Sócio */}
      <div className="bg-surface-high p-5 space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox" checked={jaSocio}
            onChange={(e) => setJaSocio(e.target.checked)}
            className="w-5 h-5 accent-yellow mt-0.5 shrink-0"
          />
          <span className="font-body text-on-surface leading-relaxed">
            Já sou sócio do clube
          </span>
        </label>

        {jaSocio ? (
          <div className="max-w-xs">
            <label htmlFor="num-socio" className="rotulo">
              Número de sócio *
            </label>
            <input
              id="num-socio" value={numeroSocio}
              onChange={(e) => setNumeroSocio(e.target.value)}
              required
              className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full"
            />
            <p className="font-body text-sm text-on-surface-muted mt-1.5">
              Está no cartão. Se não o tiveres à mão, a sede confirma-o.
            </p>
          </div>
        ) : (
          <p className="font-body text-sm text-on-surface-muted leading-relaxed">
            Ainda não és? Podes enviar a inscrição à mesma — mas só se fecha
            depois de te fazeres sócio, e isso são 1 € por mês.
          </p>
        )}
      </div>

      <div>
        <label htmlFor="notas" className="rotulo">
          Alguma coisa que devamos saber{" "}
          <span className="normal-case tracking-normal opacity-60">(opcional)</span>
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
          Direitos de imagem
        </h3>
        <p className="font-body text-sm text-on-surface-muted leading-relaxed">
          O clube fotografa e filma treinos, jogos e convívios, e publica-os
          no site e nas redes. Para isso precisa da tua autorização — é
          obrigatória para todos os atletas e pode ser retirada a qualquer
          momento, por escrito.
        </p>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={consentimento}
            onChange={(e) => setConsentimento(e.target.checked)}
            required
            className="w-5 h-5 accent-yellow mt-0.5 shrink-0"
          />
          <span className="font-body text-on-surface leading-relaxed">
            {declaracao(menor)}
          </span>
        </label>

        <Link
          href="/inscricoes/direitos-de-imagem"
          target="_blank"
          className="inline-flex items-center gap-2 font-body text-sm text-yellow underline underline-offset-4"
        >
          Ler o termo completo <ExternalLink size={13} aria-hidden />
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit" disabled={aEnviar}
          className={clsx("btn-primary text-sm", aEnviar && "opacity-60")}
        >
          {aEnviar ? (
            <><Loader2 size={16} className="animate-spin" /> A enviar…</>
          ) : (
            <><Send size={16} /> Enviar inscrição</>
          )}
        </button>
        <p className="font-body text-sm text-on-surface-muted">
          {VAGAS.curto}
        </p>
      </div>
    </form>
  );
}
