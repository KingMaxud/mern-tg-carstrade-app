import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'

import './index.css'
import reportWebVitals from './reportWebVitals'
import { Apollo } from './ApolloProvider'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
   <BrowserRouter>
      <ChakraProvider>
         <Apollo />
      </ChakraProvider>
   </BrowserRouter>
)

reportWebVitals()
