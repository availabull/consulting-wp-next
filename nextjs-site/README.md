# Consulting WP + Next Stack

| Layer | Tech | URL (prod) |
|-------|------|------------|
| CMS & API | WordPress (Bedrock) + WPGraphQL | https://wp.example.com |
| Front‑end | Next.js 15 / App Router | https://example.com |
| DB | MariaDB 11 | internal |
| Reverse proxy / TLS | Traefik v2.11 (DNS‑01 via Cloudflare) | 80 / 443 |

## Local development

```bash
# clone & enter repo
git clone git@github.com:<org>/<repo>.git
cd <repo>

# minimal env for DB
echo "MYSQL_ROOT_PASSWORD=secret" > .env

docker compose up --build -d          # builds WP + Next
open http://localhost:8000/wp/wp-admin/   # install WordPress
open http://localhost:8000               # Next.js
```

Run ./bin/wp-bootstrap.sh after the containers start to install WordPress
automatically and activate WPGraphQL.
