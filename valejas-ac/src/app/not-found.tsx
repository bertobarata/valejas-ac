/**
 * Endereços que nem chegam a ter língua (o middleware não os apanha).
 * As páginas que não existem dentro do site caem em [locale]/not-found.
 */
export default function NaoEncontradoGlobal() {
  return (
    <html lang="pt">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "4rem 1.5rem", textAlign: "center" }}>
        <h1>Página não encontrada</h1>
        <p><a href="/">Voltar ao Valejas AC</a></p>
      </body>
    </html>
  );
}
