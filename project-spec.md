# Project Specification – “Consultancy WP × Next”

> **Version 1.2 – 22 Jul 2025**
> Maintainer • **@devpony**  
> Target env • DigitalOcean (Ubuntu 22.04, Docker 24.x)  
> _This file is immutable input for all AI‑driven development tasks._

---

## 1 Vision & Scope

| Layer               | Goal                                                                                                    |
|---------------------|----------------------------------------------------------------------------------------------------------|
| **Editorial (WP)**  | WordPress (Bedrock) as a familiar CMS for non‑technical staff (pages, posts, CPTs, media).               |
| **Presentation**    | Slick, app‑like **Next.js 15** front‑end (React 19, App Router, ISR, Edge runtime).                      |
| **API Glue**        | **WPGraphQL 2.3.x** → consumed by **Apollo Client 3.13** in Next; strongly‑typed contract.               |
| **Ops**             | GitHub Actions CI + CD → images in GHCR → droplet deployment ⥂ Traefik v2.11 with Cloudflare DNS‑01 TLS. |

---

## 2 Technical Stack (locked versions)

| Concern            | Technology / Package                | Pin / Version | Notes |
|--------------------|--------------------------------------|---------------|-------|
| CMS core           | **roots/bedrock**                   | WP 6.8.x      | Env‑vars via `.env`, Composer‑managed. |
| WP theme           | Hello + child                        | latest        | No front‑end assets—headless. |
| WP plugins         | `wp-graphql`, `wp-super-cache`       | 2.3.x         | `/wp/graphql` endpoint (WordPress lives in `/wp`), fallback cache. |
| Front‑end          | **Next.js 15.3.4**                   | 15.3.4        | `app/` router, RSC, Turbopack dev. |
| Data client        | **@apollo/client**                   | 3.13.8        | Suspense‑ready cache. |
| Design system      | Tailwind 4.1 + **shadcn/ui**         | 4.1.x         | Radix primitives. |
| Typography         | Geist Sans & Mono                    | self‑hosted   | via `@next/font/local`. |
| TypeScript         | **Strict**                           | 5.x           | Compiler‑strict. |
| Lint / Format      | ESLint 9, `eslint-config-next`; **Laravel Pint** | — | Enforced in CI. |
| Containers         | Docker 24; **Traefik v2.11**         | —             | Proxy 80/443 (prod) & 8000/8443 (dev). |
| CI / CD            | GitHub Actions                       | —             | `lint-*`, `deploy` jobs. |

---

## 3 Why GraphQL?

* **Typed schema** removes runtime guesswork.  
* **Single request** for composite data (menus + CPTs + media).  
* **Ecosystem momentum** – Canonical WP plugin, Smart Cache, ACF/Woo add‑ons.  

_Alternative (REST) rejected for verbosity & weaker typing._

---

## 4 Information Architecture

| Type                       | Purpose             | Extra                                              |
|----------------------------|---------------------|----------------------------------------------------|
| `Page`                     | Static marketing    | Gutenberg blocks.                                  |
| `Post`                     | Blog / insights     | Uses `category`, `tag`.                            |
| `CaseStudy` (CPT)          | Success stories     | Custom taxonomy **Industry**.                      |
| `Service` (CPT)            | Offering catalogue  | Listed on home page.                               |

Menus: `PRIMARY` (header) & `FOOTER`; query via  
`menuItems(where:{location:PRIMARY}) { nodes { label url } }`

---

## 5 Developer Workflows

### 5.1 Prerequisites

| Tool              | Min Version |
|-------------------|-------------|
| Docker Engine     | 24 |
| `docker compose`  | v2 |
| Node (with pnpm)  | 20 |
| PHP               | 8.1 |

### 5.2 First‑time Setup

```bash
git clone git@github.com:<org>/<repo>.git
cd <repo>

cp .env.example .env
cp stack.env.example stack.env
cp nextjs-site/.env.example nextjs-site/.env.local

corepack enable pnpm
cd nextjs-site && pnpm install
cd ../wordpress   && composer install
cd ..

docker compose up --build -d          # WP :8000, Next :3000
./bin/wp-bootstrap.sh                 # installs WP + activates WPGraphQL
