"use client";

import { useState } from "react";
import { Loader2, LogIn } from "lucide-react";

export default function EntrarDirecao() {
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [aEntrar, setAEntrar] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setAEntrar(true);
    try {
      const res = await fetch("/api/direcao/entrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErro(json.erro ?? "Não foi possível entrar.");
        return;
      }
      window.location.reload();
    } catch {
      setErro("Falha de ligação.");
    } finally {
      setAEntrar(false);
    }
  }

  return (
    <form onSubmit={entrar} className="bg-surface-high p-8 md:p-10 max-w-md space-y-6">
      <p className="font-body text-base text-on-surface-muted leading-relaxed">
        Escreva a palavra-passe para publicar comunicados.
      </p>

      <div>
        <label htmlFor="pw" className="font-body text-sm font-semibold uppercase tracking-widest text-on-surface-muted block mb-2">
          Palavra-passe
        </label>
        <input
          id="pw"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="input-field px-4 border border-on-surface/15 focus:border-yellow w-full text-lg"
        />
      </div>

      {erro && <p className="font-body text-base text-red-500" role="alert">{erro}</p>}

      <button type="submit" disabled={aEntrar} className="btn-primary w-full justify-center text-base py-4 disabled:opacity-60">
        {aEntrar ? <><Loader2 size={16} className="animate-spin" /> A entrar…</> : <><LogIn size={16} /> Entrar</>}
      </button>
    </form>
  );
}
