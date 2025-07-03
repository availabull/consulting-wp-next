# 🐳 Bedrock + Next starter – `robertfisher.com`

* WordPress (roots/Bedrock) – headless CMS  
* Next.js 15 (React 19 ready) – front‑end  
* Traefik 3 – reverse‑proxy + automatic Let’s Encrypt  
* One `docker‑compose.yml` that runs **locally** and **on the droplet**

---

## 1 Local workflow

| Goal | One‑liner | Opens in browser |
|------|-----------|------------------|
| build & start | `docker compose up --build -d` | – |
| WP admin | – | <http://localhost:8080/wp/wp-admin> |
| GraphQL | – | <http://localhost:8080/graphql> |
| Next.js (container) | – | <http://localhost:3100> |
| ultrafast React dev (Turbopack) | `cd nextjs-site && pnpm dev` | <http://localhost:3000> |
| stop stack | `docker compose down` | – |
| **wipe DB + uploads** | ```bash
docker compose down -v          # stop & drop volumes  
docker volume prune -f          # optional: delete dangling vols  
docker compose up -d            # fresh DB, run installer  
``` | runs installer again |

### What a clean start looks like

* `https://localhost:8080/wp/wp-admin/install.php` shows **“Welcome to WordPress – Site Title / Username / Password”**  
* After setup → activate **WP GraphQL** → save **Permalinks / Post name**  
* `http://localhost:8080/graphql` returns `{"errors":[{"message":"Must provide query string"}]}`  
* `http://localhost:3100` renders the Next.js front‑end (or use Turbopack on :3000).

---

## 2 Deploy (GitHub → DigitalOcean)

### 2.1 Prepare once

| Where | What |
|-------|------|
| **Cloudflare** | *A* record → droplet IP (for `robertfisher.com`, `www`, `wp`) |
| **Cloudflare → API Tokens** | create token → *Edit zone DNS* (for that zone) |
| **Droplet** (`/etc/environment`) | ```bash
LE_EMAIL=you@robertfisher.com
CF_DNS_API_TOKEN=cf_xxxxxxxxxxxxxxxxx  
MYSQL_ROOT_PASSWORD=prod-secret                         # keep DB pwd out of repo
``` |
| **GitHub → repo → Settings → Secrets** | same three vars above (`LE_EMAIL`, `CF_DNS_API_TOKEN`, `MYSQL_ROOT_PASSWORD`) |

### 2.2 CI/CD flow

1. `git push origin master`  
   *GitHub Action* builds two images → pushes to GHCR.
2. Action SSHs into the droplet, writes **`docker‑compose.yml`** and runs:

   ```bash
   docker compose pull
   docker compose up -d
# trigger
# trigger
