import { Box } from '@chakra-ui/react'

import { Announcement } from '../../../shared/types'
import AnnouncementCard from './AnnouncementCard'

type Props = {
   announcements: Announcement[]
}

const AnnouncementsList = ({ announcements }: Props) => {
   return (
      <Box>
         {announcements.map(a => (
            <AnnouncementCard key={a._id} a={a} />
         ))}
      </Box>
   )
}

export default AnnouncementsList
