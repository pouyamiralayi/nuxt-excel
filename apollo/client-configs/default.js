import {ApolloLink} from 'apollo-link';
import {createHttpLink} from 'apollo-link-http';
import {onError} from 'apollo-link-error';
import {HttpLink} from 'apollo-link-http'
import {InMemoryCache} from 'apollo-cache-inmemory'

export default function (context) {

  const httpLink = createHttpLink({uri: process.env.apiUrl + '/graphql'});
  // middleware
  // const middlewareLink = new ApolloLink((operation, forward) => {
  //   const token = context.store.getters['auth/token'] // It is working here - confusing @_@
  //   operation.setContext({
  //     headers: { authorization: `Bearer ${token}` }
  //   })
  //   return forward(operation)
  // })
  const errorLink = onError(({graphQLErrors, networkError}) => {
    try{
      if (graphQLErrors)
        graphQLErrors.map(async ({message, locations, path}) => {
          if(message.toLowerCase().includes("user not found")){
            // console.log("auth error")
            // console.log(context)
            // console.log(context.app)
            const client = context.app.apolloProvider.defaultClient
            // await client.queryManager.fetchQueryRejectFns;
            // await client.resetStore();
            await client.clearStore()
            context.store.commit('auth/logout')
            context.app.router.push("/")
          }
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${JSON.stringify(path)}`
          )
        }

        )
      // if (networkError.statusCode === 401) {
      //   console.log("network error: ",networkError.message)
      //   console.log(context)
      // }
    }
    catch (e) {
      console.log("errorLink: ", e)
    }
  })

// use with apollo-client
  const link = errorLink.concat(httpLink);
  // const link = error.concat(middlewareLink)
  return {
    link,
    cache: new InMemoryCache()
    // httpEndpoint: process.env.APOLLO_URL || 'http://localhost:1337/graphql'
    // httpEndpoint: process.env.APOLLO_URL || 'http://10.30.205.75:1339/graphql',
  }
}
