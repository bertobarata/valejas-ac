/** API — entrada na área da Direção. */

import { NextResponse } from "next/server";
import {
  palavraPasseCorreta, criarSessao, authConfigurada,
  COOKIE_SESSAO, DURACAO_COOKIE_SEGUNDOS,
} from "@/lib/auth-direcao";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!authConfigurada()) {
    return NextResponse.json(
      { ok: false, erro: "A área da Direção ainda não está configurada." },
      { status: 503 }
    );
  }

  const { password } = await req.json().catch(() => ({ password: "" }));

  if (!palavraPasseCorreta(String(password ?? ""))) {
    // Atraso curto para tornar tentativas em massa pouco práticas.
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ ok: false, erro: "Palavra-passe errada." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_SESSAO, criarSessao(), {
    httpOnly: true,
    sameSite: "lax",
    secure:   process.env.NODE_ENV === "production",
    path:     "/",
    maxAge:   DURACAO_COOKIE_SEGUNDOS,
  });
  return res;
}

/** Sair. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_SESSAO, "", { path: "/", maxAge: 0 });
  return res;
}
