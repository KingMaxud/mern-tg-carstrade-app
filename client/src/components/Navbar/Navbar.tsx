import { NavLink, useLocation } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import { useAuth } from '../../context/context'
import { signOut } from '../../context/reducer'
import tokenService from '../../shared/utils/token.service'
import { LOGOUT } from '../../shared/utils/graphql'
import styles from './Navbar.module.scss'
import MyAnnouncements from './MyAnnouncements/MyAnnouncements'
import useDidMountEffect from '../../shared/hooks/useDidMountEffect'
import useWindowSize from '../../shared/hooks/useWindowDimensions'

const Navbar = () => {
   const { state, dispatch } = useAuth()
   const location = useLocation()
   const width = useWindowSize().width

   const [isMyAnnouncementsShown, setIsMyAnnouncementsShown] = useState(false)
   const [isMessageShown, setIsMessageShown] = useState(false)
   const [isMobile, setIsMobile] = useState<boolean>(
      (width || 1000) <= 768
   )
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

   const [removeRefreshToken] = useMutation(LOGOUT)

   const handleLogOut = () => {
      tokenService.removeLocalAccessToken()
      removeRefreshToken()
      dispatch(signOut())
      window.location.reload()
   }

   // Hide popups and menu
   useDidMountEffect(() => {
      setIsMyAnnouncementsShown(false)
      setIsMessageShown(false)
      setIsMobileMenuOpen(false)
   }, [location])
   // Change isMobile, when width changes
   useEffect(() => {
      setIsMobile((width || 0) <= 768)
   }, [width])
   // Close unwanted menus, when isMobile changes
   useDidMountEffect(() => {
      setIsMessageShown(false)
      setIsMobileMenuOpen(false)
      setIsMyAnnouncementsShown(false)
   }, [isMobile])

   // Animations
   const menuVariants = {
      open: { x: '-100%' },
      closed: { x: 0 }
   }

   return (
      <nav className={styles.nav}>
         <NavLink className={styles.nav__header} to={'/'}>
            CarTrader
         </NavLink>
         {/*Mobile hamburger menu*/}
         <i
            className={styles.hamburgerMenu}
            onClick={() => setIsMobileMenuOpen(true)}>
            <svg
               xmlns="http://www.w3.org/2000/svg"
               fill="#000000"
               viewBox="0 0 24 24">
               <path d="M 2 5 L 2 7 L 22 7 L 22 5 L 2 5 z M 2 11 L 2 13 L 22 13 L 22 11 L 2 11 z M 2 17 L 2 19 L 22 19 L 22 17 L 2 17 z" />
            </svg>
         </i>
         {state.isAuthed ? (
            <motion.div
               animate={isMobileMenuOpen ? 'open' : 'closed'}
               variants={menuVariants}
               transition={{
                  ease: 'easeOut',
                  duration: 0.25
               }}
               className={styles.nav__menu}>
               <NavLink
                  className={styles.nav__menu__element}
                  to={'/addannouncement'}>
                  Add Announcement
               </NavLink>
               {!isMobile && (
                  <div className={styles.nav__menu__element}>
                     <h1
                        onClick={() =>
                           setIsMyAnnouncementsShown(!isMyAnnouncementsShown)
                        }>
                        My Announcements
                     </h1>
                  </div>
               )}
               <button
                  className={styles.nav__menu__element}
                  onClick={handleLogOut}>
                  Log Out
               </button>
               {isMyAnnouncementsShown && <MyAnnouncements />}
               {isMyAnnouncementsShown && (
                  <div
                     className={styles.overlay}
                     onClick={() => setIsMyAnnouncementsShown(false)}
                  />
               )}
               {isMobile && (
                  <i onClick={() => setIsMobileMenuOpen(false)}>
                     <svg
                        className={styles.nav__menu__close}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 94.926 94.926">
                        <path d="M55.931,47.463L94.306,9.09c0.826-0.827,0.826-2.167,0-2.994L88.833,0.62C88.436,0.224,87.896,0,87.335,0   c-0.562,0-1.101,0.224-1.498,0.62L47.463,38.994L9.089,0.62c-0.795-0.795-2.202-0.794-2.995,0L0.622,6.096   c-0.827,0.827-0.827,2.167,0,2.994l38.374,38.373L0.622,85.836c-0.827,0.827-0.827,2.167,0,2.994l5.473,5.476   c0.397,0.396,0.936,0.62,1.498,0.62s1.1-0.224,1.497-0.62l38.374-38.374l38.374,38.374c0.397,0.396,0.937,0.62,1.498,0.62   s1.101-0.224,1.498-0.62l5.473-5.476c0.826-0.827,0.826-2.167,0-2.994L55.931,47.463z" />
                     </svg>
                  </i>
               )}
            </motion.div>
         ) : (
            <motion.div
               animate={isMobileMenuOpen ? 'open' : 'closed'}
               variants={menuVariants}
               transition={{
                  ease: 'easeOut',
                  duration: 0.25
               }}
               className={styles.nav__menu}>
               <button
                  className={styles.nav__menu__element}
                  onClick={() => setIsMessageShown(!isMessageShown)}>
                  Add Announcement
               </button>
               {isMessageShown && (
                  <div className={styles.message}>
                     <p>Please sign in first!</p>
                     <i onClick={() => setIsMessageShown(false)}>
                        <svg
                           className={styles.closeIcon}
                           xmlns="http://www.w3.org/2000/svg"
                           viewBox="0 0 94.926 94.926">
                           <path d="M55.931,47.463L94.306,9.09c0.826-0.827,0.826-2.167,0-2.994L88.833,0.62C88.436,0.224,87.896,0,87.335,0   c-0.562,0-1.101,0.224-1.498,0.62L47.463,38.994L9.089,0.62c-0.795-0.795-2.202-0.794-2.995,0L0.622,6.096   c-0.827,0.827-0.827,2.167,0,2.994l38.374,38.373L0.622,85.836c-0.827,0.827-0.827,2.167,0,2.994l5.473,5.476   c0.397,0.396,0.936,0.62,1.498,0.62s1.1-0.224,1.497-0.62l38.374-38.374l38.374,38.374c0.397,0.396,0.937,0.62,1.498,0.62   s1.101-0.224,1.498-0.62l5.473-5.476c0.826-0.827,0.826-2.167,0-2.994L55.931,47.463z" />
                        </svg>
                     </i>
                  </div>
               )}
               <NavLink className={styles.nav__menu__element} to={'/signin'}>
                  Sign In
               </NavLink>
               <NavLink className={styles.nav__menu__element} to={'/signup'}>
                  Sign Up
               </NavLink>
               {isMobile && (
                  <i onClick={() => setIsMobileMenuOpen(false)}>
                     <svg
                        className={styles.nav__menu__close}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 94.926 94.926">
                        <path d="M55.931,47.463L94.306,9.09c0.826-0.827,0.826-2.167,0-2.994L88.833,0.62C88.436,0.224,87.896,0,87.335,0   c-0.562,0-1.101,0.224-1.498,0.62L47.463,38.994L9.089,0.62c-0.795-0.795-2.202-0.794-2.995,0L0.622,6.096   c-0.827,0.827-0.827,2.167,0,2.994l38.374,38.373L0.622,85.836c-0.827,0.827-0.827,2.167,0,2.994l5.473,5.476   c0.397,0.396,0.936,0.62,1.498,0.62s1.1-0.224,1.497-0.62l38.374-38.374l38.374,38.374c0.397,0.396,0.937,0.62,1.498,0.62   s1.101-0.224,1.498-0.62l5.473-5.476c0.826-0.827,0.826-2.167,0-2.994L55.931,47.463z" />
                     </svg>
                  </i>
               )}
            </motion.div>
         )}
      </nav>
   )
}

export default Navbar
