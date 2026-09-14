# Valejas AC — Loja Online & Melhorias de Design

Documento de planeamento para apresentação à Direção do clube.
Preparado por: Equipa de desenvolvimento web · Março 2026

---

## Parte 1 — Loja Online

### Contexto

O site do Valejas AC está pronto com todas as páginas principais (Home, Jogos, Equipas, Clube, Notícias, Sócios & Contacto). O próximo passo natural é a loja online para venda de merchandising e equipamentos do clube.

O tipo e quantidade de produtos que o clube pretende vender vai determinar qual plataforma faz mais sentido. Abaixo estão as três opções viáveis, cada uma com o seu cenário ideal.

---

### Opção A — Shopify Headless (Recomendado)

**O que é:** A loja vive visualmente dentro do site do Valejas AC — o adepto nunca sai do site — mas toda a logística (stock, pagamentos, envio, faturação) é gerida pelo Shopify nos bastidores.

| Aspeto | Detalhe |
|---|---|
| **Custo** | ~27 €/mês (plano Basic Shopify) + taxas de transação |
| **Pagamentos** | MB Way, Multibanco, Cartão, PayPal — via Shopify Payments (disponível em Portugal) |
| **Gestão de stock** | Dashboard Shopify completo — o presidente ou assessor gere tudo sem tocar em código |
| **Integração no site** | Via Storefront API — a loja tem o mesmo design, cores e tipografia do site |
| **Escalabilidade** | Sem limite de produtos; suporta variantes (tamanho S/M/L/XL, cor), descontos para sócios, cupões |
| **Envio** | Integração com CTT, DPD, UPS; cálculo automático de portes |

**Ideal para:** Clubes que querem vender equipamentos oficiais, cachecóis, acessórios e ter controlo total sobre stock e margens. Funciona mesmo que o catálogo cresça para 50+ produtos.

**Vantagem principal:** O checkout é fluido e confiável — os adeptos pagam com MB Way em 2 cliques. A experiência não "quebra" ao passar para a loja.

---

### Opção B — Snipcart

**O que é:** Um snippet de JavaScript que adiciona um carrinho de compras a qualquer site. Não precisa de backend próprio — o Snipcart trata de tudo.

| Aspeto | Detalhe |
|---|---|
| **Custo** | 2% por transação + mínimo 20 €/mês |
| **Pagamentos** | Stripe (cartão, Apple Pay, Google Pay) — MB Way e Multibanco requerem integração Stripe Portugal |
| **Gestão de stock** | Painel Snipcart simples — funcional mas menos poderoso que Shopify |
| **Integração no site** | Muito leve — adiciona-se ao HTML existente com atributos `data-` |
| **Escalabilidade** | Funciona bem até ~20 produtos; acima disso, a gestão torna-se limitada |

**Ideal para:** Catálogo pequeno (5–15 produtos), lançamento rápido, orçamento reduzido.

**Vantagem principal:** Implementação em 1–2 dias, sem dependência de plataforma externa.

---

### Opção C — Printful/Printify + Shopify (Print-on-Demand)

**O que é:** O clube desenha os produtos (camisolas, cachecóis, bonés, canecas) e um parceiro de impressão fabrica e envia cada encomenda diretamente ao cliente. O clube nunca toca no stock.

| Aspeto | Detalhe |
|---|---|
| **Custo** | Shopify (~27 €/mês) + custo de produção por item (ex: t-shirt ~12€, venda a 25€) |
| **Pagamentos** | Mesmos do Shopify (MB Way, Multibanco, etc.) |
| **Gestão de stock** | Não existe stock — cada peça é produzida na encomenda |
| **Integração no site** | Mesma do Shopify Headless (Storefront API) |
| **Escalabilidade** | Ilimitada — Printful trata da produção e envio para toda a Europa |

**Ideal para:** Clubes que não querem investir em stock inicial nem gerir armazém. Perfeito para merchandising casual (t-shirts, hoodies, canecas com o emblema).

**Limitação:** Não adequado para equipamentos técnicos de jogo (camisolas oficiais com patrocínios) — esses requerem fabricante próprio e stock real.

**Vantagem principal:** Risco zero de stock parado. O clube ganha margem em cada venda sem investimento inicial.

---

### Que produtos o clube pretende vender?

Para ajudar a Direção a decidir, aqui estão os produtos típicos de um clube desportivo:

**Equipamento oficial de jogo**
- Camisola principal (casa)
- Camisola alternativa (fora)
- Camisola de treino
- Calções e meias

**Merchandising / Lifestyle**
- Cachecóis
- Bonés / Gorros
- T-shirts casuais com emblema
- Hoodies / Sweats
- Canecas
- Porta-chaves
- Mochilas / Sacos de treino

**Produtos digitais (sem custo de stock)**
- Quotas de sócio online
- Bilhetes para jogos
- Pacotes VIP / Experiências

> **Nota:** Se o clube pretende vender apenas merchandising casual (t-shirts, canecas, cachecóis), a Opção C (Print-on-Demand) elimina o risco de stock. Se pretende vender equipamento oficial de jogo, a Opção A (Shopify) é necessária.

---

### Comparação rápida

| Critério | Shopify Headless | Snipcart | Print-on-Demand |
|---|---|---|---|
| Custo mensal | ~27 € | ~20 € | ~27 € |
| MB Way / Multibanco | ✅ Nativo | ⚠️ Via Stripe | ✅ Nativo |
| Gestão de stock | ✅ Completo | ⚠️ Básico | ✅ Automático |
| Design integrado no site | ✅ | ✅ | ✅ |
| Tempo de implementação | ~1 semana | ~2 dias | ~1 semana |
| Nº de produtos ideal | Ilimitado | Até 20 | Ilimitado |
| Necessita armazém | Sim | Sim | Não |

---

## Parte 2 — Plano de Melhorias de Design

### Melhoria 1 — Fotografia real e direção de arte

**Problema:** O placeholder "V" gigante aparece em todas as secções (hero, notícias, cards de jogadores). Dilui 60% do impacto visual.

| Opção | Descrição | Esforço |
|---|---|---|
| **A — Sessão fotográfica profissional** | Contratar fotógrafo para 1 sessão de treino + retratos individuais do plantel. Resultado: banco de 200+ fotos para toda a época. | 1 dia + ~300–500 € |
| **B — Fotografia amadora de qualidade** | Um membro do clube com boa câmara (ou smartphone recente) fotografa treinos e jogos. Edição com presets consistentes (Lightroom). | 0 € + tempo |
| **C — Stock desportivo + IA** | Usar bancos de imagem gratuitos (Unsplash, Pexels) com temática futsal + gerar imagens complementares com IA para personalizar. | 0–50 € |

---

### Melhoria 2 — Transições entre páginas

**Problema:** Flash branco/preto ao navegar entre páginas. Quebra a sensação de produto acabado.

| Opção | Descrição | Esforço |
|---|---|---|
| **A — View Transitions API + GSAP (Recomendado)** | Fade-out suave de 200ms + fade-in na nova página. Usa a API nativa do browser + GSAP já instalado. Resultado premium. | ~4 horas |
| **B — Loading skeleton animado** | Em vez de transição, mostra esqueletos animados (shimmer) enquanto carrega. Mais simples mas menos elegante. | ~2 horas |

---

### Melhoria 3 — Cards de jogadores premium (flip 3D)

**Problema:** Cards planos com foto + stats. Funcional mas genérico.

| Opção | Descrição | Esforço |
|---|---|---|
| **A — Flip 3D com stats no verso (Recomendado)** | Ao hover, o card roda em 3D e mostra estatísticas detalhadas no verso com o número em marca de água. Inspirado nos cards FIFA/Topps. | ~6 horas |
| **B — Slide overlay** | Stats aparecem num overlay semi-transparente que sobe de baixo ao hover. Mais simples, menos impacto. | ~3 horas |
| **C — Modal detalhado** | Click no card abre um modal full com perfil completo, galeria e stats. Mais conteúdo mas menos imediato. | ~8 horas |

---

### Melhoria 4 — Uso estratégico do vermelho

**Problema:** O amarelo faz todo o trabalho de acento. O vermelho (uma das 3 cores do clube) está quase ausente.

| Opção | Descrição | Esforço |
|---|---|---|
| **A — Sistema de urgência vermelho (Recomendado)** | Vermelho para: badge "AO VIVO", alertas, comunicados, CTA de bilhetes, hover em ações críticas. Amarelo mantém-se para destaques e navegação. | ~3 horas |
| **B — Alternância vermelho/amarelo por secção** | Secções alternam entre amarelo e vermelho como cor de acento dominante. Mais dinâmico mas pode fragmentar a identidade. | ~4 horas |

---

### Melhoria 5 — Notícias na Home com hierarquia editorial

**Problema:** 3 cards idênticos sem hierarquia. Não comunica "media desportivo sério".

| Opção | Descrição | Esforço |
|---|---|---|
| **A — Layout The Athletic (Recomendado)** | 1 artigo grande à esquerda (2/3 do espaço) + 2 secundários empilhados à direita. Tipografia diferenciada por importância. | ~4 horas |
| **B — Layout editorial com ticker** | Barra de ticker horizontal no topo com últimos resultados + grid assimétrico de artigos abaixo. | ~5 horas |

---

### Melhoria 6 — Menu mobile full-screen

**Problema:** Hamburger genérico que abre uma lista. Funcional mas sem carácter.

| Opção | Descrição | Esforço |
|---|---|---|
| **A — Overlay full-screen dramático (Recomendado)** | Fundo escuro full-screen, secções em Epilogue Black a 60–80px, crest em marca de água, animação stagger entrada. Social links no fundo. | ~5 horas |
| **B — Slide-in lateral com branding** | Painel lateral com fundo azul, links em branco, crest no topo. Mais convencional mas polido. | ~3 horas |

---

## Parte 3 — Decisões tomadas

> Decisões registadas em 24/03/2026 pela equipa de desenvolvimento.

### Loja Online
- **Plataforma escolhida:** ✅ Shopify Headless (via Storefront API)
- **Tipo de produtos:** _(pendente — aguarda input da Direção sobre o catálogo pretendido)_
- **Print-on-demand?:** _(possibilidade a explorar com a Direção para merch casual)_
- **Próximos passos:** Criar conta Shopify → configurar Storefront API → implementar páginas de loja no Next.js com identidade visual do site

### Melhorias de Design
- **Fotografia:** _(pendente — requer sessão fotográfica real; sem decisão de opção)_
- **Transições:** ✅ View Transitions API + GSAP — fade suave entre páginas (~4h)
- **Cards jogadores:** ✅ Flip 3D com stats no verso, inspiração FIFA/Topps (~6h)
- **Uso do vermelho:** ✅ Sistema de urgência — vermelho para AO VIVO, alertas, bilhetes, comunicados (~3h)
- **Notícias Home:** ✅ Layout The Athletic — 1 grande + 2 secundários, hierarquia editorial (~4h)
- **Menu mobile:** ✅ Overlay full-screen dramático com tipografia Epilogue e stagger anim (~5h)

### Estimativa total de implementação
| Melhoria | Horas |
|---|---|
| Transições entre páginas | ~4h |
| Cards jogadores flip 3D | ~6h |
| Vermelho estratégico | ~3h |
| Notícias Home editorial | ~4h |
| Menu mobile full-screen | ~5h |
| **Total** | **~22h** |

---

*Documento atualizado: 24 de Março de 2026*
