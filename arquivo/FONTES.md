# Tipografia — o que o site precisa

Guia para escolher fontes novas. Escrito depois de a Trench Slab não ter
resultado, para não se repetir o erro.

---

## Porque é que a Trench Slab falhou

Não é uma fonte má — é a fonte errada para este layout.

| O layout foi feito para | A Trench Slab é |
|---|---|
| Sans **estreita** | Slab **larga** |
| Peso **900** | Máximo **700** |
| **Itálico** verdadeiro | Sem itálico |
| Letras apertadas (`tracking-tighter`, `leading-[0.85]`) | Serifas grossas que precisam de ar |

O hero tem títulos a 10rem em maiúsculas, encostados uns aos outros. Uma
fonte larga nesse espaço fica entalada. Uma fonte que pára nos 700 perde o
degrau de destaque que o desenho usava.

---

## O que é preciso

### 1. Fonte de títulos — a que faz o trabalho

Usada em: heróis, resultados, nomes de jogadores, chamadas para sócio,
títulos de secção, botões. É a que dá identidade.

**Obrigatório:**
- [ ] Pesos até **800 ou 900**. O desenho precisa de dois degraus fortes,
      não de um só
- [ ] **Estreita ou normal** — nunca larga. Os títulos são longos
      ("ASSEMBLEIA GERAL ORDINÁRIA") e o espaço é apertado
- [ ] Funciona bem **toda em maiúsculas** — é assim que é usada em quase
      todo o lado
- [ ] **Acentuação portuguesa completa**: Á À Â Ã É Ê Í Ó Ô Õ Ú Ç.
      Testar com "ATLÉTICO", "DIREÇÃO", "ORDINÁRIA" — muitas fontes de
      display têm acentos mal desenhados ou colados à letra
- [ ] Formato **woff2** para o site

**Desejável:**
- [ ] **Itálico verdadeiro** (não obliquo sintético). O desenho original
      usava-o e dava-lhe movimento
- [ ] **Variável** — um ficheiro em vez de cinco, site mais leve
- [ ] Ficheiro **TTF ou OTF** também, para o cartão dos comunicados: o
      gerador de imagens não lê woff2

### 2. Fonte de texto corrido

Usada em: notícias, descrições, formulários, calendário, rodapé.

- [ ] Pesos **400, 500, 600, 700**
- [ ] **Itálico**
- [ ] Legível a 14–16px, que é onde vive a maior parte do texto
- [ ] Acentuação portuguesa completa
- [ ] **Algarismos tabulares** seria uma vantagem real — resultados,
      datas e valores de quota alinham em coluna

> A **General Sans** cumpre isto tudo. Se gostares dela, o problema é só
> a fonte de títulos.

---

## Sugestões que encaixam no desenho

Todas gratuitas, todas com acentuação portuguesa a sério.

### Para títulos

| Fonte | Onde | Porquê encaixa | A ter em conta |
|---|---|---|---|
| **Archivo** (variável) | Google Fonts | Pesos 100–900 **e** eixo de largura 62–125. Itálico verdadeiro. Dá para apertar a largura no hero e alargar noutros sítios | A mais versátil das três. Serve de títulos **e** de texto |
| **Barlow Condensed** | Google Fonts | 100–900 com itálico. Estreita de origem, muito usada em desporto | Muito estreita — pode ser demais em títulos curtos |
| **Anton** | Google Fonts | Extremamente pesada e estreita, feita para títulos grandes | **Só tem um peso.** Não há degrau de destaque |

### Para texto corrido

| Fonte | Onde | Porquê |
|---|---|---|
| **General Sans** | Fontshare | Já está instalada e cumpre tudo |
| **Inter** | Google Fonts | O padrão da legibilidade em ecrã, algarismos tabulares |
| **Archivo** | Google Fonts | Se usares Archivo nos títulos, uma família só para tudo |

**Recomendação:** **Archivo variável nos títulos + General Sans no texto.**
O eixo de largura da Archivo resolve o problema que a Trench Slab criou —
aperta-se onde o espaço é curto, sem trocar de fonte.

---

## Como testar antes de decidir

Antes de me passares a fonte, escreve estas três linhas no sítio da fonte,
todas em maiúsculas e a tamanho grande:

```
SOMOS TODOS VALEJAS
ASSEMBLEIA GERAL ORDINÁRIA
DIREÇÃO · ATLÉTICO · INSCRIÇÃO
```

A terceira é a que revela problemas: se os acentos parecerem colados,
tortos ou de outra fonte, essa fonte não serve para um site português.

---

## O que fazer com o que já lá está

Se quiseres largar a Trench Slab, é rápido: as fontes estão isoladas em
`src/app/fonts.ts` e apontadas por variáveis CSS no `tailwind.config.ts`.
Trocar a fonte de títulos é mexer nesses dois sítios e substituir os
ficheiros em `public/fonts/`.

O que **não** volta atrás sozinho: os 35 itálicos e os 116 `font-black`
que foram removidos por a Trench Slab não os suportar. Se a fonte nova
tiver itálico e peso 900, esses têm de ser repostos — diz-me e faço a
varredura ao contrário.
