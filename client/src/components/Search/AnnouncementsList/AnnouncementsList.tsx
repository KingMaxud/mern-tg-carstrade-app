import { Box } from '@chakra-ui/react'
import { Link } from 'react-router-dom'

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
               <Link to={`/vehicledetails/${a._id}`} key={a._id}>
                  <img src={imageUrl} alt={`${a.mark} ${a.model}`} />
               </Link>
            )
         })}
      </Box>
   )
}

export default AnnouncementsList
