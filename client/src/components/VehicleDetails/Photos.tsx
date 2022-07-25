import { useEffect, useState } from 'react'
import { Skeleton } from '@chakra-ui/react'

import MainCarouselPhoto from './MainCarouselPhoto'
import { getImageBySize } from '../../shared/utils/utils'
import styles from './Photos.module.scss'

type Props = {
   photos: string[] | null
   alt: string
}

type Image = {
   src: string
   number: number
}

const Photos = ({ photos, alt }: Props) => {
   const [currentImage, setCurrentImage] = useState<null | Image>(null)

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

   useEffect(() => {
      setCurrentImage(photos ? { src: photos[0], number: 0 } : null)
   }, [photos])

   return (
      <div>
         {!currentImage ? (
            <Skeleton width={`${720}px`} height={`${540}px`} />
         ) : (
            <MainCarouselPhoto
               image={currentImage.src}
               number={currentImage.number}
               alt={alt}
               prevImage={prevImage}
               nextImage={nextImage}
               width={720}
               height={540}
            />
         )}

         <div>
            {photos && (
               <div className={styles.photosContainer}>
                  {photos.map((p, index) => (
                     <img
                        key={`${index} photo`}
                        onClick={() =>
                           setCurrentImage({ src: p, number: index + 1 })
                        }
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
