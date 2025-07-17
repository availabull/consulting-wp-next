import client from "@/lib/apollo";
import { gql } from "@apollo/client";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function WPPage({ params }: PageProps) {
  const { slug } = await params;
  try {
    const { data } = await client.query({
      query: gql`
        query PageBySlug($slug: ID!) {
          page(id: $slug, idType: URI) {
            title
            content
          }
        }
      `,
      variables: { slug },
      fetchPolicy: "no-cache",
    });

    if (!data?.page) {
      return (
        <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-10 py-24 bg-background">
          <h1 className="text-4xl font-bold">Page not found</h1>
        </main>
      );
    }

    return (
      <main className="prose mx-auto px-6 py-12">
        <h1>{data.page.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: data.page.content }} />
      </main>
    );
  } catch (err) {
    console.error("GraphQL error:", err);
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-10 py-24 bg-background">
        <h1 className="text-4xl font-bold text-destructive">Error loading page</h1>
        <p className="text-sm">Check the WP GraphQL endpoint and browser console.</p>
      </main>
    );
  }
}
