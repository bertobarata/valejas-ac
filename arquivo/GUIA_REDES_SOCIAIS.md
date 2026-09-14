# Publicar comunicados no Facebook e Instagram

Guia para ligar o site às redes sociais do Valejas AC através do Make.com.
Fazes isto uma vez. Depois o Presidente só escreve e carrega em Publicar.

---

## Como funciona

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

## Antes de começar

- [ ] A conta de Instagram do clube tem de ser **Profissional**
      (app do Instagram → Definições → Tipo de conta → Mudar para conta profissional)
- [ ] Essa conta tem de estar **ligada à Página de Facebook** do clube
      (Instagram → Definições → Partilhar noutras aplicações → Facebook)
- [ ] Tens de ser administrador da Página de Facebook

Sem estes três pontos, nem o Make nem nada mais consegue publicar no Instagram.

---

## Passo 1 — Criar o cenário no Make

1. Conta grátis em **make.com**
2. **Create a new scenario**
3. Primeiro módulo: procura **Webhooks** → **Custom webhook** → **Add**
4. Dá-lhe um nome (ex.: `comunicados-valejas`) → **Save**
5. Copia o URL que aparece. É algo como
   `https://hook.eu2.make.com/a1b2c3d4e5f6...`

Guarda esse URL — é o `MAKE_WEBHOOK_URL`.

---

## Passo 2 — Ensinar o Make a reconhecer os campos

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

## Passo 3 — Proteger o webhook

Sem isto, quem descobrir o URL publica no nome do clube.

1. Gera um segredo no terminal:
   ```
   openssl rand -hex 24
   ```
2. No Make, entre o webhook e os módulos seguintes, adiciona um **Filter**
3. Condição: `X-Valejas-Segredo` (dos headers) **Equal to** o segredo gerado
4. Guarda o mesmo valor em `MAKE_WEBHOOK_SEGREDO`

---

## Passo 4 — Publicar no Facebook

1. A seguir ao filtro: **Facebook Pages** → **Create a Post**
2. **Add connection** → entra com a conta que administra a Página
3. Escolhe a Página do clube
4. Preenche:
   - **Message**: campo `legenda` do webhook
   - **Photo URL / Link**: campo `imagemUrl`
5. Adiciona um **Filter** antes deste módulo: `facebook` **Equal to** `true`

---

## Passo 5 — Publicar no Instagram

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

## Passo 6 — Ligar tudo

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

## Passo 7 — Testar

1. Vai a `/direcao`, entra com a palavra-passe
2. Escreve um comunicado de teste
3. Confirma que a pré-visualização mostra o emblema e o texto
4. Publica
5. Vê o resultado no site, no Facebook e no Instagram
6. Apaga o teste das três

---

## Quando alguma coisa falha

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

## Notas

- **Plano grátis do Make**: 1000 operações/mês. Cada comunicado gasta 3.
  Dá para cerca de 330 comunicados por mês.
- **Sem `MAKE_WEBHOOK_URL` configurado**, o site fica em modo demonstração:
  mostra o que iria publicar e não publica nada. Nada rebenta.
- **Alternativa futura**: o código para falar diretamente com a Meta já
  existe em `src/lib/social/meta.ts`. Se um dia o clube tiver app própria
  aprovada, basta preencher `META_PAGE_ID`, `META_IG_USER_ID` e
  `META_PAGE_ACCESS_TOKEN` e remover o `MAKE_WEBHOOK_URL`.
