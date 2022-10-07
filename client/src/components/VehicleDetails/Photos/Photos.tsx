import { useEffect, useState } from 'react'
import { Skeleton } from '@chakra-ui/react'

import MainCarouselPhoto from '../MainCarouselPhoto/MainCarouselPhoto'
import { getImageBySize } from '../../../shared/utils/utils'
import styles from './Photos.module.scss'
import useWindowSize from '../../../shared/hooks/useWindowDimensions'
import useDidMountEffect from '../../../shared/hooks/useDidMountEffect'

type Props = {
   photos: string[] | null
   alt: string
}

type Image = {
   src: string
   number: number
}

const getPhotoWidth = (screenWidth: number) => {
   if (screenWidth >= 760) {
      return 720
   } else if (screenWidth >= 600) {
      return 560
   } else if (screenWidth >= 440) {
      return 400
   } else if (screenWidth >= 350) {
      return 320
   } else if (screenWidth >= 285) {
      return 260
   } else if (screenWidth >= 220) {
      return 200
   } else {
      return 120
   }
}

const getHeightByWidth = (screenWidth: number) => {
   return Math.round((screenWidth * 3) / 4)
}

const Photos = ({ photos, alt }: Props) => {
   const [currentImage, setCurrentImage] = useState<null | Image>(null)
   const [showSkeleton, setShowSkeleton] = useState(true)
   const [photoWidth, setPhotoWidth] = useState(
      getPhotoWidth(window.innerWidth)
   )

   const prevImage = (number: number) => {
      // If the current image is the first - set the last
      const prevImageNumber =
         number === 0 ? (photos?.length || 0) - 1 : --number

      photos?.map((p, i) => {
         if (i === prevImageNumber) {
            setCurrentImage({ src: p, number: prevImageNumber })
         }
      })
   }

   const nextImage = (number: number) => {
      // If the current image is the last - set the first
      const nextImageNumber =
         number === (photos?.length || 0) - 1 ? 0 : ++number

      photos?.map((p, i) => {
         if (i === nextImageNumber) {
            setCurrentImage({ src: p, number: nextImageNumber })
         }
      })
   }

   // Change width when screen size changes
   useDidMountEffect(() => {
      setPhotoWidth(getPhotoWidth(window.innerWidth))
   }, [useWindowSize().width])

   useEffect(() => {
      setCurrentImage(photos ? { src: photos[0], number: 0 } : null)
   }, [photos])

   return (
      <div className={styles.container}>
         {!currentImage ? (
            <Skeleton
               width={`${photoWidth}px`}
               height={`${getHeightByWidth(photoWidth)}px`}
            />
         ) : (
            <MainCarouselPhoto
               image={currentImage.src}
               number={currentImage.number}
               showSkeleton={showSkeleton}
               setShowSkeleton={setShowSkeleton}
               alt={alt}
               prevImage={prevImage}
               nextImage={nextImage}
               width={photoWidth}
               height={getHeightByWidth(photoWidth)}
            />
         )}

         <div>
            {photos && (
               <div className={styles.photosContainer}>
                  {photos.map((p, index) => (
                     <img
                        key={`${index} photo`}
                        onClick={() => {
                           if (currentImage && index !== currentImage.number) {
                              setShowSkeleton(true)
                              setCurrentImage({ src: p, number: index })
                           }
                        }}
                        src={getImageBySize(p, 144, 108)}
                        alt={`${alt}${index + 1}`}
                     />
                  ))}
               </div>
            )}
         </div>
      </div>
   )
}

export default Photos
