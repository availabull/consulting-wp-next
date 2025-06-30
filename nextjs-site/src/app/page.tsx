// nextjs-site/src/app/page.tsx
import client from '@/lib/apollo';
import { gql } from '@apollo/client';

export const dynamic = 'force-dynamic';   // no ISR while in dev

export default async function Home() {
  const { data } = await client.query({
    query: gql`
      query SiteTitle {
        generalSettings {
          title
        }
      }
    `,
    fetchPolicy: 'no-cache',
  });

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">{data.generalSettings.title}</h1>
      <p className="mt-2 text-sm text-gray-500">
        served by WordPress + GraphQL
      </p>
    </main>
  );
}
