#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# Copia variáveis do .env.local para a Vercel (Production e Preview),
# sem nunca as mostrar no ecrã.
#
# Uso, da pasta valejas-ac/:
#   scripts/enviar-segredos.sh DIRECAO_UTILIZADORES
#   scripts/enviar-segredos.sh DIRECAO_SECRET RESEND_API_KEY
#
# Depois é preciso um deploy novo: as variáveis só entram no deploy
# seguinte, nunca no que já está no ar.
# ─────────────────────────────────────────────────────────────────
set -euo pipefail

AQUI="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$AQUI/.env.local"
RAIZ="$(cd "$AQUI/.." && pwd)"   # o projeto da Vercel está ligado à raiz do repo

[[ $# -gt 0 ]] || { echo "Diz que variáveis enviar. Ex.: $0 DIRECAO_UTILIZADORES" >&2; exit 1; }
[[ -f "$ENV_FILE" ]] || { echo "Não encontro $ENV_FILE" >&2; exit 1; }

valor() {
  local v
  v="$(grep -m1 "^$1=" "$ENV_FILE" | cut -d= -f2-)" || true
  v="${v%\"}"; v="${v#\"}"; v="${v%\'}"; v="${v#\'}"
  printf '%s' "$v"
}

validar_utilizadores() {
  local par nome pass ok=1
  IFS=',' read -ra pares <<< "$1"
  for par in "${pares[@]}"; do
    par="$(echo "$par" | xargs)"
    nome="${par%%:*}"; pass="${par#*:}"
    if [[ "$par" != *:* || -z "$nome" || -z "$pass" ]]; then
      echo "  ✗ Um dos pares não está no formato nome:palavra-passe" >&2; ok=0
    elif (( ${#pass} < 12 )); then
      echo "  ✗ A palavra-passe de «$nome» tem menos de 12 caracteres" >&2; ok=0
    else
      echo "  ✓ $nome (${#pass} caracteres)"
    fi
  done
  (( ok ))
}

for NOME in "$@"; do
  VALOR="$(valor "$NOME")"
  [[ -n "$VALOR" ]] || { echo "✗ $NOME está vazia ou não existe no .env.local" >&2; exit 1; }
  echo "→ $NOME"
  if [[ "$NOME" == "DIRECAO_UTILIZADORES" ]]; then
    validar_utilizadores "$VALOR" || { echo "Corrige o .env.local e volta a correr." >&2; exit 1; }
  fi
  for AMBIENTE in production preview; do
    printf '%s' "$VALOR" | vercel env add "$NOME" "$AMBIENTE" --force --yes --cwd "$RAIZ" >/dev/null 2>&1 \
      && echo "  ✓ $AMBIENTE" \
      || { echo "  ✗ $AMBIENTE falhou — corre com -x para ver porquê" >&2; exit 1; }
  done
done

echo
echo "Feito. Para entrar em vigor:  cd \"$RAIZ\" && vercel deploy   (ou --prod)"
