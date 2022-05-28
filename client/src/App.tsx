import React, { useEffect, useReducer, useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import './App.css'
import Home from './components/Home/Home'
import Navbar from './components/Navbar'
import SignUp from './components/SingUp/SignUp'
import SignIn from './components/SignIn/SignIn'
import { AuthContext } from './context/context'
import authReducer, { setUser } from './context/reducer'
import { initialAuthState, User } from './context/state'
import NotAuthedProtected from './components/NotAuthedProtected'
import Admin from './components/Admin/Admin'
import AdminProtected from './components/AdminProtected'
import { gql, useLazyQuery } from '@apollo/client'

type UserData = {
   getUser: User
}

const App = () => {
   const [state, dispatch] = useReducer(authReducer, initialAuthState)

   const [getUser] = useLazyQuery<UserData>(GET_USER, {
      onCompleted: ({ getUser }) => {
         dispatch(setUser(getUser))
      },
      onError: error => console.log(error)
   })

   return (
      <AuthContext.Provider value={{ state, dispatch }}>
         <Navbar />
         <Routes>
            <Route path="/" element={<Home />} />
            <Route
               path="signup"
               element={
                  <NotAuthedProtected isAuthed={state.isAuthed}>
                     <SignUp />
                  </NotAuthedProtected>
               }
            />
            <Route
               path="signin"
               element={
                  <NotAuthedProtected isAuthed={state.isAuthed}>
                     <SignIn />
                  </NotAuthedProtected>
               }
            />
            <Route
               path="/admin"
               element={
                  // <AdminProtected>
                     <Admin />
                  // </AdminProtected>
               }
            />
         </Routes>
      </AuthContext.Provider>
   )
}

export default App

const GET_USER = gql(`
   query Query {
      getUser {
         name
         email
         isAdmin
      }
   }
`)
