export default function(context){

  return {
    // httpEndpoint: process.env.APOLLO_URL || 'http://localhost:1337/graphql'
    httpEndpoint: process.env.APOLLO_URL || 'http://10.30.205.75:1339/graphql',
  }
}
