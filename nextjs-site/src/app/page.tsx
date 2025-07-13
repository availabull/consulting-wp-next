/* ──────────────────────────────────────────────────────────────
   Displays the WordPress site title plus a shadcn/ui <Button>.
   Confirms Tailwind + tw‑animate + GraphQL are wired correctly.
─────────────────────────────────────────────────────────────── */

import client from "@/lib/apollo";
import { gql } from "@apollo/client";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";  // disable ISR in dev

export default async function Home() {
  try {
    const { data } = await client.query({
      query: gql`{ generalSettings { title } }`,
      fetchPolicy: "no-cache"
    });

    if (!data?.generalSettings?.title) throw new Error("No title");

    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-10 py-24 bg-background">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          {data.generalSettings.title}
        </h1>

        <p className="text-sm text-muted-foreground">
          served by WordPress + GraphQL
        </p>

        <Button className="animate-in fade-in zoom-in">
          I’m a shadcn / Tailwind button
        </Button>
      </main>
    );
  } catch (err) {
    console.error("GraphQL error:", err);
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-10 py-24 bg-background">
        <h1 className="text-4xl font-bold text-destructive">
          Error loading site title
        </h1>
        <p className="text-sm">
          Check the WP GraphQL endpoint and browser console.
        </p>
        <Button variant="secondary" className="animate-in fade-in">
          Retry
        </Button>
      </main>
    );
  }
}
