import { Skeleton } from '@chakra-ui/react'
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { getImageBySize } from '../../shared/utils/utils'
import styles from './MainCarouselPhoto.module.scss'

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
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  enableBackground="new 0 0 32 32"
                  version="1.1"
                  viewBox="0 0 32 32"
                  className={`${styles.svg} ${hovered && styles.hovered}`}>
                  <path
                     clipRule="evenodd"
                     d="M20.273,5.278l-9.977,9.999  c-0.394,0.395-0.394,1.034,0,1.429h0v0l9.97,9.991c0.634,0.66,1.748,0.162,1.723-0.734V6.02C22.013,5.127,20.907,4.643,20.273,5.278  z M12.434,15.991l7.55-7.566v15.133L12.434,15.991z"
                     fill="#000000"
                     fillRule="evenodd"
                     id="Arrow_Drop_Left"
                  />
               </svg>
            </div>
            <div className={styles.arrowsContainerCenter} />
            <div
               onClick={() => {
                  nextImage(number)
                  setShowSkeleton(true)
               }}
               className={styles.arrowBlock}>
               <div className={styles.overlay} />
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  enableBackground="new 0 0 32 32"
                  version="1.1"
                  viewBox="0 0 32 32"
                  className={`${styles.svg} ${hovered && styles.hovered}`}>
                  <path
                     clipRule="evenodd"
                     d="M11.727,26.71l9.977-9.999  c0.394-0.395,0.394-1.034,0-1.429h0v0l-9.97-9.991c-0.634-0.66-1.748-0.162-1.723,0.734v19.943  C9.988,26.861,11.094,27.345,11.727,26.71z M19.567,15.997l-7.55,7.566V8.431L19.567,15.997z"
                     fill="#000000"
                     fillRule="evenodd"
                     id="Arrow_Drop_Right"
                  />
               </svg>
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
