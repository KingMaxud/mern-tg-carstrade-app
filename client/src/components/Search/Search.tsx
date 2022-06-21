import { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useSearchParams } from 'react-router-dom'

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

const Search = () => {
   const [, setSearch] = useSearchParams()

   const [count, setCount] = useState(0)
   const [params, setParams] = useState<SearchParams>({
      condition: ['Used', 'New']
   })
   const [announcements, setAnnouncements] = useState<Announcement[]>([])
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
      onCompleted: data => setAnnouncements(data.getAnnouncements)
   })

   const [loadCount] = useLazyQuery<
      GetFilteredAnnouncementCountData,
      GetFilteredAnnouncementCountVars
   >(GET_FILTERED_ANNOUNCEMENTS_COUNT, {
      onCompleted: data => {
         setCount(data.getFilteredAnnouncementCount)
      }
   })

   // Load announcements when params or pages changes
   useEffect(() => {
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
   }, [params, page])

   // Set page and other params to search params
   useDidMountEffect(() => {
      const temp = { ...params, page: page.toString() }
      setSearch(temp, { replace: true })
   }, [page])

   // Change page when params changes
   useDidMountEffect(() => {
      setPage(1)
   }, [params])

   return (
      <div>
         <AdvancedFilter
            params={params}
            setParams={setParams}
            setPage={setPage}
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
