import { Skeleton } from '@chakra-ui/react'
import { getImageBySize } from '../../shared/utils/utils'
import { useEffect, useState } from 'react'

type Props = {
   image: string | null
   alt: string
   width: number
   height: number
}

const MainCarouselPhoto = ({ image, alt, width, height }: Props) => {
   const [smallImage, setSmallImage] = useState<string | null>(null)
   const [bigImage, setBigImage] = useState<string | null>(null)
   const [smallImageLoaded, setSmallImageLoaded] = useState(false)

   useEffect(() => {
      if (image) {
         setSmallImage(getImageBySize(image, 120, 90))
         setBigImage(getImageBySize(image, width, height))
      }
   }, [image])

   return (
      <div
         style={{
            width,
            height
         }}>
         {!smallImageLoaded && (
            <Skeleton width={`${width}px`} height={`${height}px`} />
         )}
         {smallImage && bigImage && (
            <div
               style={{ width: ` ${width + 12}px`, height: ` ${height + 12}px` }}>
               {/*This img is only for setSmallImageLoaded*/}
               <img
                  src={smallImage}
                  alt={alt}
                  style={{
                     position: 'absolute',
                     width,
                     height,
                     objectFit: 'cover',
                     filter: 'blur(6px)'
                  }}
                  onLoad={() => setSmallImageLoaded(true)}
               />
               <img
                  src={bigImage}
                  alt={alt}
                  onLoad={() => setSmallImageLoaded(true)}
                  style={{
                     position: 'relative',
                     zIndex: 10,
                     width,
                     height,
                     objectFit: 'contain'
                  }}
               />
            </div>
         )}
      </div>
   )
}

export default MainCarouselPhoto
