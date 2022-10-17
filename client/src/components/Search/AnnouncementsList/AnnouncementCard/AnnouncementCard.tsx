import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Skeleton } from '@chakra-ui/react'

import { Announcement } from '../../../../shared/types'
import {
   divideByThreeChars,
   getImageBySize
} from '../../../../shared/utils/utils'
import styles from './AnnouncementCard.module.scss'
import noImage from '../../../../images/NO_IMAGE.svg'
import useDidMountEffect from '../../../../shared/hooks/useDidMountEffect'
import useWindowSize from '../../../../shared/hooks/useWindowDimensions'

type SizesFunction = (screenWidth: number) => {
   width: number
   height: number
}

const getWidthAndHeight: SizesFunction = (screenWidth: number) => {
   if (screenWidth > 320) {
      return { width: 240, height: 180 }
   }
   return { width: 200, height: 150 }
}

const AnnouncementCard = ({ a }: { a: Announcement }) => {
   const [width, setWidth] = useState(
      getWidthAndHeight(window.innerWidth).width
   )
   const [height, setHeight] = useState(
      getWidthAndHeight(window.innerWidth).height
   )

   const img = a.photos[0]
   const imageUrl = img ? getImageBySize(img, width, height) : noImage
   const [showImageSkeleton, setShowImageSkeleton] = useState(true)

   useDidMountEffect(() => {
      setWidth(getWidthAndHeight(window.innerWidth).width)
      setHeight(getWidthAndHeight(window.innerWidth).height)
   }, [useWindowSize().width])

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
            <div
               className={styles.imageBlock}
               style={{ width: `${width}px`, height: `${height}px` }}>
               {showImageSkeleton && (
                  <Skeleton height={`${width}px`} width={`${height}px`} />
               )}
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
