import { ehValejas, type LinhaClassificacao } from "@/lib/data/jogos";

/**
 * Tabela do 1.º ao 20.º classificado.
 * Em ecrã estreito as colunas de detalhe escondem-se e fica o
 * essencial — posição, equipa, jogos e pontos.
 */
export default function TabelaClassificativa({ linhas }: { linhas: LinhaClassificacao[] }) {
  return (
    <section aria-labelledby="titulo-classificacao">
      <h2
        id="titulo-classificacao"
        className="font-headline font-black uppercase text-2xl md:text-3xl tracking-tighter text-on-surface mb-6"
      >
        Classificação
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <caption className="sr-only">
            Classificação do campeonato, do primeiro ao vigésimo classificado
          </caption>
          <thead>
            <tr className="border-b border-on-surface/20">
              <th scope="col" className="th-tabela w-10 text-left">#</th>
              <th scope="col" className="th-tabela text-left">Equipa</th>
              <th scope="col" className="th-tabela w-10 text-center">J</th>
              <th scope="col" className="th-tabela w-10 text-center hidden sm:table-cell">V</th>
              <th scope="col" className="th-tabela w-10 text-center hidden sm:table-cell">E</th>
              <th scope="col" className="th-tabela w-10 text-center hidden sm:table-cell">D</th>
              <th scope="col" className="th-tabela w-14 text-center hidden md:table-cell">GM–GS</th>
              <th scope="col" className="th-tabela w-12 text-right">P</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map((l) => {
              const nosso = ehValejas(l.equipa);
              return (
                <tr
                  key={l.posicao}
                  className={`border-b border-on-surface/10 ${
                    nosso ? "bg-yellow/15" : ""
                  }`}
                >
                  <td className="td-tabela text-on-surface-muted">{l.posicao}</td>
                  <td
                    className={`td-tabela font-headline font-black uppercase text-sm ${
                      nosso ? "text-on-surface" : "text-on-surface-muted"
                    }`}
                  >
                    {l.equipa}
                  </td>
                  <td className="td-tabela text-center text-on-surface-muted">{l.jogos}</td>
                  <td className="td-tabela text-center text-on-surface-muted hidden sm:table-cell">{l.vitorias}</td>
                  <td className="td-tabela text-center text-on-surface-muted hidden sm:table-cell">{l.empates}</td>
                  <td className="td-tabela text-center text-on-surface-muted hidden sm:table-cell">{l.derrotas}</td>
                  <td className="td-tabela text-center text-on-surface-muted hidden md:table-cell whitespace-nowrap">
                    {l.golosMarcados}–{l.golosSofridos}
                  </td>
                  <td
                    className={`td-tabela text-right font-headline font-black ${
                      nosso ? "text-on-surface" : "text-on-surface"
                    }`}
                  >
                    {l.pontos}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="font-body text-xs text-on-surface-muted mt-4">
        J jogos · V vitórias · E empates · D derrotas · GM–GS golos marcados e sofridos · P pontos
      </p>
    </section>
  );
}
