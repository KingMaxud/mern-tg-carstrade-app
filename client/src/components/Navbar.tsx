import { NavLink } from 'react-router-dom'
import { useMutation } from '@apollo/client'

import { useAuth } from '../context/context'
import { signOut } from '../context/reducer'
import tokenService from '../shared/utils/token.service'
import { LOGOUT } from '../shared/utils/graphql'

const Navbar = () => {
   const { state, dispatch } = useAuth()

   const [removeRefreshToken] = useMutation(LOGOUT)

   const handleClick = () => {
      tokenService.removeLocalAccessToken()
      removeRefreshToken()
      dispatch(signOut())
   }

   return (
      <nav>
         <NavLink to={'/'}>Home</NavLink>
         {state.isAuthed ? (
            <div>
               <div>My Announcements</div>
               <button onClick={handleClick}>Log Out</button>
            </div>
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
