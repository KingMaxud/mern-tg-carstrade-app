import { Skeleton } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import { getImageBySize } from '../../shared/utils/utils'
import styles from './MainCarouselPhoto.module.scss'
import arrowLeft from '../../images/arrow_left.svg'
import arrowRight from '../../images/arrow_right.svg'

type Props = {
   image: string | null
   number: number
   alt: string
   width: number
   height: number
   nextImage: (number: number) => void
   prevImage: (number: number) => void
}

const MainCarouselPhoto = ({
   image,
   number,
   alt,
   width,
   height,
   nextImage,
   prevImage
}: Props) => {
   const [smallImage, setSmallImage] = useState<string | null>(null)
   const [bigImage, setBigImage] = useState<string | null>(null)
   const [smallImageLoaded, setSmallImageLoaded] = useState(false)
   const [hovered, setHovered] = useState(false)

   useEffect(() => {
      if (image) {
         setSmallImage(getImageBySize(image, 120, 90))
         setBigImage(getImageBySize(image, width, height))
      }
   }, [image])

   return (
      <div
         onMouseEnter={() => setHovered(true)}
         onMouseLeave={() => setHovered(false)}
         style={{
            width,
            height
         }}>
         {!smallImageLoaded && (
            <Skeleton width={`${width}px`} height={`${height}px`} />
         )}
         {smallImage && bigImage && (
            <div
               style={{
                  width,
                  height
               }}>
               <div
                  className={styles.arrowsContainer}
                  style={{
                     width,
                     height
                  }}>
                  <div
                     onClick={() => prevImage(number)}
                     className={styles.arrowBlock}>
                     <div className={styles.overlay} />
                     <img
                        src={arrowLeft}
                        alt="left arrow"
                        className={`${styles.image} ${
                           hovered && styles.hovered
                        }`}
                     />
                  </div>
                  <div className={styles.arrowsContainerCenter} />
                  <div
                     onClick={() => nextImage(number)}
                     className={styles.arrowBlock}>
                     <div className={styles.overlay} />
                     <img
                        src={arrowRight}
                        alt="right arrow"
                        className={`${styles.image} ${
                           hovered && styles.hovered
                        }`}
                     />
                  </div>
               </div>
               <img
                  src={smallImage}
                  alt={alt}
                  style={{
                     width,
                     height
                  }}
                  className={styles.smallImage}
                  onLoad={() => setSmallImageLoaded(true)}
               />
               <img
                  id={bigImage}
                  src={bigImage}
                  alt={alt}
                  style={{
                     width,
                     height
                  }}
                  className={styles.bigImage}
               />
            </div>
         )}
      </div>
   )
}

export default MainCarouselPhoto
