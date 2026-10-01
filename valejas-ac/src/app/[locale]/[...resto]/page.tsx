import { notFound } from "next/navigation";

/** Qualquer endereço dentro de uma língua que não corresponda a uma página. */
export default function Resto() {
  notFound();
}
