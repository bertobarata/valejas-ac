# Design — Valejas Atlético Clube

Sistema visual do site. Gerado a partir do código em 13/09/2026.
Register: **brand**.

---

## Cor

Estratégia: **committed**. O amarelo e o azul do emblema carregam a
identidade; o creme é o chão. Não é uma paleta restrita com um acento
tímido, nem está afogada em cor.

### Marca

| Token | Valor | Onde |
|---|---|---|
| `yellow` | `#FADB09` | Acento principal, botões, destaques |
| `yellow-dim` | `#E2C600` | Estado hover do amarelo |
| `blue` | `#1554BB` | Secções de fundo, segunda voz |
| `blue-deep` | `#014CB3` | Texto sobre amarelo, fundos mais fundos |
| `red` | `#D4150C` | Faixa de jogo ao vivo. **Legado** — a Direção fixou a paleta em amarelo + azul |

### Superfícies

Escala de creme quente em tema claro, midnight em escuro. Nenhum neutro
é cinzento puro: todos puxam para o azul-navy do clube.

| Token | Claro | Escuro |
|---|---|---|
| `surface` | `#FDFBF5` | `#0D1321` |
| `surface-low` | `#F5F0E4` | `#151C29` |
| `surface-high` | `#E6DFCC` | `#232A38` |
| `surface-highest` | `#DDD5BF` | `#2E3543` |
| `on-surface` | `#0B285C` | `#DCE2F5` |
| `on-surface-muted` | `#4A5678` | `#CEC6AB` |

### A regra do amarelo — ler antes de mexer

Amarelo sobre creme dá **1,34:1**. Ilegível. Por isso `globals.css`
recolore `text-yellow` para o azul do emblema em tema claro.

A exceção são fundos escuros, onde o amarelo contrasta bem. Essa
exceção **deriva do próprio fundo** (`.bg-blue`, `.bg-blue-deep`) ou de
`.section-dark` para casos que não usem essas classes — fotografias, por
exemplo.

Isto já falhou uma vez: uma secção azul sem a marca fez o amarelo ficar
exatamente da cor do fundo. Se criares um fundo escuro com outra classe,
acrescenta `.section-dark`.

### Contrastes verificados

```
navy sobre creme            13,78:1   ✓
preto sobre botão amarelo   15,20:1   ✓
muted sobre creme            7,01:1   ✓
azul recolorido sobre creme  6,73:1   ✓
branco sobre azul            6,96:1   ✓
amarelo sobre azul           5,04:1   ✓
text-white/85 sobre azul     5,49:1   ✓  ← mínimo usado sobre azul
text-white/70 sobre azul     4,27:1   ✗  não usar em texto normal
amarelo sobre creme          1,34:1   ✗  nunca em texto
```

---

## Tipografia

| Papel | Fonte | Pesos | Notas |
|---|---|---|---|
| Títulos | **Archivo** variável | 100–900 + itálico | Eixo de largura 62–125 |
| Texto | **General Sans** variável | 200–700 + itálico | Auto-alojada |

Ambas servidas do próprio site. A Archivo vem por `next/font/google`,
descarregada no build; a General Sans é local em `public/fonts/`.

### Largura variável

A Archivo tem eixo de largura, e é isso que resolve títulos longos em
maiúsculas. Utilidades em `globals.css`:

```
.wdth-condensed   font-stretch: 87.5%   títulos grandes
.wdth-normal      font-stretch: 100%
.wdth-wide        font-stretch: 112.5%
```

Usar `wdth-condensed` em heróis e `.section-title`. "ASSEMBLEIA GERAL
ORDINÁRIA" não cabe de outra forma.

### Regras

- Títulos em maiúsculas, `tracking-tighter`, `leading-none`
- Peso 900 nos títulos, 400–700 no texto
- Nunca `italic` em títulos: houve uma fonte sem itálico e o falso-itálico
  ficou registado como erro a não repetir
- Medida de leitura limitada a `max-w-prose` em texto corrido

---

## Espaçamento e forma

- Secções: `py-14` a `py-28`, com `md:` a subir
- Grelhas com `gap-px` sobre `bg-on-surface/10` para linhas finas entre cartões
- Cantos: botões em pílula (`rounded-full`), tudo o resto a direito
- `.section-container` dá a largura e as margens laterais

---

## Componentes

| Classe | O que é |
|---|---|
| `.btn-primary` | Amarelo, texto preto, pílula. Ação principal |
| `.btn-secondary` | Azul, texto branco, cantos vivos |
| `.btn-ghost` | Contorno, para ações secundárias |
| `.btn-danger` | Vermelho. **Legado**, só no jogo ao vivo |
| `.section-title` | Título de secção, já com `wdth-condensed` |
| `.input-field` | Campo com sublinhado, sem caixa |
| `.th-tabela` / `.td-tabela` | Células de tabela de classificação |
| `.texto-legal` | Tipografia das páginas legais |

---

## Movimento

GSAP com ScrollTrigger para entradas, Lenis para scroll suave.

**Movimento reduzido é respeitado a sério.** Quem o pede recebe:
- CSS a anular animações e transições
- `gsap.globalTimeline.timeScale(400)`, que leva cada tween ao estado
  final de imediato
- Lenis que nem arranca

Sem isto, metade do conteúdo ficava invisível a quem desliga o movimento
— as entradas partem de `opacity: 0`.

Curvas: `power2.out` e `power3.out`. Sem bounce, sem elastic.

---

## Acessibilidade

- Anel de foco: 3px, azul em tema claro e amarelo em escuro, via
  `--anel-foco`. Nunca `outline: none` sem substituto
- Alvos de toque a 44px (`w-11 h-11`). Público dos 10 aos 60+, quase
  todo em telemóvel
- Tabelas com `<caption>`, `scope` e colunas que se escondem em ecrã estreito
- Acordeões com `aria-expanded` e `aria-controls`
- Mapas e conteúdo de terceiros só carregam a pedido

---

## O que não fazer

Aprendido a corrigir este site, não copiado de uma lista genérica.

- **Barras laterais coloridas** (`border-l-2` amarelo como destaque). Havia
  seis; foram todas substituídas por fundo próprio ou rótulo tipográfico
- **Itálico em títulos** quando a fonte não o tem desenhado
- **`Record<string, X>` para mapas de tokens.** Usar `Record<Grupo, X>`:
  um grupo novo passa a partir o build em vez de sair sem cor
- **Nomes inventados** em dados de exemplo. Os adversários chamam-se
  "Equipa Adversária N" de propósito — já houve "Lions FC" e "Dragões Sul"
  a passar por reais
- **Clichê desportivo**: "Elite", "força imparável", "redefine os limites".
  O PRODUCT.md lista isto como anti-referência
- **`display: grid` com o atributo `hidden`**: a classe de display ganha
  ao atributo e o elemento fica visível
