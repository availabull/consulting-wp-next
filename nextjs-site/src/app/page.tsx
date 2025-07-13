/* ────────────────────────────────────────────────────────
   nextjs-site/src/app/page.tsx
   Fetches the WordPress site title via WP‑GraphQL and shows
   a styled shadcn/ui <Button> to confirm Tailwind + tw‑animate
   are working inside the Next.js front‑end.
───────────────────────────────────────────────────────── */

import client from "@/lib/apollo";
import { gql } from "@apollo/client";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic"; // disable ISR while in dev

export default async function Home() {
  try {
    const { data } = await client.query({
      query: gql`
        query SiteTitle {
          generalSettings {
            title
          }
        }
      `,
      fetchPolicy: "no-cache",
    });

    if (!data?.generalSettings?.title) {
      throw new Error("Missing site title");
    }

    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-10 py-24">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          {data.generalSettings.title}
        </h1>

        <p className="text-sm text-muted-foreground">
          served by WordPress + GraphQL
        </p>

        {/* demo shadcn/ui component */}
        <Button className="animate-in fade-in zoom-in">
          I’m a shadcn / Tailwind button
        </Button>
      </main>
    );
  } catch (error) {
    /* eslint-disable no-console */
    console.error("GraphQL request failed:", error);
    /* eslint-enable no-console */

    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-10 py-24">
        <h1 className="text-4xl font-bold text-destructive">
          Error loading site title
        </h1>
        <p className="text-sm">
          Check the WordPress GraphQL endpoint and browser console for
          details.
        </p>

        {/* even in error state we test the Button styling */}
        <Button variant="secondary" className="animate-in fade-in">
          Retry
        </Button>
      </main>
    );
  }
}
