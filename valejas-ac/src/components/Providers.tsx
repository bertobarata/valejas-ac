"use client";

import { ThemeProvider } from "next-themes";
import { CarrinhoProvider } from "@/lib/loja/carrinho";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange={false}
    >
      <CarrinhoProvider>{children}</CarrinhoProvider>
    </ThemeProvider>
  );
}
