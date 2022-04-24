import { ApolloServer, gql } from 'apollo-server-micro'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { NextApiRequest, NextApiResponse } from 'next'
import { typeDefs, resolvers } from './schema'

const appServer = new ApolloServer({
 typeDefs,
 resolvers,
 plugins: [
  ...(process.env.NODE_ENV === 'development'
   ? [ApolloServerPluginLandingPageGraphQLPlayground]
   : []),
 ],
})

export const config = {
 api: {
  bodyParser: false,
 },
}
const startServer = appServer.start()
export default async function handler(
 req: NextApiRequest,
 res: NextApiResponse
) {
 await startServer
 appServer.createHandler({ path: '/api/graphql' })(req, res)
}
