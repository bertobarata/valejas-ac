"use client";

import { useState } from "react";
import { submitToFormspree } from "@/lib/formspree";

type Variant = "default" | "dark";

const STYLES: Record<Variant, { form: string; input: string }> = {
  default: {
    form: "flex gap-0 w-full md:w-auto",
    input:
      "input-field flex-1 md:w-72 px-4 bg-surface-high border border-on-surface/20 border-r-0 focus:border-yellow",
  },
  dark: {
    form: "flex gap-0 max-w-md mx-auto mb-8",
    input:
      "flex-1 bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-3 font-body text-sm focus:outline-none focus:border-yellow transition-colors duration-200",
  },
};

export default function NewsletterForm({
  variant = "default",
  cta = "Subscrever",
}: {
  variant?: Variant;
  cta?: string;
}) {
  const s = STYLES[variant];
  const [estado, setEstado] = useState<"idle" | "loading" | "ok" | "erro">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEstado("loading");
    try {
      const fd = new FormData(e.currentTarget);
      fd.append("_subject", "Nova subscrição newsletter — Valejas AC");
      await submitToFormspree(Object.fromEntries(fd));
      setEstado("ok");
    } catch {
      setEstado("erro");
    }
  }

  if (estado === "ok") {
    return (
      <p className="font-body text-sm text-yellow" role="status">
        Subscrito. Bem-vindo ao clube.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={s.form}>
      <input
        type="email"
        name="email"
        required
        placeholder="O teu email"
        className={s.input}
      />
      <button
        type="submit"
        disabled={estado === "loading"}
        className="btn-primary rounded-none px-5 py-3 text-xs disabled:opacity-60"
      >
        {estado === "loading" ? "A enviar…" : estado === "erro" ? "Tentar de novo" : cta}
      </button>
    </form>
  );
}
