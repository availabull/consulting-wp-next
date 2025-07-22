# Guidelines for repository agents

This repository hosts a headless WordPress backend and a Next.js 15 frontend.

## Subdirectories
- `nextjs-site` – TypeScript/React code managed with `pnpm`.
- `wordpress` – Bedrock based WordPress project managed with Composer.

## Development workflow
1. Copy `.env.example` to `.env` and `stack.env.example` to `stack.env`, then fill required values.
2. Install dependencies:
   - `cd nextjs-site && pnpm install`
   - `cd wordpress && composer install`
3. Start the local stack via `docker compose up --build -d`.
   - Visit `http://localhost:8000/wp/wp-admin` for WordPress.
    - Run `cd nextjs-site && pnpm dev` to start the frontend.
   - Visit `http://localhost:3000` for the Next.js frontend when running `pnpm dev`.
4. Stop with `docker compose down`.

Helper scripts include `bin/wp-bootstrap.sh` for automated WordPress installation and `scripts/site-info.js` for printing stack info.
## Linting / Tests
- Run `pnpm lint` inside `nextjs-site` to check TypeScript/React code.
- Run `composer lint` inside `wordpress` to check PHP code style via Pint.
- Ensure `pnpm lint` and `composer lint` succeed before each PR. Use `composer lint:fix` for PHP formatting.

## Pull requests
- Keep changes focused and describe the goal clearly.
- Do not commit `.env` files, the `vendor/` directory, or `node_modules/`.
- Summarize key changes and reference relevant issues if applicable.

