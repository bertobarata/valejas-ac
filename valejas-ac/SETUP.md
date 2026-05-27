# Valejas AC — Guia de Instalação

## 1. Instalar dependências

Abre o terminal na pasta `valejas-ac` e corre:

```bash
cd "valejas-ac"
npm install
```

Isso instala automaticamente:
- **Next.js 14** (App Router, SSR + SSG)
- **Tailwind CSS** (sistema de design unificado dark/light)
- **GSAP + @gsap/react** (animações de scroll)
- **Three.js** (partículas 3D no hero)
- **Lenis** (smooth scroll conectado ao GSAP)
- **next-themes** (toggle dark/light mode)
- **lucide-react** (ícones)

## 2. Correr em desenvolvimento

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 3. Build para produção

```bash
npm run build
npm start
```

---

## Estrutura do projeto

```
src/
├── app/
│   ├── layout.tsx          — Layout global (Navbar, Footer, Providers)
│   ├── globals.css         — Design system: CSS vars, componentes, utilities
│   ├── page.tsx            — Home (/)
│   ├── clube/              — /clube (identidade, história, títulos)
│   ├── jogos/              — /jogos (Match Center)
│   ├── equipas/            — /equipas (plantel)
│   ├── modalidades/        — /modalidades/[slug]
│   └── noticias/           — /noticias
│
├── components/
│   ├── Navbar.tsx          — Navbar com dark/light toggle + GSAP entrance
│   ├── Footer.tsx          — Footer com newsletter
│   ├── Providers.tsx       — ThemeProvider (next-themes)
│   ├── SmoothScroll.tsx    — Lenis + GSAP ScrollTrigger connector
│   └── home/               — Componentes da página Home
│       ├── HeroSection.tsx        — Hero full-width com Three.js + GSAP
│       ├── LiveMatchBanner.tsx    — Próximo jogo / último resultado
│       ├── StatsCounter.tsx       — Contadores animados ao scroll
│       ├── NewsSection.tsx        — Grid de notícias
│       ├── ModalidadesGrid.tsx    — Grid das 6 modalidades
│       ├── ClubIdentitySection.tsx — Teaser do emblema
│       └── SociosCTA.tsx          — CTA newsletter / sócios
│
└── lib/
    └── gsap-animations.ts  — Helpers GSAP reutilizáveis
```

---

## Design System — Cores

| Token         | Light Mode      | Dark Mode       | Uso                     |
|---------------|-----------------|-----------------|-------------------------|
| `bg-surface`  | `#FAF8FF`       | `#0D1321`       | Fundo principal         |
| `bg-surface-low` | `#F2F3FF`    | `#151C29`       | Fundo alternativo       |
| `text-on-surface` | `#001945`   | `#DCE2F5`       | Texto principal         |
| `text-yellow` | `#FADB09`       | `#FADB09`       | Accent primário (fixo)  |
| `bg-blue`     | `#1554BB`       | `#1554BB`       | Accent secundário (fixo)|
| `bg-red`      | `#D4150C`       | `#D4150C`       | Accent terciário (fixo) |

---

## Adicionar imagens reais

Coloca as imagens em `/public/images/`:

- `hero-futsal.jpg` — Foto fullscreen do hero (mínimo 1920×1080)
- `news-derby.jpg` — Notícia em destaque
- `news-transfer.jpg`, `news-academy.jpg`, `news-interview.jpg`

---

## Próximos passos

1. `/src/app/jogos/page.tsx` — Centro de Jogos com Match Center completo
2. `/src/app/equipas/page.tsx` — Plantel com player cards
3. `/src/app/clube/page.tsx` — Emblema + História + Títulos
4. Substituir mock data por CMS real (Sanity, Contentful, ou simples JSON)
