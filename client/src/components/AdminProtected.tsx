import { Navigate } from 'react-router-dom'
import {useContext, useEffect, useState} from 'react'

import { AuthContext } from '../context/context'

// type Props = {
//    children: JSX.Element
// }

const AdminProtected = (): JSX.Element => {
   const [isAdmin, setIsAdmin] = useState(false)
   const { state } = useContext(AuthContext)
   console.log('rendered')

   useEffect(() => {
      console.log('effect')
      // if (state.user) {
      //    setIsAdmin(state.user.isAdmin)
      // }
   }, [])
   return <>Zalupa</>
}

export default AdminProtected
