export default function(context){

  return {
    httpEndpoint: process.env.APOLLO_URL || 'http://localhost:1337/graphql'
  }
}
