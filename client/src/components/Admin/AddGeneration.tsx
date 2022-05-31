import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useMutation } from '@apollo/client'
import { FilePond, registerPlugin } from 'react-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginImageValidateSize from 'filepond-plugin-image-validate-size'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'

import { ADD_GENERATION } from '../../shared/utils/graphql'
import useAddPhoto from '../../shared/hooks/useAddPhoto'
import { addGenerationVars, MutationDetails } from '../../shared/types'

registerPlugin(
   FilePondPluginImagePreview,
   FilePondPluginImageValidateSize,
   FilePondPluginImageExifOrientation,
   FilePondPluginFileValidateType
)

type AddGenerationProps = {
   mark: string
   model: string
}

const AddGeneration = ({ mark, model }: AddGenerationProps): JSX.Element => {
   const [error, setError] = useState('')
   const [loading, setLoading] = useState(false)
   const [photoUrlError, setPhotoUrlError] = useState('')
   const [images, setImages] = useState<any>([])
   const addPhoto = useAddPhoto()

   const AddGenerationSchema = Yup.object().shape({
      generationName: Yup.string().required('Required'),
      startYear: Yup.string().required('Required'),
      endYear: Yup.string().required('Required')
   })

   const formik = useFormik({
      initialValues: {
         generationName: '',
         startYear: '',
         endYear: ''
      },
      validationSchema: AddGenerationSchema,
      onSubmit: async values => {
         setLoading(true)
         const photoUrl = await addPhoto(images)
         if (photoUrl) {
            addGeneration({
               variables: {
                  markName: mark,
                  modelName: model,
                  generationName: values.generationName,
                  startYear: values.startYear,
                  endYear: values.endYear,
                  photoUrl: photoUrl[0]
               }
            })
         } else {
            setPhotoUrlError('Please add photo')
         }
      }
   })

   const [addGeneration] = useMutation<
      { addGeneration: MutationDetails },
      addGenerationVars
   >(ADD_GENERATION, {
      update() {
         setLoading(false)
      },
      onError(error) {
         setLoading(false)
         setError(error.message)
      }
   })

   return (
      <>
         <h1>Add Model</h1>
         <form onSubmit={formik.handleSubmit}>
            <label htmlFor="modelName">Generation: </label>
            <input
               id="generationName"
               name="generationName"
               type="text"
               onChange={formik.handleChange}
               onBlur={formik.handleBlur}
               value={formik.values.generationName}
            />
            {formik.touched.generationName && formik.errors.generationName ? (
               <div>{formik.errors.generationName}</div>
            ) : null}
            <label htmlFor="modelName">Start Year: </label>
            <input
               id="startYear"
               name="startYear"
               type="text"
               onChange={formik.handleChange}
               onBlur={formik.handleBlur}
               value={formik.values.startYear}
            />
            {formik.touched.startYear && formik.errors.startYear ? (
               <div>{formik.errors.startYear}</div>
            ) : null}
            <label htmlFor="modelName">End Year: </label>
            <input
               id="endYear"
               name="endYear"
               type="text"
               onChange={formik.handleChange}
               onBlur={formik.handleBlur}
               value={formik.values.endYear}
            />
            {formik.touched.endYear && formik.errors.endYear ? (
               <div>{formik.errors.endYear}</div>
            ) : null}
            <label htmlFor="modelName">Photo: </label>
            <FilePond
               // @ts-ignore
               files={images}
               // @ts-ignore
               onupdatefiles={setImages}
               allowMultiple={false}
               name="files"
               acceptedFileTypes={['image/png', 'image/jpeg', 'image/jpg']}
               imageValidateSizeMinWidth={320}
               imageValidateSizeMinHeight={240}
               labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
            />
            {photoUrlError}
            <button type="submit">Add</button>
            {error && error}
         </form>
      </>
   )
}

export default AddGeneration
