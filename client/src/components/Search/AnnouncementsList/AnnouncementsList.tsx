import { Box } from '@chakra-ui/react'

import { Announcement } from '../../../shared/types'

type Props = {
   announcements: Announcement[]
}

const AnnouncementsList = ({ announcements }: Props) => {
   return (
      <Box>
         {announcements.map(a => {
            const img = a.photos[0]
            const widthAndHeight = 'upload/w_240,h_180,c_fill'
            const [stringStart, stringEnd] = img.split('upload')
            const imageUrl = stringStart.concat(widthAndHeight, stringEnd)

            return (
               <img src={imageUrl} alt={`${a.mark} ${a.model}`} key={a._id} />
            )
         })}
      </Box>
   )
}

export default AnnouncementsList
