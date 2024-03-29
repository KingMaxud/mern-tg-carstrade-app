import { gql, useLazyQuery } from '@apollo/client'
import Compressor from 'compressorjs'
import axios from 'axios'
import { FilePond, registerPlugin } from 'react-filepond'
import React, { useState } from 'react'
import FilePondPluginImageValidateSize from 'filepond-plugin-image-validate-size'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'

import 'filepond/dist/filepond.min.css'

registerPlugin(
   FilePondPluginImagePreview,
   FilePondPluginImageValidateSize,
   FilePondPluginImageExifOrientation,
   FilePondPluginFileValidateType
)

type UploadPresetData = {
   getUploadPreset: string
}

const compressImage = (image: any, uploadPreset: string) => {
   // Compress image, then  upload it to cloudinary
   return new Promise<string>(function (res, rej) {
      // Return Promise, so I can await it
      new Compressor(image.file, {
         maxWidth: 1200,
         maxHeight: 900,
         success: async compressedImage => {
            const formData = new FormData()
            formData.append('file', compressedImage)
            formData.append('upload_preset', uploadPreset)
            const dataRes = await axios.post(
               'https://api.cloudinary.com/v1_1/dxl170evw/image/upload',
               formData
            )
            res(dataRes.data.url)
         },
         error(err) {
            rej(err)
         }
      })
   })
}

const useAddPhoto = () => {
   const [loadUploadPreset] = useLazyQuery<UploadPresetData>(GET_UPLOAD_PRESET)
   const [images, setImages] = useState<any[]>([])

   const addPhoto = async () => {
      const data = await loadUploadPreset()
      let uploadPreset: string
      if (data.data) {
         uploadPreset = data.data.getUploadPreset
         const unresolved = images.map(async image => {
            const url = await compressImage(image, uploadPreset)
            return url
         })

         const resolved = await Promise.all(unresolved)
         return resolved // Return url's array
      }
   }

   // Component to upload images
   const addPhotoComponent = (
      <FilePond
         // @ts-ignore
         files={images}
         // @ts-ignore
         onupdatefiles={setImages}
         allowMultiple={true}
         maxFiles={9}
         name="files"
         acceptedFileTypes={[
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/webp'
         ]}
         imageValidateSizeMinWidth={320}
         imageValidateSizeMinHeight={240}
         labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />
   )

   return { addPhoto, addPhotoComponent }
}

export default useAddPhoto

const GET_UPLOAD_PRESET = gql`
   query getUploadPreset {
      getUploadPreset
   }
`
