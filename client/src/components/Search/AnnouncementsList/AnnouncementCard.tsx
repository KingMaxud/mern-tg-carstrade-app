import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Skeleton } from '@chakra-ui/react'

import { Announcement } from '../../../shared/types'
import { getImageBySize } from '../../../shared/utils/utils'

const AnnouncementCard = ({ a }: { a: Announcement }) => {
   const img = a.photos[0]
   const imageUrl = getImageBySize(img, 240, 180)
   const [showImageSkeleton, setShowImageSkeleton] = useState(true)

   return (
      <Link
         to={`/vehicledetails/${a._id}`}
         key={a._id}
         onClick={() =>
            sessionStorage.setItem(
               'yScrollPosition',
               JSON.stringify(Math.round(window.scrollY))
            )
         }>
         {showImageSkeleton && <Skeleton height="180px" width="240px" />}
         <img
            src={imageUrl}
            alt={`${a.mark} ${a.model}`}
            onLoad={() => setShowImageSkeleton(false)}
            style={{ display: showImageSkeleton ? 'none' : 'block' }}
         />
      </Link>
   )
}

export default AnnouncementCard
