import { NavLink, useLocation } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { useState } from 'react'

import { useAuth } from '../../context/context'
import { signOut } from '../../context/reducer'
import tokenService from '../../shared/utils/token.service'
import { LOGOUT } from '../../shared/utils/graphql'
import styles from './Navbar.module.scss'
import MyAnnouncements from './MyAnnouncements'
import useDidMountEffect from '../../shared/hooks/useDidMountEffect'

const Navbar = () => {
   const { state, dispatch } = useAuth()
   const location = useLocation()

   const [isMyAnnouncementsShown, setIsMyAnnouncementsShown] = useState(false)

   const [removeRefreshToken] = useMutation(LOGOUT)

   const handleClick = () => {
      tokenService.removeLocalAccessToken()
      removeRefreshToken()
      dispatch(signOut())
      window.location.reload()
   }

   useDidMountEffect(() => {
      setIsMyAnnouncementsShown(false)
   }, [location])

   return (
      <nav className={styles.nav}>
         <NavLink className={styles.navHeader} to={'/'}>CarTrader</NavLink>
         {state.isAuthed ? (
            <div className={styles.nav__right}>
               <div>
                  <h1
                     onClick={() =>
                        setIsMyAnnouncementsShown(!isMyAnnouncementsShown)
                     }>
                     My Announcements
                  </h1>
                  {isMyAnnouncementsShown && <MyAnnouncements />}
               </div>
               <button onClick={handleClick}>Log Out</button>
            </div>
         ) : (
            <div className={styles.nav__right}>
               <NavLink to={'/signin'}>Sign In</NavLink>
               <NavLink to={'/signup'}>Sign Up</NavLink>
            </div>
         )}
      </nav>
   )
}

export default Navbar
