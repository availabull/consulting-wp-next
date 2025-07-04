# Guidelines for repository agents

This repository hosts a headless WordPress backend and a Next.js 15 frontend.

## Subdirectories
- `nextjs-site` – TypeScript/React code managed with `pnpm`.
- `wordpress` – Bedrock based WordPress project managed with Composer.

## Development workflow
1. Install dependencies:
   - `cd nextjs-site && pnpm install`
   - `cd wordpress && composer install`
2. Start the local stack via `docker compose up --build -d`.
   - Visit `http://localhost:8080/wp/wp-admin` for WordPress.
   - Visit `http://localhost:3000` for the Next.js frontend when running `pnpm dev`.
3. Stop with `docker compose down`.

## Linting / Tests
- Run `pnpm lint` inside `nextjs-site` to check TypeScript/React code.
- Run `composer lint` inside `wordpress` to check PHP code style via Pint.
- Ensure these checks succeed before submitting a PR.

## Pull requests
- Keep changes focused and describe the goal clearly.
- Do not commit `.env` files or the `vendor/` directory.
- Summarize key changes and reference relevant issues if applicable.

