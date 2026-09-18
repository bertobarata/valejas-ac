---
name: Valejas Atlético Clube
description: O Clube da Nossa Terra — sistema visual de um clube de bairro com 60 anos, quente em vez de agressivo.
colors:
  amarelo-emblema: "#FADB09"
  amarelo-fosco: "#E2C600"
  azul-emblema: "#1554BB"
  azul-fundo: "#014CB3"
  vermelho-faixa: "#D4150C"
  vermelho-claro: "#FF6B5E"
  claro-fundo: "#FCFDFF"
  claro-seccao: "#F1F4F9"
  claro-cartao: "#E0E6F0"
  creme-alto: "#E6DFCC"
  creme-altissimo: "#DDD5BF"
  navy-texto: "#0B285C"
  slate-texto: "#4A5678"
  midnight-escuro: "#0D1321"
  midnight-baixo: "#151C29"
  midnight-alto: "#232A38"
  gelo-texto: "#DCE2F5"
  areia-texto: "#CEC6AB"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(3rem, 9vw, 9rem)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.05em"
    fontVariation: "'wdth' 87.5"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.05em"
    fontVariation: "'wdth' 87.5"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  body:
    fontFamily: "General Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "General Sans, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "0.1em"
rounded:
  none: "0px"
  sm: "0.125rem"
  md: "0.375rem"
  full: "9999px"
spacing:
  xs: "0.5rem"
  sm: "1rem"
  md: "1.75rem"
  lg: "3.5rem"
  xl: "7rem"
components:
  button-primary:
    backgroundColor: "{colors.amarelo-emblema}"
    textColor: "#000000"
    rounded: "{rounded.full}"
    padding: "0.75rem 1.5rem"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.amarelo-fosco}"
  button-secondary:
    backgroundColor: "{colors.azul-emblema}"
    textColor: "#FFFFFF"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.5rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.navy-texto}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.5rem"
  input-field:
    backgroundColor: "{colors.creme-alto}"
    textColor: "{colors.navy-texto}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1rem"
  skip-link:
    backgroundColor: "{colors.amarelo-emblema}"
    textColor: "{colors.azul-fundo}"
    padding: "0.75rem 1.25rem"
---

# Design — Valejas Atlético Clube

> Atualizado a 14/09/2026: paleta nova, contrastes recalculados, e a
> tipografia absorvida do antigo `FONTES.md`.

## Overview

**O Clube da Nossa Terra.** A frase está na faixa do topo e no rodapé, e é
também a regra do sistema: isto é a casa de quem já pertence, não uma montra
para recrutar estranhos.

O tom é caloroso, orgulhoso e comunitário. Um clube de bairro com 60 anos e
garra, mas acolhedor dos 10 aos 60+ e de sete modalidades. Orgulho sem
espetáculo: a intensidade do jogo cabe, o calor humano manda.

O material antigo (`arquivo/PAVILION_VOLTAGE_PHILOSOPHY.md`) era escuro, elétrico e
clínico. Foi suavizado por decisão: servia o futsal isolado, não o
clube-família. O amarelo ficou; a voltagem saiu.

**Anti-referências** — o sistema falhou se parecer alguma destas:

- Template genérico de clube: azul/cinza, calendário clip-art, banners de
  patrocínio empilhados
- Corporate ou SaaS frio: navy com métricas grandes, fotos de stock de escritório
- Feed de rede social com moldura de site
- Clichê desportivo: chamas, cromados, "guerreiros", gradientes agressivos

**Medida de leitura.** 65ch, e o limite vai no parágrafo, não no contentor —
assim os títulos e as tabelas continuam largos. `.texto-legal` já o aplica a
todos os `p` e `li`. Onde a grelha só se divide em `lg:`, o parágrafo tem de
trazer o seu próprio limite: num iPad vertical a coluna é a largura toda, e
já houve linhas de 95 caracteres em `/inscricoes`.

**Layout.** Secções de `py-14` a `py-28`, a crescer em `md:`. Grelhas com
`gap-px` sobre `bg-on-surface/10`, o que dá linhas finas entre blocos sem
desenhar bordas. Medida de leitura limitada a `max-w-prose`. A largura e as
margens vêm de `.section-container`.

## Colors

Estratégia **committed**: o amarelo e o azul do emblema carregam a identidade,
e o chão é neutro. Não é uma paleta restrita com um acento tímido, nem está
afogada em cor.

### Marca

| Token | Valor | Papel |
|---|---|---|
| `amarelo-emblema` | `#FADB09` | Acento principal, botões, destaques |
| `amarelo-fosco` | `#E2C600` | Estado hover |
| `azul-emblema` | `#1554BB` | Secções de fundo, segunda voz |
| `azul-fundo` | `#014CB3` | Texto sobre amarelo, fundos mais profundos |
| `vermelho-faixa` | `#D4150C` | Faixa de jogo ao vivo. Legado: a Direção fixou a paleta em amarelo + azul |
| `vermelho-claro` | `#FF6B5E` | O mesmo vermelho, clareado para tema escuro |

### Superfícies

Cinzentos frios com uma ponta do azul do emblema em tema claro, midnight em
escuro. **Nenhum neutro é cinzento puro** — todos puxam para o navy do clube.

| Papel | Claro | Escuro |
|---|---|---|
| Fundo | `#FCFDFF` | `#0D1321` |
| Secção | `#F1F4F9` | `#151C29` |
| Elevado | `#E0E6F0` | `#232A38` |
| Texto | `#0B285C` | `#DCE2F5` |
| Texto secundário | `#4A5678` | `#A0ACC6` |

**Porque deixou de ser creme (14/09/2026).** As superfícies claras eram cremes
quentes, com bege a puxar ao papel velho. Ficavam bem num site de arquivo e mal
num clube que joga de amarelo: o bege e o amarelo do emblema disputavam a mesma
zona do olho. Com o chão frio, o amarelo volta a ser a única cor quente da
página — que é como se destaca.

### A regra do amarelo — ler antes de mexer

Amarelo sobre creme dá **1,34:1**. Ilegível. Por isso `globals.css` recolore
`text-yellow` para o azul do emblema em tema claro.

A exceção são fundos escuros, e **deriva do próprio fundo** (`.bg-blue`,
`.bg-blue-deep`) ou de `.section-dark` para casos que não usem essas classes,
como fotografias. Já falhou uma vez, quando era preciso lembrar-se da marca:
uma secção azul sem ela fez o amarelo ficar exatamente da cor do fundo.

O vermelho tem regra irmã: `#D4150C` dá 3,46:1 sobre o fundo escuro, por isso
em tema escuro clareia para `#FF6B5E` (6,64:1).

### Contrastes verificados

Recalculados a 14/09/2026, contra as superfícies novas.

```
ice sobre escuro             14,34:1   ✓
navy sobre fundo claro       14,01:1   ✓
preto sobre botão amarelo    15,20:1   ✓
navy sobre cartão claro      11,37:1   ✓
azul-deep sobre amarelo      10,32:1   ✓
muted escuro sobre escuro     8,14:1   ✓
muted sobre fundo claro       7,13:1   ✓
branco sobre azul             6,96:1   ✓
azul recolorido sobre claro   6,84:1   ✓
vermelho claro sobre escuro   6,64:1   ✓
muted sobre cartão claro      5,79:1   ✓
white/85 sobre azul           5,49:1   ✓  ← mínimo usado sobre azul
amarelo sobre azul            5,04:1   ✓
white/70 sobre azul           4,27:1   ✗  não usar em texto normal
amarelo sobre fundo claro     1,36:1   ✗  nunca em texto
```

## Typography

**Archivo** nos títulos, **General Sans** no texto. Ambas variáveis, ambas
servidas do próprio site a partir de `public/fonts/`.

A Archivo tem **eixo de largura de 62 a 125**, e é isso que resolve títulos
longos em maiúsculas. Utilidades: `.wdth-condensed` (87,5%), `.wdth-normal`,
`.wdth-wide`. Usar condensado em heróis e `.section-title` — "ASSEMBLEIA GERAL
ORDINÁRIA" não cabe de outra forma.

Regras:

- Títulos em maiúsculas, `tracking-tighter`, `leading-none`, peso 900
- **Nunca `italic` em títulos.** Houve uma fonte sem itálico desenhado e o
  falso-itálico ficou registado como erro a não repetir
- Nada abaixo de **12px**. O público vai dos 10 aos 60+ e está quase todo em
  telemóvel. A regra esteve escrita e quebrada em cinco sítios até 15/09/2026
  (`.th-tabela` a 10,4px, quatro `text-[0.7rem]` a 11,2px)
- `tabular-nums` em resultados, datas, preços e números de camisola

### O que uma fonte tem de ter para entrar aqui

Escrito depois de a **Trench Slab** não ter resultado, para não se repetir o
erro. Não era uma fonte má — era a fonte errada para este layout:

| O layout foi feito para | A Trench Slab era |
|---|---|
| Sans **estreita** | Slab **larga** |
| Peso **900** | Máximo **700** |
| Letras apertadas (`tracking-tighter`, `leading-[0.85]`) | Serifas grossas que precisam de ar |

Requisitos para uma fonte de títulos:

- Pesos até **800 ou 900** — o desenho precisa de dois degraus fortes
- **Estreita ou normal**, nunca larga
- Funciona **toda em maiúsculas**, que é como é usada em quase todo o lado
- **Acentuação portuguesa completa**: Á À Â Ã É Ê Í Ó Ô Õ Ú Ç. Testar com
  "ATLÉTICO", "DIREÇÃO", "ORDINÁRIA" — muitas fontes de display têm acentos
  colados à letra
- **woff2** para o site, e **TTF ou OTF** também: o gerador da imagem dos
  comunicados (satori) não lê woff2 nem interpreta eixos variáveis, e por isso
  usa instâncias fixas em `public/fonts/Archivo-SemiCondensed-*.ttf`

Para texto corrido: pesos 400 a 700, itálico verdadeiro, legível a 14–16px,
acentuação completa e algarismos tabulares.

## Elevation

O sistema é **plano com camadas tonais**, não com sombras. A profundidade vem
da escala de superfícies (`surface` → `surface-low` → `surface-high` →
`surface-highest`), não de elevação simulada.

Existem três sombras definidas e usadas com parcimónia: `ambient` para a barra
de navegação quando cola ao topo, `float` e `yellow-glow` para momentos
pontuais. Se estiveres a acrescentar uma sombra para separar dois blocos, a
resposta certa é quase sempre trocar de tom de superfície.

Cantos: botões em pílula (`rounded-full`), tudo o resto a direito.

## Components

| Classe | O que é |
|---|---|
| `.btn-primary` | Amarelo, texto preto, pílula. Ação principal |
| `.btn-secondary` | Azul, texto branco, cantos vivos |
| `.btn-ghost` | Contorno, ações secundárias |
| `.btn-danger` | Vermelho. Legado, só no jogo ao vivo |
| `.section-title` | Título de secção, já com `wdth-condensed` |
| `.section-container` | Largura e margens da página |
| `.input-field` | Campo com sublinhado, sem caixa |
| `.th-tabela` / `.td-tabela` | Células da tabela de classificação |
| `.texto-legal` | Tipografia das páginas legais |
| `.link-salto` | Salto para o conteúdo, visível só com foco |
| `.entrada-pagina` | Entrada de página, com reposição em CSS |

**Telemóvel: tudo ao centro.** Abaixo de 768px o conteúdo do `main` e do
rodapé alinha ao centro, texto corrido incluído. Decisão do cliente a
15/09/2026, tomada com o aviso de que texto longo centrado se lê pior — a
margem esquerda irregular obriga o olho a procurar o início de cada linha.
A partir de 768px volta a alinhar à esquerda, o que protege a leitura no
tablet e no computador.

As exceções não são gosto, são sítios onde centrar parte alguma coisa:
campos de formulário (o cursor saltava a cada letra), células de tabela (é
o alinhamento que permite comparar), e marcadores de lista, que passam a
ponto acima do texto em vez de ficarem encostados à esquerda. Ícones,
imagens e botões dentro de colunas flex precisam de `align-self`, porque o
`text-align` não lhes chega.

**Alvos de toque.** 44px de altura mínima em tudo o que se carrega, pela
classe `.alvo-toque` ou por `min-h-11`. Inclui a barra de navegação de
computador: um iPad deitado tem mais de 1024px e recebe-a, operada com o
dedo. Links dentro de uma frase são a exceção — o WCAG dispensa-os, e
esticá-los partia a linha.

**Foco.** Anel de 3px via `--anel-foco`: azul em tema claro, amarelo em escuro.
Nunca `outline: none` sem substituto. Todos os campos têm nome acessível, por
`<label htmlFor>` ou por etiqueta que os envolve.

**Movimento.** GSAP com ScrollTrigger nas entradas, Lenis no scroll suave,
canvas 2D no campo de partículas do hero. Curvas `power2.out` e `power3.out`;
sem bounce, sem elastic.

Movimento reduzido é respeitado nos **quatro** caminhos, e isso não é opcional:
as entradas partem de `opacity: 0`, por isso saltá-las deixaria metade do
conteúdo invisível.

1. CSS anula animações e transições
2. `gsap.globalTimeline.timeScale(400)` leva cada tween ao estado final
3. Lenis não arranca
4. O campo de partículas desenha-se uma vez, parado

## Do's and Don'ts

Aprendido a corrigir este site, não copiado de uma lista genérica.

**Não fazer:**

- **Barras laterais coloridas** (`border-l-2` amarelo como destaque). Havia
  seis; foram todas substituídas por fundo próprio ou rótulo tipográfico.
  **Voltaram a entrar três vezes** — nos filtros da loja e em dois blocos da
  inscrição — e foram outra vez removidas a 15/09/2026. É o erro que mais
  reincide neste projeto
- **Grelhas de cartões idênticos.** Os órgãos sociais eram 20 retângulos iguais
  com iniciais, onde o Presidente e o 2.º suplente tinham o mesmo peso, e onde
  duas pessoas davam as mesmas iniciais. Uma lista com hierarquia resolveu os
  três problemas
- **`three.js` para decoração.** Eram 23 MB de dependência e 126 kB por visita
  para desenhar pontos. Um canvas 2D faz o mesmo em 40 linhas
- **`Record<string, X>` para mapas de tokens.** Usar `Record<Grupo, X>`: um
  grupo novo passa a partir o build em vez de sair sem cor
- **`display: grid` com o atributo `hidden`.** A classe de display ganha ao
  atributo e o elemento fica visível
- **`opacity: 0` à espera de JavaScript.** Embrulhava o site inteiro; uma falha
  de script deixava a página em branco. A opacidade inicial é do CSS
- **Nomes inventados em dados de exemplo.** Os adversários chamam-se "Equipa
  Adversária N" de propósito. Já houve "Lions FC" e um reforço do "São Paulo
  FC" a passar por reais
- **Clichê desportivo**: "Elite", "força imparável", "redefine os limites"

**Fazer:**

- Estados vazios honestos. Sem notícias, a secção desaparece da homepage e a
  página diz que ainda não há — não se inventa conteúdo para encher
- Conteúdo de terceiros só a pedido. O mapa do Google carrega quando alguém
  carrega no botão, não antes
- Dizer o que não se sabe. A página da história assume que não há registo dos
  fundadores e convida a comunidade a contar
