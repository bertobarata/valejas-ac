# Imagens da loja

Onde estão, que tamanho têm de ter, e um prompt para as refazer.

## Onde ficam

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

## Que ficheiro é que peça

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

## Tamanhos e formatos

As imagens entram em molduras com proporção fixa e são **contidas**, não
cortadas: o que sobra fica em branco. Por isso o que importa é a peça
ficar centrada e com margem à volta.

| Onde aparece | Proporção da moldura | Ficheiro recomendado |
|---|---|---|
| Cartão na grelha | 3:2 (horizontal) | **1600 × 1067 px** |
| Cartão em destaque | 2:1 | 1600 × 800 px |
| Kit de atleta | 16:4 (faixa larga) | **1920 × 480 px** |

- Formato: **WebP**, qualidade 80–85. Um PNG de 1 MB dá o mesmo a 60 kB
- Fundo: **branco puro (#FFFFFF)** ou transparente. A moldura do site é
  branca, por isso um fundo branco funde-se com ela e a peça fica a
  flutuar — que é o efeito que se quer
- Margem: deixa ~8% de folga à volta da peça
- Todas as peças da mesma família com o **mesmo enquadramento e a mesma
  escala**. Numa grelha, uma camisola maior que a do lado lê-se como erro

## Cores do clube

| Cor | Hex | Onde |
|---|---|---|
| Amarelo | `#FADB09` | Riscas, detalhes |
| Azul | `#1554BB` | Riscas, calção |
| Azul-marinho | `#0B285C` | Alternativos, agasalhos |
| Vermelho | `#D4150C` | Faixa do emblema |
| Branco | `#FFFFFF` | Equipamento alternativo |

Emblema oficial: `valejas-ac/public/brand/crest.png`

---

## Prompt para gerar as imagens

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
magick nova-imagem.png -resize 1600x1067^ -gravity center -extent 1600x1067 \
  -background white -alpha remove -quality 82 equipamento-principal.webp
```

Para a faixa do kit, a montagem das três peças faz-se assim:

```bash
magick montage equipamento-principal.webp equipamento-branco.webp conjunto-azul.webp \
  -tile 3x1 -geometry 640x480+0+0 -background white kit-atleta.webp
```

Substituído o ficheiro, é só recarregar a página — não é preciso mexer
em código nem fazer deploy novo se ainda estiveres em desenvolvimento.
