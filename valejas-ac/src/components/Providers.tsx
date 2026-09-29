"use client";

import { ThemeProvider } from "next-themes";
import { CarrinhoProvider } from "@/lib/loja/carrinho";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    /*
     * Escuro por omissão, a pedido do clube (29/09/2026) — mesmo que o
     * telemóvel esteja em modo claro. O botão da barra troca, e a escolha
     * fica guardada no browser: quem passou a claro continua claro.
     */
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <CarrinhoProvider>{children}</CarrinhoProvider>
    </ThemeProvider>
  );
}
