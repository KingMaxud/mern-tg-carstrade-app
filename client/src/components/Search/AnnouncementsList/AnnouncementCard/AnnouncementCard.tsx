import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Skeleton } from '@chakra-ui/react'

import { Announcement } from '../../../../shared/types'
import {
   divideByThreeChars,
   getImageBySize,
   reverseString
} from '../../../../shared/utils/utils'
import styles from './AnnouncementCard.module.scss'

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
         <div className={styles.container}>
            <div className={styles.imageBlock}>
               {showImageSkeleton && <Skeleton height="180px" width="240px" />}
               <img
                  src={imageUrl}
                  alt={`${a.mark} ${a.model}`}
                  onLoad={() => setShowImageSkeleton(false)}
                  style={{ display: showImageSkeleton ? 'none' : 'block' }}
               />
            </div>
            <p className={styles.name}>
               {a.mark} {a.model}
            </p>
            <p className={styles.price}>{a.price} €</p>
            <p className={styles.condition}>{a.condition}</p>
            <p className={styles.transmission}>{a.transmission}</p>
            <p className={styles.fuelType}>{a.fuelType}</p>
            <p className={styles.mileage}>
               {divideByThreeChars(a.mileage.toString())} km
            </p>
            <p className={styles.year}>{a.year}</p>
            <p className={styles.engineCapacity}>
               {a.engineCapacity.toString().includes('.')
                  ? a.engineCapacity
                  : `${a.engineCapacity}.0`}{' '}
               l.
            </p>
         </div>
      </Link>
   )
}

export default AnnouncementCard
