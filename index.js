const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const dotenv = require('dotenv')
const path = require('path')
const depthLimit = require('graphql-depth-limit')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

dotenv.config()

const resolvers = require('./graphql/resolvers')
const typeDefs = require('./graphql/typeDefs.js')
const getUser = require('./utils/getUser.js')

const app = express()
app.use(cookieParser())

const whitelist = [
   'https://studio.apollographql.com',
   process.env.DOMAIN
]

console.log(whitelist)

mongoose.connect(process.env.MONGO_URI)
mongoose.connection.on('error', err => {
   console.log('err', err)
})
mongoose.connection.on('connected', (err, res) => {
   console.log('mongoose is connected')
})

let server

const startServer = async () => {
   server = new ApolloServer({
      typeDefs,
      resolvers,
      context: async ({ req, res }) => {
         const user = await getUser(req)
         const userInfo = user.isAuthed ? user.info : null
         return { req, res, userInfo }
      },
      validationRules: [depthLimit(10)]
   })
   await server.start()
   server.applyMiddleware({
      app,
      cors: {
         methods: ['GET', 'PUT', 'POST'],
         credentials: true, // Allows setting credentials
         origin: function (origin, callback) {
            if (whitelist.indexOf(origin) !== -1) {
               callback(null, true)
            } else {
               callback(new Error('Not allowed by CORS'))
            }
         }
      }
   })
}

startServer()

if (process.env.NODE_ENV === 'production') {
   app.use(express.static('client/build'))
   app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
   })
}

const port = Number.parseInt(process.env.PORT) || 4000

app.listen({ port }, () => {
   console.log(
      `Server is running at http://localhost:${process.env.PORT}${server.graphqlPath}`
   )
})
