// Envio de formulários via Formspree (funciona em hosting estático / GitHub Pages).
// Cria um form em https://formspree.io → copia o endpoint → define em .env.local:
//   NEXT_PUBLIC_FORMSPREE_ENDPOINT=https://formspree.io/f/xxxxxxxx
// Como é NEXT_PUBLIC_*, o valor é embutido no build (rebuild após mudar).

const ENDPOINT = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

export function isFormspreeConfigured(): boolean {
  return Boolean(ENDPOINT);
}

/**
 * POST de dados de formulário para o Formspree.
 * Devolve true em sucesso. Lança Error com mensagem legível em falha.
 */
export async function submitToFormspree(
  data: Record<string, FormDataEntryValue | string>
): Promise<boolean> {
  if (!ENDPOINT) {
    throw new Error(
      "Formulário ainda não configurado (falta NEXT_PUBLIC_FORMSPREE_ENDPOINT)."
    );
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: (() => {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => fd.append(k, v as string));
      return fd;
    })(),
  });

  if (!res.ok) {
    let msg = "Não foi possível enviar. Tenta novamente.";
    try {
      const json = await res.json();
      if (json?.errors?.length) msg = json.errors.map((e: { message: string }) => e.message).join(" ");
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }
  return true;
}
