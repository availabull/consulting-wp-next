import { gql } from "@apollo/client";
import client from "@/lib/apollo";

export const dynamic = "force-dynamic";   // disables ISR in dev

/*  When generateStaticParams is async, Next’s code‑gen makes
    PageProps = { params: Promise<{ slug:string }> }              */
export default async function WPPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  /* runtime still receives a plain object → await is cheap/no‑op */
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
        <main className="flex min-h-screen items-center justify-center">
          <h1 className="text-4xl font-bold">Page not found</h1>
        </main>
      );
    }

    return (
      <main className="prose mx-auto max-w-3xl px-6 py-12">
        <h1>{data.page.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: data.page.content }} />
      </main>
    );
  } catch (err) {
    console.error("GraphQL error:", err);
    return (
      <main className="flex min-h-screen items-center justify-center">
        <h1 className="text-4xl font-bold text-destructive">
          Error loading page
        </h1>
      </main>
    );
  }
}
