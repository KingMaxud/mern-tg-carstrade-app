import { Skeleton } from '@chakra-ui/react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { getImageBySize } from '../../shared/utils/utils'
import styles from './MainCarouselPhoto.module.scss'
import arrowLeft from '../../images/arrow_left.svg'
import arrowRight from '../../images/arrow_right.svg'

type Props = {
   image: string | null
   number: number
   showSkeleton: boolean
   setShowSkeleton: Dispatch<SetStateAction<boolean>>
   alt: string
   width: number
   height: number
   nextImage: (number: number) => void
   prevImage: (number: number) => void
}

const MainCarouselPhoto = ({
   image,
   number,
   showSkeleton,
   setShowSkeleton,
   alt,
   width,
   height,
   nextImage,
   prevImage
}: Props) => {
   const [smallImage, setSmallImage] = useState<string>('')
   const [bigImage, setBigImage] = useState<string>('')
   const [bigImageLoaded, setBigImageLoaded] = useState(false)
   const [hovered, setHovered] = useState(false) // To display arrow buttons on hover

   // Set images by size whe it's available
   useEffect(() => {
      if (image) {
         setSmallImage(getImageBySize(image, 120, 90))
         setBigImage(getImageBySize(image, width, height))
      }
   }, [image])

   // Hide Big Image when user changes main photo
   useEffect(() => {
      if (showSkeleton) {
         setBigImageLoaded(false)
      }
   }, [showSkeleton])

   return (
      <div
         onMouseEnter={() => setHovered(true)}
         onMouseLeave={() => setHovered(false)}
         style={{
            width,
            height
         }}>
         {showSkeleton && (
            <Skeleton
               width={`${width}px`}
               height={`${height}px`}
               className={styles.skeleton}
            />
         )}
         <div
            className={styles.arrowsContainer}
            style={{
               width,
               height
            }}>
            <div
               onClick={() => {
                  prevImage(number)
                  setShowSkeleton(true)
               }}
               className={styles.arrowBlock}>
               <div className={styles.overlay} />
               <img
                  src={arrowLeft}
                  alt="left arrow"
                  className={`${styles.image} ${hovered && styles.hovered}`}
               />
            </div>
            <div className={styles.arrowsContainerCenter} />
            <div
               onClick={() => {
                  nextImage(number)
                  setShowSkeleton(true)
               }}
               className={styles.arrowBlock}>
               <div className={styles.overlay} />
               <img
                  src={arrowRight}
                  alt="right arrow"
                  className={`${styles.image} ${hovered && styles.hovered}`}
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
            className={`${styles.smallImage}`}
            onLoad={() => setShowSkeleton(false)}
         />
         <img
            src={bigImage || ''}
            alt={alt}
            style={{
               width,
               height
            }}
            onLoad={() => setBigImageLoaded(true)}
            className={`${styles.bigImage} ${!bigImageLoaded && styles.hidden}`}
         />
      </div>
   )
}

export default MainCarouselPhoto

// <img
// src={smallImage}
// alt={alt}
// style={{
//    width,
//       height
// }}
// className={`${styles.smallImage}`}
// onLoad={() => setShowSkeleton(false)}
// />
// <img
//    src={bigImage || ''}
//    alt={alt}
//    style={{
//       width,
//       height
//    }}
//    className={`${styles.bigImage}`}
// />
