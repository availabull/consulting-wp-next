# 🐳 Bedrock + Next starter — <https://example.com>

* **WordPress** (Roots / Bedrock) — headless CMS  
* **Next.js 15** (React 19 ready) — front‑end  
* **Traefik 3** — reverse‑proxy + automatic Let’s Encrypt via Cloudflare  
* One `docker‑compose.yml` that runs **locally** and **on the droplet**

---

## 1 Local workflow

1. Copy `.env.example` → `.env` and `stack.env.example` → `stack.env`, then fill in the placeholder values.
2. Copy `nextjs-site/.env.example` → `nextjs-site/.env.local` before running `pnpm dev`.
3. Install dependencies **before** running Docker:

```bash
   cd nextjs-site && pnpm install
cd wordpress   && composer install
```

4. After installing dependencies, run `pnpm lint` from `nextjs-site` and `composer lint` from `wordpress`. Both must pass before opening a pull request. If `pnpm lint` complains that `next` is missing, simply run `pnpm install` in `nextjs-site/` first.

| Goal | One‑liner | Opens in browser |
|------|-----------|------------------|
| build & start | `docker compose up --build -d` | – |
| WP admin | – | <http://localhost:8080/wp/wp-admin> |
| GraphQL | – | <http://localhost:8080/graphql> |
| Next.js (container) | – | <http://localhost:3000> |
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
  (no redirect to `/graphql/`; if you see a 301, flush permalinks and verify
  `web/app/mu-plugins/disable-graphql-canonical.php` is present)
* `http://localhost:3000` renders the Next.js front‑end (or use Turbopack on :3000).

---

## 2 Deploy (GitHub → DigitalOcean)

### 2.1 Prepare once

| Where | What |
|-------|------|
| **Cloudflare** | *A* record → droplet IP (for your domain, `www`, `wp`) |
| **Cloudflare → API Tokens** | create token → *Edit zone DNS* (for that zone) |
| **Droplet** (`/etc/environment`) | ```bash
LE_EMAIL=you@example.com
CLOUDFLARE_DNS_API_TOKEN=cf_xxxxxxxxxxxxxxxxx
MYSQL_ROOT_PASSWORD=prod-secret                         # keep DB pwd out of repo
DOMAIN=example.com
``` |
| **GitHub → repo → Settings → Secrets** | same vars + `DOMAIN` |

#### Traefik `le` volume

Traefik keeps Let’s Encrypt data in the named volume `le`.  That volume
needs an `acme.json` file with permissions `600`.
Inspect the volume to find its path (usually
`/var/lib/docker/volumes/<project>_le/_data`):

```bash
docker volume inspect le
```

Create the file inside that directory before starting Traefik:

```bash
touch /var/lib/docker/volumes/consulting-wp-next_le/_data/acme.json
chmod 600 /var/lib/docker/volumes/consulting-wp-next_le/_data/acme.json
```

### 2.2 CI/CD flow

1. `git push origin master`
   *GitHub Action* builds two images → pushes to GHCR.
2. Action SSHs into the droplet, writes **`docker‑compose.yml`** and runs:

   ```bash
   docker compose pull
   docker compose up -d
   ```

   That's it—the droplet now runs the updated stack behind Traefik.

### 2.3 Troubleshooting

* `docker compose logs traefik`
* check permissions of `acme.json` (should be `600`)
* ensure required environment variables (`LE_EMAIL`, `CLOUDFLARE_DNS_API_TOKEN`, `MYSQL_ROOT_PASSWORD`) are set

## 3 Site info

Run `node ./scripts/site-info.js` to print a JSON summary of the stack. This shows
current URLs, versions and the Traefik routing configuration.
