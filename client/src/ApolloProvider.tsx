import {
   InMemoryCache,
   ApolloClient,
   ApolloProvider,
   createHttpLink,
   from
} from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { setContext } from '@apollo/client/link/context'

import App from './App'
import TokenService from './shared/utils/token.service'
import jwtDecode from 'jwt-decode'

interface DecodedToken {
   exp: number
   iat: number
   sub: string
}

const link = createHttpLink({
   uri: '/graphql',
   fetchOptions: { credentials: 'include' }
})

const errorLink = onError(
   ({ graphQLErrors, networkError, operation, forward }) => {
      if (graphQLErrors) {
      }
   }
)

const authLink = setContext(async (_, { headers }) => {
   let token = TokenService.getLocalAccessToken()

   if (token) {
      const decodedToken: DecodedToken = jwtDecode(token)

      if (Date.now() >= decodedToken.exp * 1000) {
         const response = await fetch('/graphql', {
            credentials: 'include',
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               query: `mutation Mutation {
                     getNewTokens {
                     status
                     message
                     accessToken
                  }
               }
               `
            })
         })
         const data = await response.text()
         const newAccessToken = JSON.parse(data).data.getNewTokens.accessToken
         token = newAccessToken
         TokenService.setLocalAccessToken(newAccessToken)
      }
   }

   return {
      headers: {
         ...headers,
         authorization: token ? `Bearer ${token}` : ''
      }
   }
})

const client = new ApolloClient({
   cache: new InMemoryCache(),
   link: from([authLink, errorLink, link])
})

export const Apollo = (): JSX.Element => {
   return (
      <ApolloProvider client={client}>
         <App />
      </ApolloProvider>
   )
}
