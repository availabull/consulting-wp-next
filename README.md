# 🐳 Bedrock + Next starter — <https://robertfisher.com>

* **WordPress** (Roots / Bedrock) — headless CMS  
* **Next.js 15** (React 19 ready) — front‑end  
* **Traefik 3** — reverse‑proxy + automatic Let’s Encrypt via Cloudflare  
* One `docker‑compose.yml` that runs **locally** and **on the droplet**

---

## 1 Local workflow

1. Copy `.env.example` → `.env` and fill in the placeholder values.
2. Install dependencies **before** running Docker:

   ```bash
   cd nextjs-site && pnpm install
   cd wordpress   && composer install
