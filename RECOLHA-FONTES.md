# Recolha de fontes externas — 14/09/2026

Material extraído de fontes públicas para fechar pontos do `TODO.md` §3
("Dados reais em falta"). **Nada disto foi aplicado ao código.** Cada bloco
diz onde entraria e o que é preciso confirmar com a Direção antes.

---

## 0. Sobre o link que foi dado

`https://trofeu.oeiras.pt/clube/valejas-a` → redireciona para `/404`. Morto.

O URL certo é **`https://trofeu.oeiras.pt/clube/valejas-atletico-clube`**.

E a página não tem "tudo o que é preciso": tem cinco linhas de ficha —
fundação, morada, telefone e email. Sem história, sem redes sociais, sem
plantel, sem fotografias. O material abaixo veio de mais quatro fontes.

---

## 1. Ficha oficial — Câmara Municipal de Oeiras

Fonte: https://trofeu.oeiras.pt/clube/valejas-atletico-clube

| Campo | Valor publicado pela CMO |
|---|---|
| Nome | VALEJAS ATLÉTICO CLUBE |
| Ano de fundação | 01/11/1966 |
| Morada | Estrada das Palmeiras 1A |
| Código postal | `2730-8` Lisboa — Oeiras — BARCARENA |
| Telefone | 21 436 5104 |
| Email | valejas.a.c@gmail.com |

**Confirma** o que já está em `socios.ts` (email, telefone, morada) e em
`historia.ts` (fundação a 1/11/1966).

⚠️ **Conflito de código postal.** A CMO escreve `2730-8`, o site usa
`2730-132`. O `2730-8` está truncado — não é um CP válido (faltam dígitos).
O `2730-132` continua a ser o bom. Não mexer.

⚠️ **Conflito de localidade.** A CMO diz `BARCARENA`, o site diz
`Queluz de Baixo` (`historia.ts:62`, `instalacoes.ts:48`). São ambos
verdade a níveis diferentes — Queluz de Baixo é a localidade, Barcarena é
a freguesia. O `historia.ts` já distingue as duas. Não mexer.

---

## 2. Atletismo — resolve o TODO §3 "Atletismo"

Fonte: https://trofeu.oeiras.pt/evento/grande-premio-valejas-atletico-clube-2

O TODO diz que o texto de atletismo foi "escrito por inferência". Já não
precisa de ser. Factos publicados pela Câmara:

- O clube **organiza** o **Grande Prémio de Atletismo de Valejas**, prova
  integrada no **Troféu CM Oeiras** (43ª edição, 2025/26).
- Co-organização: **Divisão do Desporto da Câmara Municipal de Oeiras**.
  Apoio: **Junta de Freguesia de Barcarena**.
- 42ª edição: **19 de janeiro de 2025, 9h30**.
- 43ª edição: **29 de março de 2026, 9h30**.
- Local: Barcarena, Oeiras. Partida/chegada na sede do clube.

**Percursos da 42ª edição** (6 provas, o que responde à pergunta
"vertentes reais"):

| Prova | Distância |
|---|---|
| Percurso 1 | 7,25 km |
| Percurso 2 | 3,77 km |
| Percurso 3 | 2,60 km |
| Percurso 4 | 1,24 km |
| Percurso 5 | 0,50 km |
| Percurso 6 | 0,50 km |

Leitura: é **atletismo de estrada / corta-mato**, não pista. Os 7,25 km
são a prova principal; 3,77 e 2,6 são caminhada/prova curta; as três de
1,24 km e 0,5 km são provas de jovens. Daí o "todos os escalões".

→ Entra em `modalidades.ts`, entrada `atletismo`. A descrição atual
("Provas e treino regular…") pode passar a nomear o Grande Prémio, que é
o facto mais forte que o clube tem em atletismo e não está no site.

**Continua por saber:** federação (a prova é do Troféu CMO, não
necessariamente FPA), e se há treino regular ou só a organização da prova.

---

## 3. Plantel sénior de futsal — resolve o TODO §3 "Plantel"

Fonte: https://www.zerozero.pt/equipa/valejas/16070
Competição indicada: **AF Lisboa I Divisão Futsal 2026/27**

⚠️ **Não aplicar sem a Direção validar.** São nomes de pessoas reais a ir
para uma página pública. O zerozero pode estar desatualizado e a fonte de
verdade é `/direcao/plantel` no CMS. Isto serve para a Direção conferir
contra a ficha de inscrição, não para substituir.

| Nº | Nome | Posição |
|---|---|---|
| 1 | Márcio Santos | Guarda-Redes |
| 12 | Guilherme Bicho | Guarda-Redes |
| — | Rodrigo Bernardo | Guarda-Redes |
| 17 | Carlos Monteiro | Fixo |
| — | Ricardo Pinto | Fixo |
| — | Cláudio Tavares | Ala |
| 8 | Nuno Coimbra | Ala |
| 13 | Francisco Teixeira | Ala |
| 21 | Luís Alves | Ala |
| 29 | João Cabral | Ala |
| 48 | Samuel Santos | Ala |
| — | Xavier Quiteque | Ala |
| 20 | Fábio Melo | Ala/Pivot |
| — | Ricardo Lucas | Ala/Pivot |
| — | Flávio Afonso | Pivot |
| — | Edson Soares | Pivot |

Notas para quem aplicar:
- Faltam 7 números. O tipo `Jogador` em `plantel.ts:20` exige `numero:
  number` — ou se arranjam os números, ou o campo passa a opcional.
- "Ala/Pivot" não existe em `Posicao`. O mais próximo é `Universal`.
- Não há capitão identificado. `capitao?` fica de fora.

---

## 4. Corpo técnico — resolve o TODO "CorpoTecnico.tsx"

Mesma fonte. O ficheiro está vazio de propósito desde que se apagou o
"Marco Reus" inventado.

| Cargo | Nome |
|---|---|
| Treinador principal | Pedro Cascarrinho |
| Treinador adjunto | Mauro Rodrigues |
| Treinador de guarda-redes | Ramiro Antão |

Mesma ressalva do plantel: confirmar com a Direção antes de publicar.

---

## 5. Pavilhão — ⚠️ conflito a resolver

O zerozero indica como recinto do Valejas:

> **Pavilhão Professor Noronha Feio**, Queijas, capacidade 250

O site diz outra coisa. `jogos.ts:26`:

```
export const PAVILHAO_CASA = "Pavilhão do Valejas Atlético Clube, Barcarena";
```

E `instalacoes.ts` descreve um "Pavilhão Multiusos" em "Barcarena, Oeiras".

São dois sítios diferentes — Queijas não é Barcarena. As hipóteses:

1. O clube treina no pavilhão próprio e **joga em casa** no Noronha Feio
   (pavilhão municipal, é o padrão quando o recinto do clube não tem
   homologação ou lotação para o distrital).
2. O zerozero está errado.

Isto importa: `PAVILHAO_CASA` é o que aparece ao adepto que vai ver o
jogo. Se estiver errado, manda gente para a morada errada.

**Pergunta para a Direção:** os jogos em casa da Equipa A jogam-se onde?

---

## 6. Redes sociais — já estavam certas

Confirmadas por fonte externa, batem certo com `socios.ts:24-26`:

- Instagram — https://instagram.com/valejasa.c.desporto
- Facebook — https://facebook.com/valejasacdesporto
- YouTube — https://youtube.com/@valejastv

Existe ainda uma **segunda página de Facebook**, só de futsal, com ~1088
gostos: `facebook.com/p/Valejas-Atlético-Clube-Futsal-100057038366300`.
Não está no site. Decidir se é oficial e se entra, ou se é um duplicado a
abandonar. (Há sinais de pelo menos três páginas FB com o nome do clube —
vale a pena limpar isso antes de as divulgar no site.)

---

## 7. Achado solto — INATEL

Fonte: https://desporto.inatel.pt/pt/club/9633636

O clube está inscrito na Fundação INATEL com um contacto que **não é
nenhum dos que o site usa**:

- Telefone `914985058`
- Email `dina.paredes@jdecoffee.com` — email de empresa, de trabalho

Provavelmente um contacto pessoal de quem tratou da inscrição. Não entra
no site. Fica registado porque é um email do clube exposto publicamente
num sítio onde a Direção talvez não saiba que está.

---

## 8. Fonte por abrir

`zerozero.pt` tem página por escalão (Sub-13, Sub-15, e há registo de
Valejas no Campeonato Distrital Sub-11 da AF Lisboa). Dão os planteis de
formação e os escalões reais — o que fecha o TODO "o site diz «todos os
escalões» sem os enumerar". Não foram puxados: o domínio está fora da
lista de permissões do browser desta sessão e as páginas de plantel por
escalão não abrem por fetch simples.

O que já se confirma: **Sub-11, Sub-13 e Sub-15 existem** como equipas
inscritas. Os sete escalões listados em `modalidades.ts:82` (Petizes a
Juniores) não estão desmentidos, mas também não estão confirmados um a um.

---

## O que continua em falta e nenhuma destas fontes dá

- **História** — fundadores, ata da fundação. Não há registo público
  nenhum. Só o arquivo do clube resolve.
- **Fotografias** — plantel, corpo técnico, sede, pavilhão, os 20 membros
  dos órgãos sociais, logótipos dos patrocinadores. Nada disto se tira de
  fontes públicas com qualidade utilizável.
- **Quota** — 1€/mês por confirmar.
- **Nº de sócio duplicado** — Mário Sérgio Barata e Teresa Santos ambos
  com o 167.
