# Operação — como o clube trabalha o site

Manual de quem mexe no site por dentro. Três áreas de trabalho — a Direção, o
departamento de comunicação, e quem trata da loja — e uma configuração que se
faz uma vez e não se volta a tocar.

> Atualizado a 14/09/2026. Absorve os guias antigos de redes sociais e de
> imagens da loja, hoje em `arquivo/`.

---

## Quem faz o quê

| Quem | Onde | O quê |
|---|---|---|
| **Presidente / Direção** | `/direcao` | Escreve comunicados e publica-os no site e nas redes |
| **Departamento de comunicação** | `/direcao/jogos` | Resultados e classificação, jornada a jornada |
| **Quem trata do futsal** | `/direcao/plantel` | Plantéis da equipa A, B e dos sete escalões |
| **Quem trata da loja** | `/direcao/encomendas` | Encomendas, estados e pagamentos |
| **O Berto** | `/studio` | Tudo o resto, em bruto, quando os ecrãs simples não chegam |

Todas as áreas em `/direcao` partilham **a mesma palavra-passe**. É dívida
conhecida: não se sabe quem fez o quê, e tirar o acesso a uma pessoa obriga a
mudar a de todas. Está no `TODO.md`.

O Studio é diferente: entra-se com conta Sanity, e só quem for membro do
projeto. Hoje é um membro só.

---

## Publicar um comunicado

1. Entrar em `/direcao`
2. Escrever título e texto
3. Escolher onde sai: site (sempre), Facebook, Instagram
4. Ver a pré-visualização — o site gera sozinho um cartão 1080×1080 com o
   emblema e o título
5. Publicar

O cartão existe porque **o Instagram recusa publicações sem imagem**. Sem ele,
o Instagram nunca funcionaria.

⚠️ **Não há confirmação nem rascunho.** Um clique publica nas duas redes, e não
há forma de corrigir a partir do site. Está no `TODO.md` como a dívida técnica
mais urgente.

---

## Jogos e classificação

Em `/direcao/jogos`. O calendário das 30 jornadas já lá está — veio do programa
oficial da AF Lisboa. O que falta preencher, à medida que se joga:

- **Resultados**: marcar o jogo como disputado e escrever os golos
- **Classificação**: a tabela dos 16 clubes, que começa toda a zero

A página pública usa o que estiver no CMS; sem CMS, mostra o calendário e uma
classificação a zeros. **Nunca inventa resultados.**

---

## Plantéis

Em `/direcao/plantel`, uma equipa de cada vez. Número, nome e posição — e é só.
Sem estatísticas, por decisão da Direção.

- **Quem sai a meio da época desliga-se**, não se apaga: fica no histórico e
  desaparece do site
- **Há um capitão por equipa.** Marcar um novo desmarca o anterior

---

## Encomendas da loja

Em `/direcao/encomendas`. Cada encomenda entra com um número (`VAC-260914-9NHF`)
e percorre quatro estados: **recebida → encomendada → pronta → levantada**.

No topo da página, o trabalho da semana: **o que há a pedir à ZEMIG**, somado
por peça e tamanho de todas as encomendas juntas, e **quantas estão por pagar**.

Ao abrir uma linha: email e telemóvel clicáveis, para que atleta é, as peças, e
um campo de nota interna que quem encomendou nunca vê.

Cada encomenda também chega **por email** ao clube, com um recibo para quem
encomendou. É a via que não depende do CMS estar de pé.

---

## As cinco caixas de correio

O clube tem cinco endereços em `valejasac.pt`, e o site sabe mandar cada
coisa para a caixa certa. A variável de cada assunto está no
`.env.example`; faltando alguma, o email cai na caixa geral.

**Decisão da Direção, 14/09/2026:** `presidente@` e `direcao@` **não recebem
nada do site**. São caixas de trabalho das pessoas, não endereços de
atendimento. Quem quiser falar com a Direção escreve para a geral.

| O que entra pelo site | Vai para |
|---|---|
| Ficha de sócio | `geral@` |
| Encomenda da loja | `geral@` |
| Confirmação de pagamento | `geral@` |
| Contacto com assunto geral | `geral@` |
| Inscrição numa modalidade | `coordenacao@` |
| Contacto sobre modalidades e treinos | `coordenacao@` |
| Proposta de parceria ou patrocínio | `comunicacao@` |
| Imprensa | `comunicacao@` |
| Cópia de cada comunicado publicado | `comunicacao@` |

A **caixa geral é o contacto por omissão**: é a que aparece no rodapé, no
botão de email ao lado das redes sociais, e nas páginas legais.

A **coordenação serve todas as modalidades** — futsal, atletismo, karate,
cicloturismo, judo, dança e teatro. É uma caixa só para quem treina.

A **comunicação** fica com o arquivo dos comunicados (título, quem publicou,
quando e por onde saiu) e é o endereço para quem quer fazer parceria: «fale
diretamente com a nossa comunicação».

Quem **assina** os envios é sempre o `EMAIL_REMETENTE`, e tem de ser um
endereço do domínio verificado na Resend. A resposta vai para quem
escreveu — as mensagens levam `reply-to` com o email da pessoa, para que
responder na caixa chegue a quem de direito.

> O `valejas.a.c@hotmail.com` está impresso na ficha de atleta e no termo
> de direitos de imagem que as pessoas têm em casa. Vale a pena mantê-lo a
> reencaminhar durante uns meses.

---

## Documentos para descarregar

Papéis que a pessoa imprime, trata fora do site e entrega na sede.
Ficheiros em `valejas-ac/public/documentos/`, listados em
`src/lib/data/documentos.ts`.

| Ficheiro | O quê |
|---|---|
| `exame-medico-desportivo.pdf` | Formulário oficial do IPDJ. Obrigatório para treinar e competir |

Aparecem em dois sítios: na secção **«O que levar à sede»** da página de
inscrições, e no ecrã que se vê logo depois de enviar a inscrição — que é o
momento em que a pessoa está mais disponível para tratar do assunto.

**Não se recebe o exame médico preenchido pelo site**, e não é por descuido: é
assinado por um médico e leva dados de saúde. Entrega-se o original na sede.

Para acrescentar outro documento: pôr o PDF na pasta e uma entrada em
`documentos.ts`. A página apanha-o sozinha.

---

## Fotografias que faltam

O site não tem **uma única fotografia de pessoas**. Nem jogadores, nem treinos,
nem bancada, nem a sede. É a razão por que lê frio apesar do sistema visual
estar resolvido, e nenhuma decisão de design compensa isso.

Ficheiros em `public/images/`, JPG, minúsculas e sem acentos no nome, cada um
abaixo de 500 KB. Descarregar do Instagram e do Facebook do clube serve —
não é preciso sessão fotográfica para arrancar.

### Primeiro, porque desbloqueiam páginas inteiras

| Ficheiro | O quê | Formato | Onde entra |
|---|---|---|---|
| `equipa-principal.jpg` | Foto de grupo da equipa sénior de futsal | Retrato 4:5, 1200×1500 | `/equipas` |
| `pavilhao.jpg` | O pavilhão, de dentro, com gente se possível | Horizontal 16:10, 1600×1000 | `/instalacoes` |
| `sede.jpg` | A sede, de fora | Horizontal 16:10, 1600×1000 | `/instalacoes`, `/clube` |

### Depois

| Ficheiro | O quê | Formato |
|---|---|---|
| `plantel/<numero>-<nome>.jpg` | Um retrato por jogador. Ex.: `plantel/10-ricardo-fontes.jpg` | Quadrado 1:1, 600×600 |
| `orgaos/<nome>.jpg` | Os 20 membros dos órgãos sociais. O cartaz da Lista A tem-nas | Quadrado 1:1, 600×600 |
| `treinos/*.jpg` | Treinos das várias modalidades, para partir as grelhas de cartões iguais | Horizontal 3:2 |
| `patrocinadores/<nome>.png` | Logótipos, de preferência com fundo transparente | PNG |

### O que já não é preciso

- **`hero-futsal.jpg`** — a entrada tinha uma fotografia esbatida por trás do
  mote, com um véu escuro e uma faixa vermelha por cima. Saiu a 14/09/2026:
  eram três coisas a disputar o mesmo espaço e nenhuma se via bem. O hero é
  agora o azul do clube em gradiente
- **`og.jpg`** — o cartão de partilha é gerado pelo site em `/imagem-partilha`,
  com o emblema sobre o azul. Quando houver uma fotografia boa da equipa,
  vale a pena trocar
- **Fotografias para notícias** — `/noticias` foi fundido com `/comunicados`
- **Fotografias de produto** — as 23 maquetas da ZEMIG já lá estão

---

## Ligar o site às redes sociais

Faz-se uma vez. Depois o Presidente só escreve e carrega em publicar.

### Como funciona

```
Presidente escreve em /direcao
        ↓
Site guarda o comunicado e cria a imagem com o emblema
        ↓
Site envia tudo para o Make
        ↓
Make publica no Facebook e no Instagram
```

O Make existe no meio porque a Meta não deixa um site qualquer publicar
nas suas redes — exige uma aplicação registada e aprovada por eles, com
chaves que expiram de 60 em 60 dias. O Make já passou por essa aprovação.

---

### Antes de começar

- [ ] A conta de Instagram do clube tem de ser **Profissional**
      (app do Instagram → Definições → Tipo de conta → Mudar para conta profissional)
- [ ] Essa conta tem de estar **ligada à Página de Facebook** do clube
      (Instagram → Definições → Partilhar noutras aplicações → Facebook)
- [ ] Tens de ser administrador da Página de Facebook

Sem estes três pontos, nem o Make nem nada mais consegue publicar no Instagram.

---

### Passo 1 — Criar o cenário no Make

1. Conta grátis em **make.com**
2. **Create a new scenario**
3. Primeiro módulo: procura **Webhooks** → **Custom webhook** → **Add**
4. Dá-lhe um nome (ex.: `comunicados-valejas`) → **Save**
5. Copia o URL que aparece. É algo como
   `https://hook.eu2.make.com/a1b2c3d4e5f6...`

Guarda esse URL — é o `MAKE_WEBHOOK_URL`.

---

### Passo 2 — Ensinar o Make a reconhecer os campos

O Make só sabe que campos existem depois de receber um exemplo.

1. No módulo do webhook, carrega em **Re-determine data structure**
2. Publica um comunicado de teste em `/direcao` (ainda vai falhar a
   publicar nas redes — é suposto, ainda não há nada a seguir)
3. O Make apanha o exemplo e passa a conhecer estes campos:

| Campo | O que é |
|---|---|
| `titulo` | Título do comunicado |
| `legenda` | Texto para as redes, com o link do site no fim |
| `imagemUrl` | Cartão 1080×1080 com o emblema do clube |
| `urlSite` | Endereço do comunicado no site |
| `facebook` | `true` se o Presidente escolheu Facebook |
| `instagram` | `true` se escolheu Instagram |

---

### Passo 3 — Proteger o webhook

Sem isto, quem descobrir o URL publica no nome do clube.

1. Gera um segredo no terminal:
   ```
   openssl rand -hex 24
   ```
2. No Make, entre o webhook e os módulos seguintes, adiciona um **Filter**
3. Condição: `X-Valejas-Segredo` (dos headers) **Equal to** o segredo gerado
4. Guarda o mesmo valor em `MAKE_WEBHOOK_SEGREDO`

---

### Passo 4 — Publicar no Facebook

1. A seguir ao filtro: **Facebook Pages** → **Create a Post**
2. **Add connection** → entra com a conta que administra a Página
3. Escolhe a Página do clube
4. Preenche:
   - **Message**: campo `legenda` do webhook
   - **Photo URL / Link**: campo `imagemUrl`
5. Adiciona um **Filter** antes deste módulo: `facebook` **Equal to** `true`

---

### Passo 5 — Publicar no Instagram

1. Novo módulo: **Instagram for Business** → **Create a Photo Post**
2. **Add connection** → mesma conta de Facebook
3. Escolhe a conta de Instagram do clube
4. Preenche:
   - **Photo URL**: campo `imagemUrl`
   - **Caption**: campo `legenda`
5. Filter antes deste módulo: `instagram` **Equal to** `true`

> O Instagram **recusa publicações sem imagem**. Por isso é que o site gera
> o cartão com o emblema — sem ele, o Instagram nunca funcionaria.

---

### Passo 6 — Ligar tudo

1. No Make: **Save** e liga o interruptor **Scheduling** para **ON**
2. Na Vercel → o projeto → **Settings** → **Environment Variables**:

   | Nome | Valor |
   |---|---|
   | `MAKE_WEBHOOK_URL` | o URL do passo 1 |
   | `MAKE_WEBHOOK_SEGREDO` | o segredo do passo 3 |
   | `DIRECAO_PASSWORD` | a palavra-passe do Presidente |
   | `DIRECAO_SECRET` | `openssl rand -hex 32` |
   | `NEXT_PUBLIC_SITE_URL` | endereço final do site |

3. **Redeploy** — as variáveis só entram no próximo deploy

---

### Passo 7 — Testar

1. Vai a `/direcao`, entra com a palavra-passe
2. Escreve um comunicado de teste
3. Confirma que a pré-visualização mostra o emblema e o texto
4. Publica
5. Vê o resultado no site, no Facebook e no Instagram
6. Apaga o teste das três

---

### Quando alguma coisa falha

O site diz "Enviado para publicação" assim que o Make aceita. Se o
Facebook ou o Instagram recusarem depois disso, **isso não aparece no
site** — aparece no **History** do cenário, no Make. É lá que se vê o erro.

| Sintoma | Causa habitual |
|---|---|
| Instagram falha, Facebook passa | Conta de Instagram não é Profissional, ou não está ligada à Página |
| Nada acontece | Scheduling do cenário está OFF |
| Make recebe mas descarta | Segredo do filtro não bate certo com a variável na Vercel |
| Imagem não carrega | `NEXT_PUBLIC_SITE_URL` errado — a Meta precisa de um endereço público |

---

### Notas

- **Plano grátis do Make**: 1000 operações/mês. Cada comunicado gasta 3.
  Dá para cerca de 330 comunicados por mês.
- **Sem `MAKE_WEBHOOK_URL` configurado**, o site fica em modo demonstração:
  mostra o que iria publicar e não publica nada. Nada rebenta.
- **Alternativa futura**: o código para falar diretamente com a Meta já
  existe em `src/lib/social/meta.ts`. Se um dia o clube tiver app própria
  aprovada, basta preencher `META_PAGE_ID`, `META_IG_USER_ID` e
  `META_PAGE_ACCESS_TOKEN` e remover o `MAKE_WEBHOOK_URL`.

---

## Imagens da loja

Onde estão, que tamanho têm de ter, e como se refazem.

### Onde ficam

```
valejas-ac/public/loja/
```

Caminho completo:

```
/Users/berto_barata/Developer/WebSite Valejas/valejas-ac/public/loja/
```

**Substituir é só isso: manter o mesmo nome de ficheiro.** O site vai
buscar a imagem pelo nome que está em `valejas-ac/src/lib/data/loja.ts`
(campo `imagem`). Se o nome não mudar, não há código a mexer.

Se mudares a extensão (`.webp` → `.png`, por exemplo), tens de mudar
também o campo `imagem` do produto nesse ficheiro.

### Que ficheiro é que peça

| Ficheiro | Produto | Referência | Preço |
|---|---|---|---|
| `equipamento-principal.webp` | Equipamento principal (riscas amarelas e azuis) | ZM-1000.02 | 27,68 € |
| `equipamento-branco.webp` | Equipamento alternativo branco | ZM-1000.01 | 27,68 € |
| `equipamento-azul.webp` | Equipamento azul-marinho | ZM-1000.04 | 27,68 € |
| `equipamento-verde.webp` | Equipamento de guarda-redes | ZM-1000.03 | 27,68 € |
| `conjunto-azul.webp` | Conjunto de treino azul | ZM-4000.01 | 13,53 € |
| `conjunto-verde.webp` | Conjunto de treino verde | ZM-4000.02 | 13,53 € |
| `conjunto-branco.webp` | Conjunto branco | ZM-2000.03 | 22,14 € |
| `meias-azuis.webp` | Meias altas azuis | ZM-14000.04 | 4,61 € |
| `meias-brancas.webp` | Meias altas brancas | ZM-14000.03 | 4,61 € |
| `meias-marinho.webp` | Meias altas azul-marinho | ZM-14000.06 | 4,61 € |
| `meias-verdes.webp` | Meias altas verdes | ZM-14000.05 | 4,61 € |
| `fato-treino.webp` | Fato de treino completo | ZM-5000.02 | 39,98 € |
| `sweat-capuz.webp` | Camisola com capuz | ZM-23000.01 | sob consulta |
| `calcas-treino.webp` | Calças de fato de treino | ZM-18000.01 | sob consulta |
| `bermuda.webp` | Bermuda | ZM-11000.01 | sob consulta |
| `camisola-adepto-mote.webp` | Camisola de adepto «A união faz a força» | ZM-10000.02 | sob consulta |
| `camisola-adepto-foto.webp` | Camisola de adepto personalizada | ZM-10000.01 | sob consulta |
| `sweat-personalizada.webp` | Camisola personalizada de família | ZM-27000.01 | sob consulta |
| `casaco-california.webp` | Casaco California | PB-6440.01 | sob consulta |
| `cachecol-lema.webp` | Cachecol do clube | ZM-32000.03 | sob consulta |
| `cachecol-personalizado.webp` | Cachecol personalizado | ZM-32000.02 | sob consulta |
| `cachecol-rosa.webp` | Cachecol rosa | ZM-32000.01 | sob consulta |
| `mochila.webp` | Mochila do clube | ZM-69000.01 | sob consulta |
| `kit-atleta.webp` | **Kit obrigatório de atleta** — montagem das três peças | — | 68,89 € |

### Tamanhos e formatos

As imagens ocupam a moldura toda — são **cortadas** ao formato, não contidas.
Foi uma decisão de 14/09/2026: as maquetas da ZEMIG vêm com fundo de estúdio
cinzento que não há maneira honesta de recortar (as camisolas brancas
confundem-se com ele), e a ilha cinzenta pousada num quadrado branco lia-se
pior do que uma fotografia a sangrar.

| Onde aparece | Proporção da moldura | Ficheiro recomendado |
|---|---|---|
| Cartão na grelha | 2:1 | **1600 × 800 px** |
| Cartão em destaque | 5:2 | 1600 × 640 px |
| Faixa do kit de atleta | 32:5 | **1920 × 300 px** |

As imagens atuais estão a 1000 × 465 px, que é o que sobrou depois de lhes
cortar as bandas do fornecedor. Chegam, mas uma substituição deve subir para
os tamanhos acima.

- Formato: **WebP**, qualidade 80–85. Um PNG de 1 MB dá o mesmo a 60 kB
- Fundo: **branco puro (#FFFFFF)** é o ideal, e faz a peça flutuar. Com fundo
  branco, muda-se a moldura no `CartaoProduto.tsx` de `object-cover` para
  `object-contain` e volta-se a poder respirar à volta da peça
- Margem: ~8% de folga à volta
- Todas as peças da mesma família com o **mesmo enquadramento e a mesma
  escala**. Numa grelha, uma camisola maior que a do lado lê-se como erro

### Cores do clube

| Cor | Hex | Onde |
|---|---|---|
| Amarelo | `#FADB09` | Riscas, detalhes |
| Azul | `#1554BB` | Riscas, calção |
| Azul-marinho | `#0B285C` | Alternativos, agasalhos |
| Vermelho | `#D4150C` | Faixa do emblema |
| Branco | `#FFFFFF` | Equipamento alternativo |

Emblema oficial: `valejas-ac/public/brand/crest.png`

---

### Prompt para gerar as imagens

Usa este bloco e troca só a parte em **PEÇA**. Está escrito em inglês
porque é o que os geradores de imagem entendem melhor.

```
Professional e-commerce product photograph of a football/futsal kit,
floating centred on a pure white seamless background (#FFFFFF), no
shadow on the background other than a soft contact shadow directly
beneath the garment.

PEÇA: [descrição da peça — ver lista abaixo]

Style: clean studio product shot, soft even diffused lighting from the
front-top, no harsh highlights, no reflections, fabric texture visible
but subtle. The garment is presented flat-lay style or on an invisible
mannequin (ghost mannequin), perfectly symmetrical and upright.

Framing: the garment fills about 84% of the frame height, centred, with
even margin on all sides. Horizontal 3:2 format.

Do not include: watermarks, logos of sportswear brands, text overlays,
price tags, models, faces, hands, props, gradient or grey backgrounds,
dark vignettes, promotional banners.

Colours must be exact: yellow #FADB09, blue #1554BB, navy #0B285C.
```

### A parte **PEÇA**, produto a produto

- **equipamento-principal** — `A short-sleeved football jersey with
  vertical stripes in yellow #FADB09 and blue #1554BB, white collar and
  white sleeve cuffs, shown together with matching blue shorts placed
  below it.`
- **equipamento-branco** — `A white short-sleeved football jersey with a
  thin vertical yellow and blue stripe down the centre-left, white
  collar, shown with matching white shorts below it.`
- **equipamento-azul** — `A navy blue #0B285C short-sleeved football
  jersey with subtle yellow trim on the sleeves, shown with matching
  navy shorts below it.`
- **equipamento-verde** — `A green goalkeeper jersey with long sleeves
  and padded elbows, shown with matching green shorts below it.`
- **conjunto-azul** — `A blue #1554BB short-sleeved training jersey
  shown with yellow #FADB09 shorts below it.`
- **conjunto-verde** — `A green short-sleeved training jersey shown with
  black shorts below it.`
- **conjunto-branco** — `A white short-sleeved jersey with navy trim,
  front and back views side by side, with navy shorts.`
- **meias-azuis / brancas / marinho / verdes** — `A pair of long
  football socks in [blue #1554BB / white / navy #0B285C / green],
  standing upright side by side.`
- **fato-treino** — `A navy blue tracksuit: hooded jacket on the left,
  matching tracksuit trousers on the right, with yellow and white
  stripe detail on the sleeves and legs.`
- **sweat-capuz** — `A navy blue hooded sweatshirt, front view, with a
  white and yellow horizontal chest stripe.`
- **calcas-treino** — `Navy blue tracksuit trousers with a thin yellow
  side stripe, shown standing upright.`
- **bermuda** — `Navy blue long training shorts, front and back view
  side by side.`
- **camisola-adepto-mote** — `A navy blue supporter t-shirt with the
  text "A UNIÃO FAZ A FORÇA" printed across the chest in yellow.`
- **sweat-personalizada** — `A pink crew-neck sweatshirt, front and back
  view side by side, with text printed on the chest.`
- **casaco-california** — `A varsity college jacket with black body,
  white leather sleeves and white ribbed collar and cuffs.`
- **cachecol-lema / personalizado / rosa** — `A football supporter scarf
  laid out flat and horizontal, shown as two horizontal bands (front
  and back of the scarf), knitted texture with fringed ends.`
- **mochila** — `A sports backpack in yellow and blue vertical stripes,
  three-quarter front view, with a second view showing the black back
  and straps.`

### Depois de gerar

O emblema do clube tem de ser o verdadeiro — não um inventado pelo
gerador. Duas hipóteses:

1. Gerar a peça **sem emblema nenhum** e colar depois o
   `crest.png` por cima, num editor
2. Gerar com um espaço liso no peito e colar o emblema lá

### Converter e instalar

```bash
cd "/Users/berto_barata/Developer/WebSite Valejas/valejas-ac/public/loja"

# de qualquer formato para webp, no tamanho certo
magick nova-imagem.png -resize 1600x800^ -gravity center -extent 1600x800 \
  -background white -alpha remove -quality 82 equipamento-principal.webp
```

Para a faixa do kit, a montagem das três peças faz-se assim:

```bash
magick montage equipamento-principal.webp equipamento-branco.webp conjunto-azul.webp \
  -tile 3x1 -geometry 640x+0+0 -background white kit-atleta.webp
```

Substituído o ficheiro, é só recarregar a página — não é preciso mexer
em código nem fazer deploy novo se ainda estiveres em desenvolvimento.
