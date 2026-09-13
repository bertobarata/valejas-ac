import type { Metadata } from "next";
import PaginaLegal from "@/components/legal/PaginaLegal";
import { CONTACTO } from "@/lib/data/socios";
import { LOCALIZACAO } from "@/lib/data/historia";
import { QUOTA_MENSAL, formatEuros, PERIODICIDADES, valorPorCobranca } from "@/lib/data/quota";

export const metadata: Metadata = {
  title: "Termos e Condições",
  description:
    "Condições de utilização do site do Valejas Atlético Clube, da inscrição como sócio e do pagamento de quotas.",
};

export default function TermosPage() {
  return (
    <PaginaLegal
      atual="/termos"
      titulo="Termos e Condições"
      resumo="As regras de utilização deste site, da inscrição como sócio e do pagamento das quotas."
    >
      <h2>1. Quem somos</h2>
      <p>
        Este site é propriedade do <strong>Valejas Atlético Clube</strong>,
        associação desportiva e recreativa fundada em 1966, com sede em{" "}
        {LOCALIZACAO.morada}, {LOCALIZACAO.codigoPostal} {LOCALIZACAO.localidade},{" "}
        {LOCALIZACAO.concelho}. Contacto:{" "}
        <a href={`mailto:${CONTACTO.email}`}>{CONTACTO.email}</a>.
      </p>
      <p>
        Ao usares este site aceitas estas condições. Se não concordares com
        alguma, não uses o site.
      </p>

      <h2>2. Inscrição como sócio</h2>

      <h3>Quem se pode inscrever</h3>
      <p>
        <strong>Qualquer pessoa.</strong> Não há seleção nem aprovação prévia.
        Menores de 18 anos podem inscrever-se desde que o Encarregado de Educação
        preencha os seus dados e autorize o tratamento.
      </p>
      <p>
        Quem quiser <strong>praticar uma modalidade</strong> no clube tem de ser
        sócio. A inscrição desportiva é tratada depois, presencialmente na sede, e
        está sujeita às vagas existentes em cada modalidade.
      </p>

      <h3>Dados verdadeiros</h3>
      <p>
        A informação que preencheres deve ser verdadeira e atual. Dados errados
        podem impedir a emissão do cartão ou a tua identificação como sócio. Se
        algo mudar — morada, contacto, documento — avisa o clube.
      </p>

      <h3>Cartão de sócio</h3>
      <p>
        O cartão é emitido pelo clube depois de confirmado o pagamento e{" "}
        <strong>levantado na sede</strong>. Não há envio por correio. O cartão é
        pessoal e intransmissível.
      </p>

      <h2>3. Quotas e pagamentos</h2>

      <h3>Valor</h3>
      <p>
        A quota é de <strong>{formatEuros(QUOTA_MENSAL)} por mês</strong>, igual
        para todos os sócios. Não há jóia de inscrição nem categorias com preços
        diferentes. Escolhes apenas a periodicidade do pagamento:
      </p>
      <ul>
        {PERIODICIDADES.map((p) => (
          <li key={p.id}>
            <strong>{p.nome}</strong> — {formatEuros(valorPorCobranca(p.id))}{" "}
            de cada vez
          </li>
        ))}
      </ul>

      <h3>Métodos</h3>
      <p>
        Consoante o que estiver disponível, podes pagar por MB WAY, referência
        Multibanco, transferência bancária ou débito direto. As referências
        Multibanco são válidas durante 24 horas; depois disso é preciso gerar
        outra.
      </p>

      <h3>Confirmação</h3>
      <p>
        A inscrição só fica completa depois de o pagamento ser confirmado. Nos
        métodos automáticos a confirmação é imediata; na transferência bancária
        depende da entrada do valor na conta do clube.
      </p>

      <h3>Alterações de valor</h3>
      <p>
        O valor da quota é fixado pelos órgãos sociais do clube e pode ser
        alterado nos termos dos estatutos. Qualquer alteração é comunicada aos
        sócios com antecedência.
      </p>

      <h3>Devoluções</h3>
      <p>
        As quotas pagas correspondem ao período de filiação já decorrido e, em
        regra, não são devolvidas. Se houver cobrança indevida ou erro,
        contacta-nos e resolvemos.
      </p>

      <h2>4. Cancelar a inscrição</h2>
      <p>
        Podes deixar de ser sócio quando quiseres, avisando o clube por email ou
        na sede. Cessam as quotas futuras; as já pagas mantêm-se.
      </p>

      <h2>5. Utilização do site</h2>
      <p>Ao usar este site comprometes-te a não:</p>
      <ul>
        <li>Submeter dados falsos ou de terceiros sem autorização</li>
        <li>Tentar aceder a áreas reservadas sem autorização</li>
        <li>Interferir com o funcionamento do site ou dos seus serviços</li>
        <li>Usar os conteúdos para fins comerciais sem acordo do clube</li>
      </ul>

      <h2>6. Conteúdos e propriedade</h2>
      <p>
        O emblema, o nome, as cores e os conteúdos deste site pertencem ao Valejas
        Atlético Clube. Podes partilhar links e citar com indicação da fonte. Usar
        o emblema ou o nome do clube em material próprio exige autorização
        escrita da Direção.
      </p>
      <p>
        Os comunicados oficiais publicados aqui são da responsabilidade da
        Direção do clube.
      </p>

      <h2>7. Loja e equipamento</h2>
      <p>
        As compras de equipamento são levantadas na sede do clube. Quando a loja
        do site estiver em funcionamento, as condições específicas de encomenda,
        reserva e levantamento serão publicadas nesta página.
      </p>

      <h2>8. Disponibilidade</h2>
      <p>
        Fazemos o possível para manter o site a funcionar, mas não garantimos
        disponibilidade permanente. Pode haver interrupções para manutenção ou por
        motivos técnicos alheios ao clube.
      </p>

      <h2>9. Ligações para outros sites</h2>
      <p>
        Este site liga para a loja oficial, redes sociais e sites de parceiros.
        Esses sites têm regras próprias e o clube não responde pelo conteúdo
        deles.
      </p>

      <h2>10. Proteção de dados</h2>
      <p>
        O tratamento dos teus dados está explicado na{" "}
        <a href="/privacidade">Política de Privacidade</a>, que faz parte destes
        termos.
      </p>

      <h2>11. Lei aplicável</h2>
      <p>
        Aplica-se a lei portuguesa. Para qualquer litígio é competente o foro da
        comarca de Lisboa, sem prejuízo dos direitos que a lei reconhece aos
        consumidores.
      </p>

      <h2>12. Alterações</h2>
      <p>
        Estes termos podem ser atualizados. A data no topo da página indica a
        última versão.
      </p>
    </PaginaLegal>
  );
}
