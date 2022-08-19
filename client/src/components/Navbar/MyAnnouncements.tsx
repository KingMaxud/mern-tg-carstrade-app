import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'

import {
   GET_FILTERED_ANNOUNCEMENTS_COUNT,
   GET_USERS_ANNOUNCEMENTS
} from '../../shared/utils/graphql'
import {
   GetFilteredAnnouncementCountData,
   GetUsersAnnouncementCountVars,
   GetUsersAnnouncementsData,
   GetUsersAnnouncementsVars,
   UsersAnnouncement
} from '../../shared/types'
import styles from './MyAnnouncements.module.scss'
import { getImageBySize } from '../../shared/utils/utils'
import PagesBar from './PagesBar'

const MyAnnouncements = () => {
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(false)
   const [count, setCount] = useState(0)
   const [data, setData] = useState<UsersAnnouncement[]>([])
   const [page, setPage] = useState(1)

   useQuery<GetFilteredAnnouncementCountData, GetUsersAnnouncementCountVars>(
      GET_FILTERED_ANNOUNCEMENTS_COUNT,
      {
         variables: {
            filter: {
               user: '626a610d564752202c984e47'
            }
         },
         onCompleted: data => setCount(data.getFilteredAnnouncementCount)
      }
   )

   useQuery<GetUsersAnnouncementsData, GetUsersAnnouncementsVars>(
      GET_USERS_ANNOUNCEMENTS,
      {
         variables: {
            filter: {
               user: '626a610d564752202c984e47'
            },
            pagination: {
               page: page.toString(),
               limit: '5'
            }
         },
         onCompleted: data => {
            setData(data.getAnnouncements)
            setLoading(false)
         },
         onError: error => {
            setError(true)
            setLoading(false)
         }
      }
   )

   return (
      <div className={styles.container}>
         {loading ? (
            <p>Loading</p>
         ) : error || !data ? (
            <p>You haven't published an announcements yet!</p>
         ) : (
            <div>
               {data.map(a => (
                  <Link
                     to={`/vehicledetails/${a._id}`}
                     key={a._id}
                     className={styles.link}>
                     <div className={styles.announcement}>
                        <img
                           className={styles.image}
                           src={getImageBySize(a.photos[0], 224, 168)}
                           alt={`${a.mark} ${a.model}`}
                        />
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
