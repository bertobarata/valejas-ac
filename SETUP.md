# Instalação e configuração

Tudo o que é preciso para pôr o site a correr, em desenvolvimento e no ar.

## 1. Correr localmente

```bash
cd "valejas-ac"
npm install
npm run dev
```

Abre em **http://localhost:3000**.

O que se instala: **Next.js 14** (App Router), **React 18**, **TypeScript**,
**Tailwind 3.4**, **GSAP + ScrollTrigger**, **Lenis** (scroll suave),
**next-sanity**, **next-themes**, **lucide-react**.

> Não há three.js. O campo de partículas do hero é canvas 2D escrito à mão —
> a biblioteca eram 23 MB e ~60 kB de JavaScript por visita para desenhar
> pontos a flutuar.

Antes de `npm run build`, **parar o servidor de desenvolvimento**. A build
escreve por cima do `.next` que o dev está a usar e deixa o site a dar 500.

## 2. Variáveis de ambiente

Copiar `.env.example` para `.env.local` e preencher. O `.env.example` explica
cada variável e traz os comandos para gerar os segredos.

```bash
cp .env.example .env.local
```

O `.env.local` **nunca vai para o repositório** — está no `.gitignore`.

O que acontece sem cada uma:

| Em falta | O site |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Funciona, mas as imagens de partilha saem relativas e a Meta não as vai buscar |
| `DIRECAO_UTILIZADORES` + `DIRECAO_SECRET` | A área da Direção diz que não está configurada |
| `RESEND_API_KEY` + `EMAIL_CLUBE` | **Inscrições e encomendas não chegam a ninguém** (modo `log` escreve no terminal) |
| `EMAIL_SOCIOS`, `EMAIL_INSCRICOES`, `EMAIL_LOJA`, `EMAIL_PAGAMENTOS` | Nada: cada assunto cai na caixa geral |
| Sanity | Mostra os dados de exemplo; as áreas da Direção avisam que o CMS não está ligado |
| `DATABASE_URL` | A loja continua a vender e a encomenda chega por email, mas `/direcao/encomendas` não tem o que mostrar |
| `CRON_SECRET` | A limpeza diária recusa tudo e as encomendas nunca são apagadas — o prazo de um ano deixa de ser cumprido |
| Ifthenpay | MB WAY e referência dão 503 e o formulário cai para transferência |
| Make.com | O comunicado sai no site e as redes ficam em demonstração |

Nenhuma ausência rebenta o site. Foi construído assim de propósito.

## 3. Sanity (CMS)

Projeto **Valejas Website** — `q1z6dv1y`, dataset `production`, **privado**.

```bash
npx sanity@latest login          # uma vez, abre o browser
npx sanity@latest projects list
```

Já configurado: origens CORS para `localhost:3000`, `valejasac.pt` e
`www.valejasac.pt`, e um token `site-valejas` com papel *editor*.

Para criar outro token (ou rodar o atual, se escapar):

```bash
npx sanity@latest tokens create "nome" --role editor -p q1z6dv1y
npx sanity@latest tokens rotate <id> -p q1z6dv1y
```

**O dataset é privado, e isso tem duas consequências:**

1. Sem `SANITY_API_TOKEN` no servidor, o site **não lê nada** e volta aos
   dados de exemplo
2. Os clientes pedem `perspective: "published"`. Sem isso, um pedido com token
   traz também os rascunhos — e um comunicado a meio de ser escrito aparecia
   no site

⚠️ O plano **Free do Sanity não permite datasets privados**. O projeto está em
Growth Trial até 14/10/2026. Decisão pendente em `TODO.md` §7.

O Studio está em **/studio**, e só entra quem for membro do projeto.

## 3b. Base de dados (encomendas da loja)

Postgres. Qualquer um serve — só precisa de `DATABASE_URL`.

O que está montado: **Neon**, plano grátis, região `fra1` (Frankfurt),
criado pelo Marketplace da Vercel. A integração escreve a `DATABASE_URL`
nos três ambientes sozinha e renova-a se a base for recriada.

```bash
vercel integration add neon -m region=fra1
vercel env pull .env.local      # cuidado: substitui o ficheiro todo
```

Porque não no CMS: uma encomenda leva nome, email e telemóvel. O plano
Free do Sanity só permite datasets públicos, e público quer dizer legível
por quem souber o id do projeto — que está escrito no JavaScript do site.

Porque em Frankfurt: são dados pessoais de sócios e atletas, muitos deles
menores. Ficam na União Europeia.

A tabela `encomendas` **cria-se sozinha** à primeira utilização
(`create table if not exists`). Não há migrações para correr à mão — um
clube não tem quem o faça.

**Prazo de conservação: um ano.** O cron da Vercel chama
`/api/manutencao/encomendas` todos os dias às 4h e apaga o que passou.
O endpoint só responde a quem traga o `CRON_SECRET` no cabeçalho, que é
o que a Vercel envia sozinha quando a variável existe. Para o testar à
mão:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" \
     https://valejasac.pt/api/manutencao/encomendas
```

---

## 4. Deploy (Vercel)

```bash
npx vercel          # preview
npx vercel --prod   # produção
```

Repetir **todas** as variáveis de ambiente em Settings → Environment Variables.
Só entram no **deploy seguinte** — depois de as pôr, fazer redeploy.

### Domínio

`valejasac.pt`, comprado na Amen a 14/09/2026.

| Registo | Valor |
|---|---|
| `A` (raiz) | `76.76.21.21` |
| `CNAME` (`www`) | `cname.vercel-dns.com` |

Na Vercel: marcar **`valejasac.pt` como principal** e o `www` como
redirecionamento — não o contrário. O certificado HTTPS é automático.

O Resend precisa de verificar o domínio à parte, com registos SPF e DKIM, ou
os emails de inscrição caem no spam.

⚠️ **Impasse conhecido:** existe um projeto Vercel antigo a ocupar o subdomínio
`valejas-ac.vercel.app`, provavelmente noutra conta. Impede criar o novo.

## 5. Testes

```bash
npm test           # uma passagem
npm run test:watch # enquanto se mexe no código
```

São 25 testes sobre **as regras que custam dinheiro ou dados**: os preços vêm
do catálogo e não do browser, o sinal é a percentagem combinada, o NIF e o
Cartão de Cidadão têm dígito de controlo, quem nasceu há menos de 18 anos é
menor, as modalidades são sete e o calendário tem 30 jornadas sem repetições.

Não há testes de interface. O que interessa proteger é o que acontece no
servidor quando alguém manipula o pedido.

## 6. Antes de ir para o ar

- [x] Criar as contas em `DIRECAO_UTILIZADORES`, uma por pessoa, e apagar a
      `DIRECAO_PASSWORD` — feito a 14/09/2026
- [x] Gerar `DIRECAO_SECRET` — feito. Faltam `MAKE_WEBHOOK_SEGREDO` e
      `IFTHENPAY_CALLBACK_CHAVE`, quando essas contas existirem
- [x] Confirmar que `SANITY_API_TOKEN` está na Vercel — feito a 14/09/2026
- [x] `DATABASE_URL` na Vercel — feito a 15/09/2026 pela integração Neon,
      que a escreve sozinha nos três ambientes
- [ ] Correr `npm test` e `npm run build`, e ver que passam
- [ ] Ler o `TODO.md` §1 e §2

## Estrutura

```
valejas-ac/
├── src/app/            páginas e rotas de API
├── src/components/     componentes, por área
├── src/lib/data/       a camada de dados — tudo o que é conteúdo vive aqui
├── src/lib/            validação, email, pagamentos, autenticação
├── src/sanity/         cliente, queries e schemas do CMS
└── public/             emblema, fontes, imagens da loja
```

**Regra de ouro:** conteúdo vive em `src/lib/data/`, nunca dentro de um
componente. Foi assim que o plantel, os jogos e a loja passaram a ser
editáveis sem tocar em código.
