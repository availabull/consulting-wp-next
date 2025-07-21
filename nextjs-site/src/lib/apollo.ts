import { ApolloClient, InMemoryCache } from '@apollo/client';

const GRAPHQL_URL =
  process.env.NEXT_PUBLIC_WPGRAPHQL_URL ??
  'http://localhost:8080/graphql';

const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(),
});

export { GRAPHQL_URL };

export default client;
