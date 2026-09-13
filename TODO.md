# TODO — Website Valejas AC

Estado em 13/09/2026. O código está feito e testado; o que falta abaixo
é sobretudo **contas externas e dados reais do clube**.

---

## 1. Contas externas a criar

Nenhuma destas existe ainda. Sem elas o site funciona, mas em modo
degradado — cada uma tem um comportamento de recurso que não rebenta.

### Domínio (Amen)
- [ ] Comprar domínio do clube
- [ ] Apontar DNS para a Vercel
- [ ] `NEXT_PUBLIC_SITE_URL` com o endereço final
- **Sem isto:** site vive no `.vercel.app`. A Meta precisa de um endereço
  público para ir buscar a imagem dos comunicados.

### Email institucional — cinco caixas em domínio próprio
Decisão da Direção: emails no domínio do clube, não Gmail.
- [ ] `presidente@`
- [ ] `direcao@`
- [ ] `comunicacao@`
- [ ] `coordenacao@`
- [ ] `geral@` (ou `info@`)
- [ ] Escolher onde alojar o correio (Google Workspace, Zoho, ou o que vier
      com o domínio da Amen) — muda o custo mensal
- [ ] Decidir qual recebe as inscrições de sócio (`EMAIL_CLUBE`) e qual
      assina os envios (`EMAIL_REMETENTE`)
- [ ] Conta em **resend.com** (grátis até 3000 emails/mês)
- [ ] Verificar o domínio no Resend, se houver domínio próprio
- [ ] `EMAIL_PROVIDER=resend`, `RESEND_API_KEY`, `EMAIL_REMETENTE`, `EMAIL_CLUBE`
- **Sem isto:** as inscrições de sócio não chegam a ninguém
  (`EMAIL_PROVIDER=log` escreve no terminal e não envia).

### Ifthenpay — pagamentos automáticos
- [ ] Contrato do clube com a Ifthenpay (precisa de NIF e IBAN do clube)
- [ ] Pedir a tabela de preços: custo por referência Multibanco e por
      transação MB WAY — decide se vale a pena manter a quota mensal
- [ ] `IFTHENPAY_MBWAY_KEY`, `IFTHENPAY_MB_KEY`, `IFTHENPAY_CALLBACK_CHAVE`
- [ ] Registar o URL de callback no backoffice deles:
      `https://<domínio>/api/pagamento/callback?chave=<segredo>&orderId=[ORDER_ID]&amount=[AMOUNT]`
- [ ] Acrescentar `referencia` a `NEXT_PUBLIC_PAGAMENTOS_ATIVOS`
- [ ] Confirmar os códigos de estado da Ifthenpay contra a conta real —
      foram implementados a partir da documentação
- **Sem isto:** MB WAY e Referência devolvem 503 e o formulário cai para
  pagamento manual (transferência para o IBAN). Testado, não rebenta.

### Make.com — publicar nas redes
- [ ] Conta grátis em make.com
- [ ] Seguir o `GUIA_REDES_SOCIAIS.md` (sete passos)
- [ ] `MAKE_WEBHOOK_URL`, `MAKE_WEBHOOK_SEGREDO`
- **Sem isto:** o Presidente publica no site, e as redes ficam em modo
  demonstração (mostra o que iria publicar, não publica).

### Instagram e Facebook
- [ ] Conta de Instagram do clube passada a **Profissional**
- [ ] Instagram ligado à Página de Facebook do clube
- [ ] Confirmar quem é administrador da Página
- **Sem isto:** o Instagram não aceita publicações de lado nenhum, nem
  pelo Make nem diretamente.

### Sanity — guardar comunicados
- [ ] Projeto no Sanity
- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`
- [ ] `SANITY_API_TOKEN` com permissão de escrita
- **Sem isto:** o comunicado sai nas redes mas não fica guardado no site,
  e o site continua a mostrar os comunicados de exemplo.

---

## 2. Segredos a gerar antes de ir para o ar

- [ ] `DIRECAO_PASSWORD` — está `valejas1966`, valor de desenvolvimento. **Trocar.**
- [ ] `DIRECAO_SECRET` — `openssl rand -hex 32`
- [ ] `MAKE_WEBHOOK_SEGREDO` — `openssl rand -hex 24`
- [ ] `IFTHENPAY_CALLBACK_CHAVE` — `openssl rand -hex 24`
- [ ] Todas as variáveis repetidas na Vercel → Settings → Environment Variables,
      seguidas de **redeploy** (só entram no deploy seguinte)

---

## 3. Dados reais em falta

- [x] ~~Código postal~~ — resolvido: `2730-132 Queluz de Baixo`. A
      pesquisa de julho (`2745-663`) estava errada
- [ ] **História** — não há registo público dos fundadores nem ata da
      fundação. A página assume isso e convida quem souber a contar.
      Vale a pena a Direção procurar no arquivo do clube
- [ ] **Quota** — confirmar com a Direção: 1€/mês, sem jóia, sem categorias
- [ ] **Atletismo** — grupo (competição ou comunidade?), vertentes reais
      (pista, estrada, corta-mato, marcha?), escalões, federação. O texto
      atual foi escrito por inferência
- [ ] **Fotografias reais** — plantel e corpo técnico continuam com
      placeholders (`PlantelFilter.tsx`, `EquipasHero.tsx`, `CorpoTecnico.tsx`)
- [ ] **Plantel** — a página já está por Equipa A / Equipa B / Formação e
      sem estatísticas, mas os oito jogadores em `PlantelFilter.tsx` são
      inventados. Falta o plantel real: nome, número e posição, por equipa.
      A Equipa B e a Formação estão vazias e mostram estado vazio
- [ ] **Atletismo** — o site diz "todos os escalões" sem os enumerar.
      Se a Direção quiser a lista escalão a escalão, como no futsal, falta
      saber quais são e a federação
- [ ] **Órgãos sociais** — faltam as fotografias dos 20 membros. O cartaz
      da Lista A tem-nas; é preciso os ficheiros. Enquanto não houver, os
      cartões mostram as iniciais
- [ ] **Órgãos sociais** — no cartaz, Mário Sérgio Barata e Teresa Santos
      têm ambos o Sócio N.º 167. Um dos dois está errado
- [ ] **Jogos** — os adversários chamam-se "Equipa Adversária N" de
      propósito, para não repetir o erro dos nomes inventados. Assim que
      o Sanity estiver ligado, o departamento de comunicação preenche em
      `/direcao/jogos` e o site passa a usar esses dados
- [ ] **Patrocinadores** — faltam logótipos e links. Descrições de QB,
      Ninho da Rola e Muchacho são genéricas por falta de informação
- [ ] **Instalações** — faltam fotografias da sede e do pavilhão
- [ ] **Academia Sénior** — confirmar se a lista de atividades está completa
      e se o horário se mantém

---

## 4. Por verificar quando houver CMS

- [ ] **Incremento do slug** — a segunda "Assembleia Geral" deve ficar
      `assembleia-geral-ordinaria-2`. A lógica compila mas nunca correu:
      sem Sanity local, a função devolve sempre o slug base. Publicar o
      mesmo título duas vezes e confirmar.

---

## 5. Dívida técnica conhecida

- [ ] **Conteúdo de notícias é inventado** — `noticias.ts` tem um reforço
      vindo do "São Paulo FC" para um clube de futsal de Barcarena, uma
      academia em construção, uma entrevista e um derby 5-1, todos datados
      de 2024. Os cartões já não levam a páginas mortas, mas o texto
      continua lá e é o que ocupa a maior secção da homepage
- [ ] **Navegação cresceu para 8 itens** — `/jogos` entrou por ser
      essencial, mas a barra está no limite. A crítica já apontava
      sobrecarga com 7. Rever a arquitetura de navegação, não só a lista
- [ ] **Sem fotografias em todo o site** — `public/` tem quatro ficheiros
      do emblema e seis de tipografia. Zero pessoas. A crítica identifica
      isto como a razão de o site ler frio apesar do sistema visual
- [ ] **Publicar comunicado não tem confirmação** — um clique envia para
      Facebook e Instagram, sem rascunho guardado e sem forma de corrigir

- [ ] **Grelhas de cartões idênticos** — órgãos sociais são 20 cartões
      iguais, Academia Sénior 11, e patrocinadores e instalações seguem o
      mesmo molde. Apanhado na auditoria de design e **não corrigido**:
      precisa de decisão de layout, não de uma limpeza mecânica
- [ ] **Vermelho fora da paleta** — faixa do topo e `btn-danger` continuam
      vermelhos depois de a paleta ter sido fixada em amarelo + azul
- [ ] **Acessibilidade por testar a sério** — as correções foram feitas
      contra a norma e verificadas no código, mas o site nunca foi
      percorrido com leitor de ecrã

- [ ] `/api/comunicado-publish` — bearer simples. Substituir por
      verificação HMAC do webhook do Sanity, ou apagar a rota se o fluxo
      passar todo por `/direcao`
- [ ] Taxa de pagamento online — mecanismo existe em `quota.ts` com todos
      os valores a zero (a Direção decidiu absorver a comissão). Se nunca
      for usado, arrancar o código
- [ ] `src/lib/social/meta.ts` — publicação direta na Meta, mantida como
      alternativa ao Make. Só serve se o clube um dia tiver app aprovada

---

## 6. Pontos da reunião

- [x] **1** — Ênfase em ser sócio; ficha de inscrição; pagamento
- [x] **2** — Presidente publica comunicados no site e nas redes com o emblema
- [x] **3** — Modalidades reais, ênfase no futsal e na Academia Sénior
- [~] **4** — Refazer a loja (ver secção 7) — construída com catálogo de exemplo;
      falta a lista real de produtos e o pagamento ligado
- [x] **5** — Página de órgãos sociais (Direção, Conselho Fiscal, MAG)
- [x] **6** — Página da história (fundação, origens, localização com mapa)
- [x] **7** — Mote, patrocinadores e instalações
- [x] **8** — Página de jogos + área do departamento de comunicação
- [x] **9** — Ecrã de carregamento com o logo do clube
- [x] **10** — Páginas legais (privacidade reescrita, termos e cookies novos)

---

## 7. Ponto 4 da reunião — Refazer a loja

> Construída a 13/09/2026. O que segue descreve o que ficou feito, o que
> está por decidir, e o que ainda falta ligar.

### O que já está no site

| Página | O que faz |
|---|---|
| `/loja` | Catálogo por categorias, kit de formação em destaque, escolha de tamanho, stock por tamanho, personalização com nome e número |
| `/loja/carrinho` | Revisão da encomenda, identificação de quem encomenda, escolha entre sinal e pagamento total, envio |
| `/api/loja/encomenda` | Revalida tudo no servidor (os preços vêm do catálogo, nunca do browser), envia email ao clube e recibo a quem encomendou, cria o registo no Sanity |
| `/direcao/encomendas` | Lista das encomendas, resumo do que há a pedir ao fornecedor, estados *recebida → encomendada → pronta → levantada*, marcação de pagamento e notas internas |

O carrinho vive no `localStorage` do browser. A encomenda em si não
depende do CMS: se o Sanity estiver em baixo, o email continua a sair e a
encomenda existe na caixa de correio do clube.

### O que falta para isto ir para o ar

- [ ] **Catálogo real.** O que lá está é exemplo — ver
      `CATALOGO_DE_EXEMPLO = true` em `src/lib/data/loja.ts`. Falta a lista
      da ZEMIG com nomes, preços, tamanhos e stock da sede
- [ ] **Percentagem do sinal.** Está em 30% (`SINAL_PERCENTAGEM`), número
      inventado por falta de decisão. Num kit de 85 € dá 25,50 €
- [ ] **Pagamento ligado.** O site regista a encomenda e diz o valor; os
      dados de pagamento seguem no email. Falta decidir se o MB WAY e a
      referência das quotas passam também a servir a loja
- [ ] **Fotografias dos produtos.** O catálogo aceita imagem, não há nenhuma
- [ ] **Sanity configurado no servidor**, senão `/direcao/encomendas` só
      mostra o aviso de CMS em falta

### Objetivo

Todo o equipamento — incluindo os **kits obrigatórios de formação** — passa
a ser comprado ou encomendado na loja do site. Hoje há só um link externo
para a plataforma CTT (Zemig Sportswear), que não é do clube.

### O que muda tudo: levantamento sempre no clube

Não há envios. Isto não é uma loja online no sentido normal — é um
**sistema de encomenda e reserva** com levantamento na sede.

Consequências, todas a favor:
- Sem cálculo de portes, sem moradas de entrega, sem transportadoras
- Sem gestão de devoluções à distância
- Provas de tamanho podem ser feitas no clube antes de fechar a encomenda
- A decisão de Março (Shopify Headless) **deve ser reavaliada**: uma
  plataforma de e-commerce completa traz peso e custo mensal para
  resolver problemas que este clube não tem. Vale a pena comparar com
  uma loja simples construída na stack atual

### Categorias pedidas

Todas construídas em `src/lib/data/loja.ts`, à espera dos produtos reais.

- [x] Material de jogo
- [x] Material de treino
- [x] **Kit obrigatório de formação** — com destaque próprio, a preço fechado
- [x] Produtos personalizados (nome, número)
- [x] Material sazonal
- [ ] (a Direção deve fechar a lista de produtos dentro de cada categoria)

### Pagamento

Levantamento é sempre no clube, o que abre três momentos possíveis:
pagar tudo online, pagar um sinal de reserva online, ou pagar no
levantamento.

| Método | Estado |
|---|---|
| MB WAY | Já implementado para as quotas — reaproveitável |
| Entidade e referência | Já implementado, 24h de validade — reaproveitável |
| Pagamento no levantamento | Só precisa de estado de encomenda, sem gateway |
| Transferência + comprovativo | **Por decidir — ver abaixo** |

### A dúvida da transferência com comprovativo

Funcionaria assim: o sócio faz a encomenda, o site mostra o IBAN e um
número de encomenda, ele transfere e envia o comprovativo. Alguém do
clube abre o email, confere que o valor bateu certo, e marca a encomenda
como paga.

**O problema é o "alguém do clube".** É trabalho manual por cada
encomenda, feito por quem já transcreve fichas de sócio à mão. Com o
levantamento a ser sempre presencial, esta opção resolve pouco: quem vai
lá buscar pode simplesmente pagar na hora, por MB WAY ou dinheiro.

**Recomendação:** não construir a opção de comprovativo. Ficam três:
pagar online (MB WAY ou referência), pagar sinal online, ou pagar no
levantamento. Se a Direção insistir, o mais simples é o comprovativo ser
carregado no próprio site em vez de enviado por email — pelo menos fica
agarrado à encomenda em vez de perdido na caixa de correio.

### Decisões já tomadas (13/09/2026)

- Kit de formação: **pacote a preço fechado**
- Stock: há stock na sede e prazo máximo de **2 semanas** para o que falta
- Levantamento **sempre na sede**, nunca envio para casa
- Pagamento: o sócio escolhe entre **sinal online** e **pagamento total**
- Quem trata das encomendas: a Direção, em `/direcao/encomendas`

### Ainda por decidir

- [ ] Percentagem do sinal (está em 30% por omissão)
- [ ] Preços diferentes para sócios?
- [ ] Fotografias dos produtos — existem, ou é preciso produzi-las?
