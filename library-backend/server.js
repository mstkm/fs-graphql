const { ApolloServer } = require("@apollo/server")
const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const jwt = require('jsonwebtoken')
const User = require('./models/user')
const express = require('express')
const http = require('http')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const cors = require('cors')
const { expressMiddleware } = require('@as-integrations/express5')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')

const getUserFromAuthHeader = (auth) => {
  if (!auth || !auth.startsWith('Bearer ')) {
    return null
  }

  const decodedToken = jwt.verify(
    auth.substring(7),
    process.env.JWT_SECRET
  )

  return User.findById(decodedToken.id)
}

const startServer = async (port) => {
  const app = express()
  const httpServer = http.createServer(app)

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/'
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanUp = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanUp.dispose()
            }
          }
        }
      }
    ]
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req.headers.authorization
        const currentUser = await getUserFromAuthHeader(auth)

        return { currentUser }
      }
    })
  )

  httpServer.listen(port, () => {
    console.log(`Server is now running on http://localhost:${port}`)
  })
}

module.exports = startServer
