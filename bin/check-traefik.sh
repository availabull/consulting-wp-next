#!/usr/bin/env bash
set -euo pipefail

# Load variables from .env if present
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
if [ -f "$REPO_ROOT/.env" ]; then
  set -a
  . "$REPO_ROOT/.env"
  set +a
fi

missing=0
for var in DOMAIN LE_EMAIL CLOUDFLARE_DNS_API_TOKEN; do
  if [ -z "${!var:-}" ]; then
    echo "Error: $var is not set" >&2
    missing=1
  fi
done

if [ "$missing" -eq 1 ]; then
  echo "Fix the above issues before starting Traefik." >&2
  exit 1
fi

echo "Traefik prerequisites satisfied."
