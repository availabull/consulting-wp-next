# Guidelines for Repository Agents  
_Consultancy WP × Next • Headless WordPress (Bedrock) + Next.js 15_

> **Last synced with `project-spec.md v1.2` on 22 Jul 2025**
> Any divergence between this guide and `project-spec.md` must be resolved by updating **both**.

---

## 1 Directory Layout
| Path          | Purpose                                   |
|---------------|-------------------------------------------|
| `nextjs-site` | TypeScript / React front‑end (Next.js 15) – managed with **pnpm** |
| `wordpress`   | Bedrock‑based WordPress backend – managed with **Composer** |
| `bin/`        | Helper scripts (e.g., `wp-bootstrap.sh`)  |
| `scripts/`    | Node utilities (e.g., `site-info.js`)     |

---

## 2 Local Development Workflow

1. **Environment files**  
   ```bash
   cp .env.example       .env
   cp stack.env.example  stack.env
   cp nextjs-site/.env.example nextjs-site/.env.local
   corepack enable pnpm
   cd nextjs-site && pnpm install
   cd ../wordpress   && composer install
   cd ..
   docker compose up --build -d          # WP :8000, Next :3000
   ./bin/wp-bootstrap.sh                 # installs WP + activates WPGraphQL
   ```

   WordPress is installed in the `/wp` sub‑directory. The WPGraphQL endpoint is
   therefore `/wp/graphql` (not `/graphql`). Ensure `NEXT_PUBLIC_WPGRAPHQL_URL`
   points to `http://localhost:8000/wp/graphql` for local dev and
   `https://wp.$DOMAIN/wp/graphql` in production. If the endpoint returns HTML,
   run `./bin/wp-bootstrap.sh` again to flush permalinks.

2. **Lint before pull requests**
   Run `pnpm lint` in `nextjs-site` and `composer lint` in `wordpress`. Use `composer lint:fix` to format PHP.
