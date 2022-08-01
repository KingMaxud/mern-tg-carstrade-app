import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import history from 'history/browser'
import { Select } from '@chakra-ui/react'

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
import PagesBar from './PagesBar'
import AdvancedFilter from './AdvancedFilter/AdvancedFilter'
import useDidMountEffect from '../../shared/hooks/useDidMountEffect'
import { getSessionStorageOrDefault } from '../../shared/utils/utils'
import { sortMethods } from '../../shared/data'

const Search = () => {
   const [, setSearch] = useSearchParams()

   const [count, setCount] = useState(0)
   const [params, setParams] = useState<SearchParams>({})
   const [sortMethod, setSortMethod] = useState<null | SortMethod>(null)
   const [ifParamsParsed, setIfParamsParsed] = useState(false)
   const [announcements, setAnnouncements] = useState<Announcement[]>([])
   const [firstLoaded, setFirstLoaded] = useState(false)
   const [page, setPage] = useState(1)

   const incrementPage = () => {
      setPage(prevState => prevState + 1)
   }
   const decrementPage = () => {
      setPage(prevState => prevState - 1)
   }

   const [loadAnnouncements] = useLazyQuery<
      GetAnnouncementsData,
      GetAnnouncementsVars
   >(GET_ANNOUNCEMENTS, {
      onCompleted: data => {
         setAnnouncements(data.getAnnouncements)
         setFirstLoaded(true)
      }
   })

   const [loadCount] = useLazyQuery<
      GetFilteredAnnouncementCountData,
      GetFilteredAnnouncementCountVars
   >(GET_FILTERED_ANNOUNCEMENTS_COUNT, {
      onCompleted: data => setCount(data.getFilteredAnnouncementCount)
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
   }, [params, page, ifParamsParsed, sortMethod])

   // Set params to search params when page or sort method changes
   useDidMountEffect(() => {
      const temp: SearchParamsExtended = {
         ...params,
         page: page.toString()
      }
      if (sortMethod) {
         temp.sort = sortMethod.shortCode
      }
      history.push(`/search?${createSearchParams(params)}`)
      setSearch(temp, { replace: true })
   }, [page, sortMethod])

   // Scroll on back
   useDidMountEffect(() => {
      window.scrollTo(0, getSessionStorageOrDefault('yScrollPosition', 0))
      sessionStorage.removeItem('yScrollPosition')
   }, [firstLoaded])

   const handleSortMethodSelection = (
      e: React.ChangeEvent<HTMLSelectElement>
   ) => {
      sortMethods.map(s => {
         if (s.description === e.target.value) {
            setSortMethod(s)
         }
      })
   }

   return (
      <div>
         <AdvancedFilter
            params={params}
            setParams={setParams}
            setPage={setPage}
            setSortMethod={setSortMethod}
            ifParamsParsed={ifParamsParsed}
            setIfParamsParsed={setIfParamsParsed}
         />
         <Select
            value={sortMethod ? sortMethod.description : 'Latest offers first'}
            onChange={handleSortMethodSelection}>
            {sortMethods.map(s => (
               <option
                  key={s.description}
                  value={s.description}
                  label={s.description}
               />
            ))}
         </Select>
         <AnnouncementsList announcements={announcements} />
         <PagesBar
            count={count}
            selectedPage={page}
            setPage={setPage}
            incrementPage={incrementPage}
            decrementPage={decrementPage}
         />
      </div>
   )
}

export default Search
