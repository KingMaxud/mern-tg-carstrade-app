import { Skeleton } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import { getImageBySize } from '../../shared/utils/utils'
import { arrowBlock } from './MainCarouselPhoto.styles'

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
               style={{
                  width: ` ${width}px`,
                  height: ` ${height}px`
               }}>
               <div
                  style={{
                     position: 'absolute',
                     width: `${width}px`,
                     height: `${height}px`,
                     zIndex: 20,
                     display: 'grid',
                     gridTemplateColumns: '150px auto 150px'
                  }}>
                  <div
                     onClick={() => console.log('Hello')}
                     style={arrowBlock}
                  />
                  <div style={{ height: 'auto' }} />
                  <div
                     onClick={() => console.log('World')}
                     style={arrowBlock}
                  />
               </div>
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
                     position: 'absolute',
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
