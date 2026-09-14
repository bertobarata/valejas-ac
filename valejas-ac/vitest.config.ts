import { defineConfig } from "vitest/config";
import path from "node:path";

/**
 * Testes das regras que custam dinheiro ou dados.
 *
 * Não há aqui testes de interface: o que interessa proteger é o que
 * acontece no servidor quando alguém manipula o pedido. Correr com
 * `npm test`.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
});
