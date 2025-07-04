// nextjs-site/src/app/page.tsx
import client from '@/lib/apollo';
import { gql } from '@apollo/client';

export const dynamic = 'force-dynamic'; // disable ISR while in dev

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
      fetchPolicy: 'no-cache',
    });

    // Defensive check – avoids “cannot destructure … undefined”
    if (!data?.generalSettings?.title) {
      throw new Error('Missing site title');
    }

    return (
      <main className="p-10">
        <h1 className="text-3xl font-bold">
          {data.generalSettings.title}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          served by WordPress + GraphQL
        </p>
      </main>
    );
  } catch (error) {
    console.error('GraphQL request failed:', error);

    return (
      <main className="p-10">
        <h1 className="text-3xl font-bold text-red-600">
          Error loading site title
        </h1>
        <p className="mt-2 text-sm">
          Check WordPress GraphQL endpoint and network‑logs for details.
        </p>
      </main>
    );
  }
}
