/**
 * Link, router e pathname que sabem em que língua se está. Usar estes
 * em vez dos do Next: um <Link href="/loja"> em inglês tem de levar a
 * /en/loja, e o usePathname devolve o caminho sem o prefixo da língua.
 */

import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
