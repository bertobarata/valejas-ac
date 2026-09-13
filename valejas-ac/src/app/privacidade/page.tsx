import type { Metadata } from "next";
import PaginaLegal from "@/components/legal/PaginaLegal";
import { CONTACTO } from "@/lib/data/socios";
import { LOCALIZACAO } from "@/lib/data/historia";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Que dados o Valejas Atlético Clube recolhe, para que servem, com quem são partilhados e que direitos tens sobre eles.",
};

export default function PrivacidadePage() {
  return (
    <PaginaLegal
      atual="/privacidade"
      titulo="Política de Privacidade"
      resumo="O que recolhemos, porquê, com quem partilhamos e o que podes exigir de nós."
    >
      <h2>1. Quem trata os teus dados</h2>
      <p>
        O responsável pelo tratamento é o <strong>Valejas Atlético Clube</strong>,
        com sede em {LOCALIZACAO.morada}, {LOCALIZACAO.codigoPostal}{" "}
        {LOCALIZACAO.localidade}, {LOCALIZACAO.concelho}.
      </p>
      <p>
        Para qualquer questão sobre os teus dados, escreve para{" "}
        <a href={`mailto:${CONTACTO.email}`}>{CONTACTO.email}</a> ou liga para{" "}
        {CONTACTO.telefone}.
      </p>

      <h2>2. Que dados recolhemos</h2>

      <h3>Inscrição de sócio</h3>
      <p>
        A ficha de sócio reproduz a proposta em papel que o clube usa desde
        sempre. Recolhemos:
      </p>
      <ul>
        <li>Nome completo, data de nascimento, sexo e estado civil</li>
        <li>Naturalidade e nacionalidade</li>
        <li>Nome do pai e da mãe</li>
        <li>Morada, código postal e localidade</li>
        <li>Email, telemóvel e, se quiseres, telefone fixo</li>
        <li>
          <strong>Número e validade do Cartão de Cidadão</strong> e{" "}
          <strong>número de contribuinte</strong>
        </li>
        <li>Profissão, se a quiseres indicar</li>
        <li>Fotografia, se a quiseres enviar — serve para o cartão de sócio</li>
        <li>Nome de um sócio que te proponha, se houver</li>
        <li>
          IBAN e titular da conta, <strong>apenas</strong> se escolheres pagar
          por débito direto
        </li>
      </ul>
      <p>
        <strong>Se o candidato for menor de 18 anos</strong>, recolhemos também o
        nome, parentesco, número de Cartão de Cidadão, telemóvel e email do
        Encarregado de Educação, que é quem autoriza o tratamento. Um menor não
        pode dar esse consentimento sozinho.
      </p>

      <h3>Newsletter</h3>
      <p>O endereço de email que indicares.</p>

      <h3>Navegação</h3>
      <p>
        O site <strong>não tem ferramentas de análise nem píxeis de seguimento</strong>.
        Não sabemos quem és nem o que visitaste. Os únicos dados guardados no teu
        navegador estão explicados na{" "}
        <a href="/cookies">política de cookies</a>.
      </p>

      <h2>3. Para que usamos os dados</h2>
      <ul>
        <li>
          <strong>Inscrição de sócio</strong> — preencher a ficha de sócio no
          sistema do clube, atribuir o número de sócio, emitir o cartão e
          contactar-te sobre a tua inscrição e quotas
        </li>
        <li>
          <strong>Cartão de Cidadão e contribuinte</strong> — identificação do
          sócio e obrigações contabilísticas do clube, tal como na ficha de papel
        </li>
        <li><strong>Fotografia</strong> — imprimir o cartão de sócio</li>
        <li><strong>IBAN</strong> — processar o débito direto que autorizaste</li>
        <li><strong>Newsletter</strong> — enviar notícias do clube</li>
      </ul>
      <p>
        <strong>Não vendemos dados a ninguém</strong> e não os usamos para
        publicidade.
      </p>

      <h2>4. Com que fundamento</h2>
      <ul>
        <li>
          <strong>Consentimento</strong> — que dás ao submeter a ficha, e que
          podes retirar a qualquer momento
        </li>
        <li>
          <strong>Execução da relação de sócio</strong> — gerir a tua inscrição e
          as quotas
        </li>
        <li>
          <strong>Obrigação legal</strong> — conservar registos contabilísticos
          pelo prazo que a lei exige
        </li>
      </ul>

      <h2>5. Quem mais tem acesso</h2>
      <p>
        O clube recorre a serviços externos para funcionar. Cada um vê apenas o
        que precisa:
      </p>
      <table>
        <thead>
          <tr>
            <th>Serviço</th>
            <th>Para quê</th>
            <th>Que dados</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Vercel</td>
            <td>Alojamento do site</td>
            <td>Dados técnicos de ligação</td>
          </tr>
          <tr>
            <td>Resend</td>
            <td>Enviar a ficha para o email do clube</td>
            <td>Todos os dados da ficha, em trânsito</td>
          </tr>
          <tr>
            <td>Ifthenpay</td>
            <td>Pagamento por MB WAY e referência</td>
            <td>Valor, telemóvel e email</td>
          </tr>
          <tr>
            <td>Sanity</td>
            <td>Conteúdos do site</td>
            <td>Nenhum dado de sócio</td>
          </tr>
          <tr>
            <td>Make.com</td>
            <td>Publicar comunicados nas redes</td>
            <td>Nenhum dado de sócio</td>
          </tr>
          <tr>
            <td>Formspree</td>
            <td>Formulário de newsletter</td>
            <td>Email indicado</td>
          </tr>
        </tbody>
      </table>
      <p>
        O mapa do Google na página da história{" "}
        <strong>só é carregado depois de carregares no botão</strong>. Até lá, o
        Google não recebe nada.
      </p>

      <h2>6. Onde ficam guardados</h2>
      <p>
        A ficha de sócio <strong>não é guardada neste site</strong>. Não há base
        de dados, não fica em disco e não é registada nos relatórios do servidor:
        os dados existem em memória durante o envio e seguem para a caixa de
        correio do clube. A partir daí vivem no sistema de gestão de sócios do
        clube, num computador na sede.
      </p>

      <h2>7. Durante quanto tempo</h2>
      <ul>
        <li>
          <strong>Sócios</strong> — enquanto durar a relação com o clube, e depois
          o tempo que a lei exigir para efeitos contabilísticos
        </li>
        <li>
          <strong>Inscrições não concretizadas</strong> — eliminadas quando deixam
          de ser necessárias
        </li>
        <li>
          <strong>Newsletter</strong> — até cancelares a subscrição
        </li>
      </ul>

      <h2>8. Os teus direitos</h2>
      <p>Podes, a qualquer momento:</p>
      <ul>
        <li>Saber que dados temos sobre ti e pedir uma cópia</li>
        <li>Corrigir o que estiver errado</li>
        <li>Pedir que sejam apagados</li>
        <li>Limitar ou opor-te ao tratamento</li>
        <li>Retirar o consentimento que deste</li>
        <li>Pedir os dados num formato que possas levar para outro lado</li>
      </ul>
      <p>
        Basta escrever para <a href={`mailto:${CONTACTO.email}`}>{CONTACTO.email}</a>.
        Respondemos no prazo máximo de um mês.
      </p>
      <p>
        Se achares que não tratámos bem os teus dados, podes apresentar queixa à{" "}
        <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer">
          Comissão Nacional de Proteção de Dados
        </a>
        .
      </p>

      <h2>9. Alterações</h2>
      <p>
        Se esta política mudar, a data de atualização no topo da página muda com
        ela. Alterações que afetem o que fazemos com os teus dados são
        comunicadas aos sócios.
      </p>
    </PaginaLegal>
  );
}
