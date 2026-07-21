import type { Metadata } from "next";
import { CONTACTO } from "@/lib/data/socios";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como o Valejas Atlético Clube recolhe, usa e protege os teus dados pessoais.",
};

export default function PrivacidadePage() {
  const morada = [CONTACTO.morada, CONTACTO.codigoPostal, CONTACTO.concelho]
    .filter(Boolean)
    .join(", ");

  return (
    <section className="bg-surface py-24 md:py-32">
      <div className="section-container max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl text-on-surface mb-4">
          Política de Privacidade
        </h1>
        <p className="font-body text-sm text-on-surface-muted mb-12">
          Última atualização: {new Date().toLocaleDateString("pt-PT")}
        </p>

        <div className="space-y-8 font-body text-on-surface leading-relaxed">
          <div>
            <h2 className="font-display text-xl mb-2">1. Responsável pelo tratamento</h2>
            <p className="text-on-surface-muted">
              O <strong>Valejas Atlético Clube</strong> é responsável pelo tratamento
              dos dados pessoais recolhidos através deste website.
              {morada && <> Morada: {morada}.</>}{" "}
              {CONTACTO.email && (
                <>
                  Contacto:{" "}
                  <a href={`mailto:${CONTACTO.email}`} className="text-yellow underline">
                    {CONTACTO.email}
                  </a>
                  .
                </>
              )}
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl mb-2">2. Que dados recolhemos</h2>
            <p className="text-on-surface-muted">
              Apenas os dados que nos forneces voluntariamente nos formulários do
              site: nome, email, telefone, NIF (opcional) e a mensagem que escreves.
              Não recolhemos dados sensíveis nem fazemos perfis automáticos.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl mb-2">3. Para que usamos os dados</h2>
            <ul className="text-on-surface-muted list-disc pl-5 space-y-1">
              <li>Responder a pedidos de contacto;</li>
              <li>Processar inscrições de sócio;</li>
              <li>Enviar novidades do clube, se subscreveres a newsletter.</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl mb-2">4. Subcontratantes</h2>
            <p className="text-on-surface-muted">
              O envio dos formulários é processado pelo serviço{" "}
              <a
                href="https://formspree.io/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow underline"
              >
                Formspree
              </a>
              , que encaminha as mensagens para o email do clube. Não partilhamos os
              teus dados com terceiros para fins de marketing.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl mb-2">5. Conservação</h2>
            <p className="text-on-surface-muted">
              Guardamos os dados apenas o tempo necessário para a finalidade que os
              motivou, ou enquanto fores sócio, salvo obrigação legal de conservação.
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl mb-2">6. Os teus direitos</h2>
            <p className="text-on-surface-muted">
              Podes pedir a qualquer momento o acesso, correção, eliminação ou
              portabilidade dos teus dados, bem como opor-te ao tratamento. Para
              exercer estes direitos, contacta-nos
              {CONTACTO.email && (
                <>
                  {" "}
                  por{" "}
                  <a href={`mailto:${CONTACTO.email}`} className="text-yellow underline">
                    email
                  </a>
                </>
              )}
              . Tens ainda o direito de reclamar junto da CNPD (
              <a
                href="https://www.cnpd.pt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-yellow underline"
              >
                cnpd.pt
              </a>
              ).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
