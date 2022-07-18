import { useState } from 'react'
import { Skeleton } from '@chakra-ui/react'

import MainCarouselPhoto from './MainCarouselPhoto'
import useDidMountEffect from '../../shared/hooks/useDidMountEffect'
import { getImageBySize } from '../../shared/utils/utils'
import { photosContainer } from './Photos.styles'

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

   useDidMountEffect(() => {
      setCurrentImage(photos ? { src: photos[0], number: 1 } : null)
   }, [photos])

   return (
      <div>
         {!currentImage ? (
            <Skeleton width={`${720}px`} height={`${540}px`} />
         ) : (
            <MainCarouselPhoto
               image={currentImage.src}
               alt={alt}
               width={720}
               height={540}
            />
         )}

         <div>
            {photos && (
               <div style={photosContainer}>
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
