import { useEffect, useState } from 'react'

const ProgressiveImage = ({
   smallImage,
   bigImage,
   alt
}: {
   smallImage: string
   bigImage: string
   alt: string
}) => {
   const [imgSrc, setImgSrc] = useState(smallImage || bigImage)

   const customClass =
      smallImage && imgSrc === smallImage ? 'loading' : 'loaded'

   useEffect(() => {
      const img = new Image()
      img.src = bigImage
      img.onload = () => {
         setImgSrc(bigImage)
      }
   }, [bigImage])

   return (
      <img src={imgSrc} alt={alt || ''} className={`image ${customClass}`} />
   )
}

export default ProgressiveImage
