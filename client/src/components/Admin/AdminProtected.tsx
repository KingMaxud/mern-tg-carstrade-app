import { useLazyQuery } from '@apollo/client'
import { useEffect, useState } from 'react'

import { GET_USER } from '../../utils/graphql'
import { useAuth } from '../../context/context'
import AccessDenied from './AccessDenied'
import Admin from './Admin'

type User = {
   name: string
   email: string
   isAdmin: boolean
}

type UserData = {
   getUser: User
}

const AdminProtected = () => {
   const { state, dispatch } = useAuth()
   const [loading, setLoading] = useState(true)
   const [isAdmin, setIsAdmin] = useState<boolean>(false)

   const [getUser] = useLazyQuery<UserData>(GET_USER, {
      onCompleted: ({ getUser }) => {
         setIsAdmin(getUser.isAdmin)
         setLoading(false)
      },
      onError: error => {
         setLoading(false)
         console.log(error)
      }
   })

   useEffect(() => {
      if (state.isAuthed) {
         getUser()
      }
   }, [])

   return (
      <>
         {!state.isAuthed && !isAdmin ? (
            <AccessDenied />
         ) : loading ? (
            <div>Loading</div>
         ) : (
            <Admin />
         )}
      </>
   )
}

export default AdminProtected
