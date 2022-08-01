import React, { useState } from 'react'

const Test = () => {
   const [photo, setPhoto] = useState(
      'https://res.cloudinary.com/dxl170evw/image/upload/w_720,h_540,c_fill/v1655803612/images/gffoq5ugl35uti6w7m6m.jpg'
   )

   const [visible, setVisible] = useState(false)

   const photos = [
      'https://res.cloudinary.com/dxl170evw/image/upload/w_720,h_540,c_fill/v1655803612/images/ibhzl4s1e7mpxa9wdbeq.jpg',
      'https://res.cloudinary.com/dxl170evw/image/upload/w_720,h_540,c_fill/v1655803612/images/gffoq5ugl35uti6w7m6m.jpg'
   ]

   const changePhoto = () => {
      if (photo === photos[0]) {
         setPhoto(photos[1])
      } else {
         setPhoto(photos[0])
      }
      setVisible(false)
   }

   return (
      <div>
         {photo}
         <img
            src={photo}
            style={{
               visibility: visible ? 'visible' : 'hidden'
            }}
            onLoad={() => {
               setVisible(true)
            }}
            onClick={changePhoto}
            alt="merc dream"
         />
      </div>
   )
}

export default Test
