import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset   = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name:    "valejas-ac-studio",
  title:   "Valejas AC — Gestão de Conteúdo",
  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Painel Valejas AC")
          .items([
            // ── Configurações (singleton) ──────────────────────────────
            S.listItem()
              .title("⚙️  Configurações do Clube")
              .id("configuracao")
              .child(
                S.document()
                  .schemaType("configuracao")
                  .documentId("club-config")
                  .title("Configurações do Clube")
              ),
            S.divider(),
            // ── Notícias ───────────────────────────────────────────────
            S.listItem()
              .title("📰  Notícias & Comunicados")
              .schemaType("artigo")
              .child(S.documentTypeList("artigo").title("Notícias & Comunicados")),
            // ── Plantel ────────────────────────────────────────────────
            S.listItem()
              .title("⚽  Plantel")
              .schemaType("jogador")
              .child(S.documentTypeList("jogador").title("Plantel")),
            // ── Jogos ──────────────────────────────────────────────────
            S.listItem()
              .title("🗓️  Jogos & Resultados")
              .schemaType("jogo")
              .child(S.documentTypeList("jogo").title("Jogos & Resultados")),
          ]),
    }),

    // Ferramenta de consulta GROQ — útil para quem desenvolve
    visionTool({ defaultApiVersion: "2024-01-01" }),
  ],

  schema: { types: schemaTypes },
});
