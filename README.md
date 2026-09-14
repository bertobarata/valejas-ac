# Website — Valejas Atlético Clube

O site oficial do clube, em **valejasac.pt**. Fundado em 1966, em Valejas,
Barcarena. Sete modalidades, dos petizes aos seniores da Academia.

```bash
cd valejas-ac
npm install
npm run dev        # http://localhost:3000
```

## Onde está cada coisa

| Documento | Responde a |
|---|---|
| **[PRODUCT.md](PRODUCT.md)** | O que é o site, para quem, que modalidades e que páginas existem. As decisões da Direção que governam tudo o resto |
| **[DESIGN.md](DESIGN.md)** | Cores, tipografia, componentes, contrastes. **Ler antes de mexer no amarelo** |
| **[OPERACAO.md](OPERACAO.md)** | Como o clube trabalha o site: publicar comunicados, jogos, plantéis, encomendas. E como se ligam as redes sociais |
| **[SETUP.md](SETUP.md)** | Instalar, variáveis de ambiente, Sanity, deploy e domínio |
| **[TODO.md](TODO.md)** | O que falta. Começa pelo que bloqueia ir para o ar |
| [arquivo/](arquivo/) | Documentos que já não descrevem o site. Não usar para decidir |

## A stack, em três linhas

Next.js 14 App Router com TypeScript e Tailwind. **Sanity** guarda o conteúdo
que a Direção escreve. **GSAP + Lenis** fazem o movimento. **Resend** envia os
emails, **Ifthenpay** trata dos pagamentos e **Make.com** publica nas redes —
estes três ainda por ligar.

## Duas regras que explicam o código

**Conteúdo vive em `src/lib/data/`, nunca dentro de um componente.** Foi assim
que o plantel, os jogos e a loja passaram a ser editáveis sem tocar em código.

**Nada rebenta por falta de configuração.** Sem CMS, o site mostra dados de
exemplo. Sem gateway de pagamento, cai para transferência bancária. Sem
Make.com, o comunicado sai no site e as redes ficam em demonstração. Cada
ausência tem um caminho de recurso, e todos foram testados.

## Estado

Em `feat/reestruturacao-reuniao`. Ainda **não está no ar** — falta resolver o
impasse da Vercel, ligar o email e trocar a palavra-passe de desenvolvimento.
O `TODO.md` abre com essa lista.
