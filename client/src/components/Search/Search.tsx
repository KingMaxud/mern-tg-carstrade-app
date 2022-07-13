import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { createSearchParams, useSearchParams } from 'react-router-dom'

import {
   Announcement,
   GetAnnouncementsData,
   GetAnnouncementsVars,
   GetFilteredAnnouncementCountData,
   GetFilteredAnnouncementCountVars,
   SearchParams
} from '../../shared/types'
import {
   GET_ANNOUNCEMENTS,
   GET_FILTERED_ANNOUNCEMENTS_COUNT
} from '../../shared/utils/graphql'
import AnnouncementsList from './AnnouncementsList/AnnouncementsList'
import PagesBar from './PagesBar'
import AdvancedFilter from './AdvancedFilter/AdvancedFilter'
import useDidMountEffect from '../../shared/hooks/useDidMountEffect'
import history from 'history/browser'
import { getSessionStorageOrDefault } from '../../shared/utils/utils'

const Search = () => {
   const [, setSearch] = useSearchParams()

   const [count, setCount] = useState(0)
   const [params, setParams] = useState<SearchParams>({})
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

   // Load announcements when params or pages changes
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
               }
            }
         })
         loadCount({
            variables: {
               filter
            }
         })
      }
   }, [params, page, ifParamsParsed])

   // Set page and other params to search params
   useDidMountEffect(() => {
      const temp = { ...params, page: page.toString() }
      history.push(`/search?${createSearchParams(params)}`)
      setSearch(temp, { replace: true })
   }, [page])

   // Scroll on back
   useDidMountEffect(() => {
      window.scrollTo(0, getSessionStorageOrDefault('yScrollPosition', 0))
      sessionStorage.removeItem('yScrollPosition')
      debugger
   }, [firstLoaded])

   return (
      <div>
         <AdvancedFilter
            params={params}
            setParams={setParams}
            setPage={setPage}
            ifParamsParsed={ifParamsParsed}
            setIfParamsParsed={setIfParamsParsed}
         />
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
