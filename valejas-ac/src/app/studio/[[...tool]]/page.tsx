"use client";

/**
 * Sanity Studio — embebido em /studio
 *
 * Acesso: http://localhost:3000/studio  (dev)
 *         https://valejas.pt/studio     (produção)
 *
 * Só é acessível a utilizadores com conta no projeto Sanity.
 * Configura os membros em manage.sanity.io → Members.
 */

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
