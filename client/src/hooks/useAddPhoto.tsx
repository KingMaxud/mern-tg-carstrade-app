import { gql, useLazyQuery } from '@apollo/client'
import Compressor from 'compressorjs'
import axios from 'axios'

type UploadPresetData = {
   getUploadPreset: string
}

const compressImage = (image: any, uploadPreset: string) => {
   return new Promise<string>(function (res, rej) {
      new Compressor(image.file, {
         maxWidth: 1200,
         maxHeight: 900,
         success: async compressedImage => {
            const formData = new FormData()
            formData.append('file', compressedImage)
            formData.append('upload_preset', uploadPreset)
            const dataRes = await axios.post('https://api.cloudinary.com/v1_1/dxl170evw/image/upload', formData)
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

   const addPhoto = async (images: any[]) => {
      const data = await loadUploadPreset()
      let uploadPreset: string
      if (data.data) {
         uploadPreset = data.data.getUploadPreset
         const unresolved = images.map(async image => {
            const url = await compressImage(image, uploadPreset)
            return url
         })

         const resolved = await Promise.all(unresolved)
         return resolved
      }
   }

   return addPhoto
}

export default useAddPhoto

const GET_UPLOAD_PRESET = gql`
   query getUploadPreset {
       getUploadPreset
   }
`
