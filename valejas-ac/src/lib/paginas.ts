/**
 * Páginas que abrem com o emblema em ecrã inteiro. Nestas a barra do
 * topo fica por cima do hero — o emblema grande encolhe e "aterra" nela
 * ao rolar. Em todas as outras, o conteúdo começa abaixo da barra.
 *
 * Uma lista só, lida pela barra e pelo conteúdo: separadas, bastava
 * acrescentar uma página a uma delas para o efeito partir.
 */
export const PAGINAS_COM_HERO = ["/", "/clube/emblema"];

/**
 * A loja passou a ser do clube: vive em /loja, com levantamento na sede.
 * Mora aqui e não no Navbar: o Navbar é de cliente, e um servidor que
 * importe uma constante de lá recebe uma referência e não o texto.
 */
export const STORE_URL = "/loja";
