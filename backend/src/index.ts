import { ApolloServer, makeExecutableSchema } from 'apollo-server'

import models from './models'
import resolvers from './graphql/resolvers'
import typeDefs from './graphql/types'

import { $server } from '../config'

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const apolloServer = new ApolloServer({
  schema,
  context: {
    models,
  },
})

const alter = true
const force = false

models.sequelize.sync({ alter, force }).then(() => {
  apolloServer.listen($server.port).then(({ url }) => {
    // eslint-disable-next-line no-console
    console.log(`Running on ${url}`)
  })
})
