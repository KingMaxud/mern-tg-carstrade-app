import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import dotenv from 'dotenv'
import path from 'path'
import depthLimit from 'graphql-depth-limit'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'

dotenv.config()

import resolvers from './graphql/resolvers/index.js'
import typeDefs from './graphql/typeDefs.js'
import { getUser } from './utils/getUser.js'

const app = express()
app.use(cookieParser())

const whitelist = ['http://localhost:3000', 'https://studio.apollographql.com']

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
   app.use(express.static('../client/build'))
   app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'))
   })
}

app.listen({ port: process.env.PORT || 4000 }, () => {
   console.log(
      `Server is running at http://localhost:${process.env.PORT}${server.graphqlPath}`
   )
})
