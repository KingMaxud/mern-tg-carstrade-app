import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import './index.css'
import reportWebVitals from './reportWebVitals'
import { Apollo } from './ApolloProvider'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
   <BrowserRouter>
      <Apollo />
   </BrowserRouter>
)

reportWebVitals()
