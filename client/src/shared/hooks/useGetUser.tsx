import { useLazyQuery } from '@apollo/client'

import { GET_USER } from '../utils/graphql'
import { useAuth } from '../../context/context'

type User = {
   name: string
   email: string
   isAdmin: boolean
   _id: string
}

type UserData = {
   getUser: User
}

const useGetUser = () => {
   const { state } = useAuth()

   const [getUser] = useLazyQuery<UserData>(GET_USER)

   const getIsAdmin: () => Promise<[boolean, boolean]> = async () => {
      if (!state.isAuthed) {
         return [false, true]
      }

      const data = await getUser()
      return [data.data?.getUser.isAdmin || false, true] // [isAdmin, isLoaded]
   }

   const getUserId: () => Promise<string> = async () => {
      const data = await getUser()
      return data.data?.getUser._id || 'error'
   }

   return { getIsAdmin, getUserId }
}

export default useGetUser
