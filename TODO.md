# TODO — Website Valejas AC

Estado a 14/09/2026, fim da segunda sessão de trabalho.
Revisto ao fim do dia — ver a nota do corpo técnico na secção 5.

O código está feito e testado. **O que falta é quase tudo fora do código:**
contas por criar, dados que só o clube tem, e três decisões que custam
dinheiro ou tempo.

## O que bloqueia ir para o ar

Por ordem de quem desbloqueia mais coisas de uma vez:

| # | O quê | Sem isto |
|---|---|---|
| 1 | **Resolver o impasse da Vercel** — projeto antigo ocupa o subdomínio | Não há deploy nenhum |
| 2 | **Conta Resend + verificar o domínio** — as 5 caixas já existem | As inscrições e as encomendas não chegam a ninguém: o site está em modo `log` |
| 3 | **Contas e segredos** — criar `DIRECAO_UTILIZADORES` (uma por pessoa) e apagar a palavra-passe de desenvolvimento | Quem adivinhar `valejas1966` publica no Instagram do clube |
| 4 | **DNS do domínio** quando o registo confirmar | O site vive no `.vercel.app` |
| 5 | **`SANITY_API_TOKEN` na Vercel** | O site mostra dados de exemplo em vez do CMS |
| 6 | ~~Confirmação antes de publicar nas redes~~ | ✅ feito a 14/09/2026 |

## Decisões com prazo

| Até quando | O quê |
|---|---|
| **14/10/2026** | Plano do Sanity — o Free não permite datasets privados, e as encomendas levam nome, email e telemóvel (§1) |
| Antes da loja abrir | Percentagem do sinal (está 30%, inventado por mim) e preços dos 11 artigos sob consulta (§7) |
| Quando houver tempo | Se se recolhem dados clínicos online, e como (§8) |
| Sem prazo | Línguas do site — cinco escolhidas (§9) |

## Índice

1. [Contas externas a criar](#1-contas-externas-a-criar) — domínio, email, pagamentos, redes, CMS
2. [Segredos a gerar](#2-segredos-a-gerar-antes-de-ir-para-o-ar)
3. [Dados reais em falta](#3-dados-reais-em-falta) — plantel, fotografias, stock
4. [Por verificar quando houver CMS](#4-por-verificar-quando-houver-cms)
5. [Dívida técnica conhecida](#5-dívida-técnica-conhecida)
6. [Pontos da reunião](#6-pontos-da-reunião) — o que ficou feito
7. [A loja](#7-ponto-4-da-reunião--refazer-a-loja)
8. [Ficha oficial de atleta e dados clínicos](#8-ficha-oficial-de-atleta--o-que-o-site-ainda-não-pede)
9. [Línguas do site](#9-línguas-do-site)

Documentos irmãos: `PRODUCT.md` (o que é e para quem), `DESIGN.md` (o sistema
visual), `OPERACAO.md` (como o clube o trabalha), `SETUP.md` (instalar e pôr
no ar).

---

## 1. Contas externas a criar

Nenhuma destas existe ainda. Sem elas o site funciona, mas em modo
degradado — cada uma tem um comportamento de recurso que não rebenta.

### Domínio (Amen)
- [x] Comprar domínio do clube — **valejasac.pt**, comprado a
      14/09/2026, à espera da confirmação do registo
- [ ] Apontar DNS para a Vercel: `A` → `76.76.21.21` no domínio raiz,
      `CNAME` → `cname.vercel-dns.com` no `www`. O endereço oficial é
      **valejasac.pt**, sem `www`; o `www` fica a redirecionar para lá
- [ ] Acrescentar o domínio ao projeto na Vercel e esperar pelo
      certificado, que é automático
- [ ] `NEXT_PUBLIC_SITE_URL="https://valejasac.pt"` na Vercel
- [ ] Na Vercel, marcar `valejasac.pt` como domínio principal e o `www`
      como redirecionamento — não o contrário
- **Sem isto:** site vive no `.vercel.app`. A Meta precisa de um endereço
  público para ir buscar a imagem dos comunicados.

### Email institucional — cinco caixas em domínio próprio
Decisão da Direção: emails no domínio do clube, não Gmail.
- [x] `presidente@valejasac.pt` ✅ criada a 14/09/2026
- [x] `direcao@valejasac.pt` ✅
- [x] `comunicacao@valejasac.pt` ✅
- [x] `coordenacao@valejasac.pt` ✅
- [x] `geral@valejasac.pt` ✅
- [x] ~~Escolher onde alojar o correio~~ — Amen, cinco contas de 2 GB,
      válidas até 28/04/2027. Limite de 500 envios por caixa, que não
      afeta o site: quem envia é a Resend, não estas caixas
- [x] ~~Decidir qual recebe o quê~~ — escrito no `.env.local`:
      geral@ é a caixa por omissão e assina os envios, direcao@ recebe as
      fichas de sócio e os pagamentos, coordenacao@ os pedidos de
      inscrição. Confirmado a funcionar em modo log
- [x] ~~Formspree~~ — deixou de ser preciso. O formulário de contacto
      passou a enviar pelo próprio clube a 14/09/2026, e o assunto
      escolhido decide a caixa que recebe
- [ ] Conta em **resend.com** (grátis até 3000 emails/mês)
- [ ] Verificar `valejasac.pt` no Resend — são mais dois registos DNS,
      SPF e DKIM, sem os quais os emails de inscrição caem no spam
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
- [ ] Seguir os sete passos em `OPERACAO.md` → «Ligar o site às redes sociais»
- [ ] `MAKE_WEBHOOK_URL`, `MAKE_WEBHOOK_SEGREDO`
- **Sem isto:** o Presidente publica no site, e as redes ficam em modo
  demonstração (mostra o que iria publicar, não publica).

### Instagram e Facebook
- [ ] Conta de Instagram do clube passada a **Profissional**
- [ ] Instagram ligado à Página de Facebook do clube
- [ ] Confirmar quem é administrador da Página
- **Sem isto:** o Instagram não aceita publicações de lado nenhum, nem
  pelo Make nem diretamente.

### Sanity — o CMS ✅ feito a 14/09/2026
- [x] Projeto **Valejas Website** (`q1z6dv1y`), dataset `production`
- [x] `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`
- [x] `SANITY_API_TOKEN` — token `site-valejas`, papel *editor*, sem
      prazo. Está no `.env.local`, que não vai para o repositório
- [x] Origens CORS: `localhost:3000`, `valejasac.pt` e `www.valejasac.pt`
- [x] Dataset passado a **privado**. Vinha público, e público no Sanity
      quer dizer que qualquer pessoa com o id do projeto — que está no
      JavaScript do site — lia tudo sem token, incluindo os nomes,
      emails e telemóveis das encomendas da loja
- [ ] ⚠️ Como o dataset é privado, **sem `SANITY_API_TOKEN` no servidor
      o site não lê nada** e volta aos dados de exemplo. A variável tem
      de estar na Vercel antes de o site ir para o ar
- [x] Ciclo completo testado contra o Sanity real: escrever um jogador,
      lê-lo na API, vê-lo na página pública e apagá-lo
- [ ] Repetir as três variáveis na Vercel quando o projeto lá existir
- [ ] Escrever o conteúdo verdadeiro: plantel, resultados, classificação

#### ⚠️ Decisão a tomar antes de 14/10/2026 — fim do teste

O projeto está no **Growth Trial**, 30 dias. Ao fim disso desce para o
plano **Free**, e o Free só permite **datasets públicos**. Público quer
dizer que qualquer pessoa com o id do projeto lê tudo sem token.

Conteúdo editorial — comunicados, notícias, jogos, plantel — é para ser
público de qualquer maneira: sai no site. **O problema são as
encomendas da loja**, que levam nome, email e telemóvel.

Três saídas:

- [ ] **Pagar o Growth** — 15 $/lugar/mês, ou seja ~14 €. Um lugar
      chega se só o Berto entrar no Studio; a Direção usa `/direcao`,
      que não precisa de conta Sanity. É a saída que não muda nada
- [ ] **Tirar os dados pessoais do CMS** — a encomenda fica no Sanity
      só com número, peças e estado; o nome, email e telemóvel vivem
      apenas no email que chega ao clube. Custa zero, mas a Direção
      deixa de poder ligar a alguém a partir da página
- [ ] **Mudar as encomendas para uma base de dados** (Neon, Supabase,
      Vercel Postgres — todas com plano grátis suficiente para isto).
      Mais trabalho de uma vez, e resolve de vez

---

## 2. Segredos a gerar antes de ir para o ar

- [ ] `DIRECAO_UTILIZADORES` — uma conta por pessoa, em pares
      `nome:palavra-passe` separados por vírgulas. São escritas por
      pessoas: três palavras sem relação entre si valem mais que `Vlj!26#`
- [ ] Apagar `DIRECAO_PASSWORD` depois — está `valejas1966`, valor de
      desenvolvimento, e só é usada enquanto não houver contas
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
- [ ] **Corpo técnico** — quem treina cada equipa e cada escalão. A lista
      está **vazia** em `EQUIPA_TECNICA` e a página assume isso. Ver o
      aviso na secção 5 sobre o que lá estava antes
- [ ] **Fotografias reais** — plantel, equipa técnica e o retrato do hero
      de `/equipas` continuam com lugares reservados
- [ ] **Plantel** — a Direção já o pode escrever em `/direcao/plantel`.
      Falta escrevê-lo: nome, número e posição, por equipa. Enquanto não
      estiver no CMS, o site mostra os oito nomes de exemplo de
      `src/lib/data/plantel.ts`
- [ ] **Atletismo** — o site diz "todos os escalões" sem os enumerar.
      Se a Direção quiser a lista escalão a escalão, como no futsal, falta
      saber quais são e a federação
- [ ] **Órgãos sociais** — faltam as fotografias dos 20 membros. O cartaz
      da Lista A tem-nas; é preciso os ficheiros. Enquanto não houver, os
      cartões mostram as iniciais
- [ ] **Órgãos sociais** — no cartaz, Mário Sérgio Barata e Teresa Santos
      têm ambos o Sócio N.º 167. Um dos dois está errado
- [ ] ⚠️ **Contactos do site não batem certo com os documentos do clube.**
      Apanhado a 14/09/2026, ao comparar com a ficha de atleta e o termo
      de direitos de imagem:

      | | No site | Nos documentos do clube |
      |---|---|---|
      | Telefone | +351 214 365 104 | 216 023 289 |
      | Email | valejas.a.c@gmail.com | valejas.a.c@hotmail.com (rodapé) e secretaria.valejasac@gmail.com (dados) |
      | Localidade | 2730-132 Valejas | Valejas — 2730-132 Barcarena |

      **Não mudei nada**: os documentos são de 2022 e 2026 e podem estar
      desatualizados tal como o site. É preciso alguém do clube dizer qual
      é o número que atende e qual é a caixa que alguém lê
- [x] ~~**Jogos** — adversários de exemplo~~ — resolvido a 14/09/2026: o
      calendário oficial das 30 jornadas veio do PDF da AF Lisboa. Falta
      preencher resultados e classificação em `/direcao/jogos` à medida
      que se joga
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

- [x] ~~**Conteúdo de notícias inventado**~~ — apagado, e `/noticias` passou
      a redirecionar para `/comunicados`: eram dois sítios para escrever a
      mesma coisa e um estava vazio
- [x] ~~**Corpo técnico inventado**~~ — apanhado a 14/09/2026, ao rever o
      TODO. O treinador principal de `/equipas` chamava-se **Marco Reus** —
      o jogador do Borussia Dortmund — com uma citação inventada atribuída
      a ele e a época 2024/25, mais três adjuntos que não existem. Estava
      publicado desde maio. Apagado; a secção passa a dizer a verdade
- [x] ~~**Sem documentos para descarregar**~~ — o exame médico desportivo
      do IPDJ está em `/inscricoes`, e no ecrã logo a seguir a enviar a
      inscrição
- [x] ~~**Navegação com 8 itens**~~ — resolvido a 14/09/2026: cinco
      destinos (Início, Comunicados, Modalidades, Sénior, Contactos), um
      submenu «Clube» com as cinco páginas do clube, e a loja e o cartão
      de sócio passados a botões
- [ ] **Sem fotografias de pessoas em todo o site** — há agora as 23
      maquetas de equipamento da loja, mas nem uma fotografia de gente:
      jogadores, treinos, pavilhão, bancada. É a razão de o site ler frio
      apesar do sistema visual
- [x] ~~**Publicar comunicado não tem confirmação**~~ — resolvido a
      14/09/2026: há um passo de confirmação com o texto, a imagem e a lista
      de onde vai sair. Continua sem rascunho guardado, e corrigir depois de
      publicado obriga a ir às redes

- [ ] **Grelhas de cartões idênticos** — órgãos sociais são 20 cartões
      iguais, Academia Sénior 11, e patrocinadores e instalações seguem o
      mesmo molde. Apanhado na auditoria de design e **não corrigido**:
      precisa de decisão de layout, não de uma limpeza mecânica
- [ ] **Vermelho fora da paleta** — faixa do topo e `btn-danger` continuam
      vermelhos depois de a paleta ter sido fixada em amarelo + azul
- [ ] **Acessibilidade por testar a sério** — as correções foram feitas
      contra a norma e verificadas no código, mas o site nunca foi
      percorrido com leitor de ecrã
- [x] ~~**Zero testes automatizados**~~ — 25 testes sobre as regras que custam
      dinheiro ou dados, a correr com `npm test`
- [x] ~~**Sem SEO básico**~~ — `sitemap.xml`, `robots.txt` e cartão de partilha
      gerado em `/imagem-partilha`
- [x] ~~**Dois estilos de título**~~ — `font-display` foi removida; há um só
      estilo de título em todo o site
- [x] ~~**Notícias e comunicados eram dois sítios para o mesmo**~~ —
      `/noticias` redireciona para `/comunicados`

- [x] ~~**Palavra-passe partilhada na área da Direção**~~ — resolvido a
      14/09/2026: `DIRECAO_UTILIZADORES` leva pares nome:palavra-passe, a
      sessão guarda quem é, e tirar o acesso a uma pessoa já não obriga a
      mudar a de todas. **Falta criar as contas reais**
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
- [x] Plantéis editáveis pela Direção em /direcao/plantel — equipa A, B e os
      sete escalões. Falta a lista real de jogadores: o que está no site é
      um plantel de exemplo até alguém escrever o verdadeiro
- [x] **8** — Página de jogos + área do departamento de comunicação
      (calendário oficial das 30 jornadas importado do PDF da AF Lisboa
      a 14/09/2026; resultados e classificação atualizam-se em /direcao/jogos)
- [x] **9** — Ecrã de carregamento com o logo do clube
- [x] **10** — Páginas legais (privacidade reescrita, termos e cookies novos)

---

## 7. Ponto 4 da reunião — Refazer a loja

> Construída a 13/09/2026. O que segue descreve o que ficou feito, o que
> está por decidir, e o que ainda falta ligar.

### O que já está no site

| Página | O que faz |
|---|---|
| `/loja` | Kit obrigatório de atleta em destaque, catálogo com filtros por família e por preço, escolha de tamanho por lista, personalização com nome e número |
| `/loja/carrinho` | Revisão da encomenda, identificação de quem encomenda, escolha entre sinal e pagamento total, envio |
| `/api/loja/encomenda` | Revalida tudo no servidor (os preços vêm do catálogo, nunca do browser), envia email ao clube e recibo a quem encomendou, cria o registo no Sanity |
| `/direcao/encomendas` | Lista das encomendas, resumo do que há a pedir ao fornecedor, estados *recebida → encomendada → pronta → levantada*, marcação de pagamento e notas internas |

O carrinho vive no `localStorage` do browser. A encomenda em si não
depende do CMS: se o Sanity estiver em baixo, o email continua a sair e a
encomenda existe na caixa de correio do clube.

### O que falta para isto ir para o ar

- [x] **Catálogo real.** Os 23 artigos da ZEMIG (referências, preços,
      tamanhos e fotografias) foram importados a 14/09/2026 da loja CTT
- [ ] **Stock da sede.** Está tudo a zero, ou seja, tudo «por encomenda».
      Alguém tem de contar o que há na sede e pôr os números em
      `src/lib/data/loja.ts`
- [ ] **Preços sob consulta.** Treze artigos não têm preço fechado no
      fornecedor e por isso não se encomendam pelo site — só por contacto.
      Se a Direção fechar preços, entram no carrinho
- [ ] **Condições da loja** (`/loja/condicoes`): escritas a partir do
      regime geral de vendas à distância. Falta a Direção confirmar o
      prazo de troca (14 dias), se aceita trocas de peças não
      personalizadas, e quem responde às reclamações
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

---

## 8. Ficha oficial de atleta — o que o site ainda não pede

O clube tem uma **Ficha Individual de Atleta** em papel (época 2026/2027,
fotografada a 14/09/2026) bem mais completa do que o formulário de
`/inscricoes`. O site pede o que serve para responder depressa; o resto
preenche-se na sede. Se um dia se quiser a ficha inteira online, falta:

- [ ] Morada, código postal, naturalidade, CC/TR com validade
- [ ] Agregado familiar: pai e mãe, com telemóvel, email e profissão
- [ ] Ocupação: escola e ano, passou ou reprovou, ou empresa e profissão
- [ ] Dados clínicos: médico e telefone, grupo sanguíneo, lesões graves,
      operações, uso de óculos
- [ ] Currículo desportivo: pratica futsal desde, 1.º clube, clubes que
      representou, escalão, no VAC desde que época
- [ ] Licença FPF e número de sócio-atleta
- [ ] A declaração de autorização para inscrição como sócio-atleta

### Como recolher isto, se se quiser mesmo (14/09/2026)

Metade dos campos acima são **dados de saúde** — categoria especial no
artigo 9.º do RGPD. «O site é seguro» não é uma propriedade do site: é
uma propriedade de onde os dados ficam. Hoje o site é seguro porque não
guarda nada.

**Aviso primeiro:** pôr os campos clínicos no formulário atual fá-los-ia
sair **por email**. É a pior das hipóteses — ficam na caixa de correio
para sempre, nos registos do fornecedor de email, e reencaminháveis com
um clique. Email não é sítio para dados de saúde.

Três caminhos:

- [ ] **1. Não recolher online** — a ficha clínica preenche-se na sede,
      em papel, com o exame médico. É o que está hoje. Risco zero
- [ ] **2. Recolher online tudo menos o clínico** — identificação,
      agregado familiar, ocupação e currículo desportivo não são
      categoria especial. Dá 80% da ficha digital sem entrar no regime
      do artigo 9.º. **É o que eu recomendo**
- [ ] **3. Recolher tudo, com o clínico cifrado** — possível, mas são
      quatro peças e não uma:
      - Base de dados em região europeia (Neon ou Supabase), nunca email
        nem Sanity
      - Cifra de chave pública nos campos clínicos: o site cifra, só a
        chave privada do clube abre. Um dump da base de dados sai
        ilegível, e nem o servidor consegue ler o que guardou
      - **Contas por pessoa na área da Direção.** A palavra-passe
        partilhada de hoje não serve para dados de saúde: é preciso saber
        quem viu o quê e poder cortar o acesso a uma pessoa sem mudar a
        de todas
      - Prazo de conservação com apagamento automático, registo de
        tratamento (artigo 30.º) e política de privacidade reescrita

**A favor do caminho 2, um argumento que não é técnico:** o clube não
precisa da maior parte destes dados. O exame médico é um atestado de
aptidão — diz apto ou não apto, e o diagnóstico não é do clube. Guardar
«que operações fez» é recolher mais do que se usa, e isso é excesso mesmo
com consentimento. O que serve mesmo ao treinador em campo — grupo
sanguíneo, alergias, contacto do médico — está melhor numa ficha de papel
no saco do equipamento: num acidente ninguém abre o site.

- [x] **Direitos de imagem** — o termo de consentimento RGPD do clube foi
      transcrito para `src/lib/data/direitosImagem.ts`, vive em
      `/inscricoes/direitos-de-imagem` e é obrigatório no formulário. Fica
      registado no email com a data, o texto aceite e quem o aceitou

---

## 9. Línguas do site

Pedido do Berto (14/09/2026). O site está todo escrito em português de
Portugal; a ideia é chegar a quem vive em Valejas e não tem o português
como primeira língua. Cinco línguas, fechadas a 14/09/2026.

### Línguas a fazer

- [ ] **Português (Portugal)** — a que existe hoje, passa a ser uma
      escolha explícita em vez do único texto do site
- [ ] **Inglês**
- [ ] **Espanhol**
- [ ] **Francês**
- [ ] **Crioulo de Cabo Verde** — a variante tem de ser decidida antes de
      se começar: o crioulo de Santiago (badiu) e o de São Vicente
      (sampadjudu) escrevem-se de maneira diferente, e há duas ortografias
      em circulação (ALUPEC/AK e a de base etimológica). Isto decide-se
      com quem fala, não num dicionário

### O que é preciso para isto acontecer

- [ ] **Tirar o texto do código.** Hoje as frases estão escritas dentro
      dos componentes. Têm de passar para ficheiros de tradução — o
      caminho normal em Next.js App Router é o `next-intl`, com as
      páginas debaixo de `/[lingua]/`
- [ ] **Decidir o que se traduz.** O site inteiro são ~30 páginas e muito
      texto escrito à mão. Vale a pena começar pelas que servem quem
      chega de fora: início, modalidades, sócios e inscrição, contactos,
      loja. Comunicados e notícias são conteúdo do CMS e ficam na língua
      em que forem escritos
- [ ] **Quem traduz.** Tradução automática dá para inglês, espanhol e
      francês a um nível aceitável, desde que revista. Para o crioulo não
      dá: é preciso alguém da comunidade a escrever — e há gente no clube
      para isso
- [ ] **Onde se escolhe a língua.** Um seletor na barra do topo, e
      lembrar a escolha. Nunca escolher pela pessoa a partir do país do
      IP: quem vive cá e fala crioulo tem IP português
- [ ] **Datas, horas e valores** já saem do `Intl` com locale fixo em
      `pt-PT` — passam a seguir a língua escolhida
- [ ] **SEO**: `hreflang` entre as versões e `lang` correto no `<html>`,
      senão o Google serve a versão errada

### Aviso de esforço

Isto não é um acrescento pequeno. São cinco línguas sobre um site com
texto denso e escrito com cuidado — a parte técnica é um dia ou dois, a
tradução é o trabalho todo. Vale a pena decidir primeiro **que páginas**
se traduzem, em vez de começar pelas cinco e ficar com três por acabar.
