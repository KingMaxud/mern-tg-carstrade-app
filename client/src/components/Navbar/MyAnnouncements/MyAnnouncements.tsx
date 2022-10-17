import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { Link } from 'react-router-dom'

import {
   GET_FILTERED_ANNOUNCEMENTS_COUNT,
   GET_USERS_ANNOUNCEMENTS
} from '../../../shared/utils/graphql'
import {
   GetFilteredAnnouncementCountData,
   GetUsersAnnouncementCountVars,
   GetUsersAnnouncementsData,
   GetUsersAnnouncementsVars,
   UsersAnnouncement
} from '../../../shared/types'
import styles from './MyAnnouncements.module.scss'
import { getImageBySize } from '../../../shared/utils/utils'
import PagesBar from '../PagesBar'
import loader from '../../../images/fading-balls.png'
import useDidMountEffect from '../../../shared/hooks/useDidMountEffect'
import useGetUser from '../../../shared/hooks/useGetUser'
import noImage from '../../../images/NO_IMAGE.svg'

const MyAnnouncements = () => {
   const [firstTimeLoaded, setFirstTimeLoaded] = useState(false)
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(false)
   const [count, setCount] = useState(0)
   const [data, setData] = useState<UsersAnnouncement[]>([])
   const [page, setPage] = useState(1)
   const [userId, setUserId] = useState('')

   const { getUserId } = useGetUser()

   const [getCount] = useLazyQuery<
      GetFilteredAnnouncementCountData,
      GetUsersAnnouncementCountVars
   >(GET_FILTERED_ANNOUNCEMENTS_COUNT, {
      onCompleted: data => setCount(data.getFilteredAnnouncementCount),
      fetchPolicy: 'cache-and-network',
   })

   const [getUsersAnnouncementsData] = useLazyQuery<
      GetUsersAnnouncementsData,
      GetUsersAnnouncementsVars
   >(GET_USERS_ANNOUNCEMENTS, {
      fetchPolicy: 'cache-and-network',
      onCompleted: data => {
         setData(data.getAnnouncements)
         setFirstTimeLoaded(true)
         setLoading(false)
      },
      onError: error => {
         setError(true)
         setLoading(false)
      }
   })

   useEffect(() => {
      getUserId().then(data => {
         setUserId(data)

         getCount({
            variables: {
               filter: {
                  user: data
               }
            }
         })
         getUsersAnnouncementsData({
            variables: {
               filter: {
                  user: data
               },
               pagination: {
                  page: '1',
                  limit: '4'
               }
            }
         })
      })
   }, [])

   useDidMountEffect(() => {
      setLoading(true)
      getUsersAnnouncementsData({
         variables: {
            filter: {
               user: userId
            },
            pagination: {
               page: page.toString(),
               limit: '4'
            }
         }
      })
   }, [page])

   return (
      <div className={styles.container}>
         {!firstTimeLoaded ? (
            <div className={styles.firstLoader}>
               <img alt="loader" className={styles.loading} src={loader} />
            </div>
         ) : error || data.length === 0 ? (
            <div className={styles.empty}>You haven't published any announcements yet!</div>
         ) : (
            <div className={styles.container__loading}>
               <div
                  className={`${styles.overlay} ${
                     loading && styles.displayed
                  }`}></div>
               {data.map(a => (
                  <Link
                     to={`/vehicledetails/${a._id}`}
                     key={a._id}
                     className={styles.link}>
                     <div className={styles.announcement}>
                        <img
                           className={styles.image}
                           src={
                              a.photos.length > 0
                                 ? getImageBySize(a.photos[0], 224, 168)
                                 : noImage
                           }
                           alt={`${a.mark} ${a.model}`}
                        />
                        <div className={styles.info}>
                           <p className={styles.mark}>{a.mark}</p>
                           <p className={styles.model}>{a.model}</p>
                           <p className={styles.year}>{a.year}</p>
                           <p className={styles.price}>{a.price}$</p>
                        </div>
                     </div>
                  </Link>
               ))}
               <PagesBar page={page} setPage={setPage} count={count} />
            </div>
         )}
      </div>
   )
}

export default MyAnnouncements
