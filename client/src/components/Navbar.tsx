import { NavLink } from 'react-router-dom'
import { useContext } from 'react'

import { AuthContext } from '../context/context'
import { signOut } from '../context/reducer'
import tokenService from '../utils/token.service'
import { gql, useMutation } from '@apollo/client'

const Navbar = () => {
   const { state, dispatch } = useContext(AuthContext)

   const [removeRefreshToken,{ data, error, loading }] = useMutation(LOGOUT)

   const handleClick = () => {
      tokenService.removeLocalAccessToken()
      removeRefreshToken()
      dispatch(signOut())
   }

   return (
      <nav>
         <NavLink to={'/'}>Home</NavLink>
         {state.isAuthed ? (
            <button onClick={handleClick}>Logout</button>
         ) : (
            <div>
               <NavLink to={'/signin'}>Sign In</NavLink>
               <NavLink to={'/signup'}>Sign Up</NavLink>
            </div>
         )}
      </nav>
   )
}

export default Navbar

const LOGOUT = gql`
   mutation Logout {
      logout {
         success
         message
      }
   }
`
