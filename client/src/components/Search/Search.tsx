import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import Select from '../shared/Select'
import { createSearchParams, useNavigate } from 'react-router-dom'

import {
   Announcement,
   GetAnnouncementsData,
   GetAnnouncementsVars,
   GetFilteredAnnouncementCountData,
   GetFilteredAnnouncementCountVars,
   SearchParams,
   SearchParamsExtended,
   SortMethod
} from '../../shared/types'
import {
   GET_ANNOUNCEMENTS,
   GET_FILTERED_ANNOUNCEMENTS_COUNT
} from '../../shared/utils/graphql'
import AnnouncementsList from './AnnouncementsList/AnnouncementsList'
import PagesBar from './PagesBar/PagesBar'
import AdvancedFilter from './AdvancedFilter/AdvancedFilter'
import useDidMountEffect from '../../shared/hooks/useDidMountEffect'
import { getSessionStorageOrDefault } from '../../shared/utils/utils'
import { sortMethods } from '../../shared/data'
import styles from './Search.module.scss'

const Search = () => {
   const navigate = useNavigate()

   const [count, setCount] = useState(0)
   const [params, setParams] = useState<SearchParams>({})
   const [sortMethod, setSortMethod] = useState<null | SortMethod>(
      sortMethods[0]
   )
   const [ifParamsParsed, setIfParamsParsed] = useState(false)
   const [announcements, setAnnouncements] = useState<Announcement[]>([])
   const [announcementsLoading, setAnnouncementsLoading] = useState(true)
   const [firstLoaded, setFirstLoaded] = useState(false)
   const [page, setPage] = useState(1)
   const [loadAnnouncementTrigger, setLoadAnnouncementTrigger] = useState(false)
   const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

   const [loadAnnouncements] = useLazyQuery<
      GetAnnouncementsData,
      GetAnnouncementsVars
   >(GET_ANNOUNCEMENTS, {
      onCompleted: data => {
         setAnnouncements(data.getAnnouncements)
         setAnnouncementsLoading(false)
         setFirstLoaded(true)
      }
   })

   const [loadCount] = useLazyQuery<
      GetFilteredAnnouncementCountData,
      GetFilteredAnnouncementCountVars
   >(GET_FILTERED_ANNOUNCEMENTS_COUNT, {
      onCompleted: data => {
         setCount(data.getFilteredAnnouncementCount)

         // Change title
         const title = data.getFilteredAnnouncementCount
            ? `${params.mark ? params.mark : 'Cars'} ${
                 params.model ? params.model : ''
              } for sale: ${data.getFilteredAnnouncementCount} announcements`
            : 'There are no announcements for you'
         document.title = title
      }
   })

   // Load announcements when params, page or sort method change
   useEffect(() => {
      if (ifParamsParsed) {
         // clear empty arrays
         const filter: SearchParams = {}
         for (const param in params) {
            // @ts-ignore
            if (params[param].length !== 0) {
               // @ts-ignore
               filter[param] = params[param]
            }
         }

         setAnnouncementsLoading(true)
         loadAnnouncements({
            variables: {
               filter,
               pagination: {
                  page: page.toString(),
                  limit: '20'
               },
               sort: sortMethod?.sort
            }
         })
         loadCount({
            variables: {
               filter
            }
         })
      }
   }, [loadAnnouncementTrigger])

   // Scroll on back
   useDidMountEffect(() => {
      window.scrollTo(0, getSessionStorageOrDefault('yScrollPosition', 0))
      sessionStorage.removeItem('yScrollPosition')
   }, [firstLoaded])

   // Scroll to top when page changes
   useDidMountEffect(() => {
      window.scrollTo(0, 0)
   }, [page])

   const updateSearchParamsOnPageChanges = (page: number) => {
      const temp: SearchParamsExtended = {
         ...params
      }
      if (sortMethod) {
         temp.sort = sortMethod.shortCode
      }

      if (page !== 1) {
         temp.page = page.toString()
      }

      navigate(`/search?${createSearchParams(temp)}`)
   }

   const handleSortMethodSelection = (
      e: React.ChangeEvent<HTMLSelectElement>
   ) => {
      sortMethods.map(s => {
         if (s.description === e.target.value) {
            setSortMethod(s)

            // Record changes in history
            const temp: SearchParamsExtended = {
               ...params,
               sort: s.shortCode
            }

            navigate(`/search?${createSearchParams(temp)}`)
         }
      })
      setPage(1)
   }

   return (
      <div className={styles.container}>
         <AdvancedFilter
            params={params}
            setParams={setParams}
            setPage={setPage}
            setSortMethod={setSortMethod}
            ifParamsParsed={ifParamsParsed}
            setIfParamsParsed={setIfParamsParsed}
            isMobileFilterOpen={isMobileFilterOpen}
            setIsMobileFilterOpen={setIsMobileFilterOpen}
            loadAnnouncementTrigger={loadAnnouncementTrigger}
            setLoadAnnouncementTrigger={setLoadAnnouncementTrigger}
         />
         <div className={styles.wrapper}>
            <div className={styles.sortSelector}>
               <p>There are {count} offers for your search</p>
               <Select
                  status="default"
                  value={
                     sortMethod ? sortMethod.description : 'Latest offers first'
                  }
                  onChange={handleSortMethodSelection}>
                  {sortMethods.map(s => (
                     <option
                        key={s.description}
                        value={s.description}
                        label={s.description}
                     />
                  ))}
               </Select>
            </div>
            <AnnouncementsList
               announcements={announcements}
               announcementsLoading={announcementsLoading}
            />
            <PagesBar
               count={count}
               selectedPage={page}
               page={page}
               setPage={setPage}
               updateSearchParamsOnPageChanges={updateSearchParamsOnPageChanges}
            />
         </div>
         <div
            className={styles.mobileFilterFooter}
            onClick={() => setIsMobileFilterOpen(true)}>
            <p>Filter</p>
         </div>
      </div>
   )
}

export default Search
