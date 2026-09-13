/**
 * IR PARA O TOPO
 * ─────────────────────────────────────────────────────────────────
 * O Lenis assume o scroll da página. Quando um formulário troca o
 * conteúdo por um ecrã de confirmação e chama window.scrollTo, o
 * pedido perde-se contra o loop do Lenis e a pessoa fica a olhar para
 * o rodapé, convencida de que nada aconteceu.
 *
 * Este módulo guarda a instância ativa — se existir, é ela que manda;
 * se não existir (movimento reduzido, ou antes de montar), cai no
 * scroll nativo.
 * ─────────────────────────────────────────────────────────────────
 */

interface ScrollSuave {
  scrollTo: (alvo: number, opcoes?: Record<string, unknown>) => void;
}

let instancia: ScrollSuave | null = null;

export function registarScrollSuave(i: ScrollSuave | null): void {
  instancia = i;
}

export function irParaOTopo(): void {
  if (instancia) {
    instancia.scrollTo(0);
    return;
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}
