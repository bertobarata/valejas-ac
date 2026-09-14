import type { Metadata } from "next";
import PaginaLegal from "@/components/legal/PaginaLegal";
import { CONTACTO } from "@/lib/data/socios";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description:
    "Que cookies e armazenamento local o site do Valejas Atlético Clube usa — e porque não há banner de consentimento.",
};

export default function CookiesPage() {
  return (
    <PaginaLegal
      atual="/cookies"
      titulo="Política de Cookies"
      resumo="Esta é curta, e por boa razão: o site não te segue."
    >
      <h2>1. Porque não há banner</h2>
      <p>
        Não vais encontrar aqui aquela janela a pedir para aceitar cookies. Não é
        esquecimento: <strong>este site não usa cookies de publicidade nem de
        análise de tráfego</strong>. Não há Google Analytics, não há píxel do
        Facebook, não há nada que registe por onde andaste.
      </p>
      <p>
        A lei só obriga a pedir consentimento para armazenamento que não seja
        estritamente necessário. Como só usamos o indispensável, não há nada a
        consentir — e por isso não te incomodamos com um banner.
      </p>

      <h2>2. O que é realmente guardado</h2>
      <div className="overflow-x-auto">
        <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Para quê</th>
            <th>Quanto tempo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>vac_direcao</td>
            <td>Cookie</td>
            <td>
              Manter a sessão iniciada na área reservada da Direção. Só existe
              para quem faz a gestão do clube
            </td>
            <td>12 horas</td>
          </tr>
          <tr>
            <td>theme</td>
            <td>Armazenamento local</td>
            <td>Lembrar se escolheste o tema claro ou escuro</td>
            <td>Até limpares o navegador</td>
          </tr>
          <tr>
            <td>vac_splash_visto</td>
            <td>Armazenamento de sessão</td>
            <td>
              Não repetir o ecrã de abertura em cada página que visitas
            </td>
            <td>Até fechares o separador</td>
          </tr>
        </tbody>
        </table>
      </div>
      <p>
        O cookie da área da Direção é <strong>httpOnly</strong>: não pode ser
        lido por código a correr no navegador — e assinado, para não poder ser
        forjado. Nenhum destes três identifica visitantes nem é partilhado com
        quem quer que seja.
      </p>

      <h2>3. Conteúdo de terceiros</h2>
      <p>
        Há dois sítios onde outro serviço pode guardar algo no teu navegador:
      </p>
      <ul>
        <li>
          <strong>Mapa do Google</strong>, na página do clube, a mostrar onde
          fica a sede. Carrega com a página, e o Google pode guardar cookies
          próprias — não lhe dizemos de que página vieste
        </li>
        <li>
          <strong>Formulário de contacto</strong>, tratado pela Formspree. Só
          comunica com eles quando carregas em enviar
        </li>
      </ul>
      <p>
        A loja oficial e as redes sociais do clube são sites de terceiros com
        regras próprias. Ao seguires esses links, sais deste site.
      </p>

      <h2>4. Como apagar</h2>
      <p>
        Qualquer navegador permite apagar cookies e armazenamento local nas
        definições de privacidade. Se o fizeres, só perdes a preferência de tema
        e, se fores da Direção, a sessão iniciada.
      </p>

      <h2>5. Dúvidas</h2>
      <p>
        Escreve para <a href={`mailto:${CONTACTO.email}`}>{CONTACTO.email}</a>.
      </p>
    </PaginaLegal>
  );
}
