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
  creme-claro: "#FDFBF5"
  creme-baixo: "#F5F0E4"
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

## Overview

**O Clube da Nossa Terra.** A frase está na faixa do topo e no rodapé, e é
também a regra do sistema: isto é a casa de quem já pertence, não uma montra
para recrutar estranhos.

O tom é caloroso, orgulhoso e comunitário. Um clube de bairro com 60 anos e
garra, mas acolhedor dos 10 aos 60+ e de sete modalidades. Orgulho sem
espetáculo: a intensidade do jogo cabe, o calor humano manda.

O material antigo (`PAVILION_VOLTAGE_PHILOSOPHY.md`) era escuro, elétrico e
clínico. Foi suavizado por decisão: servia o futsal isolado, não o
clube-família. O amarelo ficou; a voltagem saiu.

**Anti-referências** — o sistema falhou se parecer alguma destas:

- Template genérico de clube: azul/cinza, calendário clip-art, banners de
  patrocínio empilhados
- Corporate ou SaaS frio: navy com métricas grandes, fotos de stock de escritório
- Feed de rede social com moldura de site
- Clichê desportivo: chamas, cromados, "guerreiros", gradientes agressivos

**Layout.** Secções de `py-14` a `py-28`, a crescer em `md:`. Grelhas com
`gap-px` sobre `bg-on-surface/10`, o que dá linhas finas entre blocos sem
desenhar bordas. Medida de leitura limitada a `max-w-prose`. A largura e as
margens vêm de `.section-container`.

## Colors

Estratégia **committed**: o amarelo e o azul do emblema carregam a identidade,
o creme é o chão. Não é uma paleta restrita com um acento tímido, nem está
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

Creme quente em tema claro, midnight em escuro. **Nenhum neutro é cinzento
puro** — todos puxam para o navy do clube.

| Papel | Claro | Escuro |
|---|---|---|
| Fundo | `#FDFBF5` | `#0D1321` |
| Elevado | `#E6DFCC` | `#232A38` |
| Texto | `#0B285C` | `#DCE2F5` |
| Texto secundário | `#4A5678` | `#CEC6AB` |

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

```
navy sobre creme            13,78:1   ✓
preto sobre botão amarelo   15,20:1   ✓
muted sobre creme            7,01:1   ✓
branco sobre azul            6,96:1   ✓
azul recolorido sobre creme  6,73:1   ✓
vermelho claro sobre escuro  6,64:1   ✓
amarelo sobre azul           5,04:1   ✓
white/85 sobre azul          5,49:1   ✓  ← mínimo usado sobre azul
white/70 sobre azul          4,27:1   ✗  não usar em texto normal
amarelo sobre creme          1,34:1   ✗  nunca em texto
```

## Typography

**Archivo** nos títulos, **General Sans** no texto. Ambas variáveis, ambas
servidas do próprio site.

A Archivo tem **eixo de largura de 62 a 125**, e é isso que resolve títulos
longos em maiúsculas. Utilidades: `.wdth-condensed` (87,5%), `.wdth-normal`,
`.wdth-wide`. Usar condensado em heróis e `.section-title` — "ASSEMBLEIA GERAL
ORDINÁRIA" não cabe de outra forma.

Regras:

- Títulos em maiúsculas, `tracking-tighter`, `leading-none`, peso 900
- **Nunca `italic` em títulos.** Houve uma fonte sem itálico desenhado e o
  falso-itálico ficou registado como erro a não repetir
- Nada abaixo de **12px**. O público vai dos 10 aos 60+ e está quase todo em
  telemóvel

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
  seis; foram todas substituídas por fundo próprio ou rótulo tipográfico
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
