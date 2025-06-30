# 🐳 Bedrock + Next = Your Standard Project Template

The goal of this repo is to make **every future site** start the same way:

* WordPress (Bedrock) as headless CMS  
* Next.js 15+ for the UI  
* Docker for everything – the same `docker‑compose.yml` runs **locally** and
  **in production**  
* Traefik issues Let’s Encrypt certs without manual work

---

## 1 Quick‑start (local)

| Goal | Command | Opens in browser |
|------|---------|------------------|
| **Build / start** all containers | `docker compose up --build -d` | – |
| WordPress admin | – | <http://localhost:8080/wp/wp-admin> |
| GraphQL endpoint | – | <http://localhost:8080/graphql> |
| Next.js (in container) | – | <http://localhost:3100> |
| **Ultra‑fast React dev** | `cd nextjs-site && pnpm dev` | <http://localhost:3000> |
| **Stop** everything | `docker compose down` | – |
| **Reset DB + uploads** | `docker compose down -v && docker compose up -d` | installer runs again |

> **Why two front‑end ports?**  
> **3000** = Turbopack (host) with hot‑reload.  
> **3100** = the containerised Node server (use when Turbopack is *not* running).

---

## 2 First run checklist

1. Browse **`/wp/wp-admin/install.php`** – you should see  
   *“Welcome to WordPress – Site Title / Username / Password”*.  
   > if you see the *wp‑config wizard* instead, composer dependencies are missing;
   run `composer install` inside **`wordpress/`** and rebuild.

2. After the short installer:  
   * **Plugins → activate “WP GraphQL”**  
   * **Settings → Permalinks → “Post name” → Save**

3. Confirm **GraphQL** → <http://localhost:8080/graphql> returns

   ```json
   {"errors":[{"message":"Must provide query string"}]}
