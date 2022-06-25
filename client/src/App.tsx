import React, { useReducer } from 'react'
import { Routes, Route } from 'react-router-dom'

import './App.css'
import Home from './components/Home/Home'
import Navbar from './components/Navbar'
import SignUp from './components/SingUp/SignUp'
import SignIn from './components/SignIn/SignIn'
import { AuthContext } from './context/context'
import authReducer from './context/reducer'
import { initialAuthState } from './context/state'
import NotAuthedProtected from './components/NotAuthedProtected'
import AdminProtected from './components/Admin/AdminProtected'
import VehicleDetails from './components/VehicleDetails/VehicleDetails'
import AddAnnouncement from './components/AddAnnouncement/AddAnnouncement'
import Search from './components/Search/Search'

const App = () => {
   const [state, dispatch] = useReducer(authReducer, initialAuthState)

   return (
      <AuthContext.Provider value={{ state, dispatch }}>
         <Navbar />
         <Routes>
            <Route path="/" element={<Home />} />
            <Route
               path="vehicledetails/:vehicleid"
               element={<VehicleDetails />}
            />
            <Route path="addannouncement" element={<AddAnnouncement />} />
            <Route path="search" element={<Search />} />
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
            <Route path="/admin" element={<AdminProtected />} />
         </Routes>
      </AuthContext.Provider>
   )
}

export default App
