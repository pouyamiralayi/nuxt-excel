// export default function(context){
//   import { ApolloLink } from 'apollo-link';
//   import { createHttpLink } from 'apollo-link-http';
//   import { onError } from 'apollo-link-error';
//   import { HttpLink } from 'apollo-link-http'
//   import { InMemoryCache } from 'apollo-cache-inmemory'
//
//
//   const httpLink = createHttpLink({ uri: 'http://10.30.205.75:1339/graphql' });
//   const errorLink = onError(({ networkError }) => {
//     if (networkError.statusCode === 401) {
//       // logout();
//     }
//   })
//
// // use with apollo-client
//   const link = errorLink.concat(httpLink);
//   return {
//     link,
//     cache:new InMemoryCache()
//     // httpEndpoint: process.env.APOLLO_URL || 'http://localhost:1337/graphql'
//     // httpEndpoint: process.env.APOLLO_URL || 'http://10.30.205.75:1339/graphql',
//   }
// }
