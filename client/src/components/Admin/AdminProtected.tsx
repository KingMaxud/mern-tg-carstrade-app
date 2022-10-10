import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import Admin from './Admin'
import useGetUser from '../../shared/hooks/useGetUser'

type IsAdmin = [boolean, boolean]

const AdminProtected = () => {
   const [isAdmin, setIsAdmin] = useState<IsAdmin>([false, false])
   const { getIsAdmin } = useGetUser()

   useEffect(() => {
      getIsAdmin().then(data => setIsAdmin(data))
   }, [])

   return (
      <>
         {!isAdmin[1] ? (
            <div></div>
         ) : !isAdmin[0] ? (
            <Navigate to="/" replace={true} />
         ) : (
            <Admin />
         )}
      </>
   )
}

export default AdminProtected
