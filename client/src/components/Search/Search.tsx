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
import useCustomSearchParams from '../../shared/hooks/useCustomSearchParams'
import AdvancedFilter from './AdvancedFilter/AdvancedFilter'

const Search = () => {
   const [search, setSearch] = useCustomSearchParams()

   const [count, setCount] = useState(0)
   const [params, setParams] = useState<SearchParams>({})
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
      variables: {
         pagination: {
            page: '1',
            limit: '20'
         }
      },
      onCompleted: data => setAnnouncements(data.getAnnouncements)
   })

   const [loadCount] = useLazyQuery<
      GetFilteredAnnouncementCountData,
      GetFilteredAnnouncementCountVars
   >(GET_FILTERED_ANNOUNCEMENTS_COUNT, {
      onCompleted: data => {
         setCount(data.getFilteredAnnouncementCount)
      },
      variables: {
         filter: params
      }
   })

   useEffect(() => {
      loadCount()
   }, [params])

   useEffect(() => {
      loadAnnouncements()
   }, [])

   return (
      <div>
         <AdvancedFilter />
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
