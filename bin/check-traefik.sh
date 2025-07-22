#!/usr/bin/env bash
set -e

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

volume_path=$(docker volume inspect le --format '{{ .Mountpoint }}' 2>/dev/null || true)
acme="$volume_path/acme.json"
if [ -z "$volume_path" ]; then
  echo "Error: Docker volume 'le' not found" >&2
  missing=1
elif [ ! -f "$acme" ]; then
  echo "Error: $acme not found" >&2
  missing=1
else
  perm=$(stat -c %a "$acme")
  if [ "$perm" != "600" ]; then
    echo "Error: $acme should have permissions 600 (current $perm)" >&2
    missing=1
  fi
fi

if [ "$missing" -eq 1 ]; then
  echo "Fix the above issues before starting Traefik." >&2
  exit 1
fi

echo "Traefik prerequisites satisfied."
