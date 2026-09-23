/**
 * Injeta um bloco JSON-LD na página.
 *
 * Componente de servidor: o objeto é serializado no HTML que sai do
 * servidor, e não custa um byte de JavaScript no telemóvel de ninguém.
 */
export default function DadosEstruturados({ dados }: { dados: unknown }) {
  if (!dados) return null;

  return (
    <script
      type="application/ld+json"
      // O conteúdo é nosso, vindo das camadas de dados — não de input
      // de utilizador. O `</` escapa-se para nunca fechar a tag cedo.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(dados).replace(/</g, "\\u003c"),
      }}
    />
  );
}
